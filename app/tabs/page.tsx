"use client";
import { useEffect, useMemo, useState } from "react";

/* Generates a COMPLETE HTML doc with inline CSS only + vanilla JS. */
type Tab = { title: string; content: string };

export default function TabsGenerator() {
  const [tabs, setTabs] = useState<Tab[]>([
    { title: "Overview", content: "Welcome to the unit." },
    { title: "Resources", content: "Links and readings." },
    { title: "Assessments", content: "All due dates here." },
  ]);
  const [accent, setAccent] = useState("#64748b"); // calm default
  const [remember, setRemember] = useState(true);

  // Persist "remember active tab" preference (cookie)
  useEffect(() => {
    const v = document.cookie.match(/builder_tabs_remember=([^;]+)/)?.[1];
    if (v) setRemember(v === "1");
  }, []);
  useEffect(() => {
    document.cookie = `builder_tabs_remember=${remember ? "1" : "0"};path=/;max-age=${60 * 60 * 24 * 90}`;
  }, [remember]);

  const html = useMemo(() => build(tabs, { accent, remember }), [tabs, accent, remember]);

  const update = (i: number, p: Partial<Tab>) =>
    setTabs((prev) => prev.map((t, idx) => (idx === i ? { ...t, ...p } : t)));
  const add = () => setTabs((p) => [...p, { title: `Tab ${p.length + 1}`, content: "Edit me." }]);
  const remove = (i: number) => setTabs((p) => p.filter((_, idx) => idx !== i));

  function loadAllExamples() { setTabs(buildAllExamples(accent)); }
  function resetStarter() {
    setTabs([
      { title: "Overview", content: "Welcome to the unit." },
      { title: "Resources", content: "Links and readings." },
      { title: "Assessments", content: "All due dates here." },
    ]);
  }

  async function copyOut() {
    await navigator.clipboard.writeText(html);
    alert("Copied! Paste into Hello.html or a Moodle HTML block.");
  }
  function download() {
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Hello.html";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <section className="section">
      <h1 className="h1">Tabs Generator — Moodle (inline CSS)</h1>
      <p className="">No classes. One file. Keyboard a11y. Cookie to remember selected tab.</p>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Config */}
        <div className="space-y-4 border card rounded-none dark:border-slate-700">
          <h2 className="h2">Configure</h2>

          <label className="block text-sm font-medium">
            Accent colour
            <input
              type="color"
              className="ml-2 h-8 w-12 align-middle"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              aria-label="Accent colour"
            />
          </label>

          <label className="mt-2 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Remember the active tab (cookie)
          </label>

          <fieldset className="border p-3 rounded-none dark:border-slate-700">
            <legend className="px-1 text-sm font-semibold">Examples</legend>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={loadAllExamples} className="btn hover:bg-slate-100/70 dark:hover:bg-slate-800/70">
                Load ALL Examples
              </button>
              <button type="button" onClick={resetStarter} className="btn hover:bg-slate-100/70 dark:hover:bg-slate-800/70">
                Reset Starter
              </button>
              <button type="button" onClick={add} className="btn hover:bg-slate-100/70 dark:hover:bg-slate-800/70">
                + Add Tab
              </button>
            </div>
            <p className="mt-2 text-xs ">
              Loads Accordion, Modal, Dropdown, Tooltip, Progress, Range, Date, Alerts, Lightbox, Canvas, Rotation, Mermaid.
            </p>
          </fieldset>

          {/* Editors */}
          <div className="space-y-3">
            {tabs.map((t, i) => (
              <fieldset key={i} className="border p-3 rounded-none dark:border-slate-700">
                <legend className="px-1 text-sm font-semibold">Tab {i + 1}</legend>
                <label className="block text-sm">
                  Title
                  <input value={t.title} onChange={(e) => update(i, { title: e.target.value })} className="mt-1 field bg-black/40" />
                </label>
                <label className="mt-2 block text-sm">
                  Content (HTML allowed)
                  <textarea value={t.content} onChange={(e) => update(i, { content: e.target.value })} rows={5} className="mt-1 field bg-black/40" />
                </label>
                <div className="mt-2 flex gap-2">
                  <button type="button" onClick={() => remove(i)} className="btn hover:bg-slate-100/70 dark:hover:bg-slate-800/70">
                    Remove
                  </button>
                </div>
              </fieldset>
            ))}
          </div>
        </div>

        {/* Output */}
        <div className="space-y-3 border card rounded-none dark:border-slate-700">
          <h2 className="h2">Output (copy or download)</h2>
          <div className="flex gap-2">
            <button onClick={copyOut} className="btn hover:bg-slate-100/70 dark:hover:bg-slate-800/70">Copy HTML</button>
            <button onClick={download} className="btn hover:bg-slate-100/70 dark:hover:bg-slate-800/70">Download Hello.html</button>
            <details className="ml-auto">
              <summary className="btn">Preview</summary>
              <iframe title="Tabs preview" className="mt-2 h-[460px] w-full border" srcDoc={html} />
            </details>
          </div>
          <textarea readOnly value={html} rows={26} className="h-[560px] w-full border bg-black/60 p-3 font-mono text-xs" />
        </div>
      </div>
    </section>
  );
}

/* Escape < > & when injecting user text into HTML string. */
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* Build a COMPLETE single-file HTML (inline styles only) — fixed colors/contrast */
function build(tabs: Tab[], opts: { accent: string; remember: boolean }) {
    const accent = opts.accent || "#64748b";
    const remember = !!opts.remember;
    const safe = tabs.length ? tabs : [{ title: "Tab 1", content: "Edit me." }];
  
    // High-contrast, visible tab buttons on dark background
    const btns = safe
      .map(
        (t, i) => `<button type="button" role="tab" id="t-${i}" aria-controls="t-${i}-p" aria-selected="false" tabindex="-1"
  style="
    border:1px solid #334155;              /* visible outline */
    background: rgba(148,163,184,0.12);    /* faint slate */
    padding:10px 14px; margin:0 6px; border-radius:12px; cursor:pointer;
    font:600 14px system-ui,Segoe UI,Roboto,Helvetica,Arial;
    color:#e5e7eb;                         /* light text on dark */
    outline-offset:3px;
  ">${esc(t.title)}</button>`
      )
      .join("");
  
    // Panels stay white with dark text (great contrast for form controls, etc.)
    const panels = safe
      .map(
        (t, i) => `<div role="tabpanel" id="t-${i}-p" aria-labelledby="t-${i}" hidden
  style="
    padding:14px; border:1px solid #e5e7eb; border-radius:14px; margin-top:10px;
    font:14px/1.6 system-ui,Segoe UI,Roboto,Helvetica,Arial;
    color:#111; background:#fff;
  ">${t.content}</div>`
      )
      .join("");
  
    return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Tabs</title>
  <body style="
    margin:20px;
    background:#0e1116;        /* dark bg */
    color:#e5e7eb;             /* light default text */
    font:16px/1.5 system-ui,Segoe UI,Roboto,Helvetica,Arial;
  ">
    <h1 style="font:700 20px system-ui; margin:0 0 10px 0; color:#e5e7eb">Tabs</h1>
    <div role="tablist" aria-label="Tabs" style="display:flex; flex-wrap:wrap; align-items:center; gap:6px; --accent:${accent}">
      ${btns}
    </div>
    ${panels}
  <script>(function(){
    // tiny helpers
    function qsa(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
    function setCookie(n,v,d){var t=new Date;t.setTime(t.getTime()+864e5*d);document.cookie=n+'='+encodeURIComponent(v)+';expires='+t.toUTCString()+';path=/'}
    function getCookie(n){var m=document.cookie.match(new RegExp('(?:^|; )'+n+'=([^;]*)'));return m?decodeURIComponent(m[1]):null}
  
    var tabs=qsa('[role="tab"]'), panels=qsa('[role="tabpanel"]');
  
    function styleTab(el, selected){
      if(selected){
        el.style.backgroundColor='var(--accent)';
        el.style.color='#ffffff';
        el.style.borderColor='var(--accent)';
      }else{
        el.style.backgroundColor='rgba(148,163,184,0.12)'; // visible on dark
        el.style.color='#e5e7eb';
        el.style.borderColor='#334155';
      }
    }
  
    function activate(i, focus){
      tabs.forEach(function(t,idx){
        var sel = idx===i;
        t.setAttribute('aria-selected', sel?'true':'false');
        t.setAttribute('tabindex', sel?'0':'-1');
        styleTab(t, sel);
        var p=document.getElementById(t.id+'-p');
        if(p) p.hidden=!sel;
      });
      if(focus) tabs[i].focus();
      ${remember ? "setCookie('last_active_tab_index', String(i), 90);" : ""}
    }
  
    var start=0;
    ${remember ? "var sv=Number(getCookie('last_active_tab_index')); if(!isNaN(sv)&&sv>=0&&sv<tabs.length) start=sv;" : ""}
    activate(start,false);
  
    tabs.forEach(function(t,i){
      t.addEventListener('click', function(){ activate(i,false); });
      t.addEventListener('keydown', function(e){
        var k=e.key; if(['ArrowLeft','ArrowRight','Home','End'].indexOf(k)===-1) return;
        e.preventDefault();
        var idx=i; if(k==='ArrowLeft') idx=(i-1+tabs.length)%tabs.length;
        if(k==='ArrowRight') idx=(i+1)%tabs.length; if(k==='Home') idx=0; if(k==='End') idx=tabs.length-1;
        activate(idx,true);
      });
    });
  })();</script>
  </body></html>`;
  }
  

/* ---------- Example preset using data-* attributes (works with the delegated script) ---------- */
function buildAllExamples(accent: string): Tab[] {
  const slate = "#e5e7eb";
  return [
    {
      title: "Accordion",
      content: `
<div>
  <button data-acc-toggle data-target="acc-a" style="display:block;width:100%;text-align:left;padding:10px 12px;margin:6px 0;border:1px solid ${slate};border-radius:10px;background:#f8fafc;cursor:pointer;font-weight:600">Section A</button>
  <div id="acc-a" hidden style="padding:10px;border:1px solid ${slate};border-radius:10px">Accordion panel A content.</div>

  <button data-acc-toggle data-target="acc-b" style="display:block;width:100%;text-align:left;padding:10px 12px;margin:6px 0;border:1px solid ${slate};border-radius:10px;background:#f8fafc;cursor:pointer;font-weight:600">Section B</button>
  <div id="acc-b" hidden style="padding:10px;border:1px solid ${slate};border-radius:10px">Accordion panel B content.</div>
</div>`
    },
    {
      title: "Modal / Popup",
      content: `
<div id="m1" data-modal style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);padding:20px">
  <div role="dialog" aria-modal="true" aria-labelledby="m1t" tabindex="-1"
       style="max-width:520px;margin:40px auto;background:#fff;border:1px solid ${slate};border-radius:12px;padding:16px">
    <h3 id="m1t" style="margin:0 0 8px 0;font:600 16px system-ui">Modal Title</h3>
    <p>Simple modal with delegated handlers (no inline JS).</p>
    <button data-modal-close style="padding:8px 10px;border:1px solid ${slate};border-radius:8px;background:#f8fafc;cursor:pointer">Close</button>
  </div>
</div>
<button data-modal-open="#m1" style="padding:8px 10px;border:1px solid ${slate};border-radius:8px;background:#fff;cursor:pointer">Open Modal</button>`
    },
    {
      title: "Dropdown",
      content: `
<div style="position:relative;display:inline-block">
  <button data-dd aria-haspopup="menu" aria-expanded="false" aria-controls="dd1"
          style="padding:8px 10px;border:1px solid ${slate};border-radius:8px;background:#fff;cursor:pointer">Menu ▾</button>
  <div id="dd1" hidden role="menu" style="position:absolute;top:100%;left:0;margin-top:6px;min-width:200px;background:#fff;border:1px solid ${slate};border-radius:10px;padding:6px">
    <a href="#" role="menuitem" style="display:block;padding:8px 10px;border-radius:8px;color:#111;text-decoration:none">Item One</a>
    <a href="#" role="menuitem" style="display:block;padding:8px 10px;border-radius:8px;color:#111;text-decoration:none">Item Two</a>
    <a href="#" role="menuitem" style="display:block;padding:8px 10px;border-radius:8px;color:#111;text-decoration:none">Item Three</a>
  </div>
</div>`
    },
    {
      title: "Tooltip",
      content: `
<span style="position:relative;display:inline-block">
  <button data-tip-target="tt1"
          style="padding:8px 10px;border:1px solid ${slate};border-radius:8px;background:#fff;cursor:pointer">Hover or focus me</button>
  <span id="tt1" hidden role="tooltip"
        style="position:absolute;bottom:100%;left:0;margin-bottom:6px;background:#111;color:#fff;padding:6px 8px;border-radius:6px;font:12px/1.2 system-ui">Tooltip text</span>
</span>`
    },
    {
      title: "Progress / Range / Date",
      content: `
<div>
  <div role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="60"
       style="width:100%;height:10px;background:${slate};border-radius:6px;overflow:hidden">
    <div style="width:60%;height:100%;background:${accent};border-radius:6px"></div>
  </div>

  <div style="margin-top:12px">
    <label>Volume
      <input type="range" min="0" max="100" value="40" oninput="this.nextElementSibling.textContent=this.value"
             style="width:100%;margin-left:8px">
      <span style="margin-left:8px">40</span>
    </label>
  </div>

  <div style="margin-top:12px">
    <label>Date:
      <input type="date" style="margin-left:8px;padding:6px;border:1px solid ${slate};border-radius:8px">
    </label>
  </div>
</div>`
    },
    {
      title: "Alerts",
      content: `
<div>
  <div role="status" style="padding:10px;border:1px solid ${slate};border-radius:10px;background:#f1f5f9;margin-bottom:8px">ℹ️ Info: Your profile is up to date.</div>
  <div role="alert"  style="padding:10px;border:1px solid ${slate};border-radius:10px;background:#fee2e2">⚠️ Warning: Submission closes tonight 11:59pm.</div>
</div>`
    },
    {
      title: "Lightbox",
      content: `
<div id="lb" data-lightbox style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.75);padding:20px">
  <div role="dialog" aria-modal="true" aria-label="Image lightbox" tabindex="-1"
       style="max-width:720px;margin:40px auto;background:#000;border:1px solid ${slate};border-radius:12px;padding:10px;text-align:center">
    <div style="width:100%;height:360px;background:linear-gradient(135deg,#e2e8f0,#94a3b8);border-radius:8px"></div>
    <button data-modal-close style="margin-top:10px;padding:8px 10px;border:1px solid ${slate};border-radius:8px;background:#fff;cursor:pointer">Close</button>
  </div>
</div>
<div style="width:220px;height:120px;background:linear-gradient(135deg,#e2e8f0,#94a3b8);border:1px solid ${slate};border-radius:10px;cursor:pointer"
     data-lightbox-open="#lb" aria-label="Open image lightbox"></div>`
    },
    {
      title: "Canvas",
      content: `
<canvas id="cv1" width="320" height="140" style="border:1px solid ${slate};border-radius:10px"></canvas>
<script>(function(){ var c=document.getElementById('cv1'); var x=c.getContext('2d');
x.fillStyle='${accent}'; x.fillRect(10,10,80,80); x.fillStyle='#334155'; x.fillRect(110,10,80,80);
x.fillStyle='#94a3b8'; x.font='16px system-ui'; x.fillText('Canvas demo', 10, 120); })();</script>`
    },
    {
      title: "CSS Rotation",
      content: `
<div id="rot1" style="width:60px;height:60px;border:2px solid #111;margin:10px auto;border-radius:12px"></div>
<script>(function(){ var el=document.getElementById('rot1'); var a=0; function spin(){ a=(a+2)%360; el.style.transform='rotate('+a+'deg)'; requestAnimationFrame(spin);} spin(); })();</script>`
    },
    {
      title: "Mermaid (code)",
      content: `
<p style="margin:0 0 8px 0">If Mermaid is enabled in Moodle, paste this code block:</p>
<pre style="white-space:pre-wrap;padding:10px;border:1px solid ${slate};border-radius:10px;background:#f8fafc">
%% Mermaid
graph TD;
  A[Start] --> B{Decision};
  B -->|Yes| C[Proceed];
  B -->|No| D[Stop];
</pre>`
    },
  ];
}
