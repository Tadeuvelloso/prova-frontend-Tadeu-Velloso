import { Button } from './Button'

interface ErrorStateProps {
  message: string
  onRetry: () => void
  isRetrying?: boolean
}

export function ErrorState({ message, onRetry, isRetrying = false }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-border-subtle bg-surface px-6 py-12 text-center shadow-card"
    >
      <p className="font-display text-base font-semibold text-content">
        Não foi possível carregar
      </p>

      <p className="mx-auto mt-1 max-w-sm text-sm text-content-muted">{message}</p>

      <Button
        variant="secondary"
        onClick={onRetry}
        isLoading={isRetrying}
        className="mt-5"
      >
        Tentar novamente
      </Button>
    </div>
  )
}
