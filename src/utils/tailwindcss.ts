import { clsx, ClassValue } from 'clsx'
import { overrideTailwindClasses } from 'tailwind-override'

// ========================================
// tailwindcssのclassを上書き
// ========================================

export const classoverride = (...classNames: ClassValue[]) => {
  return overrideTailwindClasses(clsx(...classNames.reverse()), { jit: true })
}
