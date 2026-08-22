import { Button } from './Button'

interface ErrorStateProps {
  message: string
  onRetry: () => void
  isRetrying?: boolean
}

export function ErrorState({ message, onRetry, isRetrying = false }: ErrorStateProps) {
  return (
    <div
      // `alert` porque a falha interrompe o que a pessoa veio fazer.
      role="alert"
      className="rounded-lg border border-border-subtle bg-surface px-6 py-12 text-center shadow-card"
    >
      <p className="font-display text-base font-semibold text-content">
        Não foi possível carregar
      </p>

      {/* A mensagem vem do `AppError`, já traduzida pelo errorHandler. */}
      <p className="mx-auto mt-1 max-w-sm text-sm text-content-muted">{message}</p>

      {/*
        Refazer a busca, e não recarregar a página: um `location.reload()`
        descartaria filtros, rolagem e o resto do estado por um erro que pode
        ter sido uma oscilação de rede.
      */}
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
