import { useState } from 'react';

// চলমান গাড়ির অ্যানিমেশন — সম্পূর্ণ SVG + CSS, স্ক্রিন অনুযায়ী ছোট-বড় হয়
export default function DrivingAnimation() {
  const [running, setRunning] = useState(true);
  const [fast, setFast] = useState(false);

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      <div className={`drive-scene ${running ? '' : 'is-paused'} ${fast ? 'is-fast' : ''}`}>
        <svg viewBox="0 0 800 260" className="block w-full h-auto" role="img" aria-label="রাস্তা দিয়ে চলমান একটি গাড়ির অ্যানিমেশন" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7dd3fc" />
              <stop offset="1" stopColor="#e0f2fe" />
            </linearGradient>
          </defs>
          <rect width="800" height="260" fill="url(#sky)" />
          <circle cx="680" cy="52" r="26" fill="#fde68a" />

          {/* মেঘ */}
          <g className="drive-clouds" fill="#fff" opacity="0.9">
            {[0, 400].map((o) => (
              <g key={o} transform={`translate(${o} 0)`}>
                <ellipse cx="120" cy="50" rx="34" ry="12" />
                <ellipse cx="145" cy="42" rx="22" ry="11" />
                <ellipse cx="330" cy="82" rx="30" ry="10" />
                <ellipse cx="352" cy="75" rx="18" ry="9" />
              </g>
            ))}
          </g>

          {/* দূরের পাহাড় */}
          <path d="M0 150 Q100 100 200 140 T400 135 T600 138 T800 130 V170 H0Z" fill="#86efac" opacity="0.7" />

          {/* পাশের গাছ */}
          <g className="drive-trees">
            {Array.from({ length: 9 }).map((_, i) => (
              <g key={i} transform={`translate(${i * 120 + 40} 0)`}>
                <rect x="-3" y="128" width="6" height="26" fill="#78350f" />
                <circle cx="0" cy="120" r="17" fill="#15803d" />
                <circle cx="-9" cy="128" r="11" fill="#16a34a" />
              </g>
            ))}
          </g>

          {/* ঘাস ও রাস্তা */}
          <rect y="152" width="800" height="14" fill="#4ade80" />
          <rect y="166" width="800" height="94" fill="#334155" />
          <rect y="166" width="800" height="4" fill="#f8fafc" />
          <rect y="256" width="800" height="4" fill="#f8fafc" />
          <g className="drive-dashes" fill="#f8fafc">
            {Array.from({ length: 13 }).map((_, i) => (
              <rect key={i} x={i * 80} y="211" width="44" height="5" rx="2" />
            ))}
          </g>

          {/* গাড়ি */}
          <g className="drive-car" transform="translate(300 142)">
            <ellipse cx="100" cy="102" rx="92" ry="6" fill="#000" opacity="0.25" />
            <path d="M8 84 V66 Q8 56 20 54 L52 50 L76 24 Q80 20 88 20 H132 Q140 20 146 26 L170 50 L190 56 Q200 58 200 68 V84 Z" fill="#c8283a" />
            <path d="M82 28 H128 L148 50 H64 Z" fill="#bae6fd" />
            <path d="M104 28 V50" stroke="#c8283a" strokeWidth="4" />
            <rect x="186" y="62" width="12" height="8" rx="3" fill="#fde047" />
            <rect x="10" y="64" width="8" height="8" rx="2" fill="#fca5a5" />
            <rect x="8" y="80" width="192" height="6" fill="#7f1d1d" />
            {[52, 154].map((cx) => (
              <g key={cx}>
                <circle cx={cx} cy="88" r="18" fill="#0f172a" />
                <g className="drive-wheel">
                  <circle cx={cx} cy="88" r="10" fill="#cbd5e1" />
                  <path d={`M${cx} 79 V97 M${cx - 9} 88 H${cx + 9} M${cx - 6} 82 L${cx + 6} 94 M${cx + 6} 82 L${cx - 6} 94`} stroke="#64748b" strokeWidth="2" />
                </g>
              </g>
            ))}
          </g>
        </svg>
      </div>

      <div className="flex flex-wrap items-center gap-3 p-4 sm:px-6">
        <p className="flex-1 min-w-[12rem] text-sm sm:text-base text-slate-700 leading-relaxed">
          নিরাপদ গতিতে চলুন — সিটবেল্ট বাঁধুন, ট্রাফিক সংকেত মানুন, লেন ঠিক রাখুন।
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRunning((v) => !v)}
            aria-pressed={!running}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            {running ? '⏸ থামান' : '▶ চালান'}
          </button>
          <button
            type="button"
            onClick={() => setFast((v) => !v)}
            aria-pressed={fast}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${fast ? 'bg-brsp-red text-white' : 'bg-brsp-green text-white hover:bg-emerald-800'}`}
          >
            {fast ? 'ধীরে চলুন' : 'গতি বাড়ান'}
          </button>
        </div>
      </div>
    </div>
  );
}
