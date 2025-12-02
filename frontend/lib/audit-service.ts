import { api } from './api';

export interface AuditLog {
  id: string;
  action: string;
  userId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
  } | null;
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const auditService = {
  async getLogs(page = 1, limit = 10, action?: string): Promise<AuditLogsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (action) {
      params.append('action', action);
    }

    const response = await api.get<AuditLogsResponse>(`/audit-logs?${params}`);
    return response.data;
  },
};