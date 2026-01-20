import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { GlassCard, GlassButton, GlassInput } from '@shared/components';
import { useAuthStore } from '@shared/store';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      navigate('/');
    } catch (error: any) {
      setError('root', {
        message: error.response?.data?.message || 'Registration failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-12">
      <GlassCard className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Create Account</h1>
          <p className="text-text-secondary">Join our cooking community</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <GlassInput
            label="Full Name"
            type="text"
            placeholder="John Doe"
            fullWidth
            error={errors.fullName?.message}
            {...register('fullName')}
          />

          <GlassInput
            label="Email"
            type="email"
            placeholder="your@email.com"
            fullWidth
            error={errors.email?.message}
            {...register('email')}
          />

          <GlassInput
            label="Password"
            type="password"
            placeholder="••••••••"
            fullWidth
            error={errors.password?.message}
            {...register('password')}
          />

          <GlassInput
            label="Phone (Optional)"
            type="tel"
            placeholder="0901234567"
            fullWidth
            error={errors.phone?.message}
            {...register('phone')}
          />

          {errors.root && (
            <div className="p-3 glass-dark rounded-lg border border-error/30">
              <p className="text-error text-sm">{errors.root.message}</p>
            </div>
          )}

          <GlassButton
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
          >
            Register
          </GlassButton>
        </form>

        <div className="mt-6 text-center">
          <p className="text-text-secondary text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-600">
              Login here
            </Link>
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
