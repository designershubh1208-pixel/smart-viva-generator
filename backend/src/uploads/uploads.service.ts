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
}
