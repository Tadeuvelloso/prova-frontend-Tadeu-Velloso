import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '../../common/Button'
import { Checkbox } from '../../common/Checkbox'
import { Input } from '../../common/Input'
import type { AppError } from '../../../utils/errorHandler'
import { applyServerFieldErrors } from '../../../utils/formErrors'
import { notify } from '../../../utils/notify'
import { productSchema, type ProductFormValues } from '../../../utils/validators'

const FORM_FIELDS = ['name', 'sku', 'category', 'purchasePrice', 'salePrice', 'active']

export type ProductFormMode = 'create' | 'edit'

interface ProductFormProps {
  mode: ProductFormMode
  defaultValues: ProductFormValues
  isSubmitting: boolean
  onSubmit: (values: ProductFormValues) => Promise<void>
  onCancel: () => void
}

export function ProductForm({
  mode,
  defaultValues,
  isSubmitting,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: yupResolver(productSchema),
    defaultValues,
    mode: 'onBlur',
  })

  const isEditing = mode === 'edit'

  async function submit(values: ProductFormValues) {
    try {
      await onSubmit(values)
    } catch (error) {
      const appError = error as AppError

      if (!applyProductServerError(appError, setError)) {
        notify.error(appError.message)
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      noValidate
      className="space-y-6 rounded-lg border border-border-subtle bg-surface p-6 shadow-card"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            label="Nome"
            autoComplete="off"
            placeholder="Coca-Cola 2L"
            error={errors.name?.message}
            {...register('name')}
          />
        </div>

        <Input
          label="SKU"
          autoComplete="off"
          placeholder="COCA-2L"
          // `readOnly` e não `disabled`: campo desabilitado sai do estado do
          // formulário e da navegação por teclado.
          readOnly={isEditing}
          hint={
            isEditing
              ? 'O SKU não pode ser alterado depois do cadastro.'
              : 'Código único do produto.'
          }
          error={errors.sku?.message}
          className={isEditing ? 'cursor-not-allowed text-content-muted' : ''}
          {...register('sku')}
        />

        <Input
          label="Categoria"
          autoComplete="off"
          placeholder="Refrigerantes"
          error={errors.category?.message}
          {...register('category')}
        />

        <Input
          label="Preço de compra"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="0,00"
          error={errors.purchasePrice?.message}
          {...register('purchasePrice', { valueAsNumber: true })}
        />

        <Input
          label="Preço de venda"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="0,00"
          error={errors.salePrice?.message}
          {...register('salePrice', { valueAsNumber: true })}
        />
      </div>

      <Checkbox
        label="Produto ativo"
        hint="Produtos inativos continuam cadastrados, mas ficam fora da listagem padrão."
        {...register('active')}
      />

      <div className="flex flex-col-reverse gap-3 border-t border-border-subtle pt-5 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>

        <Button type="submit" isLoading={isSubmitting}>
          {isEditing ? 'Salvar alterações' : 'Cadastrar produto'}
        </Button>
      </div>
    </form>
  )
}

function applyProductServerError(
  error: AppError,
  setError: ReturnType<typeof useForm<ProductFormValues>>['setError'],
): boolean {
  // 409 é conflito de unicidade e o formulário não envia código de barras,
  // então o único campo único em jogo é o SKU.
  if (error.status === 409) {
    setError('sku', { type: 'server', message: error.message })
    return true
  }

  return applyServerFieldErrors(error, setError, FORM_FIELDS)
}
