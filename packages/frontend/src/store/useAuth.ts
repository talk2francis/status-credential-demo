import { create } from 'zustand'

interface AuthState {
  userId: string
  setUser: (userId: string) => void
}

export const useAuth = create<AuthState>((set) => ({
  userId: 'user-student-1',
  setUser: (userId) => set({ userId })
}))
