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

/**
 * Format a raw number string with thousand separators for price input display.
 * Strips non-numeric chars, then formats with dots (Vietnamese style).
 * Uses regex to avoid locale inconsistencies across browsers/environments.
 * @example formatPriceInput("6900000") → "6.900.000"
 */
export function formatPriceInput(value: string): string {
    const digits = value.replace(/\D/g, '');
    if (!digits) return '';
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Parse a formatted price string back to a raw numeric string.
 * @example parsePriceInput("6.900.000") → "6900000"
 */
export function parsePriceInput(value: string): string {
    return value.replace(/\D/g, '');
}

/**
 * Resolve an image URL.
 * - Relative paths (e.g. /uploads/...) are returned as-is — Next.js proxies them to the backend.
 * - Absolute https/http URLs are returned as-is.
 * - blob: URLs are treated as invalid (they expire with the browser session) → return ''.
 * - null/undefined/empty → return ''.
 */
export function getImageUrl(url: string | null | undefined): string {
    if (!url) return '';
    // blob: URLs are session-scoped and expire — never store or display them
    if (url.startsWith('blob:')) return '';
    // Absolute https/http URLs (external CDN, seed data, etc.)
    if (url.startsWith('http')) return url;
    // Relative path like /uploads/... — served via Next.js → backend proxy
    return url;
}
