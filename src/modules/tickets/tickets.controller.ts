import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Body, 
  Param, 
  Query, 
  HttpStatus, 
  Res 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiQuery 
} from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { FilterTicketDto } from './dto/filter-ticket.dto';
import { TicketResponseDto } from './dto/ticket-response.dto';
import * as responseHandler from '../../responseHandler';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ticket' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The ticket has been successfully created',
    type: TicketResponseDto,
  })
  async create(@Body() createTicketDto: CreateTicketDto, @Res() res: any) {
    try {
      const ticket = await this.ticketsService.create(createTicketDto);
      responseHandler.successResponse(res, HttpStatus.CREATED, 'Ticket created successfully', ticket);
    } catch (e) {
      responseHandler.errorResponse(res, HttpStatus.BAD_REQUEST, e.message, []);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all tickets with optional filtering' })
  @ApiQuery({ name: 'status', required: false, enum: ['open', 'in_progress', 'resolved', 'closed'] })
  @ApiQuery({ name: 'priority', required: false, enum: ['low', 'medium', 'high', 'urgent'] })
  @ApiQuery({ name: 'assigned_to', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of filtered tickets',
    type: [TicketResponseDto],
  })
  async findAll(@Query() filterDto: FilterTicketDto, @Res() res: any) {
    try {
      const tickets = await this.ticketsService.findAll(filterDto);
      responseHandler.successResponse(res, HttpStatus.OK, 'Tickets fetched successfully', tickets);
    } catch (e) {
      responseHandler.errorResponse(res, HttpStatus.BAD_REQUEST, e.message, []);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a ticket by ID' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found ticket',
    type: TicketResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ticket not found',
  })
  async findOne(@Param('id') id: string, @Res() res: any) {
    try {
      const ticket = await this.ticketsService.findOne(id);
      if (ticket) {
        responseHandler.successResponse(res, HttpStatus.OK, 'Ticket fetched successfully', ticket);
      } else {
        responseHandler.errorResponse(res, HttpStatus.NOT_FOUND, 'Ticket not found', []);
      }
    } catch (e) {
      responseHandler.errorResponse(res, HttpStatus.BAD_REQUEST, e.message, []);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a ticket' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The ticket has been successfully updated',
    type: TicketResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ticket not found',
  })
  async update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto, @Res() res: any) {
    try {
      const ticket = await this.ticketsService.update(id, updateTicketDto);
      responseHandler.successResponse(res, HttpStatus.OK, 'Ticket updated successfully', ticket);
    } catch (e) {
      responseHandler.errorResponse(res, HttpStatus.BAD_REQUEST, e.message, []);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a ticket' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The ticket has been successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ticket not found',
  })
  async remove(@Param('id') id: string, @Res() res: any) {
    try {
      await this.ticketsService.remove(id);
      responseHandler.successResponse(res, HttpStatus.NO_CONTENT, 'Ticket deleted successfully', null);
    } catch (e) {
      responseHandler.errorResponse(res, HttpStatus.BAD_REQUEST, e.message, []);
    }
  }
}
