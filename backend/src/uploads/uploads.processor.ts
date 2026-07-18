import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import * as fs from 'fs/promises';
import pdfParse from 'pdf-parse';

@Processor('processing')
export class UploadsProcessor extends WorkerHost {
  private readonly logger = new Logger(UploadsProcessor.name);
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);
    if (job.name === 'extract-text') {
      const { uploadId, userId } = job.data;

      const upload = await this.prisma.upload.findUnique({ where: { id: uploadId } });
      if (!upload) return;

      try {
        const buffer = await fs.readFile(upload.fileKey);
        
        let text = '';
        if (upload.fileType === 'application/pdf') {
          const parse = pdfParse as any;
          const pdfData = await parse(buffer);
          text = pdfData.text;
        } else {
          text = buffer.toString('utf-8');
        }

        const chunks = this.chunkText(text, 1000);
        
        for (const chunkText of chunks) {
          // Temporarily disabled embedding generation to prevent 429 API rate limits on free tier
          // const embedding = await this.aiService.generateEmbeddings(chunkText);
          // const formattedEmbedding = `[${embedding.join(',')}]`;
          
          await this.prisma.$executeRaw`
            INSERT INTO "Chunk" (id, text, "uploadId")
            VALUES (gen_random_uuid(), ${chunkText}, ${uploadId})
          `;
        }

        // Generate actual viva questions from the text (reduced to 10 for speed)
        const generatedQs = await this.aiService.generateQuestions(text.substring(0, 10000), 10, 'MEDIUM');

        if (generatedQs && generatedQs.length > 0) {
          // Ensure a subject exists
          let subject = await this.prisma.subject.findFirst();
          if (!subject) {
            subject = await this.prisma.subject.create({
              data: {
                name: 'Generated Material',
                code: 'GEN101',
              }
            });
          }

          // Create QuestionSet
          const qSet = await this.prisma.questionSet.create({
            data: {
              title: `Viva for ${upload.fileName}`,
              subjectId: subject.id,
              userId: upload.userId,
            }
          });

          // Create Questions
          for (const q of generatedQs) {
            await this.prisma.question.create({
              data: {
                text: q.question,
                expectedAnswer: q.expectedAnswer,
                difficulty: 'MEDIUM',
                questionSetId: qSet.id,
              }
            });
          }
        }

        this.logger.log(`Finished processing upload ${uploadId}`);
      } catch (err) {
        this.logger.error(`Error processing upload ${uploadId}`, err);
        throw err;
      }
    }
  }

  private chunkText(text: string, chunkSize: number): string[] {
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
  }
}
