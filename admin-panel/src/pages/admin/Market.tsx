import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { adminApi } from '../../services/adminApi';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { ShoppingCart, Users, DollarSign, Search } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import type { AdminBuyer, AdminOrder, AdminFundingApplication } from '../../types/admin';

export function Market() {
  const [activeTab, setActiveTab] = useState<'buyers' | 'orders' | 'funding'>('buyers');

  const buyersQuery = useQuery({ queryKey: ['admin-buyers'], queryFn: () => adminApi.market.listBuyers() });
  const ordersQuery = useQuery({ queryKey: ['admin-orders'], queryFn: () => adminApi.market.listOrders() });
  const fundingQuery = useQuery({ queryKey: ['admin-funding'], queryFn: () => adminApi.market.getFundingApplications() });
  const updateOrderStatusMutation = useMutation({ mutationFn: ({ id, status }: { id: string; status: string }) => adminApi.market.updateOrderStatus(id, status) });

  if (buyersQuery.isLoading || ordersQuery.isLoading || fundingQuery.isLoading) return <LoadingState />;

  const buyers = buyersQuery.data?.data || [];
  const orders = ordersQuery.data?.data || [];
  const fundingApps = fundingQuery.data?.data || [];

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    await updateOrderStatusMutation.mutateAsync({ id: orderId, status });
    ordersQuery.refetch();
  };

  const getFundingStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success' as const;
      case 'rejected': return 'danger' as const;
      case 'under_review': return 'secondary' as const;
      default: return 'warning' as const;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Market Management</h1>
      <p className="text-sm text-gray-500 mt-1">Manage buyers, orders, and funding applications</p>

      <div className="flex gap-4 border-b border-gray-200">
        <button onClick={() => setActiveTab('buyers')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'buyers' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}>
          <Users className="w-4 h-4 inline mr-1" /> Buyers ({buyersQuery.data?.total || 0})
        </button>
        <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'orders' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}>
          <ShoppingCart className="w-4 h-4 inline mr-1" /> Orders ({ordersQuery.data?.total || 0})
        </button>
        <button onClick={() => setActiveTab('funding')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'funding' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}>
          <DollarSign className="w-4 h-4 inline mr-1" /> Funding ({fundingQuery.data?.total || 0})
        </button>
      </div>

      {activeTab === 'buyers' && (
        <>
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search buyers..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" />
            </div>
          </Card>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full bg-white">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Buyer</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Location</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Budget</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Verified</th>
                </tr>
              </thead>
              <tbody>
                {buyers.map((buyer: AdminBuyer) => (
                  <tr key={buyer.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3">{buyer.name} - {buyer.requiredProduct}</td>
                    <td className="px-4 py-3 text-sm">{buyer.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{buyer.location}</td>
                    <td className="px-4 py-3 text-sm font-medium">{formatCurrency(buyer.budget)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={buyer.verified ? 'success' : 'warning'}>{buyer.verified ? 'Verified' : 'Unverified'}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'orders' && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full bg-white">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Buyer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: AdminOrder) => (
                <tr key={order.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">{order.productId?.name || 'Unknown Product'}</td>
                  <td className="px-4 py-3">{order.buyerId?.name || 'Unknown'}</td>
                  <td className="px-4 py-3 text-sm font-medium">{formatCurrency(order.totalAmount)}</td>
                  <td className="px-4 py-3">
                    <select value={order.status} onChange={e => handleUpdateOrderStatus(order.id, e.target.value)} className="text-sm border border-gray-200 rounded px-2 py-1">
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'funding' && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full bg-white">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Applicant</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Scheme</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Applied</th>
              </tr>
            </thead>
            <tbody>
              {fundingApps.map((app: AdminFundingApplication) => (
                <tr key={app.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">{app.userId?.name || 'Unknown'}</td>
                  <td className="px-4 py-3 text-sm">{app.schemeId?.name || 'Unknown'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={getFundingStatusColor(app.status || '')}>{app.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(app.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
