import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/adminApi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';

export function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading } = useQuery({ queryKey: ['user', id], queryFn: () => adminApi.users.get(id!), enabled: !!id });
  const { data: auditLogs } = useQuery({ queryKey: ['audit-logs', id], queryFn: () => adminApi.users.getAuditLogs({ adminId: id }), enabled: !!id });

  if (isLoading || !user) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
        <Button variant="outline" onClick={() => navigate('/admin/users')}>Back</Button>
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-600">
                {user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.phone}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={user.role === 'SUPER_ADMIN' ? 'danger' : user.role === 'ADMIN' ? 'warning' : 'gray'}>
                  {user.role.replace('_', ' ')}
                </Badge>
                <Badge variant={user.isActive ? 'success' : 'danger'}>{user.isActive ? 'Active' : 'Inactive'}</Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Location</h3>
          <p className="text-sm">{user.location?.state || 'N/A'}, {user.location?.district || 'N/A'}</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Account Details</h3>
          <p className="text-sm text-gray-500">Joined: {user.createdAt}</p>
          <p className="text-sm text-gray-500">Onboarding: {user.onboardingCompleted ? 'Completed' : 'Pending'}</p>
        </Card>
      </div>

      {user.profile && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Profile Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><p className="text-sm text-gray-500">Age</p><p className="font-medium">{user.profile.age || 'N/A'}</p></div>
            <div><p className="text-sm text-gray-500">Education</p><p className="font-medium">{user.profile.education || 'N/A'}</p></div>
            <div><p className="text-sm text-gray-500">Capital</p><p className="font-medium">{user.profile.financialInfo?.availableCapital || 0}</p></div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
        {auditLogs?.data && auditLogs.data.length > 0 ? (
          <div className="space-y-3">
            {auditLogs.data.map((log: any) => (
              <div key={log.id} className="border-b border-gray-100 pb-3 last:border-0">
                <p className="text-sm font-medium">{log.action} - {log.resource}</p>
                <p className="text-xs text-gray-500">{new Date(log.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-gray-500">No recent activity found.</p>}
      </Card>
    </div>
  );
}
