/**
 * Shared price utilities for consistent handling of nullable prices
 */

export const priceUtils = {
  /**
   * Convert price to a number, treating null/undefined as 0
   */
  toNumber(price: number | null | undefined): number {
    const num = Number(price);
    return isNaN(num) ? 0 : num;
  },

  /**
   * Format price as USD string with 2 decimal places
   */
  formatPrice(price: number | null | undefined): string {
    const num = this.toNumber(price);
    return `$${num.toFixed(2)}`;
  },

  /**
   * Check if price value is meaningful (not null/zero)
   */
  hasPrice(price: number | null | undefined): boolean {
    return this.toNumber(price) > 0;
  },

  /**
   * Safe summation of prices
   */
  sum(prices: (number | null | undefined)[]): number {
    return prices.reduce((sum: number, price) => sum + this.toNumber(price), 0);
  },

  /**
   * Calculate average of prices (excluding zero values if wanted)
   */
  average(prices: (number | null | undefined)[], excludeZero: boolean = false): number {
    if (prices.length === 0) return 0;
    const filtered = excludeZero ? prices.filter((p) => this.toNumber(p) > 0) : prices;
    if (filtered.length === 0) return 0;
    const total = this.sum(filtered);
    return total / filtered.length;
  },
};
