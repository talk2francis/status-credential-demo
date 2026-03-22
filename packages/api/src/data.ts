import seed from '../../demo-data/seed.json' assert { type: 'json' }

export const db = {
  users: seed.users,
  courses: seed.courses,
  lessons: seed.lessons,
  quizzes: seed.quizzes,
  trades: seed.trades,
  certificates: seed.certificates,
  analytics: seed.analytics
}
