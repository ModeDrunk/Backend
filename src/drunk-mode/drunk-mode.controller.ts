/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DrunkModeService } from './drunk-mode.service';
import { ActivateDrunkModeDto } from './dto/activate-drunk-mode.dto';
import { DeactivateDrunkModeDto } from './dto/deactivate-drunk-mode.dto';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    sessionId: string;
    email: string;
    fullName: string;
  };
}

@ApiTags('Drunk Mode')
@Controller('drunk-mode')
@ApiBearerAuth()
export class DrunkModeController {
  constructor(private readonly drunkModeService: DrunkModeService) {}

  @Post('activate')
  @ApiOperation({ summary: 'Activar Modo Borracho' })
  @ApiResponse({ status: 201, description: 'Modo Borracho activado' })
  @ApiResponse({ status: 400, description: 'Ya hay un modo activo' })
  async activate(
    @Request() req: RequestWithUser,
    @Body() dto: ActivateDrunkModeDto,
  ) {
    return this.drunkModeService.activate(req.user.userId, dto);
  }

  @Post('deactivate')
  @ApiOperation({ summary: 'Desactivar Modo Borracho (requiere PIN)' })
  @ApiResponse({ status: 200, description: 'Modo Borracho desactivado' })
  @ApiResponse({ status: 400, description: 'PIN incorrecto' })
  @ApiResponse({ status: 404, description: 'No hay modo activo' })
  async deactivate(
    @Request() req: RequestWithUser,
    @Body() dto: DeactivateDrunkModeDto,
  ) {
    return this.drunkModeService.deactivate(req.user.userId, dto);
  }

  @Get('active')
  @ApiOperation({ summary: 'Verificar si el Modo Borracho está activo' })
  @ApiResponse({ status: 200, description: 'Estado actual del modo' })
  async getCurrent(@Request() req: RequestWithUser) {
    return this.drunkModeService.getCurrentSession(req.user.userId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Obtener historial de sesiones' })
  @ApiResponse({ status: 200, description: 'Historial de Modo Borracho' })
  async getHistory(
    @Request() req: RequestWithUser,
    @Query('limit') limit?: string,
  ) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.drunkModeService.getHistory(req.user.userId, limitNumber);
  }
}
