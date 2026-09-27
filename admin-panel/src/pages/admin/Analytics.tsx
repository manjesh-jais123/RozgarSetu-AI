import { Card } from '../../components/ui/Card';
import { useDashboardStats } from '../../hooks/useAdminQueries';
import { LoadingState } from '../../components/ui/LoadingState';
import { BarChart3, TrendingUp, Users, ShoppingBag } from 'lucide-react';
import { formatNumber } from '../../utils/helpers';

export function Analytics() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        Analytics Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" /> Platform Growth
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Total Users</span>
              <span className="font-medium text-gray-900">{formatNumber(stats?.totalUsers || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Active Users</span>
              <span className="font-medium text-green-600">{formatNumber(stats?.activeUsers || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">New Registrations</span>
              <span className="font-medium text-blue-600">{formatNumber(stats?.newRegistrations || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Businesses Started</span>
              <span className="font-medium text-purple-600">{formatNumber(stats?.businessesStarted || 0)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" /> Business Metrics
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Onboarding Completed</span>
              <span className="font-medium text-gray-900">{formatNumber(stats?.onboardingCompleted || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Onboarding Rate</span>
              <span className="font-medium text-green-600">{stats?.onboardingRate || 0}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Funding Matches</span>
              <span className="font-medium text-indigo-600">{formatNumber(stats?.fundingMatches || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Products Listed</span>
              <span className="font-medium text-pink-600">{formatNumber(stats?.productsListed || 0)}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Growth Trend (Last 7 Days)
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {stats?.growthTrend && stats.growthTrend.length > 0 ? (
            stats.growthTrend.slice(0, 7).reverse().map((item) => (
              <div key={item.date} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.date}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{formatNumber(item.count)}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-600 h-full" style={{ width: `${Math.min((item.count / Math.max(...stats.growthTrend.map(g => g.count), 1)) * 100, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            ))
          ) : <p className="text-sm text-gray-500">No data available</p>}
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold text-gray-900 mb-4">AI Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total Conversations</p>
            <p className="text-2xl font-bold">{formatNumber(stats?.aiUsage?.totalConversations || 0)}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total Requests</p>
            <p className="text-2xl font-bold">{formatNumber(stats?.aiUsage?.totalRequests || 0)}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
