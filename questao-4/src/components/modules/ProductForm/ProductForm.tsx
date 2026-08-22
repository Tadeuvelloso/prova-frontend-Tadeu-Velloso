import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '../../common/Button'
import { Checkbox } from '../../common/Checkbox'
import { Input } from '../../common/Input'
import type { AppError } from '../../../utils/errorHandler'
import { applyServerFieldErrors } from '../../../utils/formErrors'
import { notify } from '../../../utils/notify'
import { productSchema, type ProductFormValues } from '../../../utils/validators'

/** Campos que o formulário conhece — usado para filtrar erros vindos da API. */
const FORM_FIELDS = ['name', 'sku', 'category', 'purchasePrice', 'salePrice', 'active']

export type ProductFormMode = 'create' | 'edit'

interface ProductFormProps {
  mode: ProductFormMode
  defaultValues: ProductFormValues
  isSubmitting: boolean
  /** Deve rejeitar com `AppError` para o formulário marcar os campos. */
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
    // Valida ao sair do campo, não a cada tecla: acusar erro no meio da
    // digitação é ruído.
    mode: 'onBlur',
  })

  const isEditing = mode === 'edit'

  /**
   * Toda falha de submissão é tratada AQUI, e não em quem passou o
   * `onSubmit`. É o formulário que tem o `setError` e sabe quais campos
   * existem — um try/catch na página engoliria o erro antes de ele chegar
   * neste ponto, e a recusa do servidor viraria só um toast genérico.
   */
  async function submit(values: ProductFormValues) {
    try {
      await onSubmit(values)
    } catch (error) {
      const appError = error as AppError

      // O que não couber num campo vira aviso geral: falha de rede, 403 ou
      // 5xx não pertencem a nenhum campo, e sem isto a submissão fracassaria
      // em silêncio — o botão sairia do carregando sem explicação.
      if (!applyProductServerError(appError, setError)) {
        notify.error(appError.message)
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      // Desliga a validação nativa: as mensagens do navegador não seguem o
      // idioma da aplicação nem o estilo dos campos.
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
          // `readOnly` em vez de `disabled`: campo desabilitado sai do estado
          // do formulário e some da navegação por teclado. Somente-leitura
          // mantém o valor visível, focável e copiável.
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
          // `valueAsNumber` entrega número ao Yup em vez de string — sem isso
          // a validação de mínimo compararia texto.
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

/**
 * Traz a recusa do servidor para o campo certo. Devolve `false` quando o erro
 * não pertence a nenhum campo.
 *
 * Dois caminhos, porque o backend responde de duas formas diferentes:
 *
 * - **409** é conflito de unicidade. Como o formulário não envia código de
 *   barras, o único campo único em jogo é o SKU — e a mensagem que o backend
 *   manda ("SKU já cadastrado") já é a frase certa para exibir ali.
 * - **400** traz `details` com `path` e `message` por campo, vindos do Zod.
 */
function applyProductServerError(
  error: AppError,
  setError: ReturnType<typeof useForm<ProductFormValues>>['setError'],
): boolean {
  if (error.status === 409) {
    setError('sku', { type: 'server', message: error.message })
    return true
  }

  return applyServerFieldErrors(error, setError, FORM_FIELDS)
}
