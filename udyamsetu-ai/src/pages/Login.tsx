import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

import { useLogin } from '../hooks/useQueries';
import { useToast } from '../components/ui/Toast';
import { Phone, ArrowRight, ArrowLeft } from 'lucide-react';

export function Login() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      await loginMutation.mutateAsync(phone);
      addToast({ type: 'success', title: 'OTP sent', message: 'Check your phone for the verification code' });
      navigate('/otp', { state: { phone } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center mx-auto shadow-lg mb-4">
            <span className="text-white text-3xl font-bold">ु</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Namaste!</h1>
          <p className="text-gray-600 mt-2">Your journey from skill to income starts here.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Login to your account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Mobile Number"
              type="tel"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              error={error}
              leftIcon={<Phone className="w-5 h-5" />}
              hint="We'll send an OTP to verify"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loginMutation.isPending}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Send OTP
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-primary-600 font-medium hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy.
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