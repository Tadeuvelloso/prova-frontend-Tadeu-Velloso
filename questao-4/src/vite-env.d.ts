/// <reference types="vite/client" />

/**
 * Sem esta declaração, `import.meta.env.VITE_API_URL` é tipado como `any` pela
 * assinatura de índice do `vite/client`, e um erro de digitação no nome da
 * variável passaria batido pelo compilador.
 */
interface ImportMetaEnv {
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
