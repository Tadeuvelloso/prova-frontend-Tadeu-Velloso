import type { UserRole } from '../types/auth'

export type ProductAction = 'create' | 'update' | 'delete'

export const ROLE_LABEL: Record<UserRole, string> = {
  admin: 'Administrador',
  gerente: 'Gerente',
  operador: 'Operador',
  visualizador: 'Visualizador',
}

export const PRODUCT_WRITE_ROLES = ['admin', 'gerente'] as const satisfies readonly UserRole[]

export const PRODUCT_DELETE_ROLES = ['admin'] as const satisfies readonly UserRole[]

const ROLES_BY_ACTION: Record<ProductAction, readonly UserRole[]> = {
  create: PRODUCT_WRITE_ROLES,
  update: PRODUCT_WRITE_ROLES,
  delete: PRODUCT_DELETE_ROLES,
}

// Isto é experiência de uso, não segurança: serve para não oferecer um botão
// que só devolveria 403. Quem autoriza de fato é o backend.
export function can(role: UserRole | undefined | null, action: ProductAction): boolean {
  if (!role) return false

  return ROLES_BY_ACTION[action].includes(role)
}
