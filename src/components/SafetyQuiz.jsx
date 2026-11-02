import { useState } from 'react';
import { bnNum } from '../utils/bn.js';

const SIGN_CLS = 'w-24 h-24 sm:w-28 sm:h-28 mx-auto drop-shadow';

const SIGNS = {
  stop: (
    <svg viewBox="0 0 100 100" className={SIGN_CLS} aria-hidden="true">
      <polygon points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30" fill="#c8283a" stroke="#fff" strokeWidth="4" />
      <text x="50" y="58" textAnchor="middle" fontSize="26" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">STOP</text>
    </svg>
  ),
  noEntry: (
    <svg viewBox="0 0 100 100" className={SIGN_CLS} aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="#c8283a" />
      <rect x="20" y="42" width="60" height="16" rx="2" fill="#fff" />
    </svg>
  ),
  speed: (
    <svg viewBox="0 0 100 100" className={SIGN_CLS} aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="#c8283a" />
      <circle cx="50" cy="50" r="33" fill="#fff" />
      <text x="50" y="62" textAnchor="middle" fontSize="34" fontWeight="700" fill="#111" fontFamily="Arial, sans-serif">40</text>
    </svg>
  ),
  crossing: (
    <svg viewBox="0 0 100 100" className={SIGN_CLS} aria-hidden="true">
      <polygon points="50,6 96,88 4,88" fill="#fff" stroke="#c8283a" strokeWidth="8" strokeLinejoin="round" />
      <circle cx="50" cy="40" r="5" fill="#111" />
      <path d="M50 46 V64 M50 52 L40 60 M50 52 L60 60 M50 64 L42 76 M50 64 L58 76" stroke="#111" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  ),
  giveWay: (
    <svg viewBox="0 0 100 100" className={SIGN_CLS} aria-hidden="true">
      <polygon points="50,94 96,14 4,14" fill="#fff" stroke="#c8283a" strokeWidth="8" strokeLinejoin="round" />
    </svg>
  ),
};

const QUESTIONS = [
  { sign: 'stop', options: ['ধীরে চলুন', 'সম্পূর্ণ থামুন, নিরাপদ হলে এগোন', 'পার্কিং এলাকা', 'ওভারটেক করুন'], answer: 1 },
  { sign: 'noEntry', options: ['এই পথে প্রবেশ নিষেধ', 'একমুখী সড়ক শুরু', 'সামনে মোড়', 'গাড়ি রাখা যাবে'], answer: 0 },
  { sign: 'speed', options: ['ন্যূনতম গতি ৪০ কিমি/ঘণ্টা', 'সামনে ৪০ কিমি রাস্তা', 'সর্বোচ্চ গতিসীমা ৪০ কিমি/ঘণ্টা', 'ওজনসীমা ৪০ টন'], answer: 2 },
  { sign: 'crossing', options: ['স্কুল বন্ধ', 'সামনে পথচারী পারাপার — গতি কমান', 'পথচারীর প্রবেশ নিষেধ', 'রাস্তা মেরামত চলছে'], answer: 1 },
  { sign: 'giveWay', options: ['অন্য যানকে আগে যেতে দিন', 'দ্রুত এগিয়ে যান', 'হর্ন বাজান', 'গাড়ি থামিয়ে ঘুমান'], answer: 0 },
];

// ট্রাফিক সাইন কুইজ — সাইন দেখে অর্থ বাছাই
export default function SafetyQuiz() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const done = i >= QUESTIONS.length;
  const q = QUESTIONS[i];

  const choose = (idx) => {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === q.answer) setScore((s) => s + 1);
  };
  const next = () => {
    setPicked(null);
    setI((n) => n + 1);
  };
  const restart = () => {
    setI(0);
    setPicked(null);
    setScore(0);
  };

  const cls = (idx) => {
    const base = 'w-full text-left rounded-xl border px-4 py-3 text-sm sm:text-base font-semibold transition';
    if (picked === null) return `${base} border-slate-300 bg-white text-slate-700 hover:border-brsp-green hover:bg-emerald-50`;
    if (idx === q.answer) return `${base} border-brsp-green bg-emerald-50 text-brsp-ink`;
    if (idx === picked) return `${base} border-brsp-red bg-red-50 text-brsp-red`;
    return `${base} border-slate-200 bg-white text-slate-400`;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-slate-800">ট্রাফিক সাইন কুইজ</h3>
        <span className="text-sm font-semibold text-slate-500 tabular-nums">
          {done ? 'শেষ' : `${bnNum(i + 1)} / ${bnNum(QUESTIONS.length)}`}
        </span>
      </div>

      {done ? (
        <div className="flex-1 grid place-items-center text-center py-6">
          <div>
            <p className="text-4xl font-bold text-brsp-green tabular-nums">{bnNum(score)} / {bnNum(QUESTIONS.length)}</p>
            <p className="mt-2 text-slate-700">
              {score === QUESTIONS.length ? 'চমৎকার! সব সাইন চিনে ফেলেছেন।' : score >= 3 ? 'ভালো! আরেকবার চেষ্টা করে দেখুন।' : 'আবার চেষ্টা করুন — সাইন চেনা নিরাপদ চালনার প্রথম ধাপ।'}
            </p>
            <button type="button" onClick={restart} className="mt-4 rounded-lg bg-brsp-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 transition">
              আবার খেলুন
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 py-4">{SIGNS[q.sign]}</div>
          <p className="mt-3 text-sm text-slate-600">এই সাইনের অর্থ কী?</p>
          <div className="mt-2 grid gap-2" role="group" aria-label="উত্তর বাছাই করুন">
            {q.options.map((o, idx) => (
              <button key={o} type="button" onClick={() => choose(idx)} disabled={picked !== null} className={cls(idx)}>
                {o}
              </button>
            ))}
          </div>
          <div className="mt-3 min-h-[2.5rem] flex items-center justify-between gap-2" aria-live="polite">
            <p className={`text-sm font-semibold ${picked === q.answer ? 'text-brsp-green' : 'text-brsp-red'}`}>
              {picked === null ? '' : picked === q.answer ? '✔ সঠিক উত্তর' : '✘ ভুল — সঠিক উত্তর সবুজ রঙে দেখানো হয়েছে'}
            </p>
            {picked !== null && (
              <button type="button" onClick={next} className="shrink-0 rounded-lg bg-brsp-ink px-4 py-2 text-sm font-semibold text-white hover:bg-brsp-green transition">
                {i === QUESTIONS.length - 1 ? 'ফলাফল' : 'পরের প্রশ্ন'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
