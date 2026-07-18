import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { VivaService } from './viva.service';

@Controller('viva')
export class VivaController {
  constructor(private readonly vivaService: VivaService) {}

  @Post('start')
  async startSession(
    @Body() body: { userId: string; subjectId?: string }
  ) {
    return this.vivaService.startSession(body.userId, body.subjectId);
  }

  @Get(':id')
  async getSession(@Param('id') id: string) {
    return this.vivaService.getSession(id);
  }

  @Post(':id/message')
  async processMessage(
    @Param('id') id: string,
    @Body() body: { message: string; thinkingTimeMs?: number }
  ) {
    return this.vivaService.processMessage(id, body.message, body.thinkingTimeMs);
  }
}
