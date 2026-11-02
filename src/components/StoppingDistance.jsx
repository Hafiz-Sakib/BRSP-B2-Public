import { useState } from 'react';
import { bnNum } from '../utils/bn.js';

const G = 9.81;
const REACTION_S = 1.5; // গড় প্রতিক্রিয়া সময় (সেকেন্ড)
const ROADS = [
  { id: 'dry', label: 'শুকনো রাস্তা', mu: 0.7 },
  { id: 'wet', label: 'ভেজা রাস্তা', mu: 0.4 },
];
const MAX_TOTAL = (() => {
  const v = 100 / 3.6;
  return v * REACTION_S + (v * v) / (2 * 0.4 * G);
})();

const fmt = (m) => bnNum(Math.round(m));

// থামার দূরত্ব সিমুলেটর — গতি ও রাস্তার অবস্থা বদলে দেখুন
export default function StoppingDistance() {
  const [speed, setSpeed] = useState(60);
  const [road, setRoad] = useState('dry');
  const mu = ROADS.find((r) => r.id === road).mu;

  const v = speed / 3.6;
  const reaction = v * REACTION_S;
  const braking = (v * v) / (2 * mu * G);
  const total = reaction + braking;
  const pct = (m) => `${Math.min(100, (m / MAX_TOTAL) * 100)}%`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-800">থামতে কত দূরত্ব লাগে?</h3>
      <p className="mt-1 text-sm text-slate-600 leading-relaxed">গতি বাড়ালে থামার দূরত্ব কত দ্রুত বাড়ে, নিজেই দেখুন।</p>

      <div className="mt-4">
        <label htmlFor="speed" className="flex items-baseline justify-between text-sm font-semibold text-slate-700">
          <span>গতি</span>
          <span className="text-2xl font-bold text-brsp-green tabular-nums">{bnNum(speed)} <span className="text-sm">কিমি/ঘণ্টা</span></span>
        </label>
        <input
          id="speed"
          type="range"
          min="20"
          max="100"
          step="5"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="mt-2 w-full accent-[#00694d] h-8"
        />
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2" role="group" aria-label="রাস্তার অবস্থা">
        {ROADS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRoad(r.id)}
            aria-pressed={road === r.id}
            className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
              road === r.id ? 'border-brsp-ink bg-brsp-green text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* দূরত্বের বার */}
      <div className="mt-5" aria-hidden="true">
        <div className="h-9 rounded-lg bg-slate-700 relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 flex transition-all duration-500 ease-out" style={{ width: pct(total) }}>
            <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${(reaction / total) * 100}%` }} />
            <div className="bg-brsp-red h-full flex-1" />
          </div>
        </div>
        <p className="mt-1 text-[11px] text-slate-400">বারের পূর্ণ দৈর্ঘ্য = ১০০ কিমি/ঘণ্টায় ভেজা রাস্তায় থামার দূরত্ব</p>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-2">
          <dt className="text-xs font-semibold text-slate-600">প্রতিক্রিয়া</dt>
          <dd className="font-bold text-slate-800 tabular-nums">{fmt(reaction)} মি.</dd>
        </div>
        <div className="rounded-xl bg-red-50 border border-red-200 p-2">
          <dt className="text-xs font-semibold text-slate-600">ব্রেকিং</dt>
          <dd className="font-bold text-slate-800 tabular-nums">{fmt(braking)} মি.</dd>
        </div>
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2">
          <dt className="text-xs font-semibold text-slate-600">মোট</dt>
          <dd className="font-bold text-brsp-green tabular-nums" aria-live="polite">{fmt(total)} মি.</dd>
        </div>
      </dl>

      <p className="mt-auto pt-4 text-xs text-slate-500 leading-relaxed">
        হলুদ = বিপদ দেখে ব্রেক চাপার আগের দূরত্ব, লাল = ব্রেক চাপার পর থামা পর্যন্ত। এটি আনুমানিক হিসাব (প্রতিক্রিয়া সময় ১.৫ সেকেন্ড ধরে); বাস্তবে গাড়ি, টায়ার, রাস্তা ও চালকের অবস্থায় ভিন্ন হতে পারে।
      </p>
    </div>
  );
}
