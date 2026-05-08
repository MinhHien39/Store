// src/core/localized/LocaleHelper.ts

import { Localized } from './Localized'
import { LocaleKeys } from './LocaleKeys'

type BuildHelper<T> = {
  [K in keyof T]: T[K] extends string
    ? (params?: Record<string, string | number>) => string
    : BuildHelper<T[K]>
}

function buildHelper<T extends Record<string, any>>(keys: T): BuildHelper<T> {
  const result: any = {}

  for (const k in keys) {
    const v = keys[k]
    result[k] =
      typeof v === 'string'
        ? (p?: Record<string, any>) => Localized.t(v, p)
        : buildHelper(v)
  }

  return result
}

export const t = buildHelper(LocaleKeys)
