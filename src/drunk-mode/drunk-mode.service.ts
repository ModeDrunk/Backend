import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { DeactivateDrunkModeDto } from './dto/deactivate-drunk-mode.dto';
import { ActivateDrunkModeDto } from './dto/activate-drunk-mode.dto';

@Injectable()
export class DrunkModeService {
  constructor(private prisma: PrismaService) {}

  async activate(userId: string, dto: ActivateDrunkModeDto) {
    // Verificar si ya hay un modo activo
    const activeSession = await this.prisma.drunkModeSession.findFirst({
      where: { userId, isActive: true },
    });

    if (activeSession) {
      throw new BadRequestException('Ya tienes un modo borracho activo');
    }

    const session = await this.prisma.drunkModeSession.create({
      data: {
        userId,
        activationType: dto.activationType || 'manual',
        metadata: dto.metadata || {},
      },
    });

    return {
      success: true,
      sessionId: session.id,
      activatedAt: session.activatedAt,
      message: 'Modo Borracho activado correctamente',
    };
  }

  async deactivate(userId: string, dto: DeactivateDrunkModeDto) {
    // Buscar sesión activa
    const activeSession = await this.prisma.drunkModeSession.findFirst({
      where: { userId, isActive: true },
      include: { user: true },
    });

    if (!activeSession) {
      throw new NotFoundException('No hay un modo borracho activo');
    }

    // Verificar que el usuario tiene PIN configurado
    if (!activeSession.user.pinCode) {
      throw new BadRequestException(
        'No tienes un PIN configurado. Configura un PIN primero.',
      );
    }

    // Validar PIN
    if (!dto.pinCode) {
      throw new BadRequestException('Debes enviar el PIN');
    }

    const isValidPin = await bcrypt.compare(
      dto.pinCode,
      activeSession.user.pinCode,
    );

    if (!isValidPin) {
      throw new BadRequestException('PIN incorrecto');
    }

    // Desactivar sesión
    const updated = await this.prisma.drunkModeSession.update({
      where: { id: activeSession.id },
      data: {
        deactivatedAt: new Date(),
        isActive: false,
        deactivationType: dto.deactivationType || 'pin',
      },
    });

    return {
      success: true,
      sessionId: updated.id,
      deactivatedAt: updated.deactivatedAt,
      message: 'Modo Borracho desactivado correctamente',
    };
  }

  async getCurrentSession(userId: string) {
    const session = await this.prisma.drunkModeSession.findFirst({
      where: { userId, isActive: true },
      select: {
        id: true,
        activatedAt: true,
        activationType: true,
        metadata: true,
        isActive: true,
      },
    });

    if (!session) {
      return {
        isActive: false,
        message: 'No hay un modo borracho activo',
      };
    }

    return {
      isActive: true,
      sessionId: session.id,
      activatedAt: session.activatedAt,
      activationType: session.activationType,
      metadata: session.metadata,
    };
  }

  async getHistory(userId: string, limit: number = 10) {
    const sessions = await this.prisma.drunkModeSession.findMany({
      where: { userId },
      orderBy: { activatedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        activatedAt: true,
        deactivatedAt: true,
        activationType: true,
        deactivationType: true,
        isActive: false,
        metadata: true,
      },
    });

    return {
      total: sessions.length,
      sessions,
    };
  }

  async hasActiveSession(userId: string): Promise<boolean> {
    const session = await this.prisma.drunkModeSession.findFirst({
      where: { userId, isActive: true },
      select: { id: true },
    });
    return !!session;
  }
}
