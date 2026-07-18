import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AiModule } from './ai/ai.module';
import { UploadsModule } from './uploads/uploads.module';
import { BullModule } from '@nestjs/bullmq';
import { VivaModule } from './viva/viva.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD'),
          tls: configService.get<string>('REDIS_TLS') === 'true' ? {} : undefined,
        },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    AiModule,
    UploadsModule,
    VivaModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
