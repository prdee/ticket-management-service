import { Module } from '@nestjs/common';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import { AgentRepository } from './repositories/agent.repository';

@Module({
  controllers: [AgentsController],
  providers: [AgentsService, AgentRepository],
  exports: [AgentsService],
})
export class AgentsModule {}