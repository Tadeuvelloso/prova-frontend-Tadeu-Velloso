import { enqueueSnackbar } from 'notistack'

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
