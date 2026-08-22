import * as yup from 'yup'

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Informe o e-mail')
    .email('E-mail inválido'),

  password: yup.string().required('Informe a senha'),
})

export type LoginFormValues = yup.InferType<typeof loginSchema>

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
