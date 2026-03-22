import { useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../store/useAuth'

export function Assessments() {
  const { userId } = useAuth()
  const [answer, setAnswer] = useState('')
  const [certificate, setCertificate] = useState<{ certUrl: string; socialCardUrl: string } | null>(null)
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle')

  const handleSubmit = async () => {
    setStatus('submitting')
    const response = await api.post('/api/certificates/generate', {
      userId,
      courseId: 'course-crypto-fundamentals'
    })
    setCertificate({ certUrl: response.data.certUrl, socialCardUrl: response.data.socialCardUrl })
    setStatus('idle')
  }

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-white/10 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-amber">Assessments</p>
        <h1 className="mt-2 text-3xl font-semibold">Quiz + Project submission</h1>
        <div className="mt-6 space-y-3 text-sm">
          <p>Why does decentralized consensus matter for security?</p>
          <textarea
            className="w-full rounded-2xl border border-white/10 bg-white/5 p-4"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Explain your reasoning"
          />
          <button className="rounded-2xl border border-white/10 px-4 py-2 text-xs">Upload project</button>
        </div>
        <button
          className="mt-6 rounded-full bg-mint px-6 py-3 text-sm font-semibold text-night"
          onClick={handleSubmit}
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Grading…' : 'Generate certificate'}
        </button>
      </section>
      {certificate && (
        <section className="rounded-3xl border border-white/10 p-6">
          <h2 className="text-2xl font-semibold">Certificate ready</h2>
          <p className="text-sm text-slate">PDF + social card base64 strings returned.</p>
          <pre className="mt-4 overflow-auto rounded-2xl bg-black/40 p-4 text-xs">{certificate.certUrl}</pre>
          <pre className="mt-4 overflow-auto rounded-2xl bg-black/40 p-4 text-xs">{certificate.socialCardUrl}</pre>
          <button className="mt-4 rounded-full border border-white/10 px-4 py-2 text-sm">Share to X</button>
        </section>
      )}
    </div>
  )
}
