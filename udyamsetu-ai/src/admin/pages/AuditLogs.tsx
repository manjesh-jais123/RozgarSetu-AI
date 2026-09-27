import { useState } from 'react';
import { useAuditLogs } from '../hooks/useAdminQueries';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Shield, Search, Filter, Download } from 'lucide-react';
import { getTimeAgo } from '../../utils/helpers';
import type { AuditLog } from '../types';

export function AuditLogs() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useAuditLogs({
    search: search || undefined,
    action: actionFilter || undefined,
    resource: resourceFilter || undefined,
    page: currentPage,
    limit: 20,
  });

  const actionOptions = ['create', 'read', 'update', 'delete', 'suspend', 'activate', 'verify', 'moderate'];
  const resourceOptions = ['user', 'skill', 'opportunity', 'learning', 'scheme', 'product', 'market', 'order', 'buyer'];

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'bg-green-100 text-green-700';
      case 'update': return 'bg-blue-100 text-blue-700';
      case 'delete': return 'bg-red-100 text-red-700';
      case 'suspend':
      case 'activate': return 'bg-orange-100 text-orange-700';
      case 'verify':
      case 'moderate': return 'bg-purple-100 text-purple-700';
      case 'read': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) return <LoadingState text="Loading audit logs..." />;

  const logs = data?.data || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-sm text-gray-500 mt-1">Track all admin actions ({data?.total || 0} total logs)</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => {}}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Actions</option>
            {actionOptions.map((action) => (
              <option key={action} value={action}>{action.charAt(0).toUpperCase() + action.slice(1)}</option>
            ))}
          </select>

          <select
            value={resourceFilter}
            onChange={(e) => setResourceFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Resources</option>
            {resourceOptions.map((res) => (
              <option key={res} value={res}>{res.charAt(0).toUpperCase() + res.slice(1)}</option>
            ))}
          </select>

          <Button
            size="sm"
            onClick={() => {
              setSearch('');
              setActionFilter('');
              setResourceFilter('');
              setCurrentPage(1);
            }}
            variant={search || actionFilter || resourceFilter ? 'primary' : 'outline'}
          >
            <Filter className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </Card>

      {logs.length === 0 ? (
        <EmptyState icon={<Shield className="w-12 h-12 text-gray-300" />} title="No audit logs found" />
      ) : (
        <>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Timestamp</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Admin</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Resource</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Details</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log: AuditLog) => (
                    <tr key={log._id} className="border-b border-gray-100 last:border-0">
                      <td className="px-4 py-3 text-sm text-gray-500">{getTimeAgo(log.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-primary-600">
                              {log.adminId?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AD'}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{log.adminId?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={getActionColor(log.action)}>
                          {log.action}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="gray">
                          {log.resource}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {log.details && Object.keys(log.details).length > 0 ? (
                          <pre className="text-xs bg-gray-50 p-2 rounded max-w-xs truncate">
                            {JSON.stringify(log.details)}
                          </pre>
                        ) : (
                          <span className="text-gray-400">No details</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{log.ipAddress || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage(c => Math.max(1, c - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
