import * as yup from 'yup'

/**
 * Schemas de validação dos formulários.
 *
 * Espelham o Zod do backend (`interfaces/schemas/`) de propósito: validar no
 * cliente evita uma ida ao servidor para descobrir que faltou um campo, mas
 * não substitui a validação de lá — o servidor continua sendo a autoridade, e
 * o formulário sabe reagir ao 400 que ele devolver.
 */

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Informe o e-mail')
    // Mesma checagem do `z.string().email()` do backend.
    .email('E-mail inválido'),

  password: yup.string().required('Informe a senha'),
})

export type LoginFormValues = yup.InferType<typeof loginSchema>

/**
 * Espelha o `CreateProductSchema` do backend.
 *
 * Os campos numéricos são registrados com `valueAsNumber` no formulário, e um
 * campo vazio vira `NaN` — não `undefined`. Por isso o `typeError`: sem ele, a
 * mensagem exibida seria a do Yup em inglês, falando de tipo, quando o que
 * aconteceu foi simplesmente não preencher.
 */
export const productSchema = yup.object({
  name: yup.string().trim().required('Informe o nome do produto'),

  sku: yup.string().trim().required('Informe o SKU'),

  category: yup.string().trim().required('Informe a categoria'),

  purchasePrice: yup
    .number()
    .typeError('Informe o preço de compra')
    .min(0, 'O preço não pode ser negativo')
    .required('Informe o preço de compra'),

  salePrice: yup
    .number()
    .typeError('Informe o preço de venda')
    .min(0, 'O preço não pode ser negativo')
    .required('Informe o preço de venda'),

  active: yup.boolean().required(),
})

export type ProductFormValues = yup.InferType<typeof productSchema>
