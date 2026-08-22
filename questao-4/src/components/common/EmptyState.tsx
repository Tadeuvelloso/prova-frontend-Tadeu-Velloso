import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-border-strong bg-surface px-6 py-12 text-center">
      <p className="font-display text-base font-semibold text-content">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-content-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
