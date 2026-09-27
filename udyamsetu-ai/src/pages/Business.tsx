import { useState } from 'react';
import { useBusinessPlan, useBusinessDashboard, useCreateBusinessPlan, useUpdateBusinessPlan } from '../hooks/useQueries';
import { useAuthStore } from '../hooks/useStores';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Input';

import { StatCard } from '../components/ui/StatCard';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { TrendingUp, ClipboardList, DollarSign, CheckCircle, Plus, Edit, Lightbulb, Target, X } from 'lucide-react';

const BUSINESS_IDEAS = [
  { id: 'candle', title: 'Candle Making Business', investment: '₹20,000-60,000', duration: '1-2 months', difficulty: 'Easy', icon: Lightbulb },
  { id: 'tailoring', title: 'Custom Tailoring', investment: '₹15,000-50,000', duration: '2-3 months', difficulty: 'Easy', icon: Target },
  { id: 'bamboo', title: 'Bamboo Craft Products', investment: '₹25,000-80,000', duration: '4-6 months', difficulty: 'Medium', icon: Lightbulb },
  { id: 'food', title: 'Food Processing (Pickles)', investment: '₹30,000-1,00,000', duration: '2-3 months', difficulty: 'Medium', icon: Lightbulb },
];

export function Business() {
  const { user } = useAuthStore();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { data: plan } = useBusinessPlan(user?.id || '');
  const { data: dashboard } = useBusinessDashboard(user?.id || '');
  const _createPlan = useCreateBusinessPlan();
  const _updatePlan = useUpdateBusinessPlan();
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'plan' | 'ideas'>('dashboard');

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Business Dashboard</h1>
        <p className="text-amber-100 mt-1">Build, manage, and grow your business</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {['dashboard', 'plan', 'ideas'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${activeTab === tab ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Readiness Score" value={String(dashboard?.readinessScore || 72)} icon={<TrendingUp className="w-5 h-5" />} iconBg="bg-primary-100" iconColor="text-primary-600" />
            <StatCard label="Opportunities" value={Number(dashboard?.opportunitiesExplored || 5)} icon={<Lightbulb className="w-5 h-5" />} iconBg="bg-yellow-100" iconColor="text-yellow-600" />
            <StatCard label="Learning" value={String(dashboard?.learningProgress || 35)} icon={<ClipboardList className="w-5 h-5" />} iconBg="bg-secondary-100" iconColor="text-secondary-600" />
            <StatCard label="Funding Matched" value={Number(dashboard?.fundingMatched || 3)} icon={<DollarSign className="w-5 h-5" />} iconBg="bg-green-100" iconColor="text-green-600" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle>Business Plan</CardTitle></CardHeader><CardContent>
              {plan ? (
                <>
                  <Badge variant={plan.status === 'completed' ? 'success' : 'warning'} className="mb-3">{plan.status}</Badge>
                  <p className="text-gray-600 mb-3">{plan.idea}</p>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('plan')}>Edit Plan</Button>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-3">No business plan yet</p>
                  <Button variant="primary" size="sm" onClick={() => setShowCreatePlan(true)}>Create Plan</Button>
                </div>
              )}
            </CardContent></Card>
            <Card><CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader><CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('ideas')}>Browse Business Ideas</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/funding')}>Find Funding</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/market')}>Find Buyers</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/products')}>Manage Products</Button>
            </CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'plan' && (
        <div className="space-y-6">
          {plan ? (
            <Card><CardHeader className="flex items-center justify-between"><CardTitle>Your Business Plan</CardTitle><Button variant="outline" size="sm" onClick={() => setShowCreatePlan(true)}><Edit className="w-4 h-4 mr-2" />Edit</Button></CardHeader><CardContent className="space-y-6">
              <div><h4 className="font-medium text-gray-900">Business Idea</h4><p className="text-gray-600 mt-1">{plan.idea}</p></div>
              <div className="grid md:grid-cols-2 gap-4"><div><h4 className="font-medium text-gray-900">Investment Needed</h4><p className="text-xl font-bold text-primary-600 mt-1">₹{plan.requiredInvestment.toLocaleString()}</p></div><div><h4 className="font-medium text-gray-900">Monthly Operating Cost</h4><p className="text-xl font-bold text-gray-900 mt-1">₹{plan.operatingCost.toLocaleString()}</p></div></div>
              <div><h4 className="font-medium text-gray-900">Pricing Strategy</h4><div className="grid grid-cols-3 gap-4 mt-2"><div className="p-3 bg-gray-50 rounded"><p className="text-sm text-gray-500">Cost Price</p><p className="font-bold">₹{plan.pricingStrategy.costPrice}</p></div><div className="p-3 bg-green-50 rounded"><p className="text-sm text-gray-500">Selling Price</p><p className="font-bold text-green-600">₹{plan.pricingStrategy.sellingPrice}</p></div><div className="p-3 bg-blue-50 rounded"><p className="text-sm text-gray-500">Margin</p><p className="font-bold text-blue-600">{plan.pricingStrategy.margin}%</p></div></div></div>
              <div><h4 className="font-medium text-gray-900">Customer Segments</h4><div className="flex flex-wrap gap-2 mt-2">{plan.customerSegments.map((s, i) => <Badge key={i} variant="gray">{s}</Badge>)}</div></div>
              <div><h4 className="font-medium text-gray-900">Marketing Plan</h4><ul className="space-y-1 mt-2">{plan.marketingPlan.map((m, i) => <li key={i} className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="w-4 h-4 text-green-500" />{m}</li>)}</ul></div>
              <div><h4 className="font-medium text-gray-900">Risk Factors</h4><ul className="space-y-1 mt-2">{plan.riskFactors.map((r, i) => <li key={i} className="flex items-center gap-2 text-sm text-gray-600"><span className="w-2 h-2 rounded-full bg-red-500" />{r}</li>)}</ul></div>
              <div><h4 className="font-medium text-gray-900">Next Actions</h4><ul className="space-y-1 mt-2">{plan.nextActions.map((a, i) => <li key={i} className="flex items-center gap-2 text-sm text-gray-600"><span className="w-2 h-2 rounded-full bg-primary-500" />{a}</li>)}</ul></div>
            </CardContent></Card>
          ) : (
            <Card><CardContent className="p-6 text-center"><EmptyState icon={<ClipboardList className="w-12 h-12" />} title="No Business Plan" description="Create your first business plan to get started" action={{ label: 'Create Plan', onClick: () => setShowCreatePlan(true), variant: 'primary' }} /></CardContent></Card>
          )}
        </div>
      )}

      {activeTab === 'ideas' && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Business Ideas</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {BUSINESS_IDEAS.map(idea => (
              <Card key={idea.id}><CardContent className="p-5">
                <div className="flex items-start gap-3"><div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center"><idea.icon className="w-6 h-6 text-primary-600" /></div><div className="flex-1"><h3 className="font-semibold text-gray-900">{idea.title}</h3><p className="text-sm text-gray-500">Investment: {idea.investment} • {idea.duration} • {idea.difficulty}</p></div></div>
                <div className="mt-4 flex gap-2"><Button variant="primary" size="sm" onClick={() => { setShowCreatePlan(true); addToast({ type: 'success', title: 'Business Idea Selected', message: `${idea.title} added to your plan` }) }}><Plus className="w-4 h-4 mr-1" />Add to My Plan</Button><Button variant="outline" size="sm">View Details</Button></div>
              </CardContent></Card>
            ))}
          </div>
        </div>
      )}

      {showCreatePlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b"><div className="flex items-center justify-between"><h2 className="text-xl font-bold">Create Business Plan</h2><Button variant="ghost" size="sm" onClick={() => setShowCreatePlan(false)}><X className="w-5 h-5" /></Button></div></div>
            <form onSubmit={(e) => { e.preventDefault(); setShowCreatePlan(false); addToast({ type: 'success', title: 'Business Plan Created', message: 'Your plan has been saved' }) }} className="p-6 space-y-4">
              <Input label="Business Idea" placeholder="e.g., Handmade Candle Business" defaultValue={BUSINESS_IDEAS[0].title} />
              <Input label="Required Investment (₹)" type="number" placeholder="50000" defaultValue="50000" />
              <Textarea label="Raw Materials (one per line)" placeholder="Soy wax\nCotton wicks\nFragrance oils\nGlass jars" defaultValue="Soy wax\nCotton wicks\nFragrance oils\nGlass jars" />
              <Textarea label="Equipment" placeholder="Double boiler\nThermometer\nPouring pitcher" defaultValue="Double boiler\nThermometer\nPouring pitcher" />
              <Input label="Monthly Operating Cost (₹)" type="number" placeholder="8000" defaultValue="8000" />
              <div className="grid grid-cols-3 gap-4"><Input label="Cost Price (₹)" type="number" defaultValue="50" /><Input label="Selling Price (₹)" type="number" defaultValue="120" /><Input label="Margin (%)" type="number" defaultValue="140" /></div>
              <Textarea label="Customer Segments (one per line)" placeholder="Local households\nGift shops\nOnline marketplaces" defaultValue="Local households\nGift shops\nOnline marketplaces" />
              <Textarea label="Marketing Plan (one per line)" placeholder="Instagram marketing\nLocal exhibitions\nWhatsApp catalog" defaultValue="Instagram marketing\nLocal exhibitions\nWhatsApp catalog" />
              <Textarea label="Risk Factors (one per line)" placeholder="Seasonal demand\nRaw material price changes" defaultValue="Seasonal demand\nRaw material price changes" />
              <div className="flex gap-3 pt-4"><Button variant="outline" onClick={() => setShowCreatePlan(false)} className="flex-1">Cancel</Button><Button variant="primary" type="submit" className="flex-1">Create Plan</Button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}