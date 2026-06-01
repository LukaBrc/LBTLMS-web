import { NavLink } from 'react-router-dom'
import type { PropsWithChildren } from 'react'
import { BookOpenText, Handshake, PencilRuler, Users } from 'lucide-react'
import { cn } from '../../lib/utils'

const navItems = [
  { to: '/authors', label: 'Authors', icon: PencilRuler },
  { to: '/books', label: 'Books', icon: BookOpenText },
  { to: '/members', label: 'Members', icon: Users },
  { to: '/borrows', label: 'Borrows', icon: Handshake },
]

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl p-4 sm:p-8">
      <header className="mb-6 rounded-2xl border border-[var(--line)] bg-[var(--bg-card)] p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">LBTLMS</p>
            <h1 className="mt-2 text-3xl sm:text-4xl">Library Management UI</h1>
            <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">
              A typed frontend connected to your Spring Boot backend with React Query, form validation,
              and reusable API patterns.
            </p>
          </div>
          <p className="rounded-full bg-[var(--brand-soft)] px-4 py-2 text-sm font-semibold text-[var(--brand)]">
            API v1 client
          </p>
        </div>

        <nav className="mt-6 flex flex-wrap gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition',
                    isActive
                      ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                      : 'border-[var(--line)] bg-white text-[var(--ink)] hover:border-[var(--brand)] hover:text-[var(--brand)]',
                  )
                }
              >
                <Icon size={16} />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </header>

      <main>{children}</main>
    </div>
  )
}
