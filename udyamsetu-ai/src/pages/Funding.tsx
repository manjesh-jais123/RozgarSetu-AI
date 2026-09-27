import { useSchemes } from '../hooks/useQueries';
import { useAuthStore } from '../hooks/useStores';
import { SchemeCard } from '../components/ui/SchemeCard';
import { Card, CardContent } from '../components/ui/Card';

import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { FileText, CheckCircle, DollarSign, Globe } from 'lucide-react';

const SCHEME_CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'Central Government', label: 'Central Government' },
  { value: 'State Government', label: 'State Government' },
  { value: 'District Level', label: 'District Level' },
  { value: 'Bank Loans', label: 'Bank Loans' },
  { value: 'NGO/Foundation', label: 'NGO/Foundation' },
];

export function Funding() {
  const { user } = useAuthStore();
  void user;
  const { addToast } = useToast();
  const { data: schemes, isLoading } = useSchemes();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showEligibility, setShowEligibility] = useState<string | null>(null);

  const filteredSchemes = schemes?.filter(s => !selectedCategory || s.category === selectedCategory) || [];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Find Funding</h1>
        <p className="text-green-100 mt-1">Discover government schemes and funding opportunities tailored for you</p>
      </div>

      <Card><CardContent className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">Filter Schemes</h3>
        </div>
        <Select label="Category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} options={SCHEME_CATEGORIES} className="w-full max-w-xs mt-2" />
      </CardContent></Card>

      {isLoading ? (
        <LoadingState variant="skeleton" count={4} />
      ) : filteredSchemes.length > 0 ? (
        <div className="space-y-4">
          {filteredSchemes.map(scheme => (
            <SchemeCard key={scheme.id} {...scheme}
              onCheckEligibility={() => {
                setShowEligibility(scheme.id);
                addToast({ type: 'info', title: 'Checking Eligibility', message: 'Verifying your profile against scheme requirements' });
              }}
              onApply={() => addToast({ type: 'success', title: 'Application Started', message: `Redirecting to ${scheme.officialWebsite || 'official portal'}` })}
            />
          ))}
        </div>
      ) : (
        <EmptyState icon={<DollarSign className="w-12 h-12" />} title="No schemes found" description="Try adjusting your filters" action={{ label: 'Clear Filters', onClick: () => setSelectedCategory(''), variant: 'outline' }} />
      )}

      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-100"><CardContent className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg"><FileText className="w-6 h-6 text-green-600 mb-2" /><p className="font-medium text-gray-900">Document Checklist</p><p className="text-sm text-gray-500">Get a personalized list of documents needed for applications</p></div>
          <div className="p-4 bg-white rounded-lg"><CheckCircle className="w-6 h-6 text-blue-600 mb-2" /><p className="font-medium text-gray-900">Eligibility Checker</p><p className="text-sm text-gray-500">Quick check if you qualify before applying</p></div>
          <div className="p-4 bg-white rounded-lg"><Globe className="w-6 h-6 text-purple-600 mb-2" /><p className="font-medium text-gray-900">Official Links</p><p className="text-sm text-gray-500">Direct links to government portals</p></div>
        </div>
      </CardContent></Card>

      {showEligibility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-md w-full"><div className="p-6"><h2 className="text-xl font-bold mb-4">Eligibility Check</h2><div className="space-y-3 mb-6"><div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"><CheckCircle className="w-5 h-5 text-green-600" /><div><p className="font-medium text-green-800">Resident of Uttar Pradesh</p><p className="text-sm text-green-600">✓ Verified from your profile</p></div></div><div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"><CheckCircle className="w-5 h-5 text-green-600" /><div><p className="font-medium text-green-800">Age 18-65 years</p><p className="text-sm text-green-600">✓ You are 28 years old</p></div></div><div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"><CheckCircle className="w-5 h-5 text-green-600" /><div><p className="font-medium text-green-800">Non-farm business activity</p><p className="text-sm text-green-600">✓ Tailoring qualifies</p></div></div><div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg"><span className="w-5 h-5 text-yellow-600">!</span><div><p className="font-medium text-yellow-800">Bank account with 6 months history</p><p className="text-sm text-yellow-600">⚠ Please ensure your account has sufficient transaction history</p></div></div></div><div className="flex gap-3"><Button variant="outline" className="flex-1" onClick={() => setShowEligibility(null)}>Close</Button><Button variant="primary" className="flex-1" onClick={() => { setShowEligibility(null); addToast({ type: 'success', title: 'Application Started', message: 'Redirecting to official portal' }) }}>Proceed to Apply</Button></div></div></div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Select } from '../components/ui/Select';
