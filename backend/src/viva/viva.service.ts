import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class VivaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) {}

  async startSession(userIdStr: string, subjectId?: string) {
    let user = await this.prisma.user.findFirst();
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test Student'
        }
      });
    }
    const userId = user.id;

    return this.prisma.vivaSession.create({
      data: {
        userId,
        subjectId,
        status: 'IN_PROGRESS',
      },
    });
  }

  async getSession(sessionId: string) {
    const session = await this.prisma.vivaSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!session) throw new NotFoundException('Session not found');
    return session;
  }

  async processMessage(sessionId: string, userMessage: string, thinkingTimeMs?: number) {
    const session = await this.getSession(sessionId);

    // Save user's answer
    if (userMessage) {
      await this.prisma.vivaMessage.create({
        data: {
          vivaSessionId: sessionId,
          role: 'STUDENT',
          content: userMessage,
          thinkingTimeMs,
        },
      });
    }

    // Determine current difficulty based on previous messages (Simplified logic)
    // If it's the first question, start EASY. 
    // If previous was correct, move up. If wrong, move down.
    // For now, we'll let the LLM handle the dynamic difficulty by providing context.
    
    // Refresh session messages
    const updatedSession = await this.getSession(sessionId);
    
    // Construct prompt
    const systemPrompt = `You are a strict but helpful Viva Examiner.
You ask ONE question at a time.
Evaluate the student's previous answer (if any) and then ask the NEXT question.
Dynamically adjust the difficulty based on the student's performance.
Start Easy -> Medium -> Hard. If they fail, go back to an easier concept.
Output your response in JSON format with fields:
- evaluation (string): Your feedback on the previous answer.
- nextQuestion (string): The next question to ask.
- difficulty (string): EASY, MEDIUM, or HARD.
- isComplete (boolean): True if you have asked enough questions (e.g. 5-7) and the viva is over.
`;

    // Format chat history for AI
    const history = updatedSession.messages.map((m) => ({
      role: m.role === 'STUDENT' ? 'user' : 'assistant',
      content: m.content,
    }));

    // Use AI service to generate next response (Assuming aiService has a generateChat method, if not we'll need to adapt)
    // We will use standard OpenAI API if aiService doesn't fit. Let's check aiService later.
    // For now, pseudo-implementation:
    const aiResponseStr = await this.aiService.generateText(
      systemPrompt + '\\n\\nHistory:\\n' + JSON.stringify(history)
    );
    
    let aiResponse;
    try {
      // In case it has markdown json blocks
      const cleanStr = aiResponseStr.replace(/```json/g, '').replace(/```/g, '').trim();
      aiResponse = JSON.parse(cleanStr);
    } catch (e) {
      console.error('Failed to parse AI response as JSON', aiResponseStr);
      aiResponse = {
        evaluation: 'Could not evaluate.',
        nextQuestion: aiResponseStr,
        difficulty: 'MEDIUM',
        isComplete: false
      };
    }

    const combinedContent = aiResponse.evaluation 
      ? `${aiResponse.evaluation}\n\n${aiResponse.nextQuestion}`
      : aiResponse.nextQuestion;

    const aiMessage = await this.prisma.vivaMessage.create({
      data: {
        vivaSessionId: sessionId,
        role: 'EXAMINER',
        content: combinedContent,
        difficulty: aiResponse.difficulty,
      },
    });

    if (aiResponse.isComplete) {
      await this.prisma.vivaSession.update({
        where: { id: sessionId },
        data: { status: 'COMPLETED', endTime: new Date() }
      });
    }

    return {
      session: await this.getSession(sessionId),
      latestMessage: aiMessage,
      isComplete: aiResponse.isComplete,
    };
  }
}
