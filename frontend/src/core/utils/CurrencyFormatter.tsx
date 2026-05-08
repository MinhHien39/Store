export class CurrencyFormatter {

  // default 
  static formatNormal(amount: number, locale = 'vi-VN'): string {
    return new Intl.NumberFormat(locale).format(amount);
  }

  // default (vi-VN, VND)
  static format(amount: number, locale = 'vi-VN', currency = 'VND'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  static formatVND(amount: number): string {
    return this.format(amount, 'vi-VN', 'VND');
  }
}