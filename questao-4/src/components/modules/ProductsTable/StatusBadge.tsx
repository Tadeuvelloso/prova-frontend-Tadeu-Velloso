interface StatusBadgeProps {
  active: boolean
}

export function StatusBadge({ active }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
        active ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'
      }`}
    >
      {active ? 'Ativo' : 'Inativo'}
    </span>
  )
}
