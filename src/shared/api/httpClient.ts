import { env } from '@/shared/config/env'
import { ApiError, NETWORK_ERROR_MESSAGE, UNEXPECTED_ERROR_MESSAGE } from './ApiError'
import type { ApiResponse } from './types'

const BASE_URL = `${env.apiUrl}/api/v1`

type QueryParams = Record<string, string | undefined>

type RequestOptions = {
  query?: QueryParams
  body?: unknown
  signal?: AbortSignal
}

function buildUrl(path: string, query?: QueryParams): string {
  const url = `${BASE_URL}${path}`
  if (!query) return url
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') params.set(key, value)
  }
  const search = params.toString()
  return search ? `${url}?${search}` : url
}

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as { datos?: unknown; mensajes?: unknown }
  return Array.isArray(candidate.datos) && Array.isArray(candidate.mensajes)
}

async function parseBody(response: Response): Promise<unknown> {
  try {
    return await response.json()
  } catch {
    return undefined
  }
}

async function request<T>(method: string, path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const hasBody = options.body !== undefined
  let response: Response
  try {
    response = await fetch(buildUrl(path, options.query), {
      method,
      headers: hasBody ? { 'Content-Type': 'application/json' } : undefined,
      body: hasBody ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    })
  } catch (error) {
    // Las cancelaciones de TanStack Query no son errores de red.
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(0, NETWORK_ERROR_MESSAGE)
  }

  const payload = await parseBody(response)

  if (!response.ok) {
    const firstMessage = isApiResponse(payload) ? payload.mensajes[0] : undefined
    throw new ApiError(response.status, typeof firstMessage === 'string' ? firstMessage : UNEXPECTED_ERROR_MESSAGE)
  }

  if (!isApiResponse(payload)) {
    throw new ApiError(response.status, UNEXPECTED_ERROR_MESSAGE)
  }
  return payload as ApiResponse<T>
}

export const httpClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'body'>) => request<T>('GET', path, options),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, { body }),
  patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, { body }),
  delete: <T>(path: string) => request<T>('DELETE', path),
}
