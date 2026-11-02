import Avatar from './Avatar.jsx';

function Empty() {
  return <div className="py-14 text-center text-slate-400 font-medium">কোনো ফলাফল পাওয়া যায়নি</div>;
}

// পিসি (lg+) ও প্রিন্ট: ছবির মতো টেবিল
function StudentTable({ rows }) {
  const th = 'px-3 py-3 text-left font-semibold whitespace-nowrap';
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm print:shadow-none print:rounded-none">
      <table className="w-full text-sm xl:text-base border-collapse">
        <thead className="bg-slate-800 text-white">
          <tr>
            <th className={`${th} text-center`}>ক্রমিঃ</th>
            <th className={`${th} text-center`}>রেজি</th>
            <th className={`${th} text-center`}>ছবি</th>
            <th className={th}>নাম</th>
            <th className={th}>পিতার নাম</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s, i) => (
            <tr key={s.reg} className={`border-b border-slate-200 hover:bg-indigo-50/60 ${i % 2 ? 'bg-slate-50/80' : 'bg-white'}`}>
              <td className="px-3 py-2.5 text-center text-slate-500">{s.no}</td>
              <td className="px-3 py-2.5 text-center font-bold text-indigo-700">{s.reg}</td>
              <td className="px-3 py-2 text-center">
                <Avatar reg={s.reg} name={s.name} size="lg" ring="ring-slate-200" className="mx-auto" />
              </td>
              <td className="px-3 py-2.5 font-semibold text-slate-800">{s.name}</td>
              <td className="px-3 py-2.5 text-slate-700">{s.father}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ট্যাবলেট (২ কলাম) ও মোবাইল (১ কলাম): কার্ড
function StudentCard({ s, index = 0 }) {
  const row = (label, value) => (
    <div className="flex justify-between gap-3 text-sm">
      <dt className="text-slate-500 shrink-0">{label}</dt>
      <dd className="font-medium text-slate-800 text-right break-words min-w-0">{value}</dd>
    </div>
  );
  return (
    <article style={{ animationDelay: `${Math.min(index, 12) * 50}ms` }} className="anim-card bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-indigo-400 to-emerald-500" />
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar reg={s.reg} name={s.name} size="lg" ring="ring-indigo-100" />
            <div className="min-w-0">
              <p className="text-lg font-bold text-slate-800 leading-snug">{s.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">ক্রমিক {s.no}</p>
            </div>
          </div>
          <span className="shrink-0 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 text-sm font-bold">
            রেজি {s.reg}
          </span>
        </div>
        <div className="border-t border-dashed border-slate-200" />
        <dl className="space-y-1.5">
          {row('পিতার নাম', s.father)}
        </dl>
      </div>
    </article>
  );
}

export default function StudentList({ rows }) {
  return (
    <div className="px-3 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8 max-w-[96rem] mx-auto">
      {rows.length === 0 ? <Empty /> : <>
      <div className="hidden lg:block print:block">
        <StudentTable rows={rows} />
      </div>
      <div className="lg:hidden print:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
        {rows.map((s, i) => (
          <StudentCard key={s.reg} s={s} index={i} />
        ))}
      </div>
      </>}
    </div>
  );
}
