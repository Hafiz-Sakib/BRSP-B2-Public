import { CENTER_NAME } from '../data/batch.js';
import { ADDRESS, NEXT_BATCH } from '../data/course.js';

// পরবর্তী ব্যাচের সার্কুলার — প্রশিক্ষণ কেন্দ্রে যোগাযোগের নোটিশ
export default function NextBatchNotice() {
  const { title, text, hint, phone, phoneDisplay } = NEXT_BATCH;
  const btn = 'text-center rounded-lg px-4 py-2.5 text-sm font-semibold transition';
  return (
    <section id="next-batch" className="scroll-mt-20 px-4 sm:px-8 -mt-6 sm:-mt-8 relative z-20">
      <div className="max-w-6xl mx-auto rounded-2xl bg-white border-2 border-brsp-red/70 shadow-lg shadow-black/10 overflow-hidden">
        <div className="flex items-center gap-2 bg-brsp-red text-white px-4 sm:px-6 py-2 text-sm font-bold">
          <span className="relative flex w-2.5 h-2.5" aria-hidden="true">
            <span className="absolute inset-0 rounded-full bg-white/80 animate-ping" />
            <span className="relative w-2.5 h-2.5 rounded-full bg-white" />
          </span>
          নোটিশ
        </div>
        <div className="p-4 sm:p-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{title}</h2>
            <p className="mt-2 text-slate-700 leading-relaxed">{text}</p>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">{hint}</p>
            <p className="mt-3 text-sm font-semibold text-brsp-green">📍 {CENTER_NAME}</p>
          </div>
          <div className="flex flex-wrap md:flex-col gap-2.5 md:min-w-[13rem]">
            {phone && (
              <a href={`tel:${phone}`} className={`${btn} flex-1 bg-brsp-green text-white hover:bg-emerald-800 tabular-nums`}>
                কেন্দ্রে কল করুন {phoneDisplay && `· ${phoneDisplay}`}
              </a>
            )}
            <a href="#forms" className={`${btn} flex-1 ${phone ? 'border border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-brsp-green text-white hover:bg-emerald-800'}`}>
              ফরম ডাউনলোড
            </a>
            <a href={ADDRESS.url} target="_blank" rel="noopener noreferrer" className={`${btn} flex-1 border border-slate-300 text-slate-700 hover:bg-slate-50`}>
              {ADDRESS.web}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
