"use client";
import { useState } from "react";

/* Neon-styled Tic-Tac-Toe (a11y: clear labels). */
function Square({ value, onClick }: { value: string | null; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-16 w-16 rounded-xl border border-cyan-400/50 text-2xl font-semibold text-cyan-100 hover:bg-cyan-500/10"
      aria-label={value ? `Square ${value}` : "Empty square"}
    >
      {value}
    </button>
  );
}
const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const win = (s:(string|null)[]) => lines.find(([a,b,c]) => s[a] && s[a]===s[b] && s[a]===s[c]) ? s[lines.find(([a,b,c]) => s[a] && s[a]===s[b] && s[a]===s[c])![0]] : null;

export default function Play() {
  const [history, setHistory] = useState<(string|null)[][]>([Array(9).fill(null)]);
  const [x, setX] = useState(true);
  const [step, setStep] = useState(0);
  const s = history[step];
  const w = win(s);
  const status = w ? `Winner: ${w}` : s.every(Boolean) ? "Draw" : `Next: ${x ? "X" : "O"}`;

  function click(i:number){
    if (s[i] || w) return;
    const next = s.slice(); next[i] = x ? "X" : "O";
    const nextHist = history.slice(0, step+1).concat([next]);
    setHistory(nextHist); setStep(nextHist.length-1); setX(!x);
  }

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">Tic-Tac-Toe</h1>
      <div className="grid grid-cols-3 gap-2">
        {s.map((v,i)=><Square key={i} value={v} onClick={()=>click(i)} />)}
      </div>
      <p className="font-medium">{status}</p>
      <ol className="space-y-1">
        {history.map((_, move)=>(
          <li key={move}>
            <button
              onClick={()=>setStep(move)}
              className="rounded-lg border border-white/20 px-2 py-1 text-sm hover:bg-white/5"
            >
              {move===0 ? "Go to start" : `Go to move #${move}`}
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
