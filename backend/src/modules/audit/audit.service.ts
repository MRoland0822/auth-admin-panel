import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateAuditLogDto {
  action: string;
  userId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async createLog(data: CreateAuditLogDto) {
    return this.prisma.auditLog.create({
      data: {
        action: data.action,
        userId: data.userId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        details: data.details || null,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  }

  async getLogs(page = 1, limit = 10, action?: string) {
    const skip = (page - 1) * limit;

    const where = action ? { action } : {};

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        skip,
        take: limit,
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      logs,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
