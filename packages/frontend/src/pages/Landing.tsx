import { useCourses } from '../hooks/useCourses'
import { leaderboard } from '../data/seed'
import { AuthPanel } from '../components/AuthPanel'

export function Landing() {
  const { data, isLoading } = useCourses()
  const courseList = data?.data ?? []

  return (
    <div className="space-y-16">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-night via-night to-white/5 px-10 py-16">
        <p className="text-sm uppercase tracking-[0.3em] text-amber">Campaign</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight">
          Learn crypto by doing. Courses built by practitioners.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate">
          Status Credential Demo blends instruction, sandbox simulations, and social sharing into one cohesive learning loop.
          Join the current campaign. Countdown to demo day: <strong>12d : 06h : 44m</strong>.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <button className="rounded-full bg-mint px-6 py-3 font-semibold text-night">Browse courses</button>
          <button className="rounded-full border border-white/15 px-6 py-3 font-semibold">View sandbox</button>
        </div>
        <div className="mt-10 grid gap-6 text-sm text-slate sm:grid-cols-3">
          <div>
            <p className="text-3xl font-semibold text-white">32</p>
            <p>Instructor partners</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-white">12k+</p>
            <p>Sandbox trades replayed</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-white">89%</p>
            <p>Graduates sharing certificates</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/5 p-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Trending courses</h2>
            <p className="text-sm text-slate">Hand reviewed tracks with interactive projects.</p>
          </div>
          <a className="text-sm font-semibold text-mint" href="/catalog">
            View all
          </a>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          {isLoading ? (
            <p className="text-sm text-slate">Loading courses…</p>
          ) : (
            courseList.map((course: any) => (
              <article key={course.id} className="rounded-2xl border border-white/5 p-6">
                <div className="text-xs uppercase tracking-[0.3em] text-amber">{course.difficulty ?? 'Track'}</div>
                <h3 className="mt-3 text-xl font-semibold">{course.title}</h3>
                <p className="mt-2 text-sm text-slate">{course.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate">
                  {course.tags?.map((tag: string) => (
                    <span key={tag} className="rounded-full border border-white/10 px-3 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between text-sm">
                  <span className="text-slate">{course.duration ?? '3h runtime'}</span>
                  <button className="rounded-full bg-white/10 px-4 py-2 font-semibold">
                    {course.price === 'free' ? 'Start for free' : 'Preview lesson'}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-white/5 p-8">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Leaderboard</h2>
            <p className="text-sm text-slate">XP driven by lessons, quizzes, and sandbox trades.</p>
          </div>
          <button className="rounded-full border border-white/10 px-4 py-2 text-sm">Referral rules</button>
        </header>
        <div className="divide-y divide-white/5">
          {leaderboard.map((entry, index) => (
            <div key={entry.id} className="flex items-center justify-between py-3 text-sm">
              <div className="flex items-center gap-4">
                <span className="text-slate">{index + 1}</span>
                <span className="font-medium">{entry.name}</span>
              </div>
              <div className="flex gap-8 text-slate">
                <span>{entry.xp} XP</span>
                <span>{entry.trades} trades</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 p-6">
          <h2 className="text-2xl font-semibold">Referral flywheel</h2>
          <p className="mt-2 text-sm text-slate">
            Share completion cards, auto-generate tweet drafts, and track XP boosts for every successful invite.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-slate">
            <li>Generate certificate PNG + social card</li>
            <li>Tweet drafts with token placeholders</li>
            <li>Referral leaderboard inside dashboard</li>
          </ul>
        </div>
        <AuthPanel />
      </section>
    </div>
  )
}
