import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useOnboardingStore } from '../hooks/useStores';
import { ArrowLeft, ArrowRight, User, MapPin, Calendar } from 'lucide-react';

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export function OnboardingStep1() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    state: '',
    district: '',
    village: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { updateFormData, setCurrentStep } = useOnboardingStore();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age || Number(formData.age) < 18) newErrors.age = 'Must be 18 or older';
    if (!formData.gender) newErrors.gender = 'Please select gender';
    if (!formData.state) newErrors.state = 'Please select state';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      updateFormData(formData);
      setCurrentStep(2);
      navigate('/onboarding/step-2');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/onboarding')}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors touch-target"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-primary-600">Step 1 of 5</span>
            <span className="text-sm text-gray-400">Basic Information</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Basic Information</h1>
            <p className="text-gray-500 mt-1">Tell us about yourself so we can personalize your experience.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              leftIcon={<User className="w-5 h-5" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Age"
                type="number"
                placeholder="Your age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                error={errors.age}
                leftIcon={<Calendar className="w-5 h-5" />}
                hint="Must be 18 years or older"
              />

              <Select
                label="Gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                options={GENDERS}
                placeholder="Select gender"
                error={errors.gender}
              />
            </div>

            <Select
              label="State"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              options={STATES.map(s => ({ value: s, label: s }))}
              placeholder="Select your state"
              error={errors.state}
            />

            <Input
              label="District"
              type="text"
              placeholder="Enter your district"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              error={errors.district}
              leftIcon={<MapPin className="w-5 h-5" />}
            />

            <Input
              label="Village / City"
              type="text"
              placeholder="Enter your village or city"
              value={formData.village}
              onChange={(e) => setFormData({ ...formData, village: e.target.value })}
            />
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={() => navigate('/onboarding')}
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