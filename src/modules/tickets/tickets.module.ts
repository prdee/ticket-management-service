import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { TicketRepository } from './repositories/ticket.repository';
import { AgentsModule } from '../agents/agents.module';

@Module({
  imports: [AgentsModule],
  controllers: [TicketsController],
  providers: [TicketsService, TicketRepository],
  exports: [TicketsService],
})
export class TicketsModule {}