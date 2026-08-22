import { forwardRef } from 'react'
import { closeSnackbar, type CustomContentProps } from 'notistack'

export const SnackbarToast = forwardRef<HTMLDivElement, CustomContentProps>(
  function SnackbarToast({ id, message, variant }, ref) {
    const tone = variant === 'error' ? 'error' : variant === 'success' ? 'success' : 'info'

    return (
      <div
        ref={ref}
        role={tone === 'error' ? 'alert' : 'status'}
        className="pointer-events-auto flex w-full items-start gap-3 rounded-lg border border-border-subtle bg-surface p-3 shadow-card sm:w-80"
      >
        <span className={`mt-0.5 shrink-0 ${ICON_COLOR[tone]}`}>
          <ToastIcon tone={tone} />
        </span>

        <p className="flex-1 text-sm text-content">{message}</p>

        <button
          type="button"
          onClick={() => closeSnackbar(id)}
          aria-label="Fechar mensagem"
          className="-m-1 shrink-0 rounded p-1 text-content-muted transition-colors hover:text-content"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            className="size-3.5"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    )
  },
)

type Tone = 'success' | 'error' | 'info'

const ICON_COLOR: Record<Tone, string> = {
  success: 'text-success',
  error: 'text-danger',
  info: 'text-brand',
}

function ToastIcon({ tone }: { tone: Tone }) {
  const shared = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    className: 'size-4',
  }

  if (tone === 'success') {
    return (
      <svg {...shared}>
        <path d="M20 6L9 17l-5-5" />
      </svg>
    )
  }

  if (tone === 'error') {
    return (
      <svg {...shared}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6M12 16.5v.5" />
      </svg>
    )
  }

  return (
    <svg {...shared}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5v.5" />
    </svg>
  )
}
