import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../services/adminApi';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { LoadingState } from '../../components/ui/LoadingState';
import {
  Users,
  GraduationCap,
  Briefcase,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { formatNumber } from '../../utils/helpers';
import { useSocket } from '../hooks/useSocket';
import { useEffect } from 'react';
import type { AdminDashboardStats } from '../types';

export function Dashboard() {
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.analytics.getDashboardStats(),
  });

  const { subscribe, unsubscribe } = useSocket();

  useEffect(() => {
    const handler = () => refetch();
    subscribe('NEW_USER_REGISTERED', handler);
    subscribe('NEW_PRODUCT_REGISTERED', handler);
    subscribe('PRODUCT_STATUS_UPDATED', handler);
    subscribe('LEARNING_CONTENT_UPDATED', handler);
    subscribe('SCHEME_UPDATED', handler);
    return () => {
      unsubscribe('NEW_USER_REGISTERED');
      unsubscribe('NEW_PRODUCT_REGISTERED');
      unsubscribe('PRODUCT_STATUS_UPDATED');
      unsubscribe('LEARNING_CONTENT_UPDATED');
      unsubscribe('SCHEME_UPDATED');
    };
  }, [subscribe, unsubscribe, refetch]);

  if (isLoading || !stats) return <LoadingState text="Loading dashboard..." />;

  const typedStats = stats as AdminDashboardStats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Platform overview and recent activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Users"
          value={formatNumber(typedStats.totalUsers)}
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-gray-100"
          iconColor="text-gray-600"
        />
        <StatCard
          label="Active Users"
          value={formatNumber(typedStats.activeUsers)}
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-gray-100"
          iconColor="text-gray-600"
        />
        <StatCard
          label="New Registrations (30 days)"
          value={formatNumber(typedStats.newRegistrations)}
          icon={<TrendingUp className="w-5 h-5" />}
          iconBg="bg-gray-100"
          iconColor="text-gray-600"
        />
        <StatCard
          label="Onboarding Complete"
          value={`${typedStats.onboardingRate}%`}
          icon={<BarChart3 className="w-5 h-5" />}
          iconBg="bg-gray-100"
          iconColor="text-gray-600"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Learning Paths"
          value={typedStats.learningUsers}
          icon={<GraduationCap className="w-5 h-5" />}
          iconBg="bg-gray-100"
          iconColor="text-gray-600"
        />
        <StatCard
          label="Businesses Started"
          value={typedStats.businessesStarted}
          icon={<Briefcase className="w-5 h-5" />}
          iconBg="bg-gray-100"
          iconColor="text-gray-600"
        />
        <StatCard
          label="Funding Applications"
          value={typedStats.fundingMatches}
          icon={<DollarSign className="w-5 h-5" />}
          iconBg="bg-gray-100"
          iconColor="text-gray-600"
        />
        <StatCard
          label="Buyers on Platform"
          value={typedStats.buyerMatches}
          icon={<ShoppingCart className="w-5 h-5" />}
          iconBg="bg-gray-100"
          iconColor="text-gray-600"
        />
      </div>

      <Card className="p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Platform Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{formatNumber(typedStats.productsListed)}</p>
            <p className="text-xs text-gray-500">Products Listed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{formatNumber(typedStats.orders)}</p>
            <p className="text-xs text-gray-500">Orders</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{formatNumber(typedStats.aiUsage?.totalRequests || 0)}</p>
            <p className="text-xs text-gray-500">AI Requests</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{formatNumber(typedStats.onboardingCompleted)}</p>
            <p className="text-xs text-gray-500">Onboarding Done</p>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold text-gray-900 mb-4">User Registration Trend (Last 30 Days)</h3>
        <div className="h-48">
          {typedStats.growthTrend && typedStats.growthTrend.length > 0 ? (
            <div className="flex items-end justify-between h-36 gap-1">
              {typedStats.growthTrend.map((trend) => (
                <div key={trend.date} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-gray-100 rounded-t-sm">
                    <div
                      className="bg-gray-600 rounded-t-sm"
                      style={{ height: `${(trend.count / Math.max(...typedStats.growthTrend.map(t => t.count), 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 mt-1">
                    {new Date(trend.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">No registration data available</div>
          )}
        </div>
      </Card>
    </div>
  );
}
