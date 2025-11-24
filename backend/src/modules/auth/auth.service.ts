import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: registerDto.role || Role.USER, // Default role
      },
    });

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.email,
      user.role,
    );

    // Save refresh token to database
    await this.saveRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        role: user.role,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.email,
      user.role,
    );

    // Save refresh token
    await this.saveRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        role: user.role,
      },
    };
  }

  async refreshTokens(
    oldRefreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Find refresh token in database
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: oldRefreshToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check expiration
    if (new Date() > tokenRecord.expiresAt) {
      await this.prisma.refreshToken.delete({
        where: { id: tokenRecord.id },
      });
      throw new UnauthorizedException('Refresh token expired');
    }

    // Generate new tokens
    const { accessToken, refreshToken } = await this.generateTokens(
      tokenRecord.user.id,
      tokenRecord.user.email,
      tokenRecord.user.role,
    );

    // Delete old refresh token
    await this.prisma.refreshToken.delete({
      where: { id: tokenRecord.id },
    });

    // Save new refresh token
    await this.saveRefreshToken(tokenRecord.user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async logout(refreshToken: string): Promise<{ message: string }> {
    // Delete refresh token from database
    await this.prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    return { message: 'Logged out successfully' };
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, email, role };

    // Access token uses default config from JwtModule
    const accessToken = this.jwtService.sign(payload);

    // Refresh token needs custom config
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    if (!refreshSecret) {
      throw new Error(
        'JWT_REFRESH_SECRET is not defined in environment variables',
      );
    }

    // @ts-expect-error - JwtSignOptions type definition doesn't properly support string secret override
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: refreshSecret,
      expiresIn:
        this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d',
    });

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, token: string): Promise<void> {
    const expiresIn =
      this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d';

    // Convert "7d" to milliseconds
    const expirationMs = this.parseExpiration(expiresIn);
    const expiresAt = new Date(Date.now() + expirationMs);

    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  private parseExpiration(expiration: string): number {
    const unit = expiration.slice(-1);
    const value = parseInt(expiration.slice(0, -1), 10);

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        return 7 * 24 * 60 * 60 * 1000; // Default 7 days
    }
  }
}
