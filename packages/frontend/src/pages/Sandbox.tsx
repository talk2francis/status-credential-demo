import { useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../store/useAuth'

export function Sandbox() {
  const { userId } = useAuth()
  const [form, setForm] = useState({ symbol: 'ETH/USDC', side: 'BUY', qty: 0.5, price: 3250 })
  const [log, setLog] = useState([
    { id: 'trade-1', symbol: 'ETH/USDC', side: 'BUY', qty: 0.25, price: 3200, pnl: '+1.4%' },
    { id: 'trade-2', symbol: 'SOL/USDC', side: 'SELL', qty: 12, price: 186, pnl: '-0.5%' }
  ])
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error' | 'success'>('idle')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      setStatus('submitting')
      const response = await api.post('/api/sandbox/trade', {
        userId,
        symbol: form.symbol,
        side: form.side,
        qty: form.qty,
        price: form.price
      })
      setLog([
        {
          id: response.data.trade.id,
          symbol: response.data.trade.symbol,
          side: response.data.trade.side,
          qty: response.data.trade.qty,
          price: response.data.trade.price,
          pnl: `${response.data.trade.pnl.toFixed(2)}%`
        },
        ...log
      ])
      setStatus('success')
    } catch (error) {
      console.error(error)
      setStatus('error')
    } finally {
      setTimeout(() => setStatus('idle'), 1500)
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-amber">Sandbox simulator</p>
        <h1 className="mt-2 text-3xl font-semibold">Paper trading ledger</h1>
        <p className="text-sm text-slate">Mock wallet connect • Replayable trade history • XP rewards.</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6 rounded-3xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold">Order entry</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <label className="flex flex-col">
              Symbol
              <select
                value={form.symbol}
                onChange={(e) => setForm({ ...form, symbol: e.target.value })}
                className="mt-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-2"
              >
                <option>ETH/USDC</option>
                <option>SOL/USDC</option>
                <option>BTC/USDC</option>
              </select>
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col">
                Side
                <select
                  value={form.side}
                  onChange={(e) => setForm({ ...form, side: e.target.value })}
                  className="mt-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-2"
                >
                  <option>BUY</option>
                  <option>SELL</option>
                </select>
              </label>
              <label className="flex flex-col">
                Qty
                <input
                  type="number"
                  step="0.01"
                  value={form.qty}
                  onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })}
                  className="mt-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-2"
                />
              </label>
            </div>
            <label className="flex flex-col">
              Limit price (USD)
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="mt-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-2"
              />
            </label>
            <button type="submit" className="w-full rounded-2xl bg-mint px-4 py-3 font-semibold text-night" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Submitting…' : 'Submit paper trade'}
            </button>
            {status === 'error' && <p className="text-xs text-red-400">Sandbox offline — retry.</p>}
            {status === 'success' && <p className="text-xs text-mint">Trade logged & XP awarded.</p>}
          </form>
        </section>
        <section className="space-y-6 rounded-3xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold">Trade history</h2>
          <div className="space-y-3 text-sm">
            {log.map((trade) => (
              <div key={trade.id} className="rounded-2xl border border-white/5 px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{trade.symbol}</p>
                  <span className="text-slate">{trade.side}</span>
                </div>
                <div className="flex items-center justify-between text-slate">
                  <span>
                    {trade.qty} @ ${trade.price}
                  </span>
                  <span className={trade.pnl.startsWith('-') ? 'text-red-400' : 'text-mint'}>{trade.pnl}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-white/5 p-4 text-sm text-slate">
            Wallet connect: <button className="ml-2 rounded-full border border-white/10 px-3 py-1 text-xs">Mock testnet wallet</button>
          </div>
        </section>
      </div>
    </div>
  )
}
