"use client";
import { useEffect, useMemo, useState } from "react";

/* Browser-only blog (create, search, read) with neon split view. */
type Post = { id:string; title:string; body:string; createdAt:number };

export default function BlogPage(){
  const [title,setTitle]=useState(""); const [body,setBody]=useState(""); const [q,setQ]=useState("");
  const [posts,setPosts]=useState<Post[]>([]); const [view,setView]=useState<string|null>(null);

  useEffect(()=>{ const raw=localStorage.getItem("posts_v1"); if(raw) setPosts(JSON.parse(raw)); },[]);
  useEffect(()=>{ localStorage.setItem("posts_v1", JSON.stringify(posts)); },[posts]);

  const filtered=useMemo(()=>{ const n=q.toLowerCase(); return posts.filter(p=>p.title.toLowerCase().includes(n)||p.body.toLowerCase().includes(n)); },[posts,q]);
  const current = posts.find(p=>p.id===view) ?? filtered[0];

  function publish(){
    if(!title.trim()||!body.trim()) return;
    const p:Post={id:crypto.randomUUID(),title:title.trim(),body:body.trim(),createdAt:Date.now()};
    setPosts(v=>[p,...v]); setTitle(""); setBody(""); setView(p.id);
  }

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Blog</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Write */}
        <div className="rounded-2xl border border-white/10 bg-[var(--card)] p-4">
          <h2 className="text-xl font-semibold">New post</h2>
          <label className="block text-sm mt-2">Title
            <input value={title} onChange={(e)=>setTitle(e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2" />
          </label>
          <label className="block text-sm mt-2">Body
            <textarea value={body} onChange={(e)=>setBody(e.target.value)} rows={6} className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2" />
          </label>
          <button onClick={publish} className="mt-2 rounded-xl border border-pink-400/50 bg-pink-500/10 px-4 py-2 text-sm">Publish</button>
        </div>

        {/* Read */}
        <div className="space-y-3 rounded-2xl border border-white/10 bg-[var(--card)] p-4">
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search posts…" className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2" aria-label="Search posts" />

          <ul className="max-h-[360px] space-y-2 overflow-auto">
            {filtered.map((p)=>(
              <li key={p.id}>
                <button onClick={()=>setView(p.id)} className={`w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-left hover:bg-white/5 ${current?.id===p.id?"underline decoration-cyan-400 underline-offset-4":""}`}>
                  {p.title} <span className="text-xs text-cyan-100/60">({new Date(p.createdAt).toLocaleString()})</span>
                </button>
              </li>
            ))}
          </ul>

          {current && (
            <article className="rounded-2xl border border-white/10 bg-black/30 p-3">
              <h3 className="text-lg font-semibold">{current.title}</h3>
              <p className="mt-1 whitespace-pre-wrap text-cyan-100/90">{current.body}</p>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
