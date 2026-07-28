import { cn } from '@/lib/utils'

export const authInputClass =
  'rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring'

export type NoticeData = { type: 'success' | 'error'; text: string }

export function Notice({ notice }: { notice: NoticeData | null }) {
  if (!notice) return null

  return (
    <p
      className={cn(
        'rounded-md border px-3 py-2 text-sm',
        notice.type === 'success'
          ? 'border-green-600/40 bg-green-600/10 text-green-500'
          : 'border-destructive/40 bg-destructive/10 text-destructive'
      )}
    >
      {notice.text}
    </p>
  )
}
