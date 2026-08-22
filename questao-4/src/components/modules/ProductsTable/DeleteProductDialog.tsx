import { Button } from '../../common/Button'
import { Modal } from '../../common/Modal'
import type { Product } from '../../../types/product'

interface DeleteProductDialogProps {
  /** O produto em vias de ser excluído, ou `null` quando não há nenhum. */
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
      // Fechar durante a exclusão deixaria a operação em voo sem nada na tela
      // indicando que ela ainda está acontecendo.
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
        {/*
          Nomear o produto é o que torna a confirmação útil. "Tem certeza?"
          sozinho não deixa a pessoa perceber que clicou na linha errada —
          que é justamente o erro que o diálogo existe para evitar.
        */}
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
