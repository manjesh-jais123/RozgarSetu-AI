import { useQuery, useMutation } from '@tanstack/react-query';
import { adminApi } from '../../services/adminApi';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../hooks/useToast';
import { Package, Search } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import type { AdminProduct } from '../../types/admin';

export function Products() {
  const { addToast } = useToast();
  const { data, isLoading, refetch } = useQuery({ queryKey: ['admin-products'], queryFn: () => adminApi.products.list() });
  const moderateMutation = useMutation({ mutationFn: ({ id, status }: { id: string; status: string }) => adminApi.products.moderate(id, { moderationStatus: status, moderationNote: status === 'rejected' ? 'Does not meet guidelines' : '' }) });

  if (isLoading) return <LoadingState />;

  const products = data?.data || [];

  const handleModerate = async (product: AdminProduct, status: 'approved' | 'rejected') => {
    await moderateMutation.mutateAsync({ id: product.id, status });
    refetch();
    addToast({ type: 'success', title: `Product ${status}` });
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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search products..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500" />
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
                <tr key={product.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500 truncate">{product.category}</p>
                  </td>
                  <td className="px-4 py-3 text-sm">{product.seller?.name || 'Unknown'}</td>
                  <td className="px-4 py-3 text-sm font-medium">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={getStatusColor(product.moderationStatus)}>{product.moderationStatus || 'pending'}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {product.moderationStatus === 'pending' && (
                        <>
                          <button onClick={() => handleModerate(product, 'approved')} className="px-2 py-1 text-xs text-green-700 bg-green-50 rounded">Approve</button>
                          <button onClick={() => handleModerate(product, 'rejected')} className="px-2 py-1 text-xs text-red-700 bg-red-50 rounded">Reject</button>
                        </>
                      )}
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
