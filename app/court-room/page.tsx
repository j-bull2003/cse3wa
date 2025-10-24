'use client'
import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

/* -------------------- Types -------------------- */
type Sender = 'Boss' | 'Family' | 'Agile' | 'Court' | 'System'
type TaskKey = 'fixAlt' | 'fixInputValidation' | 'fixUserLogin' | 'fixSecureDatabase' | 'changeTitleColour'

interface TaskRule {
  key: TaskKey
  title: string
  description: string
  lawOnBreach: string
  initialDelayMs: number
  urgentDelayMs: number
  courtDelayMs: number
}
interface TaskState {
  key: TaskKey
  status: 'pending' | 'resolved' | 'urgent' | 'court'
  timestamps: { initial?: number; urgent?: number; court?: number }
}
interface Message {
  id: string
  at: number
  from: Sender
  text: string
  severity?: 'info' | 'warning' | 'urgent'
}
interface User {
  id: string
  name: string
  email: string
}

/* -------------------- Constants -------------------- */
const MS = { s: 1000, min: 60 * 1000 }
const IS_TEST = process.env.NODE_ENV === 'test'

// Helper to speed up time in test mode
const fast = (normalMs: number) => IS_TEST ? Math.max(500, normalMs / 60) : normalMs

const TASK_RULES: TaskRule[] = [
  {
    key: 'fixAlt',
    title: 'Fix alt in img1',
    description: 'Add meaningful alt text for accessibility compliance.',
    lawOnBreach: 'Disability Discrimination Act / WCAG 1.1.1',
    initialDelayMs: fast(10 * MS.s),
    urgentDelayMs: fast(2 * MS.min),
    courtDelayMs: fast(4 * MS.min)
  },
  {
    key: 'fixInputValidation',
    title: 'Fix input validation',
    description: 'Validate inputs properly (client & server).',
    lawOnBreach: 'Laws of Tort — negligence after known vulnerability.',
    initialDelayMs: fast(25 * MS.s),
    urgentDelayMs: fast(2 * MS.min),
    courtDelayMs: fast(4 * MS.min)
  },
  {
    key: 'changeTitleColour',
    title: 'Change title colour to red',
    description: 'Agile request to adjust the title UI colour.',
    lawOnBreach: '—',
    initialDelayMs: fast(35 * MS.s),
    urgentDelayMs: fast(2 * MS.min),
    courtDelayMs: fast(4 * MS.min)
  },
  {
    key: 'fixUserLogin',
    title: 'Fix user login',
    description: 'Implement login flow; otherwise no one can access your app.',
    lawOnBreach: 'Bankruptcy — no users, no revenue.',
    initialDelayMs: fast(50 * MS.s),
    urgentDelayMs: fast(2 * MS.min),
    courtDelayMs: fast(4 * MS.min)
  },
  {
    key: 'fixSecureDatabase',
    title: 'Secure database connection',
    description: 'Prevent leaks by securing DB credentials and encryption.',
    lawOnBreach: 'Laws of Tort — data breach negligence.',
    initialDelayMs: fast(65 * MS.s),
    urgentDelayMs: fast(2 * MS.min),
    courtDelayMs: fast(4 * MS.min)
  },
]

const SENDER_LINES = {
  Boss: ['Are you done with sprint 1?', 'Stand-up in 5!', 'Client wants updates today.'],
  Family: ['Can you pick up the kids?', 'Dinner tonight?', 'We miss you!'],
  Agile: ['Change title colour to red.', 'Reminder: fix alt in img1.', 'Validate inputs please.']
}

const ICONS: Record<Sender, string> = {
  Boss: '💼',
  Family: '🏠',
  Agile: '🧑‍💻',
  Court: '⚖️',
  System: '🖥️'
}

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const now = () => Date.now()
const pretty = (t: number) => new Date(t).toLocaleTimeString()

/* -------------------- Main Component -------------------- */
export default function CourtRoomGameWithLogin() {
  /* ---------- Auth ---------- */
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('courtUser')
      return stored ? JSON.parse(stored) : null
    }
    return null
  })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [registerMode, setRegisterMode] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!email || !password) return setError('Please enter both fields.')
    setError('')
    // Mock authentication
    const fakeUser = { id: crypto.randomUUID(), name: email.split('@')[0], email }
    localStorage.setItem('courtUser', JSON.stringify(fakeUser))
    setUser(fakeUser)
  }

  const handleLogout = () => {
    localStorage.removeItem('courtUser')
    setUser(null)
  }

  /* ---------- Game State ---------- */
  const [started, setStarted] = useState(false)
  const [practiceMode, setPracticeMode] = useState(false)
  const [minutes, setMinutes] = useState(5)
  const [timeLeft, setTimeLeft] = useState(0)
  const [running, setRunning] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [tasks, setTasks] = useState<Record<TaskKey, TaskState>>(
    Object.fromEntries(TASK_RULES.map(t => [t.key, { key: t.key, status: 'pending', timestamps: {} }])) as Record<TaskKey, TaskState>
  )
  const [showCourt, setShowCourt] = useState<TaskRule | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const liveRef = useRef<HTMLDivElement>(null)
  const pushMessage = (msg: Omit<Message, 'id' | 'at'>) => {
    const item: Message = { id: crypto.randomUUID(), at: now(), ...msg }
    setMessages(prev => [item, ...prev])
    if (liveRef.current) liveRef.current.textContent = `${msg.from}: ${msg.text}`
  }

  /* ---------- Timer ---------- */
  const start = () => {
    setStarted(true)
    setRunning(true)
    setTimeLeft(minutes * 60)
    pushMessage({ from: 'System', text: `Timer started for ${minutes} minutes.` })
  }

  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(interval); setRunning(false); pushMessage({ from: 'System', text: 'Time’s up!' }); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [running])

  /* ---------- Ambient Messages ---------- */
  useEffect(() => {
    if (!running) return
    let active = true
    const loop = () => {
      const delay = rand(20000, 30000)
      const id = setTimeout(() => {
        if (!active) return
        const senders: Sender[] = ['Boss', 'Family', 'Agile']
        const who = senders[rand(0, senders.length - 1)]
        const lines = SENDER_LINES[who as keyof typeof SENDER_LINES]
        const text = lines[rand(0, lines.length - 1)]
        pushMessage({ from: who, text })
        loop()
      }, delay)
      return () => clearTimeout(id)
    }
    const cleanup = loop()
    return () => { active = false; cleanup && cleanup() }
  }, [running])

  /* ---------- Escalation Logic ---------- */
  useEffect(() => {
    if (!running) return
    const timers: number[] = []
    TASK_RULES.forEach(rule => {
      const schedule = (delay: number, fn: () => void) => timers.push(window.setTimeout(fn, delay))
      schedule(rule.initialDelayMs, () => pushMessage({ from: 'Agile', text: rule.title, severity: 'warning' }))
      schedule(rule.urgentDelayMs, () => escalate(rule))
      schedule(rule.courtDelayMs, () => bringToCourt(rule))
    })
    return () => timers.forEach(clearTimeout)
  }, [running, practiceMode])

  const escalate = (rule: TaskRule) => {
    setTasks(prev => {
      const t = prev[rule.key]
      if (t.status !== 'pending') return prev
      pushMessage({ from: 'Agile', text: `URGENT: ${rule.title}`, severity: 'urgent' })
      return { ...prev, [rule.key]: { ...t, status: 'urgent' } }
    })
  }

  const bringToCourt = (rule: TaskRule) => {
    if (practiceMode) return
    setTasks(prev => {
      const t = prev[rule.key]
      if (t.status === 'resolved') return prev
      pushMessage({ from: 'Court', text: `⚖️ ${rule.title} — Fined under ${rule.lawOnBreach}`, severity: 'urgent' })
      setShowCourt(rule)
      return { ...prev, [rule.key]: { ...t, status: 'court' } }
    })
  }

  const resolveTask = (key: TaskKey) =>
    setTasks(prev => ({ ...prev, [key]: { ...prev[key], status: 'resolved' } }))

  /* ---------- Stage-aware background visuals (minimal change) ---------- */
  const bgStage = !started ? 'intro' : showCourt ? 'court' : 'running'
  const bgCourtOpacity = bgStage === 'intro' ? 'opacity-60' : bgStage === 'running' ? 'opacity-80' : 'opacity-100'
  const bgDeskOpacity  = bgStage === 'intro' ? 'opacity-50' : bgStage === 'running' ? 'opacity-70' : 'opacity-90'
  const dimOverlay     = bgStage === 'court' ? 'bg-black/50' : 'bg-transparent'

  /* ---------- Login Screen ---------- */
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-slate-100 to-slate-200 text-center p-6">
        <h1 className="text-3xl font-bold mb-2">⚖️ Court Room Login</h1>
        <p className="mb-4 text-slate-600 text-sm">Log in to access the simulation.</p>
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="rounded border px-2 py-1 mb-2 w-64" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="rounded border px-2 py-1 mb-3 w-64" />
        <button onClick={handleLogin} className="bg-slate-900 text-white rounded px-4 py-2">{registerMode ? 'Register' : 'Login'}</button>
        <p className="text-xs text-slate-500 mt-2">
          {registerMode ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setRegisterMode(!registerMode)} className="underline">
            {registerMode ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    )
  }

  /* ---------- Game Start Screen ---------- */
  if (!started) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-200 text-center p-6">
        <h1 className="text-3xl font-bold mb-3">Welcome, {user.name}! ⚖️</h1>
        <p className="max-w-md mb-4 text-slate-700 text-sm">
          Debug your code under pressure. You’ll receive distractions from your boss, family, and agile team. Ignore critical bugs, and the court will summon you!
        </p>
        <label className="flex flex-col items-center gap-1 mb-3 text-sm">
          Timer (minutes):
          <input type="number" min={1} max={60} value={minutes} onChange={e => setMinutes(Number(e.target.value))} className="rounded border px-2 py-1 w-20 text-center" />
        </label>
        <label className="flex items-center justify-center gap-2 mb-4 text-sm">
          <input type="checkbox" checked={practiceMode} onChange={e => setPracticeMode(e.target.checked)} />
          Practice Mode (no fines)
        </label>
        <button onClick={start} className="bg-slate-900 text-white rounded px-4 py-2 text-lg">Start Simulation</button>
        <button onClick={handleLogout} className="mt-3 text-xs underline text-slate-500">Logout</button>
      </section>
    )
  }

  /* ---------- Main Game ---------- */
  return (
    <main className="relative min-h-screen text-slate-900">
      {/* Courtroom background (stage-aware opacity, no negative z-index) */}
      <div
        aria-hidden
        className={clsx(
          'absolute inset-0 bg-cover bg-center transition-opacity duration-700 pointer-events-none',
          bgCourtOpacity
        )}
        style={{ backgroundImage: "url('https://courtroom-assets.s3.eu-north-1.amazonaws.com/courtroom.jpg')" }}
      />
      {/* Desk foreground anchored bottom (stage-aware opacity) */}
      <div
        aria-hidden
        className={clsx(
          'absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[400px] bg-no-repeat bg-contain transition-opacity duration-700 pointer-events-none',
          bgDeskOpacity
        )}
        style={{ backgroundImage: "url('https://courtroom-assets.s3.eu-north-1.amazonaws.com/work-desk.png')" }}
      />
      {/* Dim overlay only during court */}
      <div className={clsx('absolute inset-0 transition-colors duration-700 pointer-events-none', dimOverlay)} />

      <header className="flex justify-between items-center p-4 border-b bg-white/70 backdrop-blur relative">
        <h1 className="text-lg font-semibold">Court Room Simulation</h1>
        <div className="flex gap-4 items-center text-sm">
          <span>👋 {user.name}</span>
          <span>Time: {Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}</span>
          <button onClick={async () => {
            if (!user) return alert('Please log in first.')
            setSaving(true)
            try {
              await fetch('/api/court-sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, tasks, messages, practiceMode, minutes })
              })
              setToast('✅ Saved to DB!')
            } catch { setToast('⚠️ Save failed — check API.') }
            finally { setSaving(false); setTimeout(() => setToast(null), 3000) }
          }} className="btn">Save</button>
        </div>
      </header>

      <div className="grid sm:grid-cols-3 gap-4 p-4 max-w-6xl mx-auto relative">
        <section className="rounded border bg-white/70 p-4 backdrop-blur">
          <h2 className="font-semibold mb-2">Tasks</h2>
          <ul className="space-y-2">
            {TASK_RULES.map(rule => {
              const st = tasks[rule.key]
              return (
                <li key={rule.key} className={clsx('border rounded p-2 flex justify-between items-center',
                  st.status === 'resolved' && 'bg-green-50 border-green-300',
                  st.status === 'urgent' && 'bg-yellow-50 border-yellow-400',
                  st.status === 'court' && 'bg-red-50 border-red-400'
                )}>
                  <div>
                    <div className="font-medium">{rule.title}</div>
                    <p className="text-xs text-slate-600">{rule.description}</p>
                  </div>
                  <button onClick={() => {
                    setTasks(prev => ({ ...prev, [rule.key]: { ...prev[rule.key], status: 'resolved' } }))
                    if (showCourt?.key === rule.key) setShowCourt(null)
                  }} disabled={st.status === 'resolved'} className="btn-xs">
                    {st.status === 'resolved' ? 'Fixed' : 'Fix'}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="col-span-2 rounded border bg-white/70 p-4 backdrop-blur">
          <h2 className="font-semibold mb-2">Inbox</h2>
          <ul className="space-y-2 max-h-80 overflow-auto text-sm">
            {messages.map(m => (
              <li key={m.id} className="p-2 border rounded bg-white/60">
                <div className="flex justify-between">
                  <span>{ICONS[m.from]} {m.from}</span>
                  <span className="text-xs opacity-60">{pretty(m.at)}</span>
                </div>
                <p className={clsx('mt-1', m.severity === 'urgent' && 'text-red-700 font-semibold', m.severity === 'warning' && 'text-amber-700')}>
                  {m.text}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {showCourt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="bg-white p-6 rounded-xl max-w-md text-center">
            <h3 className="text-xl font-bold mb-2">⚖️ Court Summons</h3>
            <p className="text-sm mb-2">You ignored <strong>{showCourt.title}</strong>.</p>
            <p className="text-xs text-red-700 mb-4">Fine under <em>{showCourt.lawOnBreach}</em>.</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setTasks(prev => ({ ...prev, [showCourt.key]: { ...prev[showCourt.key], status: 'resolved' } }))
                  setShowCourt(null)
                }}
                className="btn"
              >
                Appeal & Fix
              </button>
              <button onClick={() => setShowCourt(null)} className="btn-outline">Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-4 right-4 bg-slate-800 text-white px-3 py-2 rounded">{toast}</div>}
      <div aria-live="polite" ref={liveRef} className="sr-only" />

      <style jsx global>{`
        .btn { @apply rounded bg-slate-900 text-white px-3 py-1 text-sm disabled:opacity-50; }
        .btn-outline { @apply rounded border px-3 py-1 text-sm; }
        .btn-xs { @apply rounded bg-slate-900 text-white px-2 py-0.5 text-xs disabled:opacity-50; }
      `}</style>
    </main>
  )
}
