import { useEffect, useState } from 'react';

const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;

const isIOS = () =>
  /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
  (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" />
  </svg>
);

const btnCls =
  'w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition duration-200 flex items-center justify-center space-x-2 text-sm';

// Android/Chrome/Edge/Desktop: ব্রাউজারের ইনস্টল প্রম্পট। iPhone/iPad (Safari): "Add to Home Screen" নির্দেশনা।
// ইনস্টল করা থাকলে কিছুই দেখায় না।
export default function InstallButton() {
  const [deferred, setDeferred] = useState(null);
  const [installed, setInstalled] = useState(() => (typeof window !== 'undefined' ? isStandalone() : false));
  const [showIOS, setShowIOS] = useState(false);

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault();
      setDeferred(e);
    };
    const onInstalled = () => {
      setDeferred(null);
      setInstalled(true);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed) return null;

  if (deferred) {
    const install = async () => {
      deferred.prompt();
      await deferred.userChoice;
      setDeferred(null);
    };
    return (
      <button type="button" onClick={install} className={btnCls}>
        <DownloadIcon />
        <span>অ্যাপ ইনস্টল করুন</span>
      </button>
    );
  }

  if (isIOS()) {
    return (
      <div className="w-full sm:w-auto">
        <button type="button" onClick={() => setShowIOS((v) => !v)} aria-expanded={showIOS} className={btnCls}>
          <DownloadIcon />
          <span>অ্যাপ ইনস্টল করুন</span>
        </button>
        {showIOS && (
          <p className="mt-2 max-w-xs rounded-xl bg-white/95 text-slate-700 text-sm leading-relaxed p-3 shadow-lg">
            Safari-তে নিচের <b>Share</b> (⬆️) বাটন চাপুন, তারপর <b>“Add to Home Screen”</b> বেছে নিন।
          </p>
        )}
      </div>
    );
  }

  return null;
}
