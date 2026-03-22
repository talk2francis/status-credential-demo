import { useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../store/useAuth'

export function AuthPanel() {
  const { setUser } = useAuth()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const sendMagicLink = async () => {
    try {
      setStatus('sending')
      await api.post('/api/auth/magic-link', { email })
      setStatus('sent')
      setUser('user-student-1')
    } catch (error) {
      console.error(error)
      setStatus('error')
    } finally {
      setTimeout(() => setStatus('idle'), 2000)
    }
  }

  const walletLogin = async () => {
    const response = await api.post('/api/auth/wallet-login', { walletAddress: '0xFAKE' })
    console.log(response.data)
    setUser('user-student-1')
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm">
      <p className="text-xs uppercase tracking-[0.3em] text-amber">Authentication</p>
      <h3 className="mt-2 text-xl font-semibold">Email magic link or wallet connect</h3>
      <div className="mt-4 space-y-3">
        <input
          type="email"
          className="w-full rounded-2xl border border-white/10 bg-night px-4 py-2"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button
          className="w-full rounded-2xl bg-mint px-4 py-2 font-semibold text-night"
          onClick={sendMagicLink}
          disabled={status === 'sending'}
        >
          {status === 'sending' ? 'Sending…' : 'Email magic link'}
        </button>
        <button className="w-full rounded-2xl border border-white/10 px-4 py-2" onClick={walletLogin}>
          Connect wallet (testnet)
        </button>
        {status === 'sent' && <p className="text-xs text-mint">Magic link sent (mock).</p>}
        {status === 'error' && <p className="text-xs text-red-400">Failed to send link.</p>}
      </div>
    </div>
  )
}
