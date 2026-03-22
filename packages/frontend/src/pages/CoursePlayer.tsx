import { useUserProgress } from '../hooks/useUserProgress'
import { useAuth } from '../store/useAuth'

export function CoursePlayer() {
  const { userId } = useAuth()
  const { data } = useUserProgress(userId)
  const percent = Math.round((data?.progress.percent ?? 0) * 100)
  const transcript = `Status Credential Demo sandbox lesson. Step 1: Connect to the mock wallet. Step 2: Submit a testnet trade and observe the ledger updates. Step 3: Reflect on how liquidity impacts price action.`

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <section className="space-y-6 rounded-3xl border border-white/10 p-6">
        <header>
          <p className="text-xs uppercase tracking-[0.3em] text-amber">Course player</p>
          <h1 className="mt-2 text-3xl font-semibold">Wallets and Security</h1>
        </header>
        <div className="aspect-video w-full rounded-2xl bg-white/5"></div>
        <div>
          <h2 className="text-lg font-semibold">Transcript</h2>
          <p className="mt-2 text-sm text-slate">{transcript}</p>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Inline quiz</h3>
          <div className="space-y-3 text-sm text-slate">
            <p>Why should you split hot and cold wallets?</p>
            <div className="grid gap-2">
              <label className="rounded-2xl border border-white/10 px-4 py-3">
                <input type="radio" name="quiz" className="mr-2 accent-mint" />
                Reduce single point of failure
              </label>
              <label className="rounded-2xl border border-white/10 px-4 py-3">
                <input type="radio" name="quiz" className="mr-2 accent-mint" />
                Maximize fees
              </label>
            </div>
          </div>
        </div>
      </section>
      <aside className="space-y-6 rounded-3xl border border-white/10 p-6">
        <div>
          <h2 className="text-lg font-semibold">Progress</h2>
          <p className="text-sm text-slate">
            {percent}% complete • {data?.user.xp ?? 0} XP
          </p>
          <div className="mt-2 h-2 rounded-full bg-white/10" aria-label={`Progress ${percent}%`}>
            <div className="h-2 rounded-full bg-mint" style={{ width: `${percent}%` }}></div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Sandbox mini-widget</h3>
          <p className="text-sm text-slate">Last trade: +0.8% PnL on ETH/USDC.</p>
          <button className="mt-3 w-full rounded-full border border-white/10 px-4 py-2 text-sm">Open sandbox</button>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Share progress</h3>
          <p className="text-sm text-slate">Generate a clip or tweet the checkpoint.</p>
          <button className="mt-3 w-full rounded-full bg-white/10 px-4 py-2 text-sm">Generate social card</button>
        </div>
      </aside>
    </div>
  )
}
