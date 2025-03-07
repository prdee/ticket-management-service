import { Controller, Get, Post, Body, Param, HttpStatus, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { AgentResponseDto } from './dto/agent-response.dto';
import * as responseHandler from '../../responseHandler';

@ApiTags('agents')
@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new agent' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The agent has been successfully created',
    type: AgentResponseDto,
  })
  async create(@Body() createAgentDto: CreateAgentDto, @Req() req: any, @Res() res: any) {
    try {
      const agent = await this.agentsService.create(createAgentDto);
      responseHandler.successResponse(res, HttpStatus.CREATED, 'Data created successfully', agent);
    } catch (e) {
      responseHandler.errorResponse(res, HttpStatus.BAD_REQUEST, e.message, []);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all agents' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all agents',
    type: [AgentResponseDto],
  })
  async findAll(@Res() res: any) {
    try {
      const agents = await this.agentsService.findAll();
      responseHandler.successResponse(res, HttpStatus.OK, 'Data fetched successfully', agents);
    } catch (e) {
      responseHandler.errorResponse(res, HttpStatus.BAD_REQUEST, e.message, []);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an agent by ID' })
  @ApiParam({ name: 'id', description: 'Agent ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found agent',
    type: AgentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Agent not found',
  })
  async findOne(@Param('id') id: string, @Res() res: any) {
    try {
      const agent = await this.agentsService.findOne(id);
      if (agent) {
        responseHandler.successResponse(res, HttpStatus.OK, 'Data fetched successfully', agent);
      } else {
        responseHandler.errorResponse(res, HttpStatus.NOT_FOUND, 'Agent not found', []);
      }
    } catch (e) {
      responseHandler.errorResponse(res, HttpStatus.BAD_REQUEST, e.message, []);
    }
  }
}
