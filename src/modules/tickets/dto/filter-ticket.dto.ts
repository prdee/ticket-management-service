import { IsEnum, IsUUID, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TicketPriority, TicketStatus } from '../entities/ticket.entity';
import { PaginationDto } from 'src/common/pagination.dto';

export class FilterTicketDto extends PaginationDto {
  @ApiPropertyOptional({ 
    description: 'Filter by ticket status', 
    enum: ['open', 'in_progress', 'resolved', 'closed']
  })
  @IsOptional()
  @IsEnum(['open', 'in_progress', 'resolved', 'closed'])
  status?: TicketStatus;

  @ApiPropertyOptional({ 
    description: 'Filter by ticket priority', 
    enum: ['low', 'medium', 'high', 'urgent']
  })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high', 'urgent'])
  priority?: TicketPriority;

  @ApiPropertyOptional({ description: 'Filter by assigned agent ID' })
  @IsOptional()
  @IsUUID()
  assigned_to?: string;
}