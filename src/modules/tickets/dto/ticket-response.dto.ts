import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Ticket, TicketStatus, TicketPriority } from '../entities/ticket.entity';

export class TicketResponseDto {
  @ApiProperty({ description: 'Ticket ID' })
  id: string;

  @ApiProperty({ description: 'Ticket title' })
  title: string;

  @ApiProperty({ description: 'Ticket description' })
  description: string;

  @ApiProperty({ 
    description: 'Ticket status', 
    enum: ['open', 'in_progress', 'resolved', 'closed']
  })
  status: TicketStatus;

  @ApiProperty({ 
    description: 'Ticket priority', 
    enum: ['low', 'medium', 'high', 'urgent']
  })
  priority: TicketPriority;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at: Date;

  @ApiPropertyOptional({ description: 'Assigned agent ID' })
  assigned_to: string | null;

  constructor(ticket: Ticket) {
    this.id = ticket.id;
    this.title = ticket.title;
    this.description = ticket.description;
    this.status = ticket.status;
    this.priority = ticket.priority;
    this.created_at = ticket.created_at;
    this.updated_at = ticket.updated_at;
    this.assigned_to = ticket.assigned_to;
  }

  static fromEntity(ticket: Ticket): TicketResponseDto {
    return new TicketResponseDto(ticket);
  }

  static fromEntities(tickets: Ticket[]): TicketResponseDto[] {
    return tickets.map(ticket => TicketResponseDto.fromEntity(ticket));
  }
}