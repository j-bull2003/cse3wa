/* Neon glass footer with date. */
const NAME = "Jessica Bull";
const STUDENT = process.env.NEXT_PUBLIC_STUDENT_NUMBER || "20963232";

export default function Footer() {
  const year = new Date().getFullYear();
  const today = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  return (
    <footer className="mt-16 border-t border-white/10 bg-black/40">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-cyan-100/80">
        <p>© {year} {NAME} • {STUDENT} • {today}</p>
        <p className="mt-1">Neon grid • A11y-first • Cookie remembers menu</p>
      </div>
    </footer>
  );
}
