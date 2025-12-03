'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UserTable } from '@/components/users/UserTable';
import { UserFormModal, UserFormData } from '@/components/users/UserFormModal';
import { Pagination } from '@/components/ui/Pagination';
import { userService, User } from '@/lib/user-service';
import { getErrorMessage } from '@/types/error';
import { TableSkeleton } from '@/components/ui/Skeleton';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const data = await userService.getUsers(page, 10);
      setUsers(data.users);
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
    fetchUsers();
  }, []);

  const handlePageChange = (page: number) => {
    fetchUsers(page);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (data: UserFormData) => {
  try {
    if (selectedUser) {
      // Edit mode
      const updateData: {
        firstName?: string;
        lastName?: string;
        role: 'USER' | 'ADMIN';
        isActive: boolean;
        password?: string;
      } = {
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        isActive: data.isActive,
      };

      // Only include password if it's provided
      if (data.password) {
        updateData.password = data.password;
      }

      await userService.updateUser(selectedUser.id, updateData);
      toast.success('User updated successfully');
    } else {
      // Create mode
      if (!data.password) {
        toast.error('Password is required for new users');
        return;
      }

      await userService.createUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        isActive: data.isActive,
      });
      toast.success('User created successfully');
    }

    fetchUsers(currentPage);
    handleCloseModal();
  } catch (error) {
    toast.error(getErrorMessage(error));
    throw error; // Re-throw to keep modal open
  }
};

  const handleDelete = async (user: User) => {
    if (!confirm(`Are you sure you want to delete ${user.email}?`)) {
      return;
    }

    try {
      await userService.deleteUser(user.id);
      toast.success('User deleted successfully');
      fetchUsers(currentPage);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <DashboardLayout>
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-1">
                Manage all users in the system ({total} total)
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add User
            </button>
          </div>

          {loading ? (
           <TableSkeleton />
          ) : users.length === 0 ? (
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">Get started by creating a new user.</p>
            </div>
          ) : (
            <>
              <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}

          {/* User Form Modal */}
          <UserFormModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleSubmit}
            user={selectedUser}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}