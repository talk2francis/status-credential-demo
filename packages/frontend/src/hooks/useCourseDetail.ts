import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

export function useCourseDetail(courseId?: string) {
  return useQuery({
    queryKey: ['course', courseId],
    enabled: Boolean(courseId),
    queryFn: async () => {
      const response = await api.get(`/api/courses/${courseId}`)
      return response.data
    }
  })
}
