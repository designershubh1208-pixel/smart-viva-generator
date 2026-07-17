import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { BullModule } from '@nestjs/bullmq';
import { UploadsProcessor } from './uploads.processor';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'processing',
    }),
    AiModule,
  ],
  providers: [UploadsService, UploadsProcessor],
  controllers: [UploadsController],
  exports: [UploadsService]
})
export class UploadsModule {}
