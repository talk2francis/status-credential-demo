import { useState } from 'react'
import { useCourses } from '../hooks/useCourses'

const facets = [
  { label: 'Topic', options: ['Wallets', 'DeFi', 'Security', 'NFTs'] },
  { label: 'Difficulty', options: ['Beginner', 'Intermediate', 'Advanced'] },
  { label: 'Format', options: ['Video', 'Interactive', 'Project'] },
  { label: 'Time to complete', options: ['< 2h', '2-4h', '4h+'] }
]

export function Catalog() {
  const [query, setQuery] = useState('')
  const { data, isLoading } = useCourses({ query })
  const courses = data?.data ?? []

  return (
    <div className="grid gap-8 md:grid-cols-[250px_1fr]">
      <aside className="rounded-3xl border border-white/10 p-6">
        <h2 className="text-lg font-semibold">Filters</h2>
        <div className="mt-6 space-y-6 text-sm">
          {facets.map((facet) => (
            <div key={facet.label}>
              <p className="font-medium text-white">{facet.label}</p>
              <div className="mt-2 space-y-2 text-slate">
                {facet.options.map((option) => (
                  <label key={option} className="flex items-center gap-2">
                    <input type="checkbox" className="accent-mint" />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Course catalog</h1>
            <p className="text-sm text-slate">{courses.length} curated tracks • Search and filter to personalize.</p>
          </div>
          <div className="flex gap-3">
            <input
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm"
              placeholder="Search subjects, instructors, skills"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search courses"
            />
            <button className="rounded-full border border-white/10 px-4 py-2 text-sm">Recommended track</button>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {isLoading ? (
            <p className="text-sm text-slate">Loading catalog…</p>
          ) : (
            courses.map((course: any) => (
              <article key={course.id} className="rounded-2xl border border-white/5 p-6">
                <div className="flex items-center justify-between text-xs text-slate">
                  <span>{course.difficulty}</span>
                  <span>{course.duration ?? '3h runtime'}</span>
                </div>
                <h3 className="mt-3 text-xl font-semibold">{course.title}</h3>
                <p className="mt-2 text-sm text-slate">{course.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate">
                  {course.tags?.map((tag: string) => (
                    <span key={tag} className="rounded-full bg-white/5 px-3 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between text-sm">
                  <button className="rounded-full bg-mint px-4 py-2 font-semibold text-night">
                    {course.price === 'free' ? 'Start for free' : 'Preview lesson'}
                  </button>
                  <button className="rounded-full border border-white/10 px-4 py-2">Try sandbox lesson</button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
