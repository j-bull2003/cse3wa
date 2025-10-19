'use client'
import { useEffect, useState } from 'react'

type Session = { id: string; createdAt: string; minutesPlanned: number; running: boolean; meta: any }

export default function SessionsAdmin() {
  const [items, setItems] = useState<Session[]>([])
  const [busy, setBusy] = useState(false)
  const load = async () => { const res = await fetch('/api/court-sessions'); if (res.ok) setItems(await res.json()) }
  useEffect(() => { load() }, [])
  const del = async (id: string) => { setBusy(true); await fetch(`/api/court-sessions?id=${id}`, { method: 'DELETE' }); await load(); setBusy(false) }
  return (
    <div className="section px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Saved Court Sessions</h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">ID</th><th>Created</th><th>Minutes</th><th>Running</th><th>Meta</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(s => (
            <tr key={s.id} className="border-b">
              <td className="py-2 align-top">{s.id.slice(0,8)}…</td>
              <td className="align-top">{new Date(s.createdAt).toLocaleString()}</td>
              <td className="align-top">{s.minutesPlanned}</td>
              <td className="align-top">{String(s.running)}</td>
              <td className="align-top"><code className="text-xs">{JSON.stringify(s.meta)}</code></td>
              <td className="align-top"><button className="btn-outline" disabled={busy} onClick={() => del(s.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
