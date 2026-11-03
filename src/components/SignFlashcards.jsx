import { useMemo, useState } from 'react';
import { bn, load, save } from '../utils/learner.js';

const KEY = 'dlq:signs-known';

// উৎস: PDF প্রশ্ন ২০–৩৯ (ট্রাফিক সাইন)। ছবিগুলো শেখার সুবিধার্থে আঁকা সরল চিত্র —
// অফিসিয়াল BRTA চিহ্ন দেখতে অ্যাপের "ট্রাফিক চিহ্ন" ট্যাব দেখো।
const CATS = [
  { id: 'all', t: 'সব' },
  { id: 'ban', t: 'নিষেধ' },
  { id: 'must', t: 'বাধ্যতামূলক' },
  { id: 'warn', t: 'সতর্ক' },
  { id: 'info', t: 'তথ্য' },
];

const CARDS = [
  { id: 'c-red', cat: 'ban', shape: 'circle-red', title: 'লাল বৃত্ত', ans: 'নিষেধ — করা যাবে না।', note: 'বাধ্যতামূলক শ্রেণির সাইন সাধারণত বৃত্তাকার।' },
  { id: 'c-blue', cat: 'must', shape: 'circle-blue', title: 'নীল বৃত্ত', ans: 'করতে হবে — অবশ্যপালনীয় নির্দেশনা।' },
  { id: 't-red', cat: 'warn', shape: 'tri', title: 'লাল ত্রিভুজ', ans: 'সতর্ক হও — সামনে বিপদ/সাবধানতার জায়গা।', note: 'সতর্কতামূলক সাইন প্রধানত ত্রিভুজাকৃতির।' },
  { id: 'r-blue', cat: 'info', shape: 'rect-blue', title: 'নীল আয়তক্ষেত্র', ans: 'সাধারণ তথ্যমূলক সাইন।' },
  { id: 'r-green', cat: 'info', shape: 'rect-green', title: 'সবুজ আয়তক্ষেত্র', ans: 'পথনির্দেশক তথ্যমূলক সাইন — জাতীয় মহাসড়কে ব্যবহৃত হয়।' },
  { id: 'r-black', cat: 'info', shape: 'rect-white', title: 'কালো বর্ডারে সাদা আয়তক্ষেত্র', ans: 'পথনির্দেশক সাইন — মহাসড়ক ব্যতীত অন্য সড়কে।' },
  { id: 's50r', cat: 'ban', shape: 'circle-red', glyph: '50', title: 'লাল বৃত্তে ৫০', ans: 'ঘণ্টায় ৫০ কি.মি.-এর বেশি গতিতে চালানো যাবে না (সর্বোচ্চ গতিসীমা)।' },
  { id: 's50b', cat: 'must', shape: 'circle-blue', glyph: '50', title: 'নীল বৃত্তে ৫০', ans: 'ঘণ্টায় ৫০ কি.মি.-এর কম গতিতে চালানো যাবে না (সর্বনিম্ন গতিসীমা)।' },
  { id: 'horn', cat: 'ban', shape: 'circle-red', glyph: '📯', slash: true, title: 'লাল বৃত্তে হর্ন', ans: 'হর্ন বাজানো নিষেধ।', note: 'হাসপাতাল, স্কুল-কলেজ, অফিস-আদালতের ১০০ মিটারের মধ্যে নীরব এলাকা।' },
  { id: 'bus', cat: 'ban', shape: 'circle-red', glyph: '🚌', title: 'লাল বৃত্তে বড় বাস', ans: 'বড় বাস প্রবেশ নিষেধ।' },
  { id: 'walk-ban', cat: 'ban', shape: 'circle-red', glyph: '🚶', title: 'লাল বৃত্তে চলমান মানুষ', ans: 'পথচারী পারাপার নিষেধ।' },
  { id: 'walk-warn', cat: 'warn', shape: 'tri', glyph: '🚶', title: 'লাল ত্রিভুজে চলমান মানুষ', ans: 'সামনে পথচারী পারাপার — সাবধান হও।' },
  { id: 'overtake', cat: 'ban', shape: 'circle-red', glyph: '🚗🚙', small: true, title: 'লাল বৃত্তে লাল ও কালো গাড়ি', ans: 'ওভারটেকিং নিষেধ।' },
  { id: 'school', cat: 'warn', shape: 'tri', glyph: '🏫', title: 'স্কুল/শিশু সাইন (ত্রিভুজ)', ans: 'গতি কমিয়ে সতর্কতার সাথে এগোও; শিশু থাকলে তাকে অগ্রাধিকার দাও।' },
];

// ── সরল SVG সাইন ──
function Sign({ shape, glyph, slash, small }) {
  const text = glyph && /^\d+$/.test(glyph);
  return (
    <svg viewBox="0 0 100 100" className="h-28 w-28" role="img" aria-hidden="true">
      {shape === 'circle-red' && (
        <>
          <circle cx="50" cy="50" r="44" fill="#fff" stroke="#d62839" strokeWidth="10" />
        </>
      )}
      {shape === 'circle-blue' && <circle cx="50" cy="50" r="46" fill="#1d4ed8" />}
      {shape === 'tri' && (
        <polygon points="50,8 94,86 6,86" fill="#fff" stroke="#d62839" strokeWidth="9" strokeLinejoin="round" />
      )}
      {shape === 'rect-blue' && <rect x="8" y="22" width="84" height="56" rx="6" fill="#1d4ed8" />}
      {shape === 'rect-green' && <rect x="8" y="22" width="84" height="56" rx="6" fill="#15803d" />}
      {shape === 'rect-white' && <rect x="10" y="24" width="80" height="52" rx="4" fill="#fff" stroke="#111" strokeWidth="5" />}

      {glyph && (
        <text
          x="50"
          y={shape === 'tri' ? 72 : text ? 63 : 64}
          textAnchor="middle"
          fontSize={text ? 34 : small ? 26 : shape === 'tri' ? 34 : 40}
          fontWeight="800"
          fill={shape === 'circle-blue' ? '#fff' : '#111'}
          fontFamily="system-ui, sans-serif"
        >
          {glyph}
        </text>
      )}
      {slash && <line x1="22" y1="78" x2="78" y2="22" stroke="#d62839" strokeWidth="8" />}
    </svg>
  );
}

export default function SignFlashcards() {
  const [cat, setCat] = useState('all');
  const [flipped, setFlipped] = useState({});
  const [known, setKnown] = useState(() => load(KEY, {}));

  const list = useMemo(() => CARDS.filter((c) => cat === 'all' || c.cat === cat), [cat]);
  const knownCount = CARDS.filter((c) => known[c.id]).length;

  const mark = (id, v) => {
    const next = { ...known, [id]: v };
    setKnown(next);
    save(KEY, next);
    setFlipped((f) => ({ ...f, [id]: false }));
  };
  const reset = () => {
    setKnown({});
    save(KEY, {});
    setFlipped({});
  };

  return (
    <section id="sign-cards" className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10" aria-labelledby="sc-title">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brsp-red text-xl text-white" aria-hidden="true">🚸</span>
        <div>
          <h2 id="sc-title" className="text-xl font-bold text-brsp-ink sm:text-2xl">সাইন চিনি — ফ্ল্যাশকার্ড</h2>
          <p className="text-sm text-slate-600">আগে নিজে অনুমান করো, তারপর কার্ড ট্যাপ করে উত্তর মেলাও</p>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        {CATS.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            aria-pressed={cat === c.id}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold ${
              cat === c.id ? 'border-brsp-ink bg-brsp-ink text-white' : 'border-slate-300 bg-white text-slate-700'
            }`}
          >
            {c.t}
          </button>
        ))}
        <span className="ml-auto text-sm text-slate-600">
          শিখেছি: <b>{bn(knownCount)}</b>/{bn(CARDS.length)}{' '}
          {knownCount > 0 && (
            <button onClick={reset} className="ml-1 text-slate-500 underline underline-offset-2">রিসেট</button>
          )}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {list.map((c) => {
          const f = !!flipped[c.id];
          const k = !!known[c.id];
          return (
            <div key={c.id} className="[perspective:900px]">
              <div
                className={`relative h-60 w-full transition-transform duration-500 [transform-style:preserve-3d] ${
                  f ? '[transform:rotateY(180deg)]' : ''
                }`}
              >
                {/* front */}
                <button
                  onClick={() => setFlipped((s) => ({ ...s, [c.id]: true }))}
                  aria-label={`${c.title} — উত্তর দেখতে ট্যাপ করো`}
                  className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl border bg-white p-2 shadow-sm [backface-visibility:hidden] ${
                    k ? 'border-emerald-400' : 'border-slate-200'
                  }`}
                >
                  {k && <span className="absolute right-2 top-2 text-emerald-600">✔</span>}
                  <Sign {...c} />
                  <span className="mt-2 text-sm font-semibold text-brsp-ink">{c.title}</span>
                  <span className="mt-0.5 text-xs text-slate-500">ট্যাপ করে উত্তর দেখো</span>
                </button>
                {/* back */}
                <div
                  className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-brsp-green bg-emerald-50 p-3 [backface-visibility:hidden] [transform:rotateY(180deg)]"
                  aria-hidden={!f}
                >
                  <div className="overflow-auto text-[15px] leading-snug text-brsp-ink">
                    <div className="mb-1 font-bold text-brsp-green">{c.title}</div>
                    {c.ans}
                    {c.note && <div className="mt-1.5 text-xs text-slate-600">{c.note}</div>}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button tabIndex={f ? 0 : -1} onClick={() => mark(c.id, true)} className="rounded-lg bg-brsp-green py-2 text-sm font-bold text-white">
                      জানি ✓
                    </button>
                    <button tabIndex={f ? 0 : -1} onClick={() => mark(c.id, false)} className="rounded-lg border border-slate-300 bg-white py-2 text-sm font-semibold text-slate-700">
                      আবার দেখব
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {knownCount === CARDS.length && (
        <p className="mt-4 rounded-xl bg-emerald-100 p-3 text-center font-semibold text-emerald-800">🎉 সবগুলো সাইন শেখা হয়েছে! এবার কুইজ দিয়ে যাচাই করো।</p>
      )}
    </section>
  );
}
