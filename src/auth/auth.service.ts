import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Verificar si usuario existe
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { phone: dto.phone }],
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this email or phone already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const hashedPin = dto.pinCode ? await bcrypt.hash(dto.pinCode, 10) : null;

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        passwordHash: hashedPassword,
        fullName: dto.fullName,
        pinCode: hashedPin,
      },
      select: { id: true, email: true, fullName: true, phone: true },
    });

    return this.generateTokens(user.id);
  }

  async login(dto: LoginDto, userAgent: string, ipAddress: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, userAgent, ipAddress);
  }

  private async generateTokens(
    userId: string,
    userAgent?: string,
    ipAddress?: string,
  ) {
    const refreshToken = crypto.randomUUID();

    const session = await this.prisma.session.create({
      data: {
        userId,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userAgent,
        ipAddress,
      },
    });

    const accessToken = this.jwtService.sign(
      { sub: userId, sessionId: session.id },
      { expiresIn: '1h' },
    );

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, fullName: true },
    });

    return {
      accessToken,
      refreshToken,
      user: { id: user?.id, email: user?.email, fullName: user?.fullName },
    };
  }

  async refreshTokens(refreshToken: string) {
    const session = await this.prisma.session.findFirst({
      where: {
        refreshToken,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!session) throw new UnauthorizedException('Invalid refresh token');

    const newAccessToken = this.jwtService.sign(
      { sub: session.userId, sessionId: session.id },
      { expiresIn: '1h' },
    );

    return { accessToken: newAccessToken };
  }

  async logout(sessionId: string) {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { isRevoked: true },
    });

    return { message: 'Logged out successfully' };
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, fullName: true, phone: true },
    });
  }
}
