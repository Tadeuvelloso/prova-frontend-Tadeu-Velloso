import { Button } from '../common/Button'
import { ThemeToggle } from '../common/ThemeToggle'
import { endSession } from '../../services/session'
import { useAuthStore } from '../../store/authStore'
import { ROLE_LABEL } from '../../utils/permissions'

export function Header() {
  const user = useAuthStore((state) => state.user)

  return (
    <header className="border-b border-border-subtle bg-surface">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.2em] text-content-muted uppercase">
            Distribuidora
          </p>
          <h1 className="font-display text-lg font-semibold tracking-tight text-content">
            Gestão de produtos
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {user && (
            // Somem no mobile: em tela estreita o nome empurraria os controles
            // para uma segunda linha, e quem está logado já sabe quem é.
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-content">{user.fullName}</p>
              <p className="text-xs text-content-muted">{ROLE_LABEL[user.role]}</p>
            </div>
          )}

          <ThemeToggle />

          {/*
            Chama o mesmo `endSession` do interceptor: sair pelo botão e ser
            desconectado por token vencido precisam deixar a aplicação no
            mesmo estado, cache do React Query incluído.
          */}
          <Button variant="secondary" onClick={() => endSession()}>
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
}
