import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  private ai: OpenAI;
  private readonly logger = new Logger(AiService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const rawKey = this.configService.get<string>('NVIDIA_API_KEY') || 'dummy';
    const key = rawKey.trim();
    this.logger.log(`NVIDIA_API_KEY loaded: ${key.substring(0, 10)}... (Length: ${key.length})`);
    
    this.ai = new OpenAI({
      baseURL: 'https://integrate.api.nvidia.com/v1',
      apiKey: key,
    });
  }

  async generateEmbeddings(text: string): Promise<number[]> {
    // We are disabling embeddings currently to prevent API rate limit / costs,
    // but here is the OpenRouter/OpenAI signature if needed in the future.
    /*
    const response = await this.ai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data?.[0]?.embedding || [];
    */
    return [];
  }

  async generateQuestions(context: string, count: number, difficulty: string) {
    const prompt = `You are an expert examiner preparing a written text-based viva exam. 
    Based on the following context, generate ${count} written-exam questions at ${difficulty} difficulty.
    For each question, provide the expected model answer formatted as a well-written text paragraph (not oral conversation).
    Return the output strictly in JSON format as an array of objects with 'question' and 'expectedAnswer' keys.
    Context: ${context}`;

    const response = await this.ai.chat.completions.create({
      model: 'nvidia/llama-3.3-nemotron-super-49b-v1.5',
      messages: [
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' }
    });

    try {
      let textResponse = response.choices?.[0]?.message?.content || '[]';
      
      // Clean potential markdown blocks
      if (textResponse.includes('```json')) {
        textResponse = textResponse.split('```json')[1].split('```')[0].trim();
      } else if (textResponse.includes('```')) {
        textResponse = textResponse.split('```')[1].split('```')[0].trim();
      }

      const parsed = JSON.parse(textResponse);
      let questionsArr: any[] = [];
      
      if (Array.isArray(parsed)) {
        questionsArr = parsed;
      } else if (parsed.questions && Array.isArray(parsed.questions)) {
        questionsArr = parsed.questions;
      } else {
        const anyArray = Object.values(parsed).find(val => Array.isArray(val));
        if (anyArray) questionsArr = anyArray as any[];
      }

      // Map to expected structure in case the model used slightly different keys
      return questionsArr.map(q => ({
        question: q.question || q.q || '',
        expectedAnswer: q.expectedAnswer || q.answer || q.a || ''
      }));
    } catch (e) {
      this.logger.error('Failed to parse OpenRouter/Nvidia response', e);
      return [];
    }
  }

  async evaluateAnswer(question: string, studentAnswer: string, expectedAnswer: string) {
    const prompt = `You are an examiner evaluating a student's answer.
Question: "${question}"
Expected Correct Answer: "${expectedAnswer}"
Student's Answer: "${studentAnswer}"

Evaluate if the student's answer is correct, partially correct, or incorrect. Provide a short reason explaining why.
Return the output strictly in JSON format as an object with 'isCorrect' (boolean) and 'feedback' (string).`;

    const response = await this.ai.chat.completions.create({
      model: 'nvidia/llama-3.3-nemotron-super-49b-v1.5',
      messages: [
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' }
    });

    try {
      let textResponse = response.choices?.[0]?.message?.content || '{}';
      
      if (textResponse.includes('```json')) {
        textResponse = textResponse.split('```json')[1].split('```')[0].trim();
      } else if (textResponse.includes('```')) {
        textResponse = textResponse.split('```')[1].split('```')[0].trim();
      }

      const parsed = JSON.parse(textResponse);
      return {
        isCorrect: !!parsed.isCorrect,
        feedback: parsed.feedback || parsed.reason || 'No feedback provided.',
      };
    } catch (e) {
      this.logger.error('Failed to parse evaluation response', e);
      return { isCorrect: false, feedback: 'Error evaluating answer.' };
    }
  }

  async generateText(prompt: string): Promise<string> {
    const response = await this.ai.chat.completions.create({
      model: 'nvidia/llama-3.3-nemotron-super-49b-v1.5',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });
    
    return response.choices?.[0]?.message?.content || '{}';
  }
}
