import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/adminApi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { useToast } from '../../components/ui/Toast';
import { Landmark, CheckCircle, Edit, Trash2 } from 'lucide-react';
import type { AdminScheme } from '../types';
import { useSocket } from '../hooks/useSocket';
import { useEffect } from 'react';

export function Schemes() {
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingScheme, setEditingScheme] = useState<AdminScheme | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-schemes'],
    queryFn: () => adminApi.schemes.list(),
  });

  const { subscribe, unsubscribe } = useSocket();

  useEffect(() => {
    const handler = () => refetch();
    subscribe('SCHEME_UPDATED', handler);
    return () => unsubscribe('SCHEME_UPDATED');
  }, [subscribe, unsubscribe, refetch]);

  const verifyMutation = useMutation({
    mutationFn: adminApi.schemes.verify,
    onSuccess: () => { refetch(); addToast({ type: 'success', title: 'Scheme verified' }); },
    onError: () => addToast({ type: 'error', title: 'Failed to verify' }),
  });
  const deleteMutation = useMutation({
    mutationFn: adminApi.schemes.delete,
    onSuccess: () => { refetch(); addToast({ type: 'success', title: 'Scheme deleted' }); },
    onError: () => addToast({ type: 'error', title: 'Failed to delete' }),
  });

  if (isLoading || !data) return <LoadingState text="Loading schemes..." />;

  const schemes = (data as { schemes: AdminScheme[]; categories: string[]; pagination: unknown }).schemes || [];

  const handleVerify = async (id: string) => {
    await verifyMutation.mutateAsync(id);
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  if (showForm) {
    return (
      <SchemeForm
        initial={editingScheme}
        onCancel={() => { setShowForm(false); setEditingScheme(null); }}
        onSuccess={() => { refetch(); setShowForm(false); setEditingScheme(null); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Schemes</h1>
        <Button onClick={() => { setShowForm(true); setEditingScheme(null); }}>Add Scheme</Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full bg-white">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Scheme</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schemes.map((scheme: AdminScheme) => (
              <tr key={scheme._id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Landmark className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{scheme.name}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{scheme.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{scheme.category}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <Badge variant={scheme.isVerified ? 'success' : 'warning'}>{scheme.isVerified ? 'Verified' : 'Unverified'}</Badge>
                    <Badge variant={scheme.isActive ? 'success' : 'danger'}>{scheme.isActive ? 'Active' : 'Inactive'}</Badge>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    {!scheme.isVerified && (
                      <button onClick={() => handleVerify(scheme._id)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => { setEditingScheme(scheme); setShowForm(true); }} className="p-1 text-gray-600 hover:text-primary-600 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(scheme._id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface SchemeFormProps {
  initial?: AdminScheme | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export function SchemeForm({ initial, onCancel, onSuccess }: SchemeFormProps) {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id || !!initial;
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<AdminScheme>>(initial || {
    name: '', description: '', category: '', eligibility: [], benefits: [],
    requiredDocuments: [], applicationProcess: [], officialWebsite: '',
    stateAvailability: [], isVerified: false, isActive: true,
  });

  const handleArrayField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value.split(',').map(s => s.trim()).filter(Boolean) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && (id || initial?._id)) {
        const schemeId = id || initial?._id || '';
        await adminApi.schemes.update(schemeId, formData);
      } else {
        await adminApi.schemes.create(formData);
      }
      queryClient.invalidateQueries({ queryKey: ['admin-schemes'] });
      addToast({ type: 'success', title: 'Scheme saved successfully' });
      onSuccess();
    } catch {
      addToast({ type: 'error', title: 'Failed to save scheme' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Scheme' : 'Create Scheme'}</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="Scheme Name"
            value={formData.name || ''}
            onChange={e => setFormData({...formData, name: e.target.value})}
            required
          />
          <textarea
            className="w-full px-4 py-3 border rounded-lg resize-y min-h-[100px]"
            placeholder="Description"
            value={formData.description || ''}
            onChange={e => setFormData({...formData, description: e.target.value})}
            required
          />
          <input
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="Category"
            value={formData.category || ''}
            onChange={e => setFormData({...formData, category: e.target.value})}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Eligibility (comma sep)"
              value={formData.eligibility?.join(', ') || ''}
              onChange={e => handleArrayField('eligibility', e.target.value)}
            />
            <input
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Benefits (comma sep)"
              value={formData.benefits?.join(', ') || ''}
              onChange={e => handleArrayField('benefits', e.target.value)}
            />
            <input
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Required Documents (comma sep)"
              value={formData.requiredDocuments?.join(', ') || ''}
              onChange={e => handleArrayField('requiredDocuments', e.target.value)}
            />
            <input
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Application Process (comma sep)"
              value={formData.applicationProcess?.join(', ') || ''}
              onChange={e => handleArrayField('applicationProcess', e.target.value)}
            />
          </div>
          <input
            className="w-full px-4 py-3 border rounded-lg"
            type="url"
            placeholder="Official Website"
            value={formData.officialWebsite || ''}
            onChange={e => setFormData({...formData, officialWebsite: e.target.value})}
          />
          <input
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="Target Group"
            value={formData.targetGroup || ''}
            onChange={e => setFormData({...formData, targetGroup: e.target.value})}
          />
          <input
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="State Availability (comma sep)"
            value={formData.stateAvailability?.join(', ') || ''}
            onChange={e => handleArrayField('stateAvailability', e.target.value)}
          />
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formData.isVerified} onChange={e => setFormData({...formData, isVerified: e.target.checked, lastVerified: e.target.checked ? new Date().toISOString() : undefined})} className="rounded" />
              <span>Verified</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="rounded" />
              <span>Active</span>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" loading={loading}>Save</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
