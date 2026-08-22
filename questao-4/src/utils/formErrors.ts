import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { getValidationDetails, type AppError } from './errorHandler'

/**
 * Leva os erros de campo do backend para dentro do formulário.
 *
 * Sem isto, uma recusa de validação do servidor viraria um toast genérico
 * ("Validação falhou") e o usuário teria que adivinhar qual campo revisar. Com
 * isto, a mensagem aparece embaixo do campo — o mesmo lugar onde a validação
 * do Yup já escreve.
 *
 * Só aplica em campos que o formulário conhece: um `path` desconhecido viraria
 * um erro invisível, e o formulário ficaria travado sem nada na tela
 * explicando o motivo.
 *
 * Devolve `true` se algo foi aplicado, para o chamador decidir se ainda
 * precisa exibir um aviso geral.
 */
export function applyServerFieldErrors<T extends FieldValues>(
  error: AppError,
  setError: UseFormSetError<T>,
  knownFields: readonly string[],
): boolean {
  const details = getValidationDetails(error)
  if (!details) return false

  let applied = false

  for (const detail of details) {
    if (!knownFields.includes(detail.path)) continue

    setError(detail.path as Path<T>, { type: 'server', message: detail.message })
    applied = true
  }

  return applied
}
