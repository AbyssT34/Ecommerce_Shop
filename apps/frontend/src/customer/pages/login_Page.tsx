import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { GlassCard, GlassButton, GlassInput } from '@shared/components';
import { useAuthStore } from '@shared/store';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (error: any) {
      setError('root', {
        message: error.response?.data?.message || 'Login failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <GlassCard className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
          <p className="text-text-secondary">Login to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            Login
          </GlassButton>
        </form>

        <div className="mt-6 text-center">
          <p className="text-text-secondary text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-500 hover:text-primary-600">
              Register here
            </Link>
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
