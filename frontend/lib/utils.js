import { clsx } from 'clsx';

/**
 * Merge CSS class names with clsx
 */
export function cn(...inputs) {
  return clsx(inputs);
}

/**
 * Format duration in seconds to "mm:ss" or "xh ym"
 */
export function formatDuration(seconds = 0) {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hours}h ${remMins}m`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Format date string to localized readable format
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      ...options,
    });
  } catch {
    return dateString;
  }
}

/**
 * Format phone numbers to clean display
 */
export function formatPhone(phone = '') {
  if (!phone) return '—';
  return phone;
}
