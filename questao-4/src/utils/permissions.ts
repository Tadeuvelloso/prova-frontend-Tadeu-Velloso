import type { UserRole } from '../types/auth'

export type ProductAction = 'create' | 'update' | 'delete'

/** Como cada papel aparece na interface. O backend usa os valores crus. */
export const ROLE_LABEL: Record<UserRole, string> = {
  admin: 'Administrador',
  gerente: 'Gerente',
  operador: 'Operador',
  visualizador: 'Visualizador',
}

/**
 * Espelha o `authorize([...])` das rotas de produto do backend
 * (`interfaces/routes/product.routes.ts`):
 *
 *   POST   /products      -> admin, gerente
 *   PUT    /products/:id  -> admin, gerente
 *   DELETE /products/:id  -> admin
 *
 * Duplicar a regra aqui é intencional, mas é duplicação — se o backend mudar
 * quem pode o quê, este arquivo precisa acompanhar.
 */
const ROLES_BY_ACTION: Record<ProductAction, readonly UserRole[]> = {
  create: ['admin', 'gerente'],
  update: ['admin', 'gerente'],
  delete: ['admin'],
}

/**
 * Responde se o papel pode executar a ação.
 *
 * Isto é experiência de uso, não segurança: serve para não oferecer um botão
 * que só devolveria 403. Quem de fato autoriza é o backend, e continuaria
 * negando mesmo que alguém forçasse a interface pelo DevTools.
 */
export function can(role: UserRole | undefined | null, action: ProductAction): boolean {
  if (!role) return false

  return ROLES_BY_ACTION[action].includes(role)
}
