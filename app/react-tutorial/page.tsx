"use client";
import { useState } from "react";

/** Tic-Tac-Toe (adapted from react.dev tutorial) — simple practice feature page. */
function Square({ value, onClick }: { value: string | null; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-16 w-16 rounded-xl border text-2xl font-semibold dark:border-neutral-800"
      aria-label={value ? `Square ${value}` : "Empty square"}
    >
      {value}
    </button>
  );
}

function calculateWinner(s: (string | null)[]) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  for (const [a,b,c] of lines) if (s[a] && s[a] === s[b] && s[a] === s[c]) return s[a];
  return null;
}

export default function ReactTutorialPage() {
  const [history, setHistory] = useState<(string | null)[][]>([Array(9).fill(null)]);
  const [xIsNext, setXIsNext] = useState(true);
  const [step, setStep] = useState(0);

  const squares = history[step];
  const winner = calculateWinner(squares);
  const status = winner ? `Winner: ${winner}` : squares.every(Boolean) ? "Draw" : `Next player: ${xIsNext ? "X" : "O"}`;

  function handleClick(i: number) {
    if (squares[i] || winner) return;
    const next = squares.slice();
    next[i] = xIsNext ? "X" : "O";
    const nextHistory = history.slice(0, step + 1).concat([next]);
    setHistory(nextHistory);
    setStep(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">React Tutorial — Tic-Tac-Toe</h1>
      <div className="grid grid-cols-3 gap-2">
        {squares.map((v, i) => <Square key={i} value={v} onClick={() => handleClick(i)} />)}
      </div>
      <p className="font-medium">{status}</p>
      <ol className="space-y-1">
        {history.map((_, move) => (
          <li key={move}>
            <button
              onClick={() => setStep(move)}
              className="rounded-lg border px-2 py-1 text-sm hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800"
            >
              {move === 0 ? "Go to game start" : `Go to move #${move}`}
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
