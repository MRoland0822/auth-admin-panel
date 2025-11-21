import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): object {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  @Get('api/info')
  getInfo(): object {
    return {
      name: 'Auth Admin Panel API',
      version: '1.0.0',
      description: 'Backend API for authentication and user management',
    };
  }

  @Get('db-test')
  async testDatabase(): Promise<object> {
    // Count users in database
    const userCount = await this.prisma.user.count();

    return {
      message: 'Database connection successful!',
      userCount,
      timestamp: new Date().toISOString(),
    };
  }
}
