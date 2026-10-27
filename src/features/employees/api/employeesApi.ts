import { httpClient } from '@/shared/api/httpClient'
import type { ApiResponse } from '@/shared/api/types'
import type { EmployeeDetail, ModifyEmployeeRequest, RegisterEmployeeRequest, SavedEmployee } from '../model/types'

const BASE_PATH = '/employees'

export const employeesApi = {
  async list(companyId?: string, signal?: AbortSignal): Promise<EmployeeDetail[]> {
    const response = await httpClient.get<EmployeeDetail>(BASE_PATH, { query: { companyId }, signal })
    return response.datos
  },

  register(body: RegisterEmployeeRequest): Promise<ApiResponse<SavedEmployee>> {
    return httpClient.post<SavedEmployee>(BASE_PATH, body)
  },

  modify(id: string, body: ModifyEmployeeRequest): Promise<ApiResponse<SavedEmployee>> {
    return httpClient.patch<SavedEmployee>(`${BASE_PATH}/${encodeURIComponent(id)}`, body)
  },

  remove(id: string): Promise<ApiResponse<never>> {
    return httpClient.delete<never>(`${BASE_PATH}/${encodeURIComponent(id)}`)
  },
}
