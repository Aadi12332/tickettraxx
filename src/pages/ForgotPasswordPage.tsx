import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ChevronLeft, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { ForgotPasswordFormData } from '../types';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});

export const ForgotPasswordPage = () => {
  const [apiError, setApiError] = useState('');
  const { setResetPasswordEmail } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setApiError('');
    try {
      await new Promise(r => setTimeout(r, 1000));
      setResetPasswordEmail(data.email);
      navigate('/verify-otp');
    } catch {
      setApiError('Failed to send reset email. Please try again.');
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8">
        <Link to="/login" className="inline-flex items-center gap-2 text-base text-[#fff] transition-colors mb-6">
          <ChevronLeft size={16} />
          Back
        </Link>

        <div className="mb-2">
            <h1 className="text-[30px] font-semibold text-white">Forgot Password?</h1>
        <p className="text-[#A2A1A8] mt-1 text-base">No worries! Enter your email and we'll send you a reset OTP.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <div className="relative">
            <label className="input-label">Email Address</label>
            <input
              {...register('email')}
              type="email"
              className="input-dark"
              placeholder=" "
              autoComplete="email"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        {apiError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
            {apiError}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center justify-center gap-2">
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Send OTP'
          )}
        </button>
      </form>
    </AuthLayout>
  );
};
