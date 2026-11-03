import { useState } from 'react';
import { bn, load, save } from '../utils/learner.js';

const KEY = 'dlq:predrive';

// উৎস: "গাড়ি চালনার আগে করণীয় কাজ কী কী?" (প্রশ্ন ২) + মেইনটেনেন্স অংশ
const ITEMS = [
  { id: 'docs', icon: '📄', t: 'বৈধ কাগজপত্র সঙ্গে আছে', d: 'ড্রাইভিং লাইসেন্স, রেজিস্ট্রেশন (ব্লু-বুক/স্মার্ট কার্ড), ট্যাক্সটোকেন, ইনসিওরেন্স, ফিটনেস ও রুট পারমিট।' },
  { id: 'fuel', icon: '⛽', t: 'জ্বালানি (ফুয়েল) আছে', d: 'ফুয়েল গেজ দেখো। কম থাকলে প্রয়োজনমতো নাও।' },
  { id: 'water', icon: '💧', t: 'রেডিয়েটর ও ব্যাটারিতে পানি', d: 'রেডিয়েটরের পানির লেভেল ও ব্যাটারির পানি (ডিস্টিল্ড ওয়াটার) দেখো।' },
  { id: 'battery', icon: '🔋', t: 'ব্যাটারি কানেকশন ঠিক আছে', d: 'টার্মিনাল টাইট আছে কিনা ও মরিচা জমেছে কিনা দেখো।' },
  { id: 'oil', icon: '🛢️', t: 'ইঞ্জিন অয়েল (মবিল) লেভেল', d: 'ডিপস্টিক দিয়ে মাপো। কম থাকলে পরিমাণমতো দাও।' },
  { id: 'brakeoil', icon: '🛑', t: 'ব্রেক অয়েল (মাস্টার সিলিন্ডার)', d: 'পটের গায়ে চিহ্নিত দাগ পর্যন্ত আছে কিনা দেখো।' },
  { id: 'brake', icon: '🦶', t: 'ব্রেক ও ক্লাচ ঠিকমতো কাজ করছে', d: 'গাড়ি ছাড়ার আগে প্যাডেল চেপে কার্যকারিতা যাচাই করো।' },
  { id: 'lights', icon: '💡', t: 'সব লাইট ও ইন্ডিকেটর জ্বলছে', d: 'হেডলাইট, ব্রেকলাইট, ইন্ডিকেটর, পার্কলাইট ও নাম্বারপ্লেট লাইট।' },
  { id: 'tyre', icon: '🛞', t: 'টায়ারের অবস্থা ও হাওয়া', d: 'হাওয়া, নাট-বোল্ট, অ্যালাইনমেন্ট ও স্পেয়ার চাকা দেখো।' },
  { id: 'safety', icon: '🧯', t: 'অগ্নিনির্বাপক যন্ত্র ও ফার্স্টএইড বক্স', d: 'গজ, ব্যান্ডেজ, তুলা, এন্টিসেপটিক ইত্যাদি গাড়িতে রাখো।' },
];

export default function PreDriveChecklist() {
  const [done, setDone] = useState(() => load(KEY, {}));
  const [open, setOpen] = useState(null);

  const count = ITEMS.filter((i) => done[i.id]).length;
  const pct = Math.round((count / ITEMS.length) * 100);
  const ready = count === ITEMS.length;

  const toggle = (id) => {
    const next = { ...done, [id]: !done[id] };
    setDone(next);
    save(KEY, next);
  };
  const reset = () => {
    setDone({});
    save(KEY, {});
  };

  return (
    <section id="pre-drive" className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10" aria-labelledby="pd-title">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brsp-green text-xl text-white" aria-hidden="true">✅</span>
        <div>
          <h2 id="pd-title" className="text-xl font-bold text-brsp-ink sm:text-2xl">গাড়ি চালানোর আগে চেকলিস্ট</h2>
          <p className="text-sm text-slate-600">নতুন চালকদের জন্য — প্রতিটি ধাপ ট্যাপ করে টিক দাও</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="font-semibold text-brsp-ink">
            {bn(count)} / {bn(ITEMS.length)} সম্পন্ন
          </span>
          <button onClick={reset} className="text-slate-500 underline underline-offset-2">রিসেট</button>
        </div>
        <div className="mb-4 h-3 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className={`h-full transition-all ${ready ? 'bg-emerald-500' : 'bg-brsp-green'}`} style={{ width: `${pct}%` }} />
        </div>

        <ul className="space-y-2">
          {ITEMS.map((it) => {
            const on = !!done[it.id];
            const isOpen = open === it.id;
            return (
              <li key={it.id} className={`rounded-xl border transition ${on ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200'}`}>
                <div className="flex items-center gap-3 p-3">
                  <button
                    onClick={() => toggle(it.id)}
                    role="checkbox"
                    aria-checked={on}
                    aria-label={it.t}
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border-2 text-lg font-bold ${
                      on ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 bg-white text-transparent'
                    }`}
                  >
                    ✓
                  </button>
                  <span className="text-xl" aria-hidden="true">{it.icon}</span>
                  <span className={`flex-1 font-semibold leading-snug ${on ? 'text-emerald-800' : 'text-brsp-ink'}`}>{it.t}</span>
                  <button
                    onClick={() => setOpen(isOpen ? null : it.id)}
                    aria-expanded={isOpen}
                    aria-label="বিস্তারিত"
                    className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-600"
                  >
                    {isOpen ? '−' : 'i'}
                  </button>
                </div>
                {isOpen && <p className="px-3 pb-3 pl-14 text-sm leading-relaxed text-slate-600">{it.d}</p>}
              </li>
            );
          })}
        </ul>

        <div
          className={`mt-4 rounded-xl p-3 text-center font-semibold ${
            ready ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-50 text-slate-600'
          }`}
        >
          {ready ? '🎉 সব ঠিক আছে — নিরাপদে গাড়ি ছাড়তে পারো!' : 'সবগুলো টিক দিলে গাড়ি চালানোর জন্য প্রস্তুত'}
        </div>
      </div>
    </section>
  );
}
