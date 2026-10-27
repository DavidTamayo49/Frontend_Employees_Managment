/** Envoltorio común de todas las respuestas del backend (éxito y error). */
export type ApiResponse<T> = {
  datos: T[]
  mensajes: string[]
}
