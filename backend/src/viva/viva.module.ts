import { Module } from '@nestjs/common';
import { VivaService } from './viva.service';
import { VivaController } from './viva.controller';
import { PrismaModule } from '../prisma/prisma.module'; // assuming prisma is there
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [VivaController],
  providers: [VivaService],
})
export class VivaModule {}
