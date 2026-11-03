import { useMemo, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import HomePage from './components/HomePage.jsx';
import PageBanner from './components/PageBanner.jsx';
import SearchBar from './components/SearchBar.jsx';
import StudentList from './components/StudentList.jsx';
import TrainSchedule from './components/TrainSchedule.jsx';
import LearnHub from './components/LearnHub.jsx';
import QuizPage from './components/QuizPage.jsx';
import QnABlog from './components/QnABlog.jsx';
import Footer from './components/Footer.jsx';
import OfflineBadge from './components/OfflineBadge.jsx';
import { STUDENTS, BATCH } from './data/batch.js';
import { studentMatches } from './utils/search.js';

const TABS = ['students', 'train', 'learn', 'quiz', 'blog'];
const LEARN_SUBS = ['signs', 'tips', 'study']; // পুরনো লিংক ?tab=signs / ?tab=study এখন 'learn' এ খোলে

export default function App() {
  const [query, setQuery] = useState('');
  // PWA শর্টকাট: ?tab=students / train / learn / quiz / blog দিয়ে সরাসরি ট্যাব খোলা যায়
  const urlTab = () => new URLSearchParams(window.location.search).get('tab');
  const [tab, setTab] = useState(() => {
    const t = urlTab();
    if (LEARN_SUBS.includes(t)) return 'learn';
    return TABS.includes(t) ? t : 'home';
  });
  const [learnSub, setLearnSub] = useState(() => (LEARN_SUBS.includes(urlTab()) ? urlTab() : 'signs'));

  // বাংলা বা ইংরেজি — যেকোনো অঙ্কে আইডি, নাম দিয়ে সার্চ
  const filteredStudents = useMemo(
    () => STUDENTS.filter((s) => studentMatches(s, query)),
    [query]
  );

  // ট্যাব বদলালে পেজের শুরুতে নিয়ে যাওয়া
  const selectTab = (t) => {
    if (LEARN_SUBS.includes(t)) {
      setLearnSub(t);
      setTab('learn');
    } else {
      setTab(t);
    }
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 text-slate-800">
      <Navbar tab={tab} onChange={selectTab} />
      <main id="main-content" key={tab} className="anim-page flex-1">
        {tab === 'home' ? (
          <HomePage onNavigate={selectTab} />
        ) : tab === 'students' ? (
          <>
            <PageBanner title="শিক্ষার্থী তালিকা" subtitle={BATCH} />
            <SearchBar value={query} onChange={setQuery} />
            <StudentList rows={filteredStudents} />
          </>
        ) : tab === 'learn' ? (
          <LearnHub initial={learnSub} />
        ) : tab === 'quiz' ? (
          <QuizPage onNavigate={selectTab} />
        ) : tab === 'blog' ? (
          <QnABlog />
        ) : (
          <TrainSchedule />
        )}
      </main>
      <Footer />
      <OfflineBadge />
    </div>
  );
}
