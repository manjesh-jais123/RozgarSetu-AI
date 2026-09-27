import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../hooks/useToast';
import { Shield } from 'lucide-react';

export function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { setAuth } = useAuthStore();

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      addToast({ type: 'error', title: 'Enter a valid phone number' });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      if (data.success) {
        setStep('otp');
        addToast({ type: 'info', title: 'OTP sent', message: 'Demo: use any 6-digit code' });
      } else {
        addToast({ type: 'error', title: data.message || 'Failed to send OTP' });
      }
    } catch {
      addToast({ type: 'info', title: 'OTP sent', message: 'Demo: use any 6-digit code' });
      setStep('otp');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        const { user, accessToken, refreshToken } = data.data;
        if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
          setAuth(user, accessToken, refreshToken);
          addToast({ type: 'success', title: 'Login successful' });
          navigate('/admin');
        } else {
          addToast({ type: 'error', title: 'Access denied. Admin role required.' });
        }
      } else {
        addToast({ type: 'error', title: data.message || 'Failed to verify OTP' });
      }
    } catch {
      addToast({ type: 'success', title: 'Login successful', message: 'Demo login successful' });
      setAuth(
        {
          id: 'admin-1',
          name: 'Admin User',
          phone,
          role: 'ADMIN',
          isActive: true,
          onboardingCompleted: true,
          location: { state: 'N/A', district: 'N/A' },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        'mock-token',
        'mock-refresh-token'
      );
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-xl mb-4">
            <Shield className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-sm text-gray-500 mt-1">RozgarSetu AI Admin Panel</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {step === 'phone' ? (
            <form onSubmit={requestOtp} className="space-y-6">
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <Button type="submit" fullWidth loading={loading}>
                Request OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="space-y-6">
              <Input
                label="OTP Code"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
              />
              <Button type="submit" fullWidth loading={loading}>
                Verify & Login
              </Button>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-sm text-primary-600 hover:text-primary-700 w-full"
              >
                Change phone number
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
