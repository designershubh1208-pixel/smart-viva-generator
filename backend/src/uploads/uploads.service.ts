import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, QueueEvents } from 'bullmq';
import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);

  constructor(
    private prisma: PrismaService,
    @InjectQueue('processing') private processingQueue: Queue,
  ) {}

  async uploadFile(file: Express.Multer.File, userId: string) {
    const uploadDir = path.join(process.cwd(), 'uploads', userId);
    await fs.mkdir(uploadDir, { recursive: true });

    const fileName = `${crypto.randomUUID()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, file.buffer);

    const upload = await this.prisma.upload.create({
      data: {
        userId,
        fileName: file.originalname,
        fileKey: filePath,
        fileUrl: `/uploads/${userId}/${fileName}`,
        fileType: file.mimetype,
      },
    });

    // Add job to processing queue
    const job = await this.processingQueue.add('extract-text', {
      uploadId: upload.id,
      userId,
    });

    const queueEvents = new QueueEvents('processing', { connection: this.processingQueue.opts.connection });
    await job.waitUntilFinished(queueEvents);
    await queueEvents.close();

    const qSet = await this.prisma.questionSet.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return { upload, questionSetId: qSet?.id };
  }

  async uploadImage(file: Express.Multer.File, userId: string) {
    const uploadDir = path.join(process.cwd(), 'uploads', userId);
    await fs.mkdir(uploadDir, { recursive: true });

    const fileName = `img-${crypto.randomUUID()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, file.buffer);

    const upload = await this.prisma.upload.create({
      data: {
        userId,
        fileName: file.originalname,
        fileKey: filePath,
        fileUrl: `/uploads/${userId}/${fileName}`,
        fileType: file.mimetype,
      },
    });

    // Instead of queue, directly simulate Vision Model processing for diagrams
    // In production, we'd pass the image buffer to GPT-4o Vision API
    const generatedQs = [
      {
        question: "Explain this circuit based on the uploaded diagram.",
        expectedAnswer: "The circuit demonstrates a basic amplifier...",
        difficulty: "MEDIUM"
      },
      {
        question: "Why is resistor R2 used?",
        expectedAnswer: "R2 acts as a pull-down resistor to ensure stability.",
        difficulty: "HARD"
      }
    ];

    let subject = await this.prisma.subject.findFirst();
    if (!subject) {
      subject = await this.prisma.subject.create({
        data: { name: 'Image Analysis', code: 'IMG101' }
      });
    }

    const qSet = await this.prisma.questionSet.create({
      data: {
        title: `Diagram Analysis for ${file.originalname}`,
        subjectId: subject.id,
        userId,
      }
    });

    for (const q of generatedQs) {
      await this.prisma.question.create({
        data: {
          text: q.question,
          expectedAnswer: q.expectedAnswer,
          difficulty: q.difficulty,
          questionSetId: qSet.id,
        }
      });
    }

    return { upload, questionSetId: qSet.id };
  }
}
