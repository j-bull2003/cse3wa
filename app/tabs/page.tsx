"use client";
import { useEffect, useMemo, useState } from "react";

/* ---------- Types & constants ---------- */
type Tab = { title: string; content: string };
const MAX_TABS = 15;
const LS_KEY = "tabs_generator_state_v1";

/* ---------- Page component ---------- */
export default function TabsGenerator() {
  /* Editable state (persisted) */
  const [tabs, setTabs] = useState<Tab[]>([
    { title: "Overview", content: "Welcome to the unit." },
    { title: "Resources", content: "Links and readings." },
    { title: "Assessments", content: "All due dates here." },
  ]);
  const [accent, setAccent] = useState("#64748b"); // calm default
  const [remember, setRemember] = useState(true);  // cookie remember active tab
  const [status, setStatus] = useState<string>("");


  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { tabs?: Tab[]; accent?: string; remember?: boolean };
      if (saved.tabs?.length) setTabs(saved.tabs.slice(0, MAX_TABS));
      if (typeof saved.accent === "string") setAccent(saved.accent);
      if (typeof saved.remember === "boolean") setRemember(saved.remember);
    } catch { /* ignore corrupt state */ }
  }, []);

  /* Save to localStorage on change */
  useEffect(() => {
    const payload = JSON.stringify({ tabs, accent, remember });
    localStorage.setItem(LS_KEY, payload);
  }, [tabs, accent, remember]);

  /* Build single-file HTML output (inline styles only; no classes) */
  const html = useMemo(() => build(tabs, { accent, remember }), [tabs, accent, remember]);

  /* Mutators */
  const update = (i: number, p: Partial<Tab>) =>
    setTabs(prev => prev.map((t, idx) => (idx === i ? { ...t, ...p } : t)));
  const add = () =>
    setTabs(prev =>
      prev.length >= MAX_TABS ? prev : [...prev, { title: `Tab ${prev.length + 1}`, content: "Edit me." }]
    );
  const remove = (i: number) => setTabs(prev => prev.filter((_, idx) => idx !== i));

  /* Quick presets (for your video: 1 / 3 / 5 tabs) */
  const setCount = (n: number) =>
    setTabs(Array.from({ length: Math.min(Math.max(n, 1), MAX_TABS) }, (_, i) => ({
      title: `Tab ${i + 1}`,
      content: `This is content for Tab ${i + 1}.`,
    })));

  /* Examples bundle (optional) */
  function loadAllExamples() { setTabs(buildAllExamples(accent).slice(0, MAX_TABS)); }
  function resetStarter() {
    setTabs([
      { title: "Overview", content: "Welcome to the unit." },
      { title: "Resources", content: "Links and readings." },
      { title: "Assessments", content: "All due dates here." },
    ]);
  }

  /* Output helpers */
  async function copyOut() {
    await navigator.clipboard.writeText(html);
    setStatus("Copied! Paste into Hello.html or a Moodle HTML block.");
    setTimeout(() => setStatus(""), 2000);
  }
  function download() {
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Hello.html";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /* Previews for 1/3/5 tabs (for the “video demonstrates” requirement) */
  const html1 = useMemo(() => build(preset(1), { accent, remember }), [accent, remember]);
  const html3 = useMemo(() => build(preset(3), { accent, remember }), [accent, remember]);
  const html5 = useMemo(() => build(preset(5), { accent, remember }), [accent, remember]);

  return (
    <section className="section">
      <h1 className="h1">Tabs Generator — Moodle (inline CSS)</h1>
      <p className="text-slate-400">
        Up to 15 tabs. Editable titles & content. State stored in <code>localStorage</code>.
        Output is <strong>single-file</strong> HTML with inline CSS + vanilla JS.
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ---------- Left: Config & Editors ---------- */}
        <div className="space-y-4 border card rounded-none dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="h2">Configure</h2>
            <span className="text-xs text-slate-400">{tabs.length}/{MAX_TABS} tabs</span>
          </div>

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
            Remember last active tab (cookie)
          </label>

          {/* Presets to satisfy the “video shows 1/3/5 outputs” */}
          <fieldset className="border p-3 rounded-none dark:border-slate-700">
            <legend className="px-1 text-sm font-semibold">Quick presets</legend>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setCount(1)} className="btn hover:bg-slate-100/70 dark:hover:bg-slate-800/70">1 tab</button>
              <button type="button" onClick={() => setCount(3)} className="btn hover:bg-slate-100/70 dark:hover:bg-slate-800/70">3 tabs</button>
              <button type="button" onClick={() => setCount(5)} className="btn hover:bg-slate-100/70 dark:hover:bg-slate-800/70">5 tabs</button>
              <button type="button" onClick={loadAllExamples} className="btn hover:bg-slate-100/70 dark:hover:bg-slate-800/70">Load ALL Examples</button>
              <button type="button" onClick={resetStarter} className="btn hover:bg-slate-100/70 dark:hover:bg-slate-800/70">Reset Starter</button>
              <button
                type="button"
                onClick={add}
                disabled={tabs.length >= MAX_TABS}
                className="btn hover:bg-slate-100/70 dark:hover:bg-slate-800/70 disabled:opacity-50"
              >
                + Add Tab
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Use + to add up to {MAX_TABS}. Remove tabs with the (–) button on each editor.
            </p>
          </fieldset>

          {/* Editors */}
          <div className="space-y-3">
            {tabs.map((t, i) => (
              <fieldset key={i} className="border p-3 rounded-none dark:border-slate-700">
                <legend className="px-1 text-sm font-semibold">Tab {i + 1}</legend>

                <label className="block text-sm">
                  Title
                  <input
                    value={t.title}
                    onChange={(e) => update(i, { title: e.target.value })}
                    className="mt-1 field bg-black/40"
                  />
                </label>

                <label className="mt-2 block text-sm">
                  Content (HTML allowed)
                  <textarea
                    value={t.content}
                    onChange={(e) => update(i, { content: e.target.value })}
                    rows={5}
                    className="mt-1 field bg-black/40"
                  />
                </label>

                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="btn hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
                  >
                    – Remove
                  </button>
                </div>
              </fieldset>
            ))}
          </div>
        </div>

        {/* ---------- Right: Output & Preview ---------- */}
        <div className="space-y-3 border card rounded-none dark:border-slate-700">
          <h2 className="h2">Output (copy or download)</h2>

          <div className="flex flex-wrap items-center gap-2">
            <button onClick={copyOut} className="btn hover:bg-slate-100/70 dark:hover:bg-slate-800/70">Copy HTML</button>
            <button onClick={download} className="btn hover:bg-slate-100/70 dark:hover:bg-slate-800/70">Download Hello.html</button>
            <span aria-live="polite" className="text-xs text-emerald-400">{status}</span>
            <details className="ml-auto">
              <summary className="btn">Preview current</summary>
              <iframe title="Tabs preview" className="mt-2 h-[460px] w-full border" srcDoc={html} />
            </details>
          </div>

          <textarea
            readOnly
            value={html}
            rows={26}
            className="h-[560px] w-full border bg-black/60 p-3 font-mono text-xs"
            aria-label="Generated HTML output"
          />

          {/* Extra: show the 1/3/5 outputs simultaneously for your recording */}
          <details>
            <summary className="btn">Show 1 / 3 / 5 tab previews</summary>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <iframe title="1-tab preview" className="h-[320px] w-full border" srcDoc={html1} />
              <iframe title="3-tab preview" className="h-[320px] w-full border" srcDoc={html3} />
              <iframe title="5-tab preview" className="h-[320px] w-full border" srcDoc={html5} />
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}

/* ---------- Helpers ---------- */

/* Escape < > & before injecting user text into HTML string */
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* Return simple N-tab preset for previews/video */
function preset(n: number): Tab[] {
  const count = Math.min(Math.max(n, 1), MAX_TABS);
  return Array.from({ length: count }, (_, i) => ({
    title: `Tab ${i + 1}`,
    content: `This is content for Tab ${i + 1}.`,
  }));
}

/* Build a COMPLETE single-file HTML (inline styles only, no CSS classes) */
function build(tabs: Tab[], opts: { accent: string; remember: boolean }) {
  const accent = opts.accent || "#64748b";
  const remember = !!opts.remember;
  const safe = tabs.length ? tabs.slice(0, MAX_TABS) : [{ title: "Tab 1", content: "Edit me." }];

  const btns = safe
    .map(
      (t, i) => `<button type="button" role="tab" id="t-${i}" aria-controls="t-${i}-p" aria-selected="false" tabindex="-1"
style="border:1px solid #334155;background:rgba(148,163,184,0.12);padding:10px 14px;margin:0 6px;border-radius:12px;cursor:pointer;font:600 14px system-ui,Segoe UI,Roboto,Helvetica,Arial;color:#e5e7eb;outline-offset:3px;">${esc(t.title)}</button>`
    )
    .join("");

  const panels = safe
    .map(
      (t, i) => `<div role="tabpanel" id="t-${i}-p" aria-labelledby="t-${i}" hidden
style="padding:14px;border:1px solid #e5e7eb;border-radius:14px;margin-top:10px;font:14px/1.6 system-ui,Segoe UI,Roboto,Helvetica,Arial;color:#111;background:#fff;">${t.content}</div>`
    )
    .join("");

  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tabs</title>
<body style="margin:20px;background:#0e1116;color:#e5e7eb;font:16px/1.5 system-ui,Segoe UI,Roboto,Helvetica,Arial">
  <h1 style="font:700 20px system-ui;margin:0 0 10px 0;color:#e5e7eb">Tabs</h1>
  <div role="tablist" aria-label="Tabs" style="display:flex;flex-wrap:wrap;align-items:center;gap:6px;--accent:${accent}">
    ${btns}
  </div>
  ${panels}
<script>(function(){
  // Query helpers
  function qsa(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
  // Simple cookie utils
  function setCookie(n,v,d){var t=new Date;t.setTime(t.getTime()+864e5*d);document.cookie=n+'='+encodeURIComponent(v)+';expires='+t.toUTCString()+';path=/'}
  function getCookie(n){var m=document.cookie.match(new RegExp('(?:^|; )'+n+'=([^;]*)'));return m?decodeURIComponent(m[1]):null}

  var tabs=qsa('[role="tab"]'), panels=qsa('[role="tabpanel"]');

  // Visual state for a tab button (selected vs not)
  function styleTab(el, selected){
    if(selected){
      el.style.backgroundColor='var(--accent)';
      el.style.color='#ffffff';
      el.style.borderColor='var(--accent)';
    }else{
      el.style.backgroundColor='rgba(148,163,184,0.12)';
      el.style.color='#e5e7eb';
      el.style.borderColor='#334155';
    }
  }

  // Activate a tab by index
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

  // Initial selection (optionally from cookie)
  var start=0;
  ${remember ? "var sv=Number(getCookie('last_active_tab_index')); if(!isNaN(sv)&&sv>=0&&sv<tabs.length) start=sv;" : ""}
  activate(start,false);

  // Mouse + keyboard bindings
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

/* ---------- Example preset (optional showcase content) ---------- */
function buildAllExamples(accent: string): Tab[] {
  const slate = "#e5e7eb";
  return [
    {
      title: "Accordion",
      content: `
<div>
  <button onclick="this.nextElementSibling.hidden=!this.nextElementSibling.hidden" style="display:block;width:100%;text-align:left;padding:10px 12px;margin:6px 0;border:1px solid ${slate};border-radius:10px;background:#f8fafc;cursor:pointer;font-weight:600">Section A</button>
  <div hidden style="padding:10px;border:1px solid ${slate};border-radius:10px">Accordion panel A content.</div>

  <button onclick="this.nextElementSibling.hidden=!this.nextElementSibling.hidden" style="display:block;width:100%;text-align:left;padding:10px 12px;margin:6px 0;border:1px solid ${slate};border-radius:10px;background:#f8fafc;cursor:pointer;font-weight:600">Section B</button>
  <div hidden style="padding:10px;border:1px solid ${slate};border-radius:10px">Accordion panel B content.</div>
</div>`
    },
    {
      title: "Modal / Popup",
      content: `
<div id="m1" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);padding:20px">
  <div role="dialog" aria-modal="true" aria-labelledby="m1t" tabindex="-1"
       style="max-width:520px;margin:40px auto;background:#fff;border:1px solid ${slate};border-radius:12px;padding:16px">
    <h3 id="m1t" style="margin:0 0 8px 0;font:600 16px system-ui">Modal Title</h3>
    <p>Simple modal with focusable content.</p>
    <button onclick="this.closest('#m1').style.display='none'" style="padding:8px 10px;border:1px solid ${slate};border-radius:8px;background:#f8fafc;cursor:pointer">Close</button>
  </div>
</div>
<button onclick="document.getElementById('m1').style.display='block'" style="padding:8px 10px;border:1px solid ${slate};border-radius:8px;background:#fff;cursor:pointer">Open Modal</button>`
    },
    {
      title: "Dropdown",
      content: `
<div style="position:relative;display:inline-block">
  <button onclick="var m=this.nextElementSibling;m.hidden=!m.hidden" aria-haspopup="menu" aria-expanded="false"
          style="padding:8px 10px;border:1px solid ${slate};border-radius:8px;background:#fff;cursor:pointer">Menu ▾</button>
  <div hidden role="menu" style="position:absolute;top:100%;left:0;margin-top:6px;min-width:200px;background:#fff;border:1px solid ${slate};border-radius:10px;padding:6px">
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
  <button onfocus="this.nextElementSibling.hidden=false" onblur="this.nextElementSibling.hidden=true"
          onmouseover="this.nextElementSibling.hidden=false" onmouseout="this.nextElementSibling.hidden=true"
          style="padding:8px 10px;border:1px solid ${slate};border-radius:8px;background:#fff;cursor:pointer">Hover or focus me</button>
  <span hidden role="tooltip"
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
<div id="lb" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.75);padding:20px">
  <div role="dialog" aria-modal="true" aria-label="Image lightbox" tabindex="-1"
       style="max-width:720px;margin:40px auto;background:#000;border:1px solid ${slate};border-radius:12px;padding:10px;text-align:center">
    <div style="width:100%;height:360px;background:linear-gradient(135deg,#e2e8f0,#94a3b8);border-radius:8px"></div>
    <button onclick="document.getElementById('lb').style.display='none'"
            style="margin-top:10px;padding:8px 10px;border:1px solid ${slate};border-radius:8px;background:#fff;cursor:pointer">Close</button>
  </div>
</div>
<div style="width:220px;height:120px;background:linear-gradient(135deg,#e2e8f0,#94a3b8);border:1px solid ${slate};border-radius:10px;cursor:pointer"
     onclick="document.getElementById('lb').style.display='block'" aria-label="Open image lightbox"></div>`
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
