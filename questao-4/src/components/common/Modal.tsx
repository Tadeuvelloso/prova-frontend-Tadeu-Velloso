import { useEffect, useId, useRef, type ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** Linha de botões do rodapé. */
  footer: ReactNode
}

/**
 * Diálogo modal sobre o elemento `<dialog>` nativo.
 *
 * A escolha não é por economia de linhas, é por comportamento: `showModal()`
 * entrega prisão de foco, fechamento por `Esc`, inércia do conteúdo de trás e
 * renderização na top layer — tudo pelo navegador. Uma implementação própria
 * com `div` teria que reconstruir cada uma dessas coisas, e prisão de foco
 * feita à mão é onde acessibilidade costuma quebrar.
 */
export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    // As guardas evitam chamar `showModal()` num diálogo já aberto, o que
    // lança erro, e `close()` num já fechado, que dispararia `onClose` à toa.
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  return (
    <dialog
      ref={dialogRef}
      // Dispara tanto no `Esc` quanto no `close()` — um caminho só de saída,
      // então o estado de quem abriu nunca fica dessincronizado.
      onClose={onClose}
      aria-labelledby={titleId}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg border border-border-subtle bg-surface p-0 text-content shadow-card backdrop:bg-black/50"
    >
      <div className="space-y-4 p-6">
        <h2 id={titleId} className="font-display text-lg font-semibold text-content">
          {title}
        </h2>

        <div className="text-sm text-content-muted">{children}</div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          {footer}
        </div>
      </div>
    </dialog>
  )
}
