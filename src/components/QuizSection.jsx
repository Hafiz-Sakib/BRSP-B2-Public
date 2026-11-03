import { useMemo, useState } from 'react';
import { QUIZ, QUIZ_SIZE } from '../data/quiz.js';
import { bn, load, save, shuffle } from '../utils/learner.js';

const LAST_KEY = 'dlq:last-ids'; // শেষবারের প্রশ্নগুলোর id — পরের বার এগুলো আসবে না
const HIST_KEY = 'dlq:history'; // আগের ফলাফল
const LABELS = ['ক', 'খ', 'গ', 'ঘ'];

// নতুন ১০টি প্রশ্ন: আগেরবারের প্রশ্ন বাদ, প্রশ্ন ও অপশন দুটোই র‍্যান্ডম
function buildRound() {
  const last = new Set(load(LAST_KEY, []));
  let pool = QUIZ.filter((q) => !last.has(q.id));
  if (pool.length < QUIZ_SIZE) pool = QUIZ; // প্রশ্ন কম পড়লে সব থেকে
  return shuffle(pool)
    .slice(0, QUIZ_SIZE)
    .map((q) => {
      const options = shuffle([q.answer, ...shuffle(q.wrong).slice(0, 3)]);
      return { id: q.id, q: q.q, options, correct: options.indexOf(q.answer) };
    });
}

function verdict(score) {
  if (score === QUIZ_SIZE) return { t: 'অসাধারণ! ১০০% সঠিক 🎉', c: 'text-emerald-700' };
  if (score >= 8) return { t: 'চমৎকার! লাইসেন্স পরীক্ষার জন্য তুমি প্রায় তৈরি 👍', c: 'text-emerald-700' };
  if (score >= 6) return { t: 'ভালো হয়েছে, আরেকটু অনুশীলন দরকার', c: 'text-amber-700' };
  return { t: 'আরো পড়ো ও আবার চেষ্টা করো — ভুলগুলো নিচে দেখো', c: 'text-brsp-red' };
}

export default function QuizSection() {
  const [phase, setPhase] = useState('intro'); // intro | play | result
  const [round, setRound] = useState([]);
  const [answers, setAnswers] = useState([]); // প্রতি প্রশ্নে বেছে নেওয়া অপশনের index
  const [cur, setCur] = useState(0);
  const [warn, setWarn] = useState(false);
  const [history, setHistory] = useState(() => load(HIST_KEY, []));

  const answered = answers.filter((a) => a !== null && a !== undefined).length;
  const score = useMemo(
    () => round.reduce((s, q, i) => s + (answers[i] === q.correct ? 1 : 0), 0),
    [round, answers],
  );
  const best = history.length ? Math.max(...history.map((h) => h.score)) : null;

  const start = () => {
    const r = buildRound();
    save(LAST_KEY, r.map((q) => q.id));
    setRound(r);
    setAnswers(Array(r.length).fill(null));
    setCur(0);
    setWarn(false);
    setPhase('play');
    scrollToTop();
  };

  const submit = () => {
    if (answered < round.length) {
      setWarn(true);
      // প্রথম উত্তর-না-দেওয়া প্রশ্নে নিয়ে যাই
      const first = answers.findIndex((a) => a === null);
      if (first >= 0) setCur(first);
      return;
    }
    const s = round.reduce((n, q, i) => n + (answers[i] === q.correct ? 1 : 0), 0);
    const next = [{ score: s, total: round.length, at: Date.now() }, ...history].slice(0, 8);
    setHistory(next);
    save(HIST_KEY, next);
    setPhase('result');
    scrollToTop();
  };

  const pick = (i) => {
    setAnswers((prev) => prev.map((a, idx) => (idx === cur ? i : a)));
    setWarn(false);
  };

  const q = round[cur];

  return (
    <section id="quiz" className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10" aria-labelledby="quiz-title">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brsp-green text-xl text-white" aria-hidden="true">📝</span>
        <div>
          <h2 id="quiz-title" className="text-xl font-bold text-brsp-ink sm:text-2xl">ড্রাইভিং লাইসেন্স কুইজ</h2>
          <p className="text-sm text-slate-600">লাইসেন্স পরীক্ষার প্রশ্নোত্তর থেকে — প্রতিবার ১০টি নতুন প্রশ্ন</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* ───────── intro ───────── */}
        {phase === 'intro' && (
          <div className="p-5 sm:p-7">
            <ul className="space-y-2 text-[15px] text-slate-700">
              <li>✅ মোট <b>{bn(QUIZ_SIZE)}টি</b> প্রশ্ন, সবগুলোর উত্তর দিতে হবে</li>
              <li>🔀 প্রতিবার <b>র‍্যান্ডম</b> প্রশ্ন — আগের বারের প্রশ্ন আবার আসবে না</li>
              <li>🏁 শেষে <b>স্কোর</b> ও প্রতিটি প্রশ্নের <b>সঠিক উত্তর</b> দেখানো হবে</li>
              <li>📚 প্রশ্নভান্ডার: {bn(QUIZ.length)}টি প্রশ্ন</li>
            </ul>

            {history.length > 0 && (
              <div className="mt-5 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                <div className="mb-2 font-semibold text-brsp-ink">
                  আগের ফলাফল · সর্বোচ্চ: {bn(best)}/{bn(QUIZ_SIZE)}
                </div>
                <div className="flex flex-wrap gap-2">
                  {history.map((h, i) => (
                    <span key={h.at + '-' + i} className="rounded-full border border-slate-200 bg-white px-3 py-1">
                      {bn(h.score)}/{bn(h.total)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={start}
              className="mt-6 w-full rounded-xl bg-brsp-green px-5 py-3.5 text-lg font-bold text-white shadow active:scale-[.99] sm:w-auto"
            >
              {history.length ? 'আবার কুইজ দিন' : 'কুইজ শুরু করুন'}
            </button>
          </div>
        )}

        {/* ───────── play ───────── */}
        {phase === 'play' && q && (
          <div className="p-4 sm:p-6">
            <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
              <span>প্রশ্ন {bn(cur + 1)} / {bn(round.length)}</span>
              <span>উত্তর দেওয়া হয়েছে: {bn(answered)}/{bn(round.length)}</span>
            </div>
            <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full bg-brsp-green transition-all" style={{ width: `${(answered / round.length) * 100}%` }} />
            </div>

            <h3 className="mb-4 text-[17px] font-bold leading-relaxed text-brsp-ink">
              {bn(cur + 1)}. {q.q}
            </h3>

            <div className="space-y-2.5" role="radiogroup" aria-label="উত্তর বেছে নিন">
              {q.options.map((o, i) => {
                const on = answers[cur] === i;
                return (
                  <button
                    key={i}
                    role="radio"
                    aria-checked={on}
                    onClick={() => pick(i)}
                    className={`flex w-full items-start gap-3 rounded-xl border-2 p-3 text-left leading-snug transition ${
                      on ? 'border-brsp-green bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold ${
                        on ? 'bg-brsp-green text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {LABELS[i]}
                    </span>
                    <span className="pt-0.5">{o}</span>
                  </button>
                );
              })}
            </div>

            {warn && (
              <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-brsp-red">
                সবগুলো প্রশ্নের উত্তর দিতে হবে — {bn(round.length - answered)}টি বাকি আছে।
              </p>
            )}

            {/* প্রশ্ন নেভিগেটর */}
            <div className="mt-5 flex flex-wrap gap-1.5" aria-label="প্রশ্ন তালিকা">
              {round.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCur(i)}
                  aria-label={`প্রশ্ন ${bn(i + 1)}`}
                  aria-current={i === cur}
                  className={`h-9 w-9 rounded-lg text-sm font-bold ${
                    i === cur
                      ? 'bg-brsp-ink text-white'
                      : answers[i] !== null
                        ? 'bg-emerald-100 text-emerald-800'
                        : warn
                          ? 'bg-red-100 text-brsp-red'
                          : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {bn(i + 1)}
                </button>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                onClick={() => setCur((c) => Math.max(0, c - 1))}
                disabled={cur === 0}
                className="rounded-xl border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 disabled:opacity-40"
              >
                ← আগের
              </button>
              {cur < round.length - 1 ? (
                <button
                  onClick={() => setCur((c) => c + 1)}
                  className="rounded-xl bg-brsp-ink px-5 py-2.5 font-semibold text-white"
                >
                  পরের →
                </button>
              ) : (
                <button
                  onClick={submit}
                  className={`rounded-xl px-5 py-2.5 font-bold text-white ${
                    answered === round.length ? 'bg-brsp-green' : 'bg-slate-400'
                  }`}
                >
                  জমা দিন ✓
                </button>
              )}
            </div>
            {cur < round.length - 1 && answered === round.length && (
              <button onClick={submit} className="mt-3 w-full rounded-xl bg-brsp-green py-2.5 font-bold text-white">
                সব উত্তর হয়েছে — জমা দিন ✓
              </button>
            )}
          </div>
        )}

        {/* ───────── result ───────── */}
        {phase === 'result' && (
          <div className="p-4 sm:p-6">
            <div className="rounded-2xl bg-gradient-to-br from-brsp-ink to-brsp-green p-6 text-center text-white">
              <div className="text-sm opacity-80">তোমার স্কোর</div>
              <div className="my-1 text-5xl font-extrabold">
                {bn(score)} <span className="text-2xl font-semibold opacity-80">/ {bn(round.length)}</span>
              </div>
              <div className="text-sm opacity-80">{bn(Math.round((score / round.length) * 100))}% সঠিক</div>
            </div>
            <p className={`mt-3 text-center font-semibold ${verdict(score).c}`}>{verdict(score).t}</p>

            <h3 className="mb-3 mt-6 text-lg font-bold text-brsp-ink">সঠিক উত্তরসহ পর্যালোচনা</h3>
            <ol className="space-y-3">
              {round.map((r, i) => {
                const mine = answers[i];
                const ok = mine === r.correct;
                return (
                  <li key={r.id} className={`rounded-xl border p-3 ${ok ? 'border-emerald-300 bg-emerald-50' : 'border-red-300 bg-red-50'}`}>
                    <div className="mb-2 flex items-start gap-2 font-semibold leading-snug text-brsp-ink">
                      <span aria-hidden="true">{ok ? '✅' : '❌'}</span>
                      <span>{bn(i + 1)}. {r.q}</span>
                    </div>
                    {!ok && (
                      <div className="mb-1 text-sm text-brsp-red">
                        <b>তোমার উত্তর:</b> {LABELS[mine]}. {r.options[mine]}
                      </div>
                    )}
                    <div className="text-sm text-emerald-800">
                      <b>সঠিক উত্তর:</b> {LABELS[r.correct]}. {r.options[r.correct]}
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button onClick={start} className="rounded-xl bg-brsp-green px-5 py-3 text-lg font-bold text-white">
                🔁 আবার কুইজ দিন (নতুন {bn(QUIZ_SIZE)}টি প্রশ্ন)
              </button>
              <button
                onClick={() => setPhase('intro')}
                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700"
              >
                শেষ
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function scrollToTop() {
  try {
    document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch {
    /* ignore */
  }
}
