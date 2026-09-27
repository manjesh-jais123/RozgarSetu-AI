import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useOnboardingStore } from '../hooks/useStores';
import { ArrowLeft, ArrowRight, Briefcase } from 'lucide-react';



const EDUCATION_LEVELS = [
  'No formal education',
  'Primary (1-5)',
  'Middle (6-8)',
  'Secondary (9-10)',
  'Higher Secondary (11-12)',
  'Graduate',
  'Post Graduate',
  'Diploma',
];

export function OnboardingStep2() {
  const [existingSkills, setExistingSkills] = useState('');
  const [workExperience, setWorkExperience] = useState('');
  const [education, setEducation] = useState('');
  const [interests, setInterests] = useState('');
  const { updateFormData, setCurrentStep } = useOnboardingStore();
  const navigate = useNavigate();

  const handleNext = () => {
    updateFormData({
      existingSkills,
      workExperience,
      education,
      interests,
    });
    setCurrentStep(3);
    navigate('/onboarding/step-3');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/onboarding/step-1')}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors touch-target"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-primary-600">Step 2 of 5</span>
            <span className="text-sm text-gray-400">Skills & Experience</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Skills & Experience</h1>
            <p className="text-gray-500 mt-1">Tell us about your skills and work experience.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Existing Skills
              </label>
              <textarea
                value={existingSkills}
                onChange={(e) => setExistingSkills(e.target.value)}
                placeholder="e.g., Tailoring, Embroidery, Cooking, Sales, Computer..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y"
                aria-label="Existing skills"
              />
              <p className="mt-1.5 text-xs text-gray-500">List all skills you have, separated by commas</p>
            </div>

            <Input
              label="Work Experience"
              type="text"
              placeholder="e.g., 3 years in tailoring, 1 year in retail"
              value={workExperience}
              onChange={(e) => setWorkExperience(e.target.value)}
              leftIcon={<Briefcase className="w-5 h-5" />}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Education Level
              </label>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                aria-label="Education level"
              >
                <option value="">Select education level</option>
                {EDUCATION_LEVELS.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Interests
              </label>
              <textarea
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="e.g., Fashion design, Home decor, Online selling, Cooking..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y"
                aria-label="Interests"
              />
              <p className="mt-1.5 text-xs text-gray-500">What interests you? This helps us recommend the right business.</p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={() => navigate('/onboarding/step-1')}
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