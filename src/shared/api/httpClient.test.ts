import { describe, expect, it, vi } from 'vitest'
import { jsonResponse } from '@/test/utils'
import { ApiError } from './ApiError'
import { httpClient } from './httpClient'

describe('httpClient', () => {
  it('antepone la URL base y devuelve el ApiResponse en respuestas 2xx', async () => {
    const body = { datos: [{ id: '1', name: 'Cédula' }], mensajes: [] }
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse(body))

    const result = await httpClient.get('/document-types')

    expect(result).toEqual(body)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/document-types',
      expect.objectContaining({ method: 'GET', headers: undefined }),
    )
  })

  it('envía Content-Type JSON cuando hay cuerpo', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(jsonResponse({ datos: [], mensajes: ['ok'] }, 201))

    await httpClient.post('/employees', { name: 'Ana' })

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/employees',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Ana' }),
      }),
    )
  })

  it('agrega los query params definidos', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ datos: [], mensajes: [] }))

    await httpClient.get('/employees', { query: { companyId: 'abc', other: undefined } })

    expect(fetchMock.mock.calls[0]?.[0]).toBe('http://localhost:8080/api/v1/employees?companyId=abc')
  })

  it('lanza ApiError con status y mensajes[0] en un error 400', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      jsonResponse({ datos: [], mensajes: ['Ya existe un empleado con ese documento'] }, 400),
    )

    const error = await httpClient.post('/employees', {}).catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 400, message: 'Ya existe un empleado con ese documento' })
  })

  it('usa un mensaje genérico si el cuerpo del error no se puede parsear', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('<html>Error</html>', { status: 500 }))

    const error = await httpClient.get('/employees').catch((e: unknown) => e)

    expect(error).toMatchObject({ status: 500, message: 'Se ha presentado un error inesperado' })
  })

  it('lanza ApiError de conexión si hay un error de red', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'))

    const error = await httpClient.get('/employees').catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 0, message: 'No se pudo conectar con el servidor' })
  })
})
