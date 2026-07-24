import { cn } from '@/lib/utils'

const base =
  'cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40'

/** Botão da toolbar que reflete estado ativo do editor (negrito, alinhamento…). */
export function getButtonClass(isActive: boolean): string {
  return cn(base, isActive && 'bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary')
}

/** Botão da toolbar sem estado — desfazer, refazer. */
export function getStatelessButtonClass(): string {
  return base
}
