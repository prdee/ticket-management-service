import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TicketRepository } from './repositories/ticket.repository';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { FilterTicketDto } from './dto/filter-ticket.dto';
import { TicketResponseDto } from './dto/ticket-response.dto';
import { RealtimeService } from '../realtime/realtime.service';
import { AgentsService } from '../agents/agents.service';

@Injectable()
export class TicketsService {
  constructor(
    private ticketRepository: TicketRepository,
    private realtimeService: RealtimeService,
    private agentsService: AgentsService,
  ) {}

  async findAll(filterDto: FilterTicketDto): Promise<TicketResponseDto[]> {
    const tickets = await this.ticketRepository.findAll(filterDto);
    return TicketResponseDto.fromEntities(tickets);
  }

  async findOne(id: string): Promise<TicketResponseDto> {
    const ticket = await this.ticketRepository.findOne(id);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    return TicketResponseDto.fromEntity(ticket);
  }

  async create(createTicketDto: CreateTicketDto): Promise<TicketResponseDto> {
    if (createTicketDto.assigned_to) {
      try {
        await this.agentsService.findOne(createTicketDto.assigned_to);
      } catch (error) {
        throw new BadRequestException(`Agent with ID ${createTicketDto.assigned_to} not found`);
      }
    }

    const ticket = await this.ticketRepository.create(createTicketDto);
    
    await this.realtimeService.publishEvent('ticket_created', {
      ticket: TicketResponseDto.fromEntity(ticket),
    });
    
    return TicketResponseDto.fromEntity(ticket);
  }

  async update(id: string, updateTicketDto: UpdateTicketDto): Promise<TicketResponseDto> {
    if (updateTicketDto.assigned_to) {
      try {
        await this.agentsService.findOne(updateTicketDto.assigned_to);
      } catch (error) {
        throw new BadRequestException(`Agent with ID ${updateTicketDto.assigned_to} not found`);
      }
    }

    const existingTicket = await this.ticketRepository.findOne(id);
    if (!existingTicket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    const updatedTicket = await this.ticketRepository.update(id, updateTicketDto);
    if (!updatedTicket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    
    const statusChanged = existingTicket.status !== updatedTicket.status;
    
    await this.realtimeService.publishEvent('ticket_updated', {
      ticket: TicketResponseDto.fromEntity(updatedTicket),
      statusChanged,
      previousStatus: existingTicket.status,
    });
    
    return TicketResponseDto.fromEntity(updatedTicket);
  }

  async remove(id: string): Promise<void> {
    const ticket = await this.ticketRepository.findOne(id);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    
    const deleted = await this.ticketRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    
    await this.realtimeService.publishEvent('ticket_deleted', {
      ticket: TicketResponseDto.fromEntity(ticket),
    });
  }
}