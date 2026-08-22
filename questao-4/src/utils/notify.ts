import { enqueueSnackbar } from 'notistack'

/**
 * Fachada sobre o notistack para emitir feedback ao usuário.
 *
 * Existe por dois motivos concretos:
 *
 * 1. **Tempo em tela por tipo.** O `autoHideDuration` do provider é global.
 *    Erro precisa ficar mais tempo — a mensagem é maior e o usuário tem que
 *    decidir o que fazer com ela — enquanto sucesso só confirma o que ele
 *    acabou de ver acontecer. Concentrar aqui evita repetir a opção em cada
 *    chamada.
 * 2. **Um ponto único de troca.** Se a biblioteca mudar, muda este arquivo,
 *    não as dezenas de lugares que emitem feedback.
 *
 * O `enqueueSnackbar` do notistack v3 é uma função autônoma, não um hook, e
 * por isso funciona também no interceptor do Axios e nos callbacks de mutação,
 * que rodam fora de componente.
 */

const SUCCESS_DURATION = 4000
const ERROR_DURATION = 6000

export const notify = {
  success: (message: string) =>
    enqueueSnackbar(message, { variant: 'success', autoHideDuration: SUCCESS_DURATION }),

  error: (message: string) =>
    enqueueSnackbar(message, { variant: 'error', autoHideDuration: ERROR_DURATION }),

  info: (message: string) =>
    enqueueSnackbar(message, { variant: 'info', autoHideDuration: SUCCESS_DURATION }),
}
