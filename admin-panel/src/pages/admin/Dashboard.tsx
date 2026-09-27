import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/adminApi';
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
  Activity,
} from 'lucide-react';
import { formatNumber } from '../../utils/helpers';

export function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => adminApi.analytics.getDashboardStats(),
  });

  if (isLoading || !stats) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of RozgarSetu AI platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Users" value={formatNumber(stats.totalUsers)} icon={<Users className="w-5 h-5" />} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard label="Active Users" value={formatNumber(stats.activeUsers)} icon={<Users className="w-5 h-5" />} iconBg="bg-green-50" iconColor="text-green-600" />
        <StatCard label="New (30 days)" value={formatNumber(stats.newRegistrations)} icon={<TrendingUp className="w-5 h-5" />} iconBg="bg-primary-50" iconColor="text-primary-600" />
        <StatCard label="Onboarding Complete" value={`${stats.onboardingRate}%`} icon={<Activity className="w-5 h-5" />} iconBg="bg-purple-50" iconColor="text-purple-600" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Learning Paths" value={formatNumber(stats.learningUsers)} icon={<GraduationCap className="w-5 h-5" />} iconBg="bg-indigo-50" iconColor="text-indigo-600" />
        <StatCard label="Businesses Started" value={formatNumber(stats.businessesStarted)} icon={<Briefcase className="w-5 h-5" />} iconBg="bg-orange-50" iconColor="text-orange-600" />
        <StatCard label="Funding Matches" value={formatNumber(stats.fundingMatches)} icon={<DollarSign className="w-5 h-5" />} iconBg="bg-yellow-50" iconColor="text-yellow-600" />
        <StatCard label="Buyers Matched" value={formatNumber(stats.buyerMatches)} icon={<ShoppingCart className="w-5 h-5" />} iconBg="bg-teal-50" iconColor="text-teal-600" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold text-gray-900 mb-4">AI Usage</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Total Conversations</span>
              <span className="font-medium text-gray-900">{formatNumber(stats.aiUsage.totalConversations)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Total Requests</span>
              <span className="font-medium text-gray-900">{formatNumber(stats.aiUsage.totalRequests)}</span>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Products & Orders</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Products Listed</span>
              <span className="font-medium text-gray-900">{formatNumber(stats.productsListed)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Orders</span>
              <span className="font-medium text-gray-900">{formatNumber(stats.orders)}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold text-gray-900 mb-4">User Registration Growth (Last 30 Days)</h3>
        <div className="h-48">
          {stats.growthTrend.length > 0 ? (
            <div className="flex items-end justify-between h-36 gap-1">
              {stats.growthTrend.map((trend) => (
                <div key={trend.date} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-gray-100 rounded-t-sm relative group cursor-pointer">
                    <div
                      className="bg-primary-600 rounded-t-sm"
                      style={{ height: `${(trend.count / Math.max(...stats.growthTrend.map(t => t.count), 1)) * 100}%` }}
                    />
                    <span className="absolute bottom-full left-1/2 transform -translateX-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                      {trend.count}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 mt-1">
                    {trend.date.split('-').slice(1, 3).join('/')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">No data available</div>
          )}
        </div>
      </Card>
    </div>
  );
}
