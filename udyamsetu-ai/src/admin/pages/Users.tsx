import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers, useSuspendUser, useActivateUser } from '../hooks/useAdminQueries';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import { Users as UsersIcon, Search, PauseCircle, PlayCircle, Eye } from 'lucide-react';
import { getTimeAgo } from '../../utils/helpers';
import type { AdminUser } from '../types';
import { useSocket } from '../hooks/useSocket';
import { useEffect } from 'react';

export function Users() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, refetch } = useUsers({
    search: search || undefined,
    page: currentPage,
    limit: 10,
  });

  const { subscribe, unsubscribe } = useSocket();

  useEffect(() => {
    const handler = () => refetch();
    subscribe('NEW_USER_REGISTERED', handler);
    return () => unsubscribe('NEW_USER_REGISTERED');
  }, [subscribe, unsubscribe, refetch]);

  const suspendMutation = useSuspendUser();
  const activateMutation = useActivateUser();

  const handleSuspend = async (user: AdminUser) => {
    try {
      await suspendMutation.mutateAsync({ id: user._id, reason: 'Admin action' });
      addToast({ type: 'success', title: 'User suspended' });
    } catch { addToast({ type: 'error', title: 'Failed to suspend user' }); }
  };

  const handleActivate = async (user: AdminUser) => {
    try {
      await activateMutation.mutateAsync(user._id);
      addToast({ type: 'success', title: 'User activated' });
    } catch { addToast({ type: 'error', title: 'Failed to activate user' }); }
  };

  if (isLoading) return <LoadingState text="Loading users..." />;

  const users = data?.data || [];
  const totalPages = data?.totalPages || 0;
  const hasMore = currentPage < totalPages;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-500 mt-1">Manage platform users ({data?.total || 0} total)</p>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </Card>

      {users.length === 0 ? (
        <EmptyState icon={<UsersIcon className="w-12 h-12 text-gray-300" />} title="No users found" />
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full bg-white">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Onboarding</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: AdminUser) => (
                  <tr key={user._id} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600">
                            {user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={user.role === 'SUPER_ADMIN' ? 'danger' : user.role === 'ADMIN' ? 'warning' : 'gray'}>
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {user.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="danger">Inactive</Badge>}
                    </td>
                    <td className="px-4 py-3">
                      {user.onboardingCompleted ? <Badge variant="success">Completed</Badge> : <Badge variant="warning">Pending</Badge>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{getTimeAgo(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => navigate(`/admin/users/${user._id}`)} className="p-1 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        {user.isActive ? (
                          <button onClick={() => handleSuspend(user)} className="p-1 text-orange-600 hover:bg-orange-50 rounded">
                            <PauseCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button onClick={() => handleActivate(user)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                            <PlayCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {hasMore && (
            <div className="flex justify-center mt-4">
              <Button size="sm" onClick={() => setCurrentPage(c => c + 1)}>Load More</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
