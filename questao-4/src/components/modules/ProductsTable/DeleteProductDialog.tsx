import { Button } from '../../common/Button'
import { Modal } from '../../common/Modal'
import type { Product } from '../../../types/product'

interface DeleteProductDialogProps {
  product: Product | null
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteProductDialog({
  product,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteProductDialogProps) {
  return (
    <Modal
      isOpen={product !== null}
      onClose={isDeleting ? () => {} : onCancel}
      title="Excluir produto"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={isDeleting}>
            Cancelar
          </Button>

          <Button variant="danger" onClick={onConfirm} isLoading={isDeleting}>
            {isDeleting ? 'Excluindo…' : 'Excluir'}
          </Button>
        </>
      }
    >
      <p>
        Excluir <strong className="text-content">{product?.name}</strong>
        {product && (
          <>
            {' '}
            (<span className="font-mono text-xs">{product.sku}</span>)
          </>
        )}
        ? Esta ação não pode ser desfeita.
      </p>
    </Modal>
  )
}
