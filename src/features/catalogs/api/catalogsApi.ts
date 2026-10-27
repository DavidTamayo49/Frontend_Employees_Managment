import { httpClient } from '@/shared/api/httpClient'
import type { Company, DocumentType, Role } from '../model/types'

export async function getDocumentTypes(signal?: AbortSignal): Promise<DocumentType[]> {
  const response = await httpClient.get<DocumentType>('/document-types', { signal })
  return response.datos
}

export async function getRoles(signal?: AbortSignal): Promise<Role[]> {
  const response = await httpClient.get<Role>('/roles', { signal })
  return response.datos
}

export async function getCompanies(signal?: AbortSignal): Promise<Company[]> {
  const response = await httpClient.get<Company>('/companies', { signal })
  return response.datos
}
