import express from 'express'
import cors from 'cors'
import { db } from './data'

export const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/courses', (req, res) => {
  const query = ((req.query.query as string) || '').toLowerCase()
  const filtered = db.courses.filter((course) =>
    course.title.toLowerCase().includes(query) || course.summary.toLowerCase().includes(query)
  )
  res.json({ data: filtered, total: filtered.length })
})

app.get('/api/courses/:id', (req, res) => {
  const course = db.courses.find((item) => item.id === req.params.id)
  if (!course) return res.status(404).json({ error: 'Course not found' })
  const courseLessons = db.lessons.filter((lesson) => lesson.courseId === course.id)
  res.json({ ...course, lessons: courseLessons })
})

app.post('/api/auth/magic-link', (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email required' })
  res.json({ message: 'Magic link emailed (mock)', email })
})

app.post('/api/auth/wallet-login', (_req, res) => {
  res.json({ sessionToken: 'mock-session', chain: 'sepolia-testnet' })
})

app.post('/api/sandbox/trade', (req, res) => {
  const trade = {
    id: `trade-${db.trades.length + 1}`,
    userId: req.body.userId ?? 'user-student-1',
    timestamp: new Date().toISOString(),
    symbol: req.body.symbol ?? 'ETH/USDC',
    side: req.body.side ?? 'BUY',
    qty: req.body.qty ?? 0.1,
    price: req.body.price ?? 3100,
    pnl: 0
  }
  db.trades.unshift(trade)
  res.json({ trade, portfolio: { cash: 10000, holdings: [{ symbol: trade.symbol, qty: trade.qty }] } })
})

app.get('/api/users/:id/progress', (req, res) => {
  const user = db.users.find((item) => item.id === req.params.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json({ user, progress: { percent: 0.58, xp: user.xp } })
})

app.post('/api/courses/:id/submit-project', (req, res) => {
  res.json({ status: 'received', projectId: `project-${Date.now()}`, payload: req.body })
})

app.post('/api/certificates/generate', (req, res) => {
  const certificate = {
    id: `cert-${Date.now()}`,
    userId: req.body.userId,
    courseId: req.body.courseId,
    issuedAt: new Date().toISOString(),
    certUrl: 'data:application/pdf;base64,MOCK',
    socialCardUrl: 'data:image/png;base64,MOCK'
  }
  db.certificates.push(certificate)
  res.json(certificate)
})
