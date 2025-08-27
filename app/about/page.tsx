/* Short "how to use" + video (placeholder) */
const NAME = "Jessica Bull";
const STUDENT = process.env.NEXT_PUBLIC_STUDENT_NUMBER || "20963232";
const SUBJECT = "CSE3WA";

export default function About(){
  return (
    <article className="prose prose-invert max-w-none">
      <h1>About</h1>
      <ul>
        <li><strong>Name:</strong> {NAME}</li>
        <li><strong>Student #:</strong> {STUDENT}</li>
        <li><strong>Subject:</strong> {SUBJECT}</li>
      </ul>
      <br></br>
      <h2>How to use</h2>
      <ol>
        <li>Open <strong>Tabs Generator</strong>.</li>
        <li>Configure panels, then <strong>Copy</strong> (or <strong>Download</strong>).</li>
        <li>Paste into a blank <code>Hello.html</code> or Moodle HTML block.</li>
      </ol>

      <h2>Video (placeholder)</h2>
      <br></br>
      <div className="rounded-2xl border border-white/10">
        <iframe
          title="How to use this website"
          width="100%" height="420"
          src="https://www.youtube.com/embed"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </article>
  );
}
