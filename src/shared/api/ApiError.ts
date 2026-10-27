export const UNEXPECTED_ERROR_MESSAGE = 'Se ha presentado un error inesperado'
export const NETWORK_ERROR_MESSAGE = 'No se pudo conectar con el servidor'

export class ApiError extends Error {
  /** 0 cuando no hubo respuesta del servidor (error de red). */
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function getErrorMessage(error: unknown): string {
  return isApiError(error) ? error.message : UNEXPECTED_ERROR_MESSAGE
}
