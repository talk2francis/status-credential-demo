import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/catalog', label: 'Courses' },
  { to: '/sandbox', label: 'Sandbox' },
  { to: '/assessments', label: 'Assessments' },
  { to: '/dashboard', label: 'Dashboards' }
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-night text-white">
      <header className="sticky top-0 z-50 border-b border-white/5 backdrop-blur bg-night/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="text-xl font-semibold">Status Credential Demo</div>
          <nav className="flex gap-4 text-sm font-medium">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 transition hover:bg-white/5 ${
                    isActive ? 'bg-white/10 text-mint' : 'text-slate'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button className="rounded-full bg-mint px-4 py-2 text-sm font-semibold text-night" aria-label="Browse courses CTA">
            Browse courses
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate">
        © {new Date().getFullYear()} Status Credential Demo. Learn crypto by doing. Courses built by practitioners.
      </footer>
    </div>
  )
}
