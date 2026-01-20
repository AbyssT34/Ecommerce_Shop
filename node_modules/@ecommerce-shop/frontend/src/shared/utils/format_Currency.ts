/**
 * Format currency to Vietnamese Dong
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

/**
 * Format currency without symbol (compact)
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount);
}
