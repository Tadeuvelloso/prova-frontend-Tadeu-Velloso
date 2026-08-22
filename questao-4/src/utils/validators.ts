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
