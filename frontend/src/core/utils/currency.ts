/**
 * Format a number as Vietnamese Dong (VND).
 * DB stores prices in VND — no conversion needed.
 *
 * @example formatVnd(6900000) → "6.900.000 ₫"
 */
export function formatVnd(amount: number | null | undefined): string {
    if (amount == null) return '';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(amount);
}
