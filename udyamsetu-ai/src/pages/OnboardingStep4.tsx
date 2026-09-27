import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useOnboardingStore } from '../hooks/useStores';
import { ArrowLeft, ArrowRight, TrendingUp, PiggyBank, CircleDollarSign } from 'lucide-react';

export function OnboardingStep4() {
  const [availableCapital, setAvailableCapital] = useState('');
  const [expectedIncome, setExpectedIncome] = useState('');
  const [currentIncome, setCurrentIncome] = useState('');
  const [investmentCapacity, setInvestmentCapacity] = useState('');
  const { updateFormData, setCurrentStep } = useOnboardingStore();
  const navigate = useNavigate();

  const handleNext = () => {
    updateFormData({
      availableCapital: Number(availableCapital) || 0,
      expectedIncome: Number(expectedIncome) || 0,
      currentIncome: Number(currentIncome) || 0,
      investmentCapacity: Number(investmentCapacity) || 0,
    });
    setCurrentStep(5);
    navigate('/onboarding/step-5');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/onboarding/step-3')}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors touch-target"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-primary-600">Step 4 of 5</span>
            <span className="text-sm text-gray-400">Financial Info</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Financial Information</h1>
            <p className="text-gray-500 mt-1">Help us understand your financial situation.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <Input
              label="Available Capital"
              type="number"
              placeholder="Amount in ₹"
              value={availableCapital}
              onChange={(e) => setAvailableCapital(e.target.value)}
              leftIcon={<CircleDollarSign className="w-5 h-5" />}
              hint="Money you have available to invest"
            />

            <Input
              label="Expected Monthly Income"
              type="number"
              placeholder="Amount in ₹"
              value={expectedIncome}
              onChange={(e) => setExpectedIncome(e.target.value)}
              leftIcon={<TrendingUp className="w-5 h-5" />}
              hint="What monthly income are you aiming for?"
            />

            <Input
              label="Current Monthly Income"
              type="number"
              placeholder="Amount in ₹"
              value={currentIncome}
              onChange={(e) => setCurrentIncome(e.target.value)}
              leftIcon={<CircleDollarSign className="w-5 h-5" />}
              hint="Your current monthly income (if any)"
            />

            <Input
              label="Investment Capacity"
              type="number"
              placeholder="Amount in ₹"
              value={investmentCapacity}
              onChange={(e) => setInvestmentCapacity(e.target.value)}
              leftIcon={<PiggyBank className="w-5 h-5" />}
              hint="Maximum you can invest without risk"
            />
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={() => navigate('/onboarding/step-3')}
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleNext}
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