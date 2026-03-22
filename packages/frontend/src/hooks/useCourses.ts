import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

export interface Course {
  id: string
  title: string
  summary: string
  tags: string[]
  instructorId: string
  price: 'free' | 'paid'
  publishState: string
  difficulty?: string
  duration?: string
}

export function useCourses(params?: { query?: string }) {
  return useQuery({
    queryKey: ['courses', params?.query],
    queryFn: async () => {
      const response = await api.get('/api/courses', { params })
      return response.data
    }
  })
}
