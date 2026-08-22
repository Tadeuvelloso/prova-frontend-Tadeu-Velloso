import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { ThemeToggle } from '../components/common/ThemeToggle'
import { useLogin } from '../hooks/useLogin'
import { loginSchema, type LoginFormValues } from '../utils/validators'

/**
 * Depois disto, a demora deixa de parecer travamento e vira espera com
 * explicação. O valor sai do comportamento do Render: quente, a API responde
 * em menos de um segundo; hibernada, pode levar quase um minuto.
 */
const COLD_START_HINT_DELAY = 5000

export function LoginPage() {
  const { mutate, isPending, error } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    // Valida ao sair do campo, não a cada tecla: acusar "e-mail inválido" no
    // terceiro caractere digitado é ruído, não ajuda.
    mode: 'onBlur',
  })

  const isWakingServer = useSlowRequestHint(isPending)

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex justify-end p-4">
        <ThemeToggle />
      </div>

      <main className="flex flex-1 items-start justify-center px-4 pb-16">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <p className="font-mono text-xs tracking-[0.2em] text-content-muted uppercase">
              Distribuidora
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-content">
              Gestão de produtos
            </h1>
            <p className="mt-2 text-sm text-content-muted">
              Entre para consultar e gerenciar o catálogo.
            </p>
          </div>

          <form
            onSubmit={handleSubmit((values) => mutate(values))}
            // Desliga a validação nativa do navegador: as mensagens dela não
            // seguem o idioma da aplicação nem o estilo dos campos.
            noValidate
            className="space-y-4 rounded-lg border border-border-subtle bg-surface p-6 shadow-card"
          >
            <Input
              label="E-mail"
              type="email"
              autoComplete="email"
              placeholder="admin@bebidaspro.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Senha"
              type="password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />

            {/* O erro do servidor fica junto do formulário, e não num toast no
                canto: é aqui que o usuário está olhando quando ele acontece. */}
            {error && (
              <p
                role="alert"
                className="rounded-md bg-danger-soft px-3 py-2 text-sm text-danger"
              >
                {error.message}
              </p>
            )}

            <Button type="submit" isLoading={isPending} className="w-full">
              {isPending ? 'Entrando…' : 'Entrar'}
            </Button>

            {isWakingServer && (
              <p aria-live="polite" className="text-center text-xs text-content-muted">
                O servidor gratuito hiberna quando fica sem uso. A primeira entrada
                pode levar até um minuto.
              </p>
            )}
          </form>

          {/* Ambiente de avaliação: as credenciais do seed são públicas e
              estão no README do backend. Num sistema real isto não existiria. */}
          <p className="mt-4 text-center text-xs text-content-muted">
            Acesso de demonstração:{' '}
            <span className="font-mono text-content">admin@bebidaspro.com</span> ·{' '}
            <span className="font-mono text-content">admin123</span>
          </p>
        </div>
      </main>
    </div>
  )
}

/** Vira `true` quando a requisição passa do tempo em que a espera é normal. */
function useSlowRequestHint(isPending: boolean): boolean {
  const [isSlow, setIsSlow] = useState(false)

  useEffect(() => {
    if (!isPending) return

    const timer = setTimeout(() => setIsSlow(true), COLD_START_HINT_DELAY)

    // O reset vive na limpeza, e não no corpo do efeito: quando a requisição
    // termina, o efeito é desfeito e o aviso volta ao estado inicial. Assim
    // uma segunda tentativa não começa já mostrando a dica, e nenhum
    // `setState` roda de forma síncrona durante o efeito.
    return () => {
      clearTimeout(timer)
      setIsSlow(false)
    }
  }, [isPending])

  return isSlow
}
