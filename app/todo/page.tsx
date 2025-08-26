"use client";
import { useEffect, useMemo, useState } from "react";

/* Local, fast todo with neon cards. */
type Todo = { id: string; text: string; done: boolean };

export default function TodoPage() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(()=>{ const raw=localStorage.getItem("todos_v1"); if(raw) setTodos(JSON.parse(raw)); },[]);
  useEffect(()=>{ localStorage.setItem("todos_v1", JSON.stringify(todos)); },[todos]);

  const left = useMemo(()=> todos.filter(t=>!t.done).length, [todos]);

  const add = () => { const t=text.trim(); if(!t) return; setTodos(p=>[{id:crypto.randomUUID(), text:t, done:false}, ...p]); setText(""); };
  const toggle = (id:string)=> setTodos(p=>p.map(t=>t.id===id?{...t,done:!t.done}:t));
  const remove = (id:string)=> setTodos(p=>p.filter(t=>t.id!==id));

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Todo</h1>

      <div className="rounded-2xl border border-white/10 bg-[var(--card)] p-4">
        <label className="block text-sm font-medium" htmlFor="todo-input">Add a task</label>
        <div className="mt-2 flex gap-2">
          <input
            id="todo-input"
            value={text} onChange={(e)=>setText(e.target.value)}
            onKeyDown={(e)=>e.key==="Enter"&&add()}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
            placeholder="e.g., Finish neon tabs"
            aria-label="New task"
          />
          <button onClick={add} className="rounded-xl border border-cyan-400/50 bg-cyan-500/10 px-4 py-2 text-sm">Add</button>
        </div>

        <p className="mt-3 text-sm text-cyan-100/80">{left} remaining</p>

        <ul className="mt-3 space-y-2">
          {todos.map((t)=>(
            <li key={t.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 p-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={t.done} onChange={()=>toggle(t.id)} aria-label={`Toggle ${t.text}`} />
                <span className={t.done?"line-through opacity-60":""}>{t.text}</span>
              </label>
              <button onClick={()=>remove(t.id)} className="rounded-lg border border-white/20 px-2 py-1 text-xs hover:bg-white/5">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
