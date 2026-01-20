import { format, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Format date to Vietnamese format
 */
export function formatDate(date: string | Date, pattern: string = 'dd/MM/yyyy'): string {
  return format(new Date(date), pattern, { locale: vi });
}

/**
 * Format date with time
 */
export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: vi });
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: vi
  });
}
