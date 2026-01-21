import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { GlassCard, GlassButton, GlassInput } from '@shared/components';
import { useAuthStore } from '@shared/store';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
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
    console.log('Login attempt with:', data.email);
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      console.log('Login successful, navigating to home...');
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      setError('root', {
        message: error.response?.data?.message || 'Đăng nhập thất bại',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <GlassCard className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Đăng nhập</h1>
          <p className="text-text-secondary">Chào mừng bạn quay trở lại</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <GlassInput
            label="Email"
            type="email"
            placeholder="email@cuaban.com"
            fullWidth
            error={errors.email?.message}
            {...register('email')}
          />

          <GlassInput
            label="Mật khẩu"
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
            Đăng nhập
          </GlassButton>
        </form>

        <div className="mt-6 text-center">
          <p className="text-text-secondary text-sm">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-primary-500 hover:text-primary-600">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
