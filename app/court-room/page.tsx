'use client'
import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

type Sender = 'Boss' | 'Family' | 'Agile'
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
interface TaskState { key: TaskKey; status: 'pending' | 'resolved' | 'urgent' | 'court'; timestamps: { initial?: number; urgent?: number; court?: number } }
interface Message { id: string; at: number; from: Sender | 'System'; text: string; severity?: 'info' | 'warning' | 'urgent' }

const MS = { s: 1000, min: 60 * 1000 }
const AMBIENT_MIN = 20 * MS.s, AMBIENT_MAX = 30 * MS.s

const TASK_RULES: TaskRule[] = [
  { key: 'fixAlt', title: 'fix alt in img1', description: 'Add meaningful alt text to comply with WCAG.', lawOnBreach: 'Disability Discrimination Act / WCAG 1.1.1', initialDelayMs: 10*MS.s, urgentDelayMs: 2*MS.min, courtDelayMs: 4*MS.min },
  { key: 'fixInputValidation', title: 'fix input validation', description: 'Validate email/password properly (client & server).', lawOnBreach: 'Laws of Tort (hacked; known issue)', initialDelayMs: 25*MS.s, urgentDelayMs: 2*MS.min, courtDelayMs: 4*MS.min },
  { key: 'changeTitleColour', title: 'fix change Title colour to Red', description: 'Agile request to make title red.', lawOnBreach: '—', initialDelayMs: 35*MS.s, urgentDelayMs: 2*MS.min, courtDelayMs: 4*MS.min },
  { key: 'fixUserLogin', title: 'Fix User login', description: 'Implement login flow; otherwise no one can use the app.', lawOnBreach: 'Bankruptcy scenario (no revenue)', initialDelayMs: 50*MS.s, urgentDelayMs: 2*MS.min, courtDelayMs: 4*MS.min },
  { key: 'fixSecureDatabase', title: 'Fix Secure Database', description: 'Secure DB connection & secrets; avoid breaches.', lawOnBreach: 'Laws of Tort (data breach)', initialDelayMs: 65*MS.s, urgentDelayMs: 2*MS.min, courtDelayMs: 4*MS.min },
]

const SENDER_LINES: Record<Sender, string[]> = {
  Boss: ['Are you done with sprint 1?', 'ETA on title colour?', 'Stand-up in 5.'],
  Family: ['Can you pick up the kids after work?', 'Don’t forget dinner tonight!'],
  Agile: ['“Change Title colour to Red” still open.', 'Reminder: add alt to img1.', 'Reminder: validate inputs.'],
}

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const now = () => Date.now()
const prettyTime = (ms: number) => new Date(ms).toLocaleTimeString()

export default function CourtRoom() {
  const [minutes, setMinutes] = useState<number>(5)
  const [running, setRunning] = useState(false)
  const [startedAt, setStartedAt] = useState<number | null>(null)

  const [messages, setMessages] = useState<Message[]>([])
  const [tasks, setTasks] = useState<Record<TaskKey, TaskState>>(
    Object.fromEntries(TASK_RULES.map(r => [r.key, { key: r.key, status: 'pending', timestamps: {} }])) as Record<TaskKey, TaskState>
  )
  const [showCourt, setShowCourt] = useState<null | { task: TaskRule; when: number }>(null)

  // “Fixes” state
  const [imgAlt, setImgAlt] = useState('')
  const [titleIsRed, setTitleIsRed] = useState(false)
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const emailOk = /.+@.+\..+/.test(email)
  const passOk = pass.length >= 8
  const [loginVerified, setLoginVerified] = useState(false)
  const [dbSecured, setDbSecured] = useState(false)

  // Save to DB
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')
  const liveRef = useRef<HTMLDivElement>(null)

  const pushMessage = (m: Omit<Message, 'id' | 'at'>) => {
    const item: Message = { id: crypto.randomUUID(), at: now(), ...m }
    setMessages(prev => [item, ...prev].slice(0, 100))
    if (liveRef.current) liveRef.current.textContent = `${m.from}: ${m.text}`
  }
  const pushSystem = (text: string, severity: Message['severity']='info') => pushMessage({ from: 'System', text, severity })

  // Timer
  const start = () => { setRunning(true); setStartedAt(now()); pushSystem(`Timer started for ${minutes}m.`) }
  const pause = () => { setRunning(false); pushSystem('Timer paused.') }
  const reset = () => {
    setRunning(false); setStartedAt(null); setMessages([])
    setTasks(Object.fromEntries(TASK_RULES.map(r => [r.key, { key: r.key, status: 'pending', timestamps: {} }])) as Record<TaskKey, TaskState>)
    setShowCourt(null); setImgAlt(''); setTitleIsRed(false); setEmail(''); setPass(''); setLoginVerified(false); setDbSecured(false)
    pushSystem('Simulation reset.')
  }

  // 20–30s ambient messages
  useEffect(() => {
    if (!running) return
    let cancelled = false
    const plan = () => {
      const delay = rand(AMBIENT_MIN, AMBIENT_MAX)
      const id = setTimeout(() => {
        if (cancelled) return
        const who: Sender = (['Boss','Family','Agile'] as Sender[])[rand(0,2)]
        const line = SENDER_LINES[who][rand(0, SENDER_LINES[who].length - 1)]
        pushMessage({ from: who, text: line })
        plan()
      }, delay)
      return () => clearTimeout(id)
    }
    const cleanup = plan(); return () => { cancelled = true; cleanup && cleanup() }
  }, [running])

  // Escalation (t=~0 reminder, +2m URGENT, +2m COURT)
  useEffect(() => {
    if (!running) return
    const ids: number[] = []
    TASK_RULES.forEach(rule => {
      ids.push(window.setTimeout(() => {
        setTasks(prev => {
          const t = prev[rule.key]; if (!t || t.status !== 'pending') return prev
          pushMessage({ from: 'Agile', text: rule.title, severity: 'warning' })
          return { ...prev, [rule.key]: { ...t, timestamps: { ...t.timestamps, initial: now() } } }
        })
      }, rule.initialDelayMs))
      ids.push(window.setTimeout(() => {
        setTasks(prev => {
          const t = prev[rule.key]; if (!t || t.status !== 'pending') return prev
          pushMessage({ from: 'Agile', text: `URGENT: ${rule.title}`, severity: 'urgent' })
          return { ...prev, [rule.key]: { ...t, status: 'urgent', timestamps: { ...t.timestamps, urgent: now() } } }
        })
      }, rule.urgentDelayMs))
      ids.push(window.setTimeout(() => {
        setTasks(prev => {
          const t = prev[rule.key]; if (!t || (t.status !== 'pending' && t.status !== 'urgent')) return prev
          const breached =
            rule.key === 'fixAlt' ? 'You ignored accessible alt text.' :
            rule.key === 'fixInputValidation' ? 'You ignored input validation; you were hacked.' :
            rule.key === 'fixSecureDatabase' ? 'You left the DB insecure; data breach occurred.' :
            rule.key === 'fixUserLogin' ? 'No login; you went bankrupt.' :
            'Ignored product requirement.'
          pushMessage({ from: 'System', text: `⚖️ COURT: ${breached} (${rule.lawOnBreach}).`, severity: 'urgent' })
          setShowCourt({ task: rule, when: now() })
          return { ...prev, [rule.key]: { ...t, status: 'court', timestamps: { ...t.timestamps, court: now() } } }
        })
      }, rule.courtDelayMs))
    })
    return () => ids.forEach(id => clearTimeout(id))
  }, [running])

  const resolveTask = (key: TaskKey) => setTasks(prev => {
    const t = prev[key]; if (!t || t.status === 'resolved') return prev
    pushSystem(`Task resolved: ${TASK_RULES.find(x => x.key === key)?.title}`)
    return { ...prev, [key]: { ...t, status: 'resolved' } }
  })

  const buildPayload = () => ({ startedAt, minutesPlanned: minutes, running, tasks, messages: messages.slice(0, 50), meta: { titleIsRed, loginVerified, dbSecured } })
  const saveSession = async () => {
    try {
      setSaving(true); setSaveStatus('')
      const res = await fetch('/api/court-sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(buildPayload()) })
      if (!res.ok) throw new Error(`Save failed (${res.status})`)
      const data = await res.json(); setSaveStatus(`Saved ✓ (id: ${data.id?.slice?.(0,8) ?? 'ok'})`); pushSystem('Session saved to database.')
    } catch (e: any) { setSaveStatus(e?.message ?? 'Save failed'); pushSystem('Save failed — check API logs.', 'urgent') }
    finally { setSaving(false) }
  }

  const verifyLogin = async () => {
    try {
      const created = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'test-user', lineStatus: 'online' }) })
      if (!created.ok) throw new Error('Create user failed')
      const list = await fetch('/api/users')
      if (!list.ok) throw new Error('List users failed')
      setLoginVerified(true)
      resolveTask('fixUserLogin')
    } catch { pushSystem('Login verification failed.', 'urgent') }
  }

  const verifyDbSecurity = async () => {
    try {
      const res = await fetch('/api/health/db')
      const data = await res.json()
      if (res.ok && data.connected && data.secure) { setDbSecured(true); resolveTask('fixSecureDatabase') }
      else pushSystem('DB not secure/connected. Check ENV & Docker.', 'urgent')
    } catch { pushSystem('DB health endpoint failed.', 'urgent') }
  }

  const totalOpen = Object.values(tasks).filter(t => t.status !== 'resolved').length

  return (
    <section className={clsx('relative min-h-[calc(100dvh-4rem)] w-full overflow-hidden', 'text-slate-900 dark:text-slate-100')}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center opacity-25" style={{ backgroundImage: "url('/courtroom.jpg')" }} />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 -z-10 w-[1100px] h-[380px] bg-no-repeat bg-contain opacity-70" style={{ backgroundImage: "url('/work-desk.png')" }} />

      {/* Ethics Survey Banner */}
      <div className="w-full bg-amber-50 border-b border-amber-200 text-amber-900">
        <div className="section px-4 py-2 text-sm">
          Please request feedback from <strong>two family</strong>, <strong>two friends</strong>, and <strong>two industry</strong> contacts and ask them to complete the ethical survey:{' '}
          <a className="underline" href="https://redcap.latrobe.edu.au/redcap/surveys/?s=PPEKFTMPXF4KKEFY" target="_blank" rel="noreferrer">Ethical Survey (REDCap)</a>
        </div>
      </div>

      <div className="section px-4 py-6 sm:px-8">
        <h1 className={clsx('h1 mb-2', titleIsRed && 'text-red-600')}>Court Room</h1>
        <p className="mb-4 text-sm opacity-80">Debug under pressure. Messages every 20–30s; 2m → urgent; +2m → court & fines.</p>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Timer */}
          <div className="rounded-lg border dark:border-slate-700 p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur">
            <h2 className="font-semibold mb-2">Timer</h2>
            <label className="block text-sm mb-2" htmlFor="minutes">Minutes</label>
            <input id="minutes" type="number" min={1} max={60} className="w-24 rounded border px-2 py-1 text-slate-900" value={minutes} onChange={e => setMinutes(Math.max(1, Number(e.target.value || 1)))} />
            <div className="mt-3 flex gap-2">
              <button className="btn" onClick={start} disabled={running}>Start</button>
              <button className="btn" onClick={pause} disabled={!running}>Pause</button>
              <button className="btn-outline" onClick={reset}>Reset</button>
            </div>
            <p className="mt-2 text-xs opacity-70">Boss/Family/Agile ping you while you work.</p>
          </div>

          {/* Tasks */}
          <div className="rounded-lg border dark:border-slate-700 p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur">
            <h2 className="font-semibold mb-2">Tasks ({totalOpen} open)</h2>
            <ul className="space-y-2">
              {TASK_RULES.map(rule => {
                const st = tasks[rule.key]
                return (
                  <li key={rule.key} className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium">{rule.title}</div>
                      <div className="text-xs opacity-70">{rule.description}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={clsx('inline-flex items-center rounded px-2 py-0.5 text-xs',
                        st?.status === 'resolved' && 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-300',
                        st?.status === 'urgent' && 'bg-amber-600/15 text-amber-700 dark:text-amber-300',
                        st?.status === 'court' && 'bg-red-600/15 text-red-700 dark:text-red-300',
                        (!st || st.status === 'pending') && 'bg-slate-500/15 text-slate-700 dark:text-slate-300'
                      )} aria-label={`Status: ${st?.status ?? 'pending'}`}>{st?.status ?? 'pending'}</span>
                      <button className="btn-xs" onClick={() => resolveTask(rule.key)} disabled={st?.status === 'resolved'}>Mark fixed</button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="rounded-lg border dark:border-slate-700 p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur">
            <h2 className="font-semibold mb-2">Quick Actions</h2>
            <div className="space-y-3 text-sm">
              <div className="rounded border p-3">
                <div className="mb-2 font-medium">Fix image alt</div>
                <img src="/sample-product.jpg" alt={imgAlt || ''} className="h-24 w-24 rounded object-cover border" />
                <div className="mt-2 flex items-center gap-2">
                  <input aria-label="Alt text" className="rounded border px-2 py-1 text-slate-900" placeholder="Describe the image…" value={imgAlt} onChange={e => setImgAlt(e.target.value)} />
                  <button className="btn-xs" onClick={() => imgAlt.trim() && resolveTask('fixAlt')} disabled={!imgAlt.trim()}>Save alt</button>
                </div>
                {!imgAlt && <p className="mt-1 text-xs text-amber-700">Missing alt → a11y failure</p>}
              </div>

              <div className="rounded border p-3">

                <div className="mb-2 font-medium">Change Title colour to Red</div>
                <button className="btn-xs" onClick={() => { setTitleIsRed(true); resolveTask('changeTitleColour') }}>Make title red</button>
              </div>

              <div className="rounded border p-3">
                <div className="mb-2 font-medium">Fix input validation</div>
                <label className="block text-xs" htmlFor="email">Email</label>
                <input id="email" type="email" className={clsx('mb-1 w-full rounded border px-2 py-1 text-slate-900', !emailOk && 'border-red-500')} value={email} onChange={e => setEmail(e.target.value)} />
                <label className="block text-xs" htmlFor="pass">Password</label>
                <input id="pass" type="password" className={clsx('w-full rounded border px-2 py-1 text-slate-900', !passOk && 'border-red-500')} value={pass} onChange={e => setPass(e.target.value)} />
                <button className="btn-xs mt-2" onClick={() => emailOk && passOk && resolveTask('fixInputValidation')} disabled={!(emailOk && passOk)}>Validate</button>
              </div>

              <div className="rounded border p-3">
                <div className="mb-2 font-medium">Implement User Login (verify API)</div>
                <button className="btn-xs" onClick={verifyLogin}>Verify via /api/users</button>
                {loginVerified && <p className="mt-1 text-xs text-emerald-700">Users API working ✔</p>}
              </div>

              <div className="rounded border p-3">
                <div className="mb-2 font-medium">Secure Database (verify)</div>
                <button className="btn-xs" onClick={verifyDbSecurity}>Check /api/health/db</button>
                {dbSecured && <p className="mt-1 text-xs text-emerald-700">DB connected & using postgres URL ✔</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Inbox + Save */}
        <div className="mt-6 rounded-lg border dark:border-slate-700 p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur">
          <div className="flex items-center justify-between"><h2 className="font-semibold">Inbox</h2><span className="text-xs opacity-70">Newest first</span></div>
          <ul className="mt-3 space-y-2 max-h-72 overflow-auto pr-1">
            {messages.map(m => (
              <li key={m.id} className="rounded border p-2 text-sm bg-white/60 dark:bg-slate-800/60">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{m.from}
                    {m.severity === 'urgent' && <span className="ml-2 rounded bg-red-600/15 px-2 py-0.5 text-xs text-red-700">URGENT</span>}
                    {m.severity === 'warning' && <span className="ml-2 rounded bg-amber-600/15 px-2 py-0.5 text-xs text-amber-700">reminder</span>}
                  </div>
                  <div className="text-[11px] opacity-70">{prettyTime(m.at)}</div>
                </div>
                <p className="mt-1">{m.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-3">
            <button className="btn" onClick={saveSession} disabled={saving}>{saving ? 'Saving…' : 'Save session to DB'}</button>
            {saveStatus && <span className="text-xs opacity-80">{saveStatus}</span>}
          </div>
          <div aria-live="polite" className="sr-only" ref={liveRef} />
        </div>
      </div>

      {showCourt && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="max-w-lg w-full rounded-xl border bg-white dark:bg-slate-900 dark:border-slate-700 p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-2">⚖️ Court Room</h3>
            <p className="text-sm opacity-80 mb-4">You breached: <span className="font-semibold">{showCourt.task.title}</span></p>
            <div className="rounded border p-3 text-sm">
              <p className="mb-1"><span className="font-semibold">Verdict:</span> Fine for breaking <em>{showCourt.task.lawOnBreach}</em>.</p>
              <p className="opacity-80 text-xs">Time: {prettyTime(showCourt.when)}</p>
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <button className="btn-outline" onClick={() => setShowCourt(null)}>Close</button>
              <button className="btn" onClick={() => { resolveTask(showCourt.task.key); setShowCourt(null) }}>Appeal by fixing now</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .btn { @apply rounded bg-slate-900 text-white px-3 py-1 text-sm disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900; }
        .btn-outline { @apply rounded border px-3 py-1 text-sm; }
        .btn-xs { @apply rounded bg-slate-900 text-white px-2 py-0.5 text-xs disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900; }
        .h1 { @apply text-2xl sm:text-3xl font-bold; }
        .section { @apply max-w-6xl mx-auto; }
      `}</style>
    </section>
  )
}
