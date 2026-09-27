import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useOnboardingStore } from '../hooks/useStores';
import { ArrowLeft, ArrowRight, ShoppingBag, Briefcase, Leaf, UtensilsCrossed, Heart, Sparkles } from 'lucide-react';

const BUSINESS_CATEGORIES = [
  { id: 'candle', name: 'Candle Making', icon: Sparkles, description: 'Scented & decorative candles' },
  { id: 'bamboo', name: 'Bamboo Craft', icon: Leaf, description: 'Eco-friendly bamboo products' },
  { id: 'tailoring', name: 'Tailoring & Stitching', icon: ShoppingBag, description: 'Custom clothing & alterations' },
  { id: 'food', name: 'Food Processing', icon: UtensilsCrossed, description: 'Pickles, jams, snacks' },
  { id: 'handicrafts', name: 'Handicrafts', icon: Heart, description: 'Traditional crafts & art' },
  { id: 'farming', name: 'Farming Related', icon: Leaf, description: 'Organic farming & produce' },
  { id: 'digital', name: 'Digital Services', icon: Briefcase, description: 'Online work & services' },
  { id: 'beauty', name: 'Beauty Services', icon: Heart, description: 'Beauty & wellness products' },
];

export function OnboardingStep3() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const { updateFormData, setCurrentStep } = useOnboardingStore();
  const navigate = useNavigate();

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleNext = () => {
    updateFormData({ businessInterests: selectedInterests });
    setCurrentStep(4);
    navigate('/onboarding/step-4');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/onboarding/step-2')}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors touch-target"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-primary-600">Step 3 of 5</span>
            <span className="text-sm text-gray-400">Business Interest</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Business Interest</h1>
            <p className="text-gray-500 mt-1">What business interests you? Select all that apply.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BUSINESS_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedInterests.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleInterest(cat.id)}
                  className={`
                    flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all touch-target
                    ${isSelected
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                    }
                  `}
                  aria-pressed={isSelected}
                >
                  <div className={`
                    w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
                    ${isSelected ? 'bg-primary-100' : 'bg-gray-100'}
                  `}>
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-primary-600' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                    <p className="text-sm text-gray-500">{cat.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={() => navigate('/onboarding/step-2')}
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleNext}
              disabled={selectedInterests.length === 0}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}