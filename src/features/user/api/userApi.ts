import { http, toData } from '@/core/http'

// 与 axios 对齐：可直接使用 http.get 返回 AxiosResponse
// 也可在此处统一 toData，向上层暴露纯数据 Promise

export interface UserDTO {
  id: number
  name: string
  roles?: string[]
  permissions?: string[]
}

export const userApi = {
  getUser: (id: string | number) => toData(http.get<UserDTO>(`/users/${id}`)),
  listUsers: () => toData(http.get<UserDTO[]>('/users')),
  updateUser: (data: UserDTO) => toData(http.put<UserDTO>(`/users/${data.id}`, data)),
}


