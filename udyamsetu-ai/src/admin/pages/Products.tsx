import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/adminApi';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import { Package, Search, Edit } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import type { AdminProduct } from '../types';
import { useSocket } from '../hooks/useSocket';
import { useEffect } from 'react';

export function Products() {
  const { addToast } = useToast();
  const [moderationStatus, setModerationStatus] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-products', moderationStatus, search, category],
    queryFn: () => adminApi.products.list({
      moderationStatus: moderationStatus !== 'all' ? moderationStatus : undefined,
      search: search || undefined,
      category: category || undefined,
    }),
  });

  const { subscribe, unsubscribe } = useSocket();

  useEffect(() => {
    const handler = () => refetch();
    subscribe('NEW_PRODUCT_REGISTERED', handler);
    subscribe('PRODUCT_STATUS_UPDATED', handler);
    return () => {
      unsubscribe('NEW_PRODUCT_REGISTERED');
      unsubscribe('PRODUCT_STATUS_UPDATED');
    };
  }, [subscribe, unsubscribe, refetch]);

  const queryClient = useQueryClient();

  const moderateMutation = useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: string; note?: string }) =>
      adminApi.products.moderate(id, { moderationStatus: status, moderationNote: note }),
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      addToast({ type: 'success', title: 'Product moderated' });
    },
    onError: () => addToast({ type: 'error', title: 'Failed to moderate' }),
  });

  if (isLoading || !data) return <LoadingState text="Loading products..." />;

  const products = (data as { products: AdminProduct[]; categories: string[]; pagination: unknown }).products || [];
  const categories = (data as { products: AdminProduct[]; categories: string[]; pagination: unknown }).categories || [];

  const handleModerate = async (product: AdminProduct, status: 'approved' | 'rejected') => {
    await moderateMutation.mutateAsync({
      id: product._id,
      status,
      note: status === 'rejected' ? 'Does not meet guidelines' : '',
    });
  };

  const getStatusColor = (status: AdminProduct['moderationStatus']) => {
    switch (status) {
      case 'approved': return 'success' as const;
      case 'rejected': return 'danger' as const;
      default: return 'warning' as const;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Products</h1>
      <p className="text-sm text-gray-500 mt-1">Moderate product listings</p>

      <Card className="p-4">
        <div className="flex gap-4">
          <select
            value={moderationStatus}
            onChange={e => setModerationStatus(e.target.value as 'pending' | 'approved' | 'rejected' | 'all')}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All Statuses</option>
          </select>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat: string) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </Card>

      {products.length === 0 ? (
        <EmptyState icon={<Package className="w-12 h-12 text-gray-300" />} title="No products found" />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full bg-white">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Seller</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Moderation</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: AdminProduct) => (
                <tr key={product._id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500 truncate">{product.category}</p>
                  </td>
                  <td className="px-4 py-3 text-sm">{product.userId && typeof product.userId === 'object' ? (product.userId as { name?: string }).name : 'Unknown'}</td>
                  <td className="px-4 py-3 text-sm font-medium">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={getStatusColor(product.moderationStatus)}>{product.moderationStatus}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {product.moderationStatus === 'pending' && (
                        <>
                          <button onClick={() => handleModerate(product, 'approved')} className="px-2 py-1 text-xs text-green-700 bg-green-50 rounded">Approve</button>
                          <button onClick={() => handleModerate(product, 'rejected')} className="px-2 py-1 text-xs text-red-700 bg-red-50 rounded">Reject</button>
                        </>
                      )}
                      <button onClick={() => {}} className="p-1 text-gray-600 hover:text-primary-600 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
