import Link from "next/link";
import Image from "next/image";
import Tabs from "./components/tabs";
import Carousel from "./components/carousel";


/**
 * Home: hero + highlights (tabs) + quick links + About Jessica section.
 * - Uses your layout helpers: .section, .grid-cards, .card
 * - Pixel/tech style stays subtle and reserved
 */
export default function Home() {
  return (
    <section className="section">
      {/* Hero */}
      <header className="text-center space-y-3">
        <h1 className="h1">CSE3WA — Code Lab</h1>
        <p className="mx-auto max-w-2xl ">
          A calm, tech-forward Next.js showcase: a tabs generator for Moodle, a tiny game, a todo,
          and a simple blog — accessible, keyboard-friendly, and copy-paste ready.
        </p>
      </header>

      

      {/* Highlights (pretty in-site tabs; generator lives on /tabs) */}
      <div>
        <Tabs
          items={[
            {
              label: "Tabs Generator",
              content: (
                <div className="space-y-2">
                  <p>
                    Create <strong>copy-paste</strong> HTML + JS (inline CSS only) for Moodle blocks.
                  </p>
                  <Link
                    href="/tabs"
                    className="btn hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
                  >
                    Open Generator →
                  </Link>
                </div>
              ),
            },
            {
              label: "Game",
              content: (
                <div className="space-y-2">
                  <p>Classic Tic-Tac-Toe with a crisp, pixel-styled UI.</p>
                  <Link
                    href="/play"
                    className="btn hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
                  >
                    Play Now →
                  </Link>
                </div>
              ),
            },
            {
              label: "Todo",
              content: (
                <div className="space-y-2">
                  <p>Quick local tasks, no backend, keyboard-friendly.</p>
                  <Link
                    href="/todo"
                    className="btn hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
                  >
                    Open Todo →
                  </Link>
                </div>
              ),
            },
            {
              label: "Blog",
              content: (
                <div className="space-y-2">
                  <p>Write, search, and read posts entirely in the browser.</p>
                  <Link
                    href="/blog"
                    className="btn hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
                  >
                    Open Blog →
                  </Link>
                </div>
              ),
            },
          ]}
        />
      </div>

            {/* About Jessica (integrated on Home) */}
            <section aria-labelledby="about-jess" className="space-y-4">
        <h2 id="about-jess" className="h2">About Jessica Bull</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile / photo card */}
          <div className="border card rounded-none dark:border-slate-700">
            {/* Optional photo: place /public/jessica.jpg to use this Image.
                If you don’t have one yet, the fallback initials block will show. */}
            <div className="flex items-center gap-4">
              {/* If you add /public/jessica.jpg, uncomment the Image below and remove the fallback div. */}
              {/* 
              <Image
                src="/jessica.jpg"
                alt="Portrait of Jessica Bull"
                width={88} height={88}
                className="border dark:border-slate-700"
                priority
              /> 
              */}
              <div
                aria-hidden
                className="flex h-20 w-20 items-center justify-center border text-xl font-bold dark:border-slate-700"
                title="Upload /public/jessica.jpg to replace this."
              >
                JB
              </div>

              <div>
                <p className="text-sm ">Student • CSE3WA</p>
                <p className="font-semibold">Jessica Bull</p>
                <p className="text-sm ">Student # 20963232</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed">
              Hi! I’m Jessica — I enjoy building clean, accessible UIs and tiny games
              that double as learning tools. This site demonstrates a Moodle-ready tabs
              generator and some small feature pages built with Next.js + TypeScript.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {["Next.js", "TypeScript", "Accessibility", "UI Patterns"].map((tag) => (
                <span key={tag} className="text-xs border px-2 py-1 rounded-none dark:border-slate-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Fun facts card */}
          <div className="border card rounded-none dark:border-slate-700">
            <h3 className="font-semibold">Fun facts</h3>
            <ul className="mt-2 list-disc pl-5 text-sm space-y-1 ">
              <li>Can navigate a keyboard-only UI faster than a mouse 🧭</li>
              <li>Believes “copy-paste-able” is a valid UX requirement</li>
              <li>Likes small, composable components over giant frameworks</li>
              <li>Enjoys pixel art & retro UI, but keeps it accessible</li>
            </ul>
          </div>

          {/* Now / Next card */}
          <div className="border card rounded-none dark:border-slate-700">
            <h3 className="font-semibold">Now / Next</h3>
            <div className="mt-2 grid grid-cols-1 gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide ">Now</p>
                <p className="text-sm">
                  Finalizing the Tabs generator (inline CSS/JS), and polishing spacing/layout.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide ">Next</p>
                <p className="text-sm">
                  Add a “Components Lab” page (accordion, modal, tooltip, etc.) and,
                  later, generators for those components in the same Moodle-ready style.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/tabs" className="btn hover:bg-slate-100/70 dark:hover:bg-slate-800/70">Open Tabs Generator</Link>
              <Link href="/about" className="btn hover:bg-slate-100/70 dark:hover:bg-slate-800/70">More About</Link>
            </div>
          </div>
        </div>
      </section>

      <Carousel
  label="Site highlights"
  items={[
    {
      title: "Moodle Tabs Generator",
      body: "Produce a single-file HTML + JS (inline CSS) Tabs block you can paste into Moodle or save as Hello.html.",
      href: "/tabs",
      cta: "Open Generator",
    },
    {
      title: "Play — Tic-Tac-Toe",
      body: "A tiny, crisp mini-game that doubles as a React state walkthrough.",
      href: "/play",
      cta: "Play Now",
    },
    {
      title: "Todo",
      body: "Quick, local tasks stored in your browser. Keyboard-friendly and simple.",
      href: "/todo",
      cta: "Open Todo",
    },
    {
      title: "Blog",
      body: "Create, search, and read posts — all client-side.",
      href: "/blog",
      cta: "Open Blog",
    },
    {
      title: "Project Pages",
      body: "Escape Room, Coding Races, and Court Room pages are ready as placeholders for later parts.",
      href: "/escape-room",
      cta: "See Project Pages",
    },
  ]}
/>


      {/* Quick links */}
      <div className="grid-cards grid-1-2-3">
        {[
          { href: "/tabs", title: "Moodle Tabs", desc: "Inline CSS output — copy & paste." },
          { href: "/play", title: "Play", desc: "Tic-Tac-Toe mini-game." },
          { href: "/todo", title: "Todo", desc: "Simple, local, fast." },
          { href: "/blog", title: "Blog", desc: "Create & read posts." },
          { href: "/escape-room", title: "Escape Room", desc: "Project page (placeholder)." },
          { href: "/coding-races", title: "Coding Races", desc: "Project page (placeholder)." },
          { href: "/court-room", title: "Court Room", desc: "Project page (placeholder)." },
          { href: "/about", title: "About", desc: "Your details, video, references." },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="border card rounded-none hover:translate-y-[-2px] transition will-change-transform dark:border-slate-700"
            aria-label={`${c.title} (open)`}
          >
            <h2 className="text-lg md:text-xl font-semibold">{c.title}</h2>
            <p className="mt-1 text-sm ">{c.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
