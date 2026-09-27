import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';

import { useAuthStore } from '../hooks/useStores';
import { useVerifyOtp } from '../hooks/useQueries';
import { useToast } from '../components/ui/Toast';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

export function OTPVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || '+91 98765 43210';
  const verifyOtpMutation = useVerifyOtp();
  const { setAuth } = useAuthStore();
  const { addToast } = useToast();

  const inputRefs = Array(6).fill(null);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (canResend) {
      setResendTimer(30);
      setCanResend(false);
      addToast({ type: 'info', title: 'OTP resent', message: 'Check your phone again' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    try {
      const result = await verifyOtpMutation.mutateAsync({ phone, otp: otpString });
      setAuth(result.user, result.accessToken, result.refreshToken);
      addToast({ type: 'success', title: 'Login successful', message: 'Welcome to RozgarSetu AI!' });
      
      if (result.user.onboardingCompleted) {
        navigate('/welcome');
      } else {
        navigate('/onboarding/step-1');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verify Your Phone</h1>
          <p className="text-gray-600 mt-2">We sent a 6-digit code to</p>
          <p className="font-medium text-gray-900">{phone}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Enter OTP
              </label>
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    aria-label={`Digit ${index + 1}`}
                  />
                ))}
              </div>
              {error && (
                <p className="mt-3 text-sm text-red-600 text-center" role="alert">
                  {error}
                </p>
              )}
              <p className="mt-3 text-xs text-gray-400 text-center">
                Use <span className="font-mono font-medium text-gray-600">123456</span> for demo
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={verifyOtpMutation.isPending}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Verify & Continue
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Didn't receive the code?{' '}
              <button
                onClick={handleResend}
                disabled={!canResend}
                className={`
                  font-medium ${canResend ? 'text-primary-600 hover:underline' : 'text-gray-400 cursor-not-allowed'}
                `}
              >
                {canResend ? 'Resend' : `Resend in ${resendTimer}s`}
              </button>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Change phone number
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}