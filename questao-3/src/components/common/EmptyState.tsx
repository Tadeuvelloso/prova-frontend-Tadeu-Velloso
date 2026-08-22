interface EmptyStateProps {
  title: string
  description?: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface px-6 py-14 text-center">
      <p className="font-medium text-content">{title}</p>
      {description && <p className="mt-1 text-sm text-content-muted">{description}</p>}
    </div>
  )
}
