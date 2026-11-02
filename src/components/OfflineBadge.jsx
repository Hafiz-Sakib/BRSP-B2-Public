import { useEffect, useState } from 'react';

// ইন্টারনেট না থাকলে নিচে ছোট বার — অ্যাপ ক্যাশ থেকে চলছে
export default function OfflineBadge() {
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);

  if (online) return null;
  return (
    <div
      role="status"
      className="no-print fixed inset-x-0 bottom-0 z-50 bg-slate-800 text-white text-center text-sm font-semibold px-4 py-2"
      style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}
    >
      আপনি অফলাইনে আছেন — সেভ করা তথ্য দেখানো হচ্ছে
    </div>
  );
}
