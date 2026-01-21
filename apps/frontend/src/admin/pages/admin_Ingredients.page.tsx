import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GlassCard, GlassButton, GlassInput } from '@shared/components';
import { ingredientsApi } from '@shared/api';
import type { Ingredient } from '@shared/api/ingredients_Api';

const ingredientSchema = z.object({
  name: z.string().min(1, 'Tên nguyên liệu là bắt buộc'),
  description: z.string().optional(),
});

type IngredientForm = z.infer<typeof ingredientSchema>;

export function AdminIngredientsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: ingredients = [], isLoading } = useQuery({
    queryKey: ['admin', 'ingredients'],
    queryFn: () => ingredientsApi.getAll(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IngredientForm>({
    resolver: zodResolver(ingredientSchema),
  });

  const createMutation = useMutation({
    mutationFn: ingredientsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'ingredients'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: IngredientForm }) =>
      ingredientsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'ingredients'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ingredientsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'ingredients'] });
    },
  });

  const openCreateModal = () => {
    setEditingIngredient(null);
    reset({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    reset({
      name: ingredient.name,
      description: ingredient.description || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIngredient(null);
    reset();
  };

  const onSubmit = (data: IngredientForm) => {
    if (editingIngredient) {
      updateMutation.mutate({ id: editingIngredient.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa nguyên liệu này?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredIngredients = ingredients.filter((ing: Ingredient) =>
    ing.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Quản lý Nguyên liệu</h1>
          <p className="text-text-secondary">Quản lý nguyên liệu công thức</p>
        </div>
        <GlassButton variant="primary" onClick={openCreateModal}>
          + Thêm Nguyên liệu
        </GlassButton>
      </div>

      {/* Stats & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-1">Tổng số Nguyên liệu</p>
              <p className="text-3xl font-bold text-accent-teal">{ingredients.length}</p>
            </div>
            <div className="text-4xl">🥗</div>
          </div>
        </GlassCard>

        <div className="md:col-span-3">
          <GlassInput
            placeholder="Tìm kiếm nguyên liệu..."
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Ingredients Table */}
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
                  <th className="px-6 py-4 text-left text-text-primary font-semibold">Tên nguyên liệu</th>
                  <th className="px-6 py-4 text-left text-text-primary font-semibold">Mô tả</th>
                  <th className="px-6 py-4 text-right text-text-primary font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredIngredients.map((ingredient: Ingredient) => (
                  <tr key={ingredient.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-6 py-4 text-text-secondary">#{ingredient.id}</td>
                    <td className="px-6 py-4 text-text-primary font-medium">{ingredient.name}</td>
                    <td className="px-6 py-4 text-text-secondary">{ingredient.description || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(ingredient)}
                          className="px-3 py-1 glass rounded text-info hover:bg-info/10 text-sm"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(ingredient.id)}
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
              {editingIngredient ? 'Chỉnh sửa Nguyên liệu' : 'Thêm Nguyên liệu'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <GlassInput
                label="Tên nguyên liệu"
                fullWidth
                error={errors.name?.message}
                {...register('name')}
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
                  {editingIngredient ? 'Cập nhật' : 'Tạo mới'}
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
