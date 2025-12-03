'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuditLogTable } from '@/components/audit/AuditLogTable';
import { Pagination } from '@/components/ui/Pagination';
import { auditService, AuditLog } from '@/lib/audit-service';
import { getErrorMessage } from '@/types/error';
import { TableSkeleton } from '@/components/ui/Skeleton';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterAction, setFilterAction] = useState<string>('');

  const fetchLogs = async (page = 1, action?: string) => {
    setLoading(true);
    try {
      const data = await auditService.getLogs(page, 10, action || undefined);
      setLogs(data.logs);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setCurrentPage(data.page);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1, filterAction);
  }, [filterAction]);

  const handlePageChange = (page: number) => {
    fetchLogs(page, filterAction);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterAction(e.target.value);
  };

  return (
    <ProtectedRoute requireAdmin>
      <DashboardLayout>
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
              <p className="text-gray-600 mt-1">
                View all system activities ({total} total logs)
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Filter by action:</label>
              <select
                value={filterAction}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
              >
                <option value="">All Actions</option>
                <option value="USER_LOGIN">User Login</option>
                <option value="USER_LOGOUT">User Logout</option>
                <option value="USER_CREATED">User Created</option>
                <option value="USER_UPDATED">User Updated</option>
                <option value="USER_DELETED">User Deleted</option>
              </select>
            </div>
          </div>

          {loading ? (
            <TableSkeleton />
          ) : logs.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No audit logs found</h3>
              <p className="text-gray-600">
                {filterAction
                  ? 'Try changing the filter to see more results.'
                  : 'System activities will appear here.'}
              </p>
            </div>
          ) : (
            <>
              <AuditLogTable logs={logs} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}