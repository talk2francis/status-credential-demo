const metrics = [
  { label: 'Enrollments', value: '1,248', delta: '+12.4%' },
  { label: 'Completion rate', value: '78%', delta: '+3.2%' },
  { label: 'Viral coefficient', value: '1.42', delta: '+0.08' },
  { label: 'Referral clicks', value: '9,320', delta: '+28%' }
]

const campaigns = [
  { name: 'Campus sprint', status: 'Live', conversion: '4.8%', cpa: '$9.10' },
  { name: 'Creator collab', status: 'Planned', conversion: '6.2%', cpa: '$7.45' }
]

export function Dashboard() {
  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-amber">Analytics</p>
        <h1 className="mt-2 text-3xl font-semibold">Instructor + Admin dashboard</h1>
        <p className="text-sm text-slate">Monitor XP, referrals, social shares, and authenticity reels.</p>
      </header>
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-3xl border border-white/10 p-6">
            <p className="text-sm text-slate">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold">{metric.value}</p>
            <p className="text-xs text-mint">{metric.delta} vs last week</p>
          </article>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold">Campaign performance</h2>
          <div className="mt-4 space-y-4 text-sm">
            {campaigns.map((campaign) => (
              <div key={campaign.name} className="rounded-2xl border border-white/5 p-4">
                <p className="font-semibold">{campaign.name}</p>
                <p className="text-xs text-slate">Status: {campaign.status}</p>
                <div className="mt-3 flex justify-between text-slate">
                  <span>Conversion {campaign.conversion}</span>
                  <span>CPA {campaign.cpa}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold">Authenticity reels queue</h2>
          <div className="mt-4 space-y-3 text-sm">
            {['Origin story', 'Office hours recap', 'Project highlight'].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-2xl border border-white/5 px-4 py-3">
                <div>
                  <p className="font-semibold">{item}</p>
                  <p className="text-xs text-slate">30s vertical clip • Auto-rendered</p>
                </div>
                <button className="rounded-full border border-white/10 px-3 py-1 text-xs">Render mock</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
