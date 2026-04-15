/**
 * Shared input validation utilities for API routes
 */

export const ValidationRules = {
  PRICE: { min: 0, max: 999999 },
  SORT_FIELDS: ['cardName', 'currentPrice', 'acquiredDate', 'createdAt', 'pokemon', 'setName'],
  ORDERS: ['asc', 'desc'],
  PAGINATION: { minTake: 1, maxTake: 1000, defaultTake: 100 },
  WISHLIST_PRIORITY: { min: 1, max: 10 },
  CONDITIONS: ['Near Mint', 'Lightly Played', 'Moderately Played', 'Heavily Played', 'Damaged'],
};

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validatePrice(value: any): number | null {
  if (value === null || value === undefined) return null;
  const parsed = parseFloat(value);
  if (isNaN(parsed)) throw new ValidationError('Invalid price: must be a number');
  if (parsed < ValidationRules.PRICE.min || parsed > ValidationRules.PRICE.max) {
    throw new ValidationError(
      `Price must be between $${ValidationRules.PRICE.min} and $${ValidationRules.PRICE.max}`
    );
  }
  return parsed;
}

export function validateSort(value: string): string {
  if (!ValidationRules.SORT_FIELDS.includes(value)) {
    throw new ValidationError(
      `Invalid sort field. Must be one of: ${ValidationRules.SORT_FIELDS.join(', ')}`
    );
  }
  return value;
}

export function validateOrder(value: string): 'asc' | 'desc' {
  if (!ValidationRules.ORDERS.includes(value)) {
    throw new ValidationError('Order must be "asc" or "desc"');
  }
  return value as 'asc' | 'desc';
}

export function validatePagination(skip: number, take: number) {
  if (!Number.isInteger(skip) || skip < 0) throw new ValidationError('Skip must be >= 0');
  if (!Number.isInteger(take) || take < ValidationRules.PAGINATION.minTake)
    throw new ValidationError('Take must be >= 1');
  if (take > ValidationRules.PAGINATION.maxTake)
    throw new ValidationError(`Take must be <= ${ValidationRules.PAGINATION.maxTake}`);
}

export function validateWishlistPriority(value: any): number | null {
  if (value === null || value === undefined) return null;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) throw new ValidationError('Invalid wishlist priority: must be a number');
  if (parsed < ValidationRules.WISHLIST_PRIORITY.min || parsed > ValidationRules.WISHLIST_PRIORITY.max) {
    throw new ValidationError(
      `Wishlist priority must be between ${ValidationRules.WISHLIST_PRIORITY.min} and ${ValidationRules.WISHLIST_PRIORITY.max}`
    );
  }
  return parsed;
}

export function validateCondition(value: any): string | null {
  if (value === null || value === undefined) return null;
  if (!ValidationRules.CONDITIONS.includes(value)) {
    throw new ValidationError(
      `Invalid condition. Must be one of: ${ValidationRules.CONDITIONS.join(', ')}`
    );
  }
  return value;
}

export function validateDate(value: any): Date | null {
  if (value === null || value === undefined) return null;
  const date = new Date(value);
  if (isNaN(date.getTime())) throw new ValidationError('Invalid date format');
  return date;
}
