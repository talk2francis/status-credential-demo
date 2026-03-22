import { useParams } from 'react-router-dom'
import { useCourseDetail } from '../hooks/useCourseDetail'

export function CourseDetail() {
  const { courseId } = useParams()
  const { data, isLoading } = useCourseDetail(courseId)

  if (isLoading) {
    return <p className="text-sm text-slate">Loading course…</p>
  }

  if (!data) {
    return <p className="text-sm text-red-400">Course unavailable.</p>
  }

  return (
    <div className="space-y-10">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-amber">Course</p>
        <h1 className="mt-2 text-4xl font-semibold">{data.title}</h1>
        <p className="mt-3 text-slate">{data.summary}</p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <button className="rounded-full bg-mint px-6 py-3 font-semibold text-night">
            {data.price === 'free' ? 'Start for free' : 'Enroll now'}
          </button>
          <button className="rounded-full border border-white/10 px-6 py-3 font-semibold">Try sandbox lesson</button>
        </div>
      </header>
      <section className="rounded-3xl border border-white/10 p-8">
        <h2 className="text-2xl font-semibold">Curriculum</h2>
        <p className="text-sm text-slate">Timeline with locked/unlocked states tied to XP and sandbox milestones.</p>
        <ol className="mt-6 space-y-4">
          {data.lessons.map((lesson: any, index: number) => (
            <li key={lesson.id} className="flex items-center gap-4 rounded-2xl border border-white/5 p-4">
              <span className="text-sm text-slate">Lesson {index + 1}</span>
              <div className="flex-1">
                <p className="font-semibold">{lesson.id.replaceAll('-', ' ')}</p>
                <p className="text-xs text-slate">{Math.round(lesson.durationSec / 60)} min • {lesson.type}</p>
              </div>
              <button className="rounded-full border border-white/10 px-4 py-2 text-xs">Preview</button>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
