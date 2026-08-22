interface ErrorStateProps {
  message: string
  onRetry: () => void
  isRetrying?: boolean
}

export function ErrorState({ message, onRetry, isRetrying = false }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-danger/30 bg-danger-soft px-6 py-10 text-center"
    >
      <p className="font-medium text-danger">Não foi possível carregar os produtos</p>
      <p className="mt-1 text-sm text-content-muted">{message}</p>

      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="mt-5 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isRetrying ? 'Tentando…' : 'Tentar novamente'}
      </button>
    </div>
  )
}
