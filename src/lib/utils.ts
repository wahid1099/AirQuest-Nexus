import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active': return 'text-cyan-400'
    case 'completed': return 'text-green-400'
    case 'locked': return 'text-gray-500'
    default: return 'text-gray-400'
  }
}