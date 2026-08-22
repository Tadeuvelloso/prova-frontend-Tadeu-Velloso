import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { getValidationDetails, type AppError } from './errorHandler'

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
