/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSafeContactDto } from './dto/create-safe-contact.dto';
import { UpdateSafeContactDto } from './dto/update-safe-contact.dto';
import { Prisma } from '@prisma/client';

function isPrismaError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as any).code === 'P2002'
  );
}

@Injectable()
export class SafeContactsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateSafeContactDto) {
    try {
      const contact = await this.prisma.safeContact.create({
        data: {
          userId,
          name: dto.name,
          phone: dto.phone,
          email: dto.email,
          priority: dto.priority ?? 0,
          isEnabled: dto.isEnabled ?? true,
        },
      });
      return contact;
    } catch (error: unknown) {
      if (isPrismaError(error)) {
        throw new ConflictException(
          'Este contacto ya existe para este usuario',
        );
      }
      throw error;
    }
  }

  async findAll(userId: string) {
    const contacts = await this.prisma.safeContact.findMany({
      where: { userId },
      orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
    });

    return {
      total: contacts.length,
      contacts,
    };
  }

  async findOne(userId: string, id: string) {
    const contact = await this.prisma.safeContact.findFirst({
      where: { id, userId },
    });

    if (!contact) {
      throw new NotFoundException('Contacto no encontrado');
    }

    return contact;
  }

  async update(userId: string, id: string, dto: UpdateSafeContactDto) {
    // Verificar que el contacto existe y pertenece al usuario
    await this.findOne(userId, id);

    try {
      const updated = await this.prisma.safeContact.update({
        where: { id },
        data: {
          name: dto.name,
          phone: dto.phone,
          email: dto.email,
          priority: dto.priority,
          isEnabled: dto.isEnabled,
        },
      });
      return updated;
    } catch (error: unknown) {
      if (isPrismaError(error)) {
        throw new ConflictException('Ya existe un contacto con este teléfono');
      }
      throw error;
    }
  }

  async remove(userId: string, id: string) {
    // Verificar que el contacto existe y pertenece al usuario
    await this.findOne(userId, id);

    await this.prisma.safeContact.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Contacto eliminado correctamente',
    };
  }

  async toggleEnabled(userId: string, id: string) {
    const contact = await this.findOne(userId, id);

    const updated = await this.prisma.safeContact.update({
      where: { id },
      data: { isEnabled: !contact.isEnabled },
    });

    return updated;
  }
}
