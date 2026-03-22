import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

export function useUserProgress(userId: string) {
  return useQuery({
    queryKey: ['progress', userId],
    queryFn: async () => {
      const response = await api.get(`/api/users/${userId}/progress`)
      return response.data
    }
  })
}
