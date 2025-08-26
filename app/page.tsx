import Link from "next/link";
import Tabs from "./components/tabs";

/* Hero is minimal markup; neon vibe comes from CSS utilities. */
export default function Home() {
  return (
    <section className="space-y-8">
      <header className="text-center">
        <h1 className="glitch text-4xl font-extrabold" data-text="NEON / HACK / LAB">
          NEON / HACK / LAB
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-cyan-100/80">
          A cyber-styled Next.js showcase: slick tabs, a tiny game, a todo, a blog, and a Moodle-ready tabs generator.
        </p>
      </header>

      {/* Pretty in-site tabs for highlights */}
      <Tabs
        items={[
          {
            label: "Tabs Generator",
            content: (
              <div>
                <p>Create <strong>copy-paste</strong> HTML + JS (inline CSS only) for Moodle.</p>
                <Link href="/tabs" className="mt-2 inline-block rounded-xl border border-cyan-400/50 bg-cyan-500/10 px-3 py-2 text-sm">
                  Open Generator →
                </Link>
              </div>
            ),
          },
          {
            label: "Game",
            content: (
              <div>
                <p>Classic Tic-Tac-Toe with neon styling.</p>
                <Link href="/play" className="mt-2 inline-block rounded-xl border border-violet-400/50 bg-violet-500/10 px-3 py-2 text-sm">
                  Play Now →
                </Link>
              </div>
            ),
          },
          {
            label: "Todo",
            content: (
              <div>
                <p>Quick tasks stored locally (no backend).</p>
                <Link href="/todo" className="mt-2 inline-block rounded-xl border border-emerald-400/50 bg-emerald-500/10 px-3 py-2 text-sm">
                  Open Todo →
                </Link>
              </div>
            ),
          },
          {
            label: "Blog",
            content: (
              <div>
                <p>Write posts, search, and read — all in the browser.</p>
                <Link href="/blog" className="mt-2 inline-block rounded-xl border border-pink-400/50 bg-pink-500/10 px-3 py-2 text-sm">
                  Open Blog →
                </Link>
              </div>
            ),
          },
        ]}
      />

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/tabs", title: "Moodle Tabs", desc: "Inline CSS output — copy & paste." },
          { href: "/play", title: "Play", desc: "Neon Tic-Tac-Toe." },
          { href: "/todo", title: "Todo", desc: "Simple, local, fast." },
          { href: "/blog", title: "Blog", desc: "Create & read posts." },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-2xl border border-white/10 bg-[var(--card)] p-4 shadow-[0_0_30px_rgba(167,139,250,.15)] transition hover:shadow-[0_0_40px_rgba(34,211,238,.35)]"
          >
            <h2 className="text-lg font-semibold">{c.title}</h2>
            <p className="mt-1 text-sm text-cyan-100/80">{c.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
