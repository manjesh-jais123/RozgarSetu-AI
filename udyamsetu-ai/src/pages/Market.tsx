import { useBuyers, useConnectWithBuyer, useSubmitRfq } from '../hooks/useQueries';
import { useAuthStore } from '../hooks/useStores';
import { BuyerCard } from '../components/ui/BuyerCard';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { Users, Search } from 'lucide-react';

const BUYER_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'individual', label: 'Individual Buyer' },
  { value: 'business', label: 'Business' },
  { value: 'wholesaler', label: 'Wholesaler' },
  { value: 'retailer', label: 'Retailer' },
  { value: 'exporter', label: 'Exporter' },
];

export function Market() {
  const { user } = useAuthStore();
  const { addToast } = useToast();
  const { data: buyers, isLoading } = useBuyers();
  const connectBuyer = useConnectWithBuyer();
  const submitRfq = useSubmitRfq();
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBuyers = buyers?.filter(b => !selectedType || b.type === selectedType).filter(b => 
    !searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.requiredProduct.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Find Buyers</h1>
        <p className="text-blue-100 mt-1">Connect with potential buyers for your products</p>
      </div>

      <Card><CardContent className="p-5">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1 relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Search buyers, products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
          <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} options={BUYER_TYPES} placeholder="All Types" className="w-full max-w-xs" />
        </div>
      </CardContent></Card>

      {isLoading ? (
        <LoadingState variant="skeleton" count={4} />
      ) : filteredBuyers.length > 0 ? (
        <div className="space-y-4">
          {filteredBuyers.map(buyer => (
            <BuyerCard key={buyer.id} {...buyer}
              onConnect={() => {
                connectBuyer.mutate({ buyerId: buyer.id, userId: user!.id, message: 'Hi, I\'m interested in supplying your requirements.' });
                addToast({ type: 'success', title: 'Connection Request Sent', message: 'Buyer will be notified' });
              }}
              onContact={() => addToast({ type: 'info', title: 'Contact', message: 'Contact details shared' })}
            />
          ))}
        </div>
      ) : (
        <EmptyState icon={<Users className="w-12 h-12" />} title="No buyers found" description="Try adjusting your filters" action={{ label: 'Clear Filters', onClick: () => { setSelectedType(''); setSearchQuery(''); }, variant: 'outline' }} />
      )}

      {/* RFQ Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100"><CardContent className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Post a Buying Request (RFQ)</h3>
        <p className="text-gray-600 mb-4">Let buyers know what you can supply</p>
        <form onSubmit={(e) => { e.preventDefault(); submitRfq.mutate({ productId: 'custom', quantity: 100, message: 'We can supply high-quality products' }); addToast({ type: 'success', title: 'RFQ Posted', message: 'Buyers can now see your request' }); }} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4"><Input label="Product" placeholder="e.g., Hand-embroidered cushion covers" /><Input label="Quantity" type="number" placeholder="100" /><Input label="Price Range (₹)" placeholder="400-500" /></div>
          <Textarea label="Description" placeholder="Describe your product, quality, and terms" rows={3} />
          <div className="flex gap-3"><Button variant="outline" type="button" className="flex-1">Cancel</Button><Button variant="primary" type="submit" className="flex-1">Post RFQ</Button></div>
        </form>
      </CardContent></Card>
    </div>
  );
}

import { useState } from 'react';
import { Textarea } from '../components/ui/Input';