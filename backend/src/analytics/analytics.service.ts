import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData(userId: string) {
    // 1. Overall Accuracy (Mocked or calculated from PracticeSession / Mistakes)
    // Here we'll do a simple mock or calculation
    const sessions = await this.prisma.practiceSession.findMany({
      where: { userId },
      select: { score: true }
    });
    
    const validScores = sessions.map(s => s.score).filter(s => s !== null) as number[];
    const overallAccuracy = validScores.length 
      ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
      : 84; // default mock if no data

    // 2. Average Thinking Time (from VivaMessages)
    const messages = await this.prisma.vivaMessage.findMany({
      where: {
        vivaSession: { userId },
        role: 'STUDENT',
        thinkingTimeMs: { not: null }
      },
      select: { thinkingTimeMs: true }
    });
    
    const validTimes = messages.map(m => m.thinkingTimeMs).filter(t => t !== null) as number[];
    const avgThinkingTimeSec = validTimes.length 
      ? Math.round(validTimes.reduce((a, b) => a + b, 0) / validTimes.length / 1000)
      : 17; // default mock

    // 3. Weakest Subject / Topic (Mocked for now since mistake table doesn't have subject mapping directly yet)
    const weakestSubject = "Operating System";
    const mostIncorrectTopic = "Deadlock";
    const confidenceScore = 72;
    const improvement = "+18%";

    // 4. Learning Heatmap (GitHub style)
    const activities = await this.prisma.dailyActivity.findMany({
      where: { userId },
      orderBy: { date: 'asc' }
    });

    // Generate last 30 days heatmap data
    const heatmap = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      d.setHours(0,0,0,0);
      
      const act = activities.find(a => new Date(a.date).getTime() === d.getTime());
      heatmap.push({
        date: d.toISOString().split('T')[0],
        count: act ? act.questionsDone : Math.floor(Math.random() * 10) // random mock for visual
      });
    }

    return {
      overallAccuracy,
      weakestSubject,
      mostIncorrectTopic,
      avgThinkingTimeSec,
      confidenceScore,
      improvement,
      heatmap,
    };
  }
}
