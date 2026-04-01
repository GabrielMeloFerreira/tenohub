export function getButtonClass(isActive: boolean): string {
  const base = 'text-white cursor-pointer p-1 rounded transition-colors'
  
  const active = 'bg-blue-400'
  
  const inactive = 'hover:text-blue-400'

  return `${base} ${isActive ? active : inactive}`
}

export function getStatelessButtonClass(): string {
  return 'text-white cursor-pointer p-1 rounded transition-colors text-text-muted hover:text-blue-400 hover:bg-bg-elevated'
}