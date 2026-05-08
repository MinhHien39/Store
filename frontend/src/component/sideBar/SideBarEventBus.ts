// SidebarEventBus.ts
export type SidebarEventMap = {
  'sidebar:setIndex': { index: number }
  'sidebar:toggle': { isExpanded: boolean }
}

class SidebarEventBus {
  private target = new EventTarget()

  on<K extends keyof SidebarEventMap>(
    type: K,
    handler: (detail: SidebarEventMap[K]) => void
  ) {
    const listener = (e: Event) =>
      handler((e as CustomEvent).detail)
    this.target.addEventListener(type as string, listener)
    return () => this.target.removeEventListener(type as string, listener)
  }

  emit<K extends keyof SidebarEventMap>(
    type: K,
    detail: SidebarEventMap[K]
  ) {
    this.target.dispatchEvent(
      new CustomEvent(type as string, { detail })
    )
  }
}

export const sidebarBus = new SidebarEventBus()
