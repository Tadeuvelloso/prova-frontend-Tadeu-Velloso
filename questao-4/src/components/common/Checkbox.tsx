import { forwardRef, useId, type InputHTMLAttributes } from 'react'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, hint, id, ...props },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = `${inputId}-hint`

  return (
    <div className="flex gap-3">
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        aria-describedby={hint ? hintId : undefined}
        className="mt-0.5 size-4 shrink-0 accent-[var(--color-brand)]"
        {...props}
      />

      <div>
        <label htmlFor={inputId} className="block text-sm font-medium text-content">
          {label}
        </label>
        {hint && (
          <p id={hintId} className="text-xs text-content-muted">
            {hint}
          </p>
        )}
      </div>
    </div>
  )
})
