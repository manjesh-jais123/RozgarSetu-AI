import { useParams } from 'react-router-dom';
import { useUser } from '../hooks/useAdminQueries';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { Users, Shield } from 'lucide-react';
import type { AdminUser } from '../types';

export function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: result, isLoading } = useUser(id || '');

  if (isLoading || !result) return <LoadingState text="Loading user details..." />;

  const user = result.user as AdminUser;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
        <Button variant="outline" onClick={() => window.history.back()}>Back</Button>
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
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4" /> Location
          </h3>
          <p className="text-sm">{user.location?.state || 'N/A'}, {user.location?.district || 'N/A'}</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Account Details</h3>
          <p className="text-sm text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString('en-IN')}</p>
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

      {result.progress && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" /> Learning Progress
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Paths Completed</span>
              <span className="font-medium">{(result.progress as { learningPathsCompleted?: number }).learningPathsCompleted || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Lessons Completed</span>
              <span className="font-medium">{(result.progress as { totalLessonsCompleted?: number }).totalLessonsCompleted || 0}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
