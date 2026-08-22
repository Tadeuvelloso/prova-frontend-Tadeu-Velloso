import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  /** Texto de apoio abaixo do campo. Some quando há erro, para não competir. */
  hint?: ReactNode
}

/**
 * Campo de formulário com rótulo e erro.
 *
 * Usa `forwardRef` porque o `register` do react-hook-form entrega uma ref —
 * é assim que a biblioteca lê o valor sem controlar o input a cada tecla, e
 * também como ela move o foco para o primeiro campo inválido.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id, className = '', ...props },
  ref,
) {
  // `useId` garante rótulo e campo ligados mesmo com dois formulários na
  // mesma tela, sem inventar ids manuais.
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`
  const hintId = `${inputId}-hint`

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-content">
        {label}
      </label>

      <input
        ref={ref}
        id={inputId}
        // Comunica o estado inválido a quem usa leitor de tela, não só pela cor.
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={`w-full rounded-md border bg-surface px-3 py-2 text-sm text-content transition-colors placeholder:text-content-muted focus:border-brand ${
          error ? 'border-danger' : 'border-border-strong'
        } ${className}`}
        {...props}
      />

      {error ? (
        <p id={errorId} className="text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-content-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
})
