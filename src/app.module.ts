import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TicketsModule } from './modules/tickets/tickets.module';
import { AgentsModule } from './modules/agents/agents.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { DatabaseModule } from './database/database.module';
import ablyConfig from './config/ably.config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, ablyConfig],
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        API_PREFIX: Joi.string().default('api'),
        SUPABASE_URL: Joi.string().required(),
        SUPABASE_KEY: Joi.string().required(),
        ABLY_API_KEY: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),
    DatabaseModule,
    TicketsModule,
    AgentsModule,
    RealtimeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}