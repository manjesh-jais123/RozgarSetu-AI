import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../services/adminApi';
import { Card } from '../../components/ui/Card';
import { LoadingState } from '../../components/ui/LoadingState';
import {
  BarChart3,
  Users,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  GraduationCap,
  CalendarIcon,
  FileText,
  PieChart,
} from 'lucide-react';
import { formatNumber } from '../../utils/helpers';
import type { AdminDashboardStats, AIGenerationStats } from '../types';

export function Analytics() {
  const [period, setPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'ai' | 'business'>('overview');

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-analytics-stats'],
    queryFn: () => adminApi.analytics.getDashboardStats(),
  });

  const { data: aiStats, isLoading: aiLoading } = useQuery({
    queryKey: ['admin-analytics-ai', period],
    queryFn: () => adminApi.analytics.getAIGenerationStats(period),
  });

  const { data: businessStats, isLoading: businessLoading } = useQuery({
    queryKey: ['admin-analytics-business', period],
    queryFn: () => adminApi.analytics.getBusinessAnalytics(period),
  });

  if (isLoading || !stats) return <LoadingState text="Loading analytics..." />;

  const typedStats = stats as AdminDashboardStats;
  const typedAiStats = aiStats as AIGenerationStats;

  const periods = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'ai', label: 'AI Usage', icon: PieChart },
    { id: 'business', label: 'Business', icon: ShoppingCart },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Platform performance and insights</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
        >
          {periods.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`
                  flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm
                  ${isActive
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">User Growth</p>
                <Users className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(typedStats.newRegistrations)}</p>
              <p className="text-xs text-gray-500 mt-1">New registrations ({periods.find(p => p.value === period)?.label})</p>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Onboarding Rate</p>
                <GraduationCap className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{Math.round(typedStats.onboardingRate)}%</p>
              <p className="text-xs text-gray-500 mt-1">Completion rate</p>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Businesses Started</p>
                <DollarSign className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(typedStats.businessesStarted)}</p>
              <p className="text-xs text-gray-500 mt-1">Total businesses</p>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Funding Applications</p>
                <TrendingUp className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(typedStats.fundingMatches)}</p>
              <p className="text-xs text-gray-500 mt-1">Total applications</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" /> User Registration Trend
              </h3>
              <div className="space-y-3">
                {typedStats.growthTrend && typedStats.growthTrend.slice(0, 10).map((trend) => (
                  <div key={trend.date} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-20">
                      {new Date(trend.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex-1 h-6 bg-gray-100 rounded">
                      <div
                        className="h-full bg-gray-700 rounded"
                        style={{ width: `${Math.min((trend.count / Math.max(...typedStats.growthTrend.map(t => t.count), 1)) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-8 text-right">{trend.count}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" /> Market Overview
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Products Listed</span>
                  <span className="font-medium text-gray-900">{formatNumber(typedStats.productsListed)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Buyers on Platform</span>
                  <span className="font-medium text-gray-900">{formatNumber(typedStats.buyerMatches)}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Total Orders</span>
                  <span className="font-medium text-gray-900">{formatNumber(typedStats.orders)}</span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Top AI Search Topics
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase py-2">Topic</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase py-2">Searches</th>
                  </tr>
                </thead>
                <tbody>
                  {typedAiStats?.popularTopics?.slice(0, 5).map((topic, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-2 text-sm text-gray-700">{topic.topic}</td>
                      <td className="py-2 text-sm font-medium text-gray-900">{topic.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {activeTab === 'ai' && (
        aiLoading ? (
          <LoadingState text="Loading AI stats..." />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Card className="p-5">
                <p className="text-sm font-medium text-gray-500 mb-2">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(typedAiStats?.totalRequests || 0)}</p>
              </Card>
              <Card className="p-5">
                <p className="text-sm font-medium text-gray-500 mb-2">Failed Requests</p>
                <p className="text-2xl font-bold text-red-600">{formatNumber(typedAiStats?.totalFailures || 0)}</p>
              </Card>
              <Card className="p-5">
                <p className="text-sm font-medium text-gray-500 mb-2">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">{Math.round(typedAiStats?.successRate || 0)}%</p>
              </Card>
            </div>

            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Popular Topics</h3>
              <div className="space-y-3">
                {typedAiStats?.popularTopics?.map((topic, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-48">{topic.topic}</span>
                    <div className="flex-1 h-5 bg-gray-100 rounded">
                      <div
                        className="h-full bg-gray-700 rounded"
                        style={{ width: `${Math.min((topic.count / Math.max(...typedAiStats.popularTopics.map(t => t.count), 1)) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-8 text-right">{topic.count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )
      )}

      {activeTab === 'business' && (
        businessLoading ? (
          <LoadingState text="Loading business analytics..." />
        ) : (
          <div className="space-y-6">
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Business Analytics Data</h3>
              <pre className="text-xs text-gray-600 overflow-x-auto p-4 bg-gray-50 rounded-lg">
                {JSON.stringify(businessStats, null, 2)}
              </pre>
            </Card>
          </div>
        )
      )}
    </div>
  );
}
