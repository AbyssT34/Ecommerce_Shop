import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GlassCard, GlassButton, GlassInput } from '@shared/components';
import { categoriesApi } from '@shared/api';
import type { Category } from '@shared/types';

const categorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục là bắt buộc'),
  slug: z.string().optional(),
  description: z.string().optional(),
});

type CategoryForm = z.infer<typeof categorySchema>;

export function AdminCategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
  });

  const createMutation = useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryForm }) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: categoriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
    },
  });

  const openCreateModal = () => {
    setEditingCategory(null);
    reset({ name: '', slug: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    reset({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    reset();
  };

  const onSubmit = (data: CategoryForm) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Quản lý Danh mục</h1>
          <p className="text-text-secondary">Quản lý danh mục sản phẩm</p>
        </div>
        <GlassButton variant="primary" onClick={openCreateModal}>
          + Thêm Danh mục
        </GlassButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-1">Tổng số Danh mục</p>
              <p className="text-3xl font-bold text-accent-teal">{categories.length}</p>
            </div>
            <div className="text-4xl">📁</div>
          </div>
        </GlassCard>
      </div>

      {/* Categories Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent-teal border-t-transparent"></div>
        </div>
      ) : (
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-text-primary font-semibold">ID</th>
                  <th className="px-6 py-4 text-left text-text-primary font-semibold">Tên danh mục</th>
                  <th className="px-6 py-4 text-left text-text-primary font-semibold">Slug</th>
                  <th className="px-6 py-4 text-left text-text-primary font-semibold">Mô tả</th>
                  <th className="px-6 py-4 text-right text-text-primary font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category: Category) => (
                  <tr key={category.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-6 py-4 text-text-secondary">#{category.id}</td>
                    <td className="px-6 py-4 text-text-primary font-medium">{category.name}</td>
                    <td className="px-6 py-4 text-text-secondary">{category.slug}</td>
                    <td className="px-6 py-4 text-text-secondary">{category.description || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="px-3 py-1 glass rounded text-info hover:bg-info/10 text-sm"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="px-3 py-1 glass rounded text-error hover:bg-error/10 text-sm"
                          disabled={deleteMutation.isPending}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <GlassCard
            className="w-full max-w-md p-8"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold gradient-text mb-6">
              {editingCategory ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <GlassInput
                label="Tên danh mục"
                fullWidth
                error={errors.name?.message}
                {...register('name')}
              />

              <GlassInput
                label="Slug (Tùy chọn)"
                fullWidth
                error={errors.slug?.message}
                {...register('slug')}
              />

              <GlassInput
                label="Mô tả (Tùy chọn)"
                fullWidth
                error={errors.description?.message}
                {...register('description')}
              />

              <div className="flex gap-4 pt-4">
                <GlassButton
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={createMutation.isPending || updateMutation.isPending}
                >
                  {editingCategory ? 'Cập nhật' : 'Tạo mới'}
                </GlassButton>
                <GlassButton type="button" variant="secondary" fullWidth onClick={closeModal}>
                  Hủy bỏ
                </GlassButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
