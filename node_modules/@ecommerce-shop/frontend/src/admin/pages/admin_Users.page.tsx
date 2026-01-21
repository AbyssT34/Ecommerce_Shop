import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GlassCard, Badge } from '@shared/components';
import { usersApi } from '@shared/api';
import type { User } from '@shared/types';
import { formatDate } from '@shared/utils';

export function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => usersApi.getAll(),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: number; role: 'user' | 'admin' }) =>
      usersApi.update(id, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });

  const handleToggleRole = (user: User) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (confirm(`Đổi quyền của ${user.email} thành ${newRole}?`)) {
      updateRoleMutation.mutate({ id: user.id, role: newRole });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredUsers = users.filter((user: User) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: users.length,
    admins: users.filter((u: User) => u.role === 'admin').length,
    users: users.filter((u: User) => u.role === 'user').length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Quản lý Người dùng</h1>
          <p className="text-text-secondary">Quản lý tài khoản và phân quyền người dùng</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-1">Tổng số Người dùng</p>
              <p className="text-3xl font-bold text-accent-teal">{stats.total}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-1">Quản trị viên</p>
              <p className="text-3xl font-bold text-warning">{stats.admins}</p>
            </div>
            <div className="text-4xl">🛡️</div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-1">Khách hàng</p>
              <p className="text-3xl font-bold text-success">{stats.users}</p>
            </div>
            <div className="text-4xl">🛒</div>
          </div>
        </GlassCard>

        <div>
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            className="w-full h-full glass rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent-teal border-t-transparent"></div>
        </div>
      ) : (
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-text-primary font-semibold">ID</th>
                  <th className="px-6 py-4 text-left text-text-primary font-semibold">Người dùng</th>
                  <th className="px-6 py-4 text-left text-text-primary font-semibold">SĐT</th>
                  <th className="px-6 py-4 text-left text-text-primary font-semibold">Vai trò</th>
                  <th className="px-6 py-4 text-left text-text-primary font-semibold">Tham gia</th>
                  <th className="px-6 py-4 text-right text-text-primary font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user: User) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-6 py-4 text-text-secondary">#{user.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-text-primary font-medium">{user.fullName || 'No name'}</p>
                        <p className="text-text-secondary text-sm">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{user.phone || '-'}</td>
                    <td className="px-6 py-4">
                      <Badge variant={user.role === 'admin' ? 'warning' : 'info'}>
                        {user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-text-secondary text-sm">
                      {user.createdAt ? formatDate(user.createdAt) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleRole(user)}
                          className="px-3 py-1 glass rounded text-info hover:bg-info/10 text-sm"
                          disabled={updateRoleMutation.isPending}
                        >
                          {user.role === 'admin' ? 'Hạ cấp User' : 'Thăng cấp Admin'}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="px-3 py-1 glass rounded text-error hover:bg-error/10 text-sm"
                          disabled={deleteMutation.isPending}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
