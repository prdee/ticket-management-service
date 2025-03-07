import { IsString, IsEnum, IsUUID, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TicketPriority, TicketStatus } from '../entities/ticket.entity';

export class UpdateTicketDto {
  @ApiPropertyOptional({ description: 'Ticket title' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ description: 'Ticket description' })
  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Ticket status', 
    enum: ['open', 'in_progress', 'resolved', 'closed']
  })
  @IsOptional()
  @IsEnum(['open', 'in_progress', 'resolved', 'closed'])
  status?: TicketStatus;

  @ApiPropertyOptional({ 
    description: 'Ticket priority', 
    enum: ['low', 'medium', 'high', 'urgent']
  })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high', 'urgent'])
  priority?: TicketPriority;

  @ApiPropertyOptional({ description: 'Assigned agent ID' })
  @IsOptional()
  @IsUUID()
  assigned_to?: string;
}

