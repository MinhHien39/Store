// src/core/localized/Localized.ts

function getByPath(obj: any, path: string): string | undefined {
  return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj)
}

class LocalizedInternal {
  private locale: any = {}
  private fallback: any = {}

  init(locale: any, fallback?: any) {
    this.locale = locale
    this.fallback = fallback ?? {}
  }

  t(key: string, params?: Record<string, string | number>): string {
    let text =
      getByPath(this.locale, key) ??
      getByPath(this.fallback, key) ??
      key

    if (params) {
      for (const k in params) {
        text = text.replace(`{{${k}}}`, String(params[k]))
      }
    }

    return text
  }
}


export const Localized = new LocalizedInternal()
