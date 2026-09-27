import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useRegister } from '../hooks/useQueries';
import { useToast } from '../components/ui/Toast';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function CreateAccount() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('hi');
  const [error, setError] = useState('');
  const registerMutation = useRegister();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (name.trim().length < 2) {
      setError('Please enter your full name');
      return;
    }

    if (phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      await registerMutation.mutateAsync({ name: name.trim(), phone, language });
      addToast({ type: 'success', title: 'Account created', message: 'Welcome to RozgarSetu AI!' });
      navigate('/otp', { state: { phone } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center mx-auto shadow-lg mb-4">
            <span className="text-white text-3xl font-bold">ु</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Start your journey to sustainable income</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={error}
              hint="As it appears on your Aadhaar card"
            />

            <Input
              label="Mobile Number"
              type="tel"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              leftIcon={<span className="text-gray-400">+91</span>}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Preferred Language
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`
                    p-3 rounded-lg border-2 transition-all touch-target
                    ${language === 'hi'
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }
                  `}
                >
                  <span className="text-2xl">🇮🇳</span>
                  <span className="block text-sm font-medium mt-1">हिंदी</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`
                    p-3 rounded-lg border-2 transition-all touch-target
                    ${language === 'en'
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }
                  `}
                >
                  <span className="text-2xl">🇺🇸</span>
                  <span className="block text-sm font-medium mt-1">English</span>
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={registerMutation.isPending}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-primary-600 font-medium hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/welcome')}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Welcome
          </button>
        </div>
      </div>
    </div>
  );
}