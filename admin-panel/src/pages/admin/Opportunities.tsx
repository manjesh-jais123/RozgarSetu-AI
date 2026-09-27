import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { Search } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import type { AdminOpportunity } from '../../types/admin';

export function Opportunities() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({ queryKey: ['admin-opportunities'], queryFn: () => adminApi.opportunities.list() });

  if (isLoading) return <LoadingState />;

  const opportunities = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Opportunities</h1>
        <Button onClick={() => navigate('/admin/opportunities/create')}>Add Opportunity</Button>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search opportunities..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500" />
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {opportunities.map((opp: AdminOpportunity) => (
          <Card key={opp.id} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{opp.title}</h3>
              <Badge variant={opp.isActive ? 'success' : 'danger'}>{opp.isActive ? 'Active' : 'Inactive'}</Badge>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{opp.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
              <Badge variant="gray" size="sm">{opp.category}</Badge>
              <Badge variant="gray" size="sm">{opp.difficulty}</Badge>
              <span>Invest: {formatCurrency(opp.requiredInvestment.min)} - {formatCurrency(opp.requiredInvestment.max)}</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/opportunities/${opp.id}/edit`)}>Edit</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
