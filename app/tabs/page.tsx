"use client";
import { useEffect, useMemo, useState } from "react";

/* Outputs a COMPLETE HTML doc with inline CSS only + vanilla JS. */
type Tab = { title: string; content: string };

export default function TabsGenerator() {
  const [tabs, setTabs] = useState<Tab[]>([
    { title: "Overview", content: "Welcome to the unit." },
    { title: "Resources", content: "Links and readings." },
    { title: "Assessments", content: "All due dates here." },
  ]);
  const [accent, setAccent] = useState("#22d3ee");       // matches neon
  const [remember, setRemember] = useState(true);

  /* Persist generator preference */
  useEffect(()=>{ const v=document.cookie.match(/builder_tabs_remember=([^;]+)/)?.[1]; if(v) setRemember(v==="1"); },[]);
  useEffect(()=>{ document.cookie=`builder_tabs_remember=${remember?"1":"0"};path=/;max-age=${60*60*24*90}`; },[remember]);

  const html = useMemo(()=> build(tabs,{accent,remember}), [tabs,accent,remember]);

  const update = (i:number,p:Partial<Tab>)=> setTabs(prev=>prev.map((t,idx)=>idx===i?{...t,...p}:t));
  const add    = ()=> setTabs(p=>[...p,{title:`Tab ${p.length+1}`, content:"Edit me."}]);
  const remove = (i:number)=> setTabs(p=>p.filter((_,idx)=>idx!==i));

  async function copyOut(){ await navigator.clipboard.writeText(html); alert("Copied! Paste into Hello.html or Moodle HTML block."); }
  function download(){
    const blob=new Blob([html],{type:"text/html"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="Hello.html";
    a.click(); URL.revokeObjectURL(a.href);
  }

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Tabs Generator — Moodle (inline CSS)</h1>
      <p className="text-cyan-100/80">No classes. One file. Keyboard a11y. Cookie to remember selected tab.</p>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Config */}
        <div className="space-y-4 rounded-2xl border border-white/10 bg-[var(--card)] p-4">
          <h2 className="text-xl font-semibold">Configure</h2>

          <label className="block text-sm font-medium">Accent colour
            <input type="color" className="ml-2 h-8 w-12 align-middle" value={accent} onChange={(e)=>setAccent(e.target.value)} aria-label="Accent colour" />
          </label>

          <label className="mt-2 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={remember} onChange={(e)=>setRemember(e.target.checked)} />
            Remember the active tab (cookie)
          </label>

          <div className="space-y-3">
            {tabs.map((t,i)=>(
              <fieldset key={i} className="rounded-xl border border-white/10 p-3">
                <legend className="px-1 text-sm font-semibold">Tab {i+1}</legend>
                <label className="block text-sm">
                  Title
                  <input value={t.title} onChange={e=>update(i,{title:e.target.value})} className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2" />
                </label>
                <label className="mt-2 block text-sm">
                  Content (HTML allowed)
                  <textarea value={t.content} onChange={e=>update(i,{content:e.target.value})} rows={4} className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2" />
                </label>
                <div className="mt-2 flex gap-2">
                  <button type="button" onClick={()=>remove(i)} className="rounded-lg border border-white/20 px-3 py-1 text-sm hover:bg-white/5">Remove</button>
                </div>
              </fieldset>
            ))}
            <button type="button" onClick={add} className="rounded-xl border border-cyan-400/50 bg-cyan-500/10 px-4 py-2 text-sm font-medium">+ Add Tab</button>
          </div>
        </div>

        {/* Output */}
        <div className="space-y-3 rounded-2xl border border-white/10 bg-[var(--card)] p-4">
          <h2 className="text-xl font-semibold">Output (copy or download)</h2>
          <div className="flex gap-2">
            <button onClick={copyOut} className="rounded-xl border border-cyan-400/50 bg-cyan-500/10 px-4 py-2 text-sm">Copy HTML</button>
            <button onClick={download} className="rounded-xl border border-violet-400/50 bg-violet-500/10 px-4 py-2 text-sm">Download Hello.html</button>
            <details className="ml-auto">
              <summary className="cursor-pointer select-none rounded-xl border border-white/20 px-3 py-2 text-sm hover:bg-white/5">Preview</summary>
              <iframe title="Tabs preview" className="mt-2 h-[460px] w-full rounded-xl border border-white/10" srcDoc={html} />
            </details>
          </div>
          <textarea readOnly value={html} rows={24} className="h-[500px] w-full rounded-xl border border-white/10 bg-black/60 p-3 font-mono text-xs" />
        </div>
      </div>
    </section>
  );
}

/* Escape < > & in user text. */
const esc=(s:string)=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

/* Build a COMPLETE single-file HTML (inline styles only). */
function build(tabs:Tab[], opts:{accent:string; remember:boolean}){
  const accent=opts.accent||"#22d3ee", remember=!!opts.remember;
  const safe=tabs.length?tabs:[{title:"Tab 1",content:"Edit me."}];

  const btns=safe.map((t,i)=>`<button role="tab" id="t-${i}" aria-controls="t-${i}-p" aria-selected="false" tabindex="-1"
style="border:0;background:transparent;padding:10px 14px;margin:0 6px;border-radius:12px;cursor:pointer;font:600 14px system-ui,Segoe UI,Roboto,Helvetica,Arial;color:#111;outline-offset:3px;"
>${esc(t.title)}</button>`).join("");

  const panels=safe.map((t,i)=>`<div role="tabpanel" id="t-${i}-p" aria-labelledby="t-${i}" hidden
style="padding:14px;border:1px solid #e5e7eb;border-radius:14px;margin-top:10px;font:14px/1.6 system-ui,Segoe UI,Roboto,Helvetica,Arial;color:#111;background:#fff;"
>${t.content}</div>`).join("");

  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tabs</title>
<body style="margin:20px;background:#0b1220;color:#0a0a0a;font:16px/1.5 system-ui,Segoe UI,Roboto,Helvetica,Arial">
  <h1 style="font:700 20px system-ui;margin:0 0 10px 0;color:#fff">Tabs</h1>
  <div role="tablist" aria-label="Tabs" style="display:flex;flex-wrap:wrap;align-items:center;gap:6px;--accent:${accent}">${btns}</div>
  ${panels}
<script>(function(){
  const qsa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const tabs=qsa('[role="tab"]'), panels=qsa('[role="tabpanel"]');
  function setCookie(n,v,d){const t=new Date;t.setTime(t.getTime()+864e5*d),document.cookie=n+"="+encodeURIComponent(v)+";expires="+t.toUTCString()+";path=/"}
  function getCookie(n){const m=document.cookie.match(new RegExp('(?:^|; )'+n+'=([^;]*)'));return m?decodeURIComponent(m[1]):null}
  function activate(i,f){tabs.forEach((t,idx)=>{const s=idx===i;t.setAttribute("aria-selected",s?"true":"false");t.setAttribute("tabindex",s?"0":"-1");t.style.backgroundColor=s?"var(--accent)":"transparent";t.style.color=s?"white":"#111";document.getElementById(t.id+"-p").hidden=!s}); f&&tabs[i].focus();${remember?'setCookie("last_active_tab_index",String(i),90);':''}}
  let start=0; ${remember?'const sv=Number(getCookie("last_active_tab_index")); if(!Number.isNaN(sv)&&sv>=0&&sv<tabs.length) start=sv;':''}
  activate(start,false);
  tabs.forEach((t,i)=>{t.addEventListener("click",()=>activate(i,false)); t.addEventListener("keydown",e=>{const k=e.key;if(!["ArrowLeft","ArrowRight","Home","End"].includes(k))return;e.preventDefault();let idx=i;if(k==="ArrowLeft")idx=(i-1+tabs.length)%tabs.length;if(k==="ArrowRight")idx=(i+1)%tabs.length;if(k==="Home")idx=0;if(k==="End")idx=tabs.length-1;activate(idx,true);});});
})();</script>
</body></html>`;
}
