import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { GlassCard, GlassButton, GlassInput } from '@shared/components';
import { useAuthStore } from '@shared/store';

const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  fullName: z.string().min(2, 'Vui lòng nhập họ tên đầy đủ'),
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
          <h1 className="text-3xl font-bold gradient-text mb-2">Đăng ký tài khoản</h1>
          <p className="text-text-secondary">Tham gia cùng cộng đồng yêu bếp</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <GlassInput
            label="Họ và tên"
            type="text"
            placeholder="Nguyễn Văn A"
            fullWidth
            error={errors.fullName?.message}
            {...register('fullName')}
          />

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

          <GlassInput
            label="Số điện thoại (Tùy chọn)"
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
            Đăng ký
          </GlassButton>
        </form>

        <div className="mt-6 text-center">
          <p className="text-text-secondary text-sm">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-600">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
