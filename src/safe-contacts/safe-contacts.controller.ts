import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SafeContactsService } from './safe-contacts.service';
import { CreateSafeContactDto } from './dto/create-safe-contact.dto';
import { UpdateSafeContactDto } from './dto/update-safe-contact.dto';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    sessionId: string;
    email: string;
    fullName: string;
  };
}

@ApiTags('Safe Contacts')
@Controller('safe-contacts')
@ApiBearerAuth()
export class SafeContactsController {
  constructor(private readonly safeContactsService: SafeContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un contacto de confianza' })
  @ApiResponse({ status: 201, description: 'Contacto creado exitosamente' })
  @ApiResponse({ status: 409, description: 'Contacto ya existe' })
  async create(
    @Request() req: RequestWithUser,
    @Body() dto: CreateSafeContactDto,
  ) {
    return this.safeContactsService.create(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los contactos de confianza' })
  @ApiResponse({ status: 200, description: 'Lista de contactos' })
  async findAll(@Request() req: RequestWithUser) {
    return this.safeContactsService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un contacto por ID' })
  @ApiResponse({ status: 200, description: 'Contacto encontrado' })
  @ApiResponse({ status: 404, description: 'Contacto no encontrado' })
  async findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.safeContactsService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un contacto de confianza' })
  @ApiResponse({ status: 200, description: 'Contacto actualizado' })
  @ApiResponse({ status: 404, description: 'Contacto no encontrado' })
  @ApiResponse({ status: 409, description: 'Teléfono duplicado' })
  async update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateSafeContactDto,
  ) {
    return this.safeContactsService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un contacto de confianza' })
  @ApiResponse({ status: 200, description: 'Contacto eliminado' })
  @ApiResponse({ status: 404, description: 'Contacto no encontrado' })
  async remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.safeContactsService.remove(req.user.userId, id);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Activar/desactivar un contacto' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  async toggleEnabled(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    return this.safeContactsService.toggleEnabled(req.user.userId, id);
  }
}
