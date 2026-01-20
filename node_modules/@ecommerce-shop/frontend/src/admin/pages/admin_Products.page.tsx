import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GlassCard, GlassButton, GlassInput, Badge } from '@shared/components';
import { productsApi, categoriesApi } from '@shared/api';
import { Product } from '@shared/types';
import { formatCurrency } from '@shared/utils';

const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  stockQuantity: z.number().min(0, 'Stock must be non-negative'),
  categoryId: z.number().min(1, 'Category is required'),
  unit: z.string().optional(),
});

type ProductForm = z.infer<typeof productSchema>;

export function AdminProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: () => productsApi.getAll(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  const createMutation = useMutation({
    mutationFn: (data: ProductForm) => productsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      setIsModalOpen(false);
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductForm }) =>
      productsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      setIsModalOpen(false);
      setEditingProduct(null);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setValue('name', product.name);
      setValue('description', product.description || '');
      setValue('price', product.price);
      setValue('stockQuantity', product.stockQuantity);
      setValue('categoryId', product.category.id);
      setValue('unit', product.unit || '');
    } else {
      setEditingProduct(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    reset();
  };

  const onSubmit = (data: ProductForm) => {
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Products Management</h1>
          <p className="text-text-secondary">Manage your product inventory</p>
        </div>
        <GlassButton variant="primary" size="lg" onClick={() => handleOpenModal()}>
          + Add Product
        </GlassButton>
      </div>

      {/* Products Table */}
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
                  <th className="px-6 py-4 text-left text-text-primary font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-text-primary font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-text-primary font-semibold">Price</th>
                  <th className="px-6 py-4 text-left text-text-primary font-semibold">Stock</th>
                  <th className="px-6 py-4 text-left text-text-primary font-semibold">Status</th>
                  <th className="px-6 py-4 text-right text-text-primary font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: Product) => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-6 py-4 text-text-secondary">#{product.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-text-primary font-medium">{product.name}</p>
                        {product.description && (
                          <p className="text-text-secondary text-sm truncate max-w-xs">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{product.category.name}</td>
                    <td className="px-6 py-4 text-text-primary font-semibold">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {product.stockQuantity} {product.unit}
                    </td>
                    <td className="px-6 py-4">
                      {product.stockQuantity > 0 ? (
                        <Badge variant="success">In Stock</Badge>
                      ) : (
                        <Badge variant="error">Out of Stock</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="px-3 py-1 glass rounded text-text-primary hover:bg-white/10 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-3 py-1 glass rounded text-error hover:bg-error/10 text-sm"
                        >
                          Delete
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

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <GlassCard className="w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold gradient-text mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <GlassInput
                label="Product Name"
                type="text"
                placeholder="Fresh Tomatoes"
                fullWidth
                error={errors.name?.message}
                {...register('name')}
              />

              <div>
                <label className="block text-text-primary font-medium mb-2">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Product description..."
                  rows={3}
                  className="w-full glass px-4 py-3 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-teal resize-none"
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-error text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <GlassInput
                  label="Price (VND)"
                  type="number"
                  step="0.01"
                  placeholder="50000"
                  fullWidth
                  error={errors.price?.message}
                  {...register('price', { valueAsNumber: true })}
                />

                <GlassInput
                  label="Stock Quantity"
                  type="number"
                  placeholder="100"
                  fullWidth
                  error={errors.stockQuantity?.message}
                  {...register('stockQuantity', { valueAsNumber: true })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-primary font-medium mb-2">Category</label>
                  <select
                    className="w-full glass px-4 py-3 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal"
                    {...register('categoryId', { valueAsNumber: true })}
                  >
                    <option value="">Select category</option>
                    {categories.map((category: any) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-error text-sm mt-1">{errors.categoryId.message}</p>
                  )}
                </div>

                <GlassInput
                  label="Unit (Optional)"
                  type="text"
                  placeholder="kg, pcs, etc."
                  fullWidth
                  error={errors.unit?.message}
                  {...register('unit')}
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <GlassButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={createMutation.isPending || updateMutation.isPending}
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </GlassButton>
                <GlassButton
                  type="button"
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={handleCloseModal}
                >
                  Cancel
                </GlassButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
