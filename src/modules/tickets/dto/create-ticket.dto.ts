import { IsNotEmpty, IsString, IsEnum, IsUUID, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TicketPriority, TicketStatus } from '../entities/ticket.entity';

export class CreateTicketDto {
  @ApiProperty({ description: 'Ticket title', example: 'Login issue with mobile app' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'Ticket description', example: 'User cannot log in to the mobile app. The app crashes after entering credentials.' })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  description: string;

  @ApiPropertyOptional({ 
    description: 'Ticket status', 
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  })
  @IsOptional()
  @IsEnum(['open', 'in_progress', 'resolved', 'closed'])
  status?: TicketStatus = 'open';

  @ApiPropertyOptional({ 
    description: 'Ticket priority', 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high', 'urgent'])
  priority?: TicketPriority = 'medium';

  @ApiPropertyOptional({ description: 'Assigned agent ID' , example :"ad714ecd-8d71-4149-8401-4ae5e30f93d0" })
  @IsOptional()
  assigned_to?: string;
}
