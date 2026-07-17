import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AiService } from './ai/ai.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
    private readonly aiService: AiService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('viva/:id')
  async getViva(@Param('id') id: string) {
    const qSet = await this.prisma.questionSet.findUnique({
      where: { id },
      include: { questions: true }
    });
    
    if (!qSet) {
      throw new NotFoundException('Question set not found');
    }
    
    return qSet;
  }

  @Post('viva/evaluate')
  async evaluateAnswer(
    @Body('questionId') questionId: string,
    @Body('studentAnswer') studentAnswer: string
  ) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const evaluation = await this.aiService.evaluateAnswer(
      question.text,
      studentAnswer,
      question.expectedAnswer
    );

    return evaluation;
  }

  @Get('dashboard/stats')
  async getDashboardStats() {
    // For local testing without auth, get the first user
    const user = await this.prisma.user.findFirst();
    if (!user) {
      return { recentSets: [], quickStats: { averageScore: 0, topicsMastered: 0 }, weakTopics: [] };
    }

    const recentSets = await this.prisma.questionSet.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: {
        _count: {
          select: { questions: true }
        }
      }
    });

    const mappedSets = recentSets.map(set => ({
      id: set.id,
      title: set.title,
      questions: set._count.questions,
      difficulty: 'Medium', // Defaulting since we set everything to medium currently
      createdAt: set.createdAt
    }));

    return {
      recentSets: mappedSets,
      quickStats: {
        averageScore: 0, // Placeholder until practice sessions are scored
        topicsMastered: 0 // Placeholder until topic mastery is tracked
      },
      weakTopics: [] // Placeholder until topics are linked to questions
    };
  }

  @Get('subjects')
  async getSubjects() {
    const subjects = await this.prisma.subject.findMany({
      include: {
        _count: {
          select: { questionSets: true }
        }
      }
    });

    return subjects.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description || 'General study material',
      questionSetsCount: s._count.questionSets
    }));
  }

  @Get('history')
  async getHistory() {
    const user = await this.prisma.user.findFirst();
    if (!user) return [];

    const questionSets = await this.prisma.questionSet.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        subject: true,
        _count: {
          select: { questions: true }
        }
      }
    });

    return questionSets.map(set => ({
      id: set.id,
      subject: set.subject.name,
      topic: set.title,
      date: set.createdAt,
      totalQuestions: set._count.questions,
      score: 'N/A', // Score integration pending PracticeSession tracking
      status: 'Available'
    }));
  }
}
