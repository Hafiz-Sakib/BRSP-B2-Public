import { useMemo, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import HomePage from './components/HomePage.jsx';
import PageBanner from './components/PageBanner.jsx';
import SearchBar from './components/SearchBar.jsx';
import StudentList from './components/StudentList.jsx';
import TrainSchedule from './components/TrainSchedule.jsx';
import LearnHub from './components/LearnHub.jsx';
import HomeInteractive from './components/HomeInteractive.jsx';
import ParkLightHub from './components/ParkLightHub.jsx';
import QuizPage from './components/QuizPage.jsx';
import ContactSection from './components/ContactSection.jsx';
import Footer from './components/Footer.jsx';
import OfflineBadge from './components/OfflineBadge.jsx';
import { STUDENTS, BATCH } from './data/batch.js';
import { studentMatches } from './utils/search.js';

const TABS = ['students', 'train', 'quiz'];
// সাইন, টিপস, স্টাডি ও প্রশ্নোত্তর এখন 'learn' (শিক্ষা কেন্দ্র) ট্যাবে; কুইজ আলাদা ট্যাব — ?tab=signs/study/blog/quiz কাজ করে
const LEARN_SUBS = ['signs', 'tips', 'study', 'learn', 'blog'];
const PARK_TABS = ['parking', 'lights', 'parklight']; // ?tab=parking / lights → 'parklight'
const toParkSub = (t) => (t === 'lights' ? 'lights' : 'parking');
const toLearnSub = (t) => (t === 'tips' || t === 'learn' || !t ? 'signs' : t);

export default function App() {
  const [query, setQuery] = useState('');
  // PWA শর্টকাট: ?tab=students / train / learn / quiz / blog / parklight দিয়ে সরাসরি ট্যাব খোলা যায়
  const urlTab = () => new URLSearchParams(window.location.search).get('tab');
  const [tab, setTab] = useState(() => {
    const t = urlTab();
    if (LEARN_SUBS.includes(t)) return 'learn';
    if (PARK_TABS.includes(t)) return 'parklight';
    return TABS.includes(t) ? t : 'home';
  });
  const [learnSub, setLearnSub] = useState(() => toLearnSub(urlTab()));
  const [parkSub, setParkSub] = useState(() => toParkSub(urlTab()));

  // বাংলা বা ইংরেজি — যেকোনো অঙ্কে আইডি, নাম দিয়ে সার্চ
  const filteredStudents = useMemo(
    () => STUDENTS.filter((s) => studentMatches(s, query)),
    [query]
  );

  // ট্যাব বদলালে পেজের শুরুতে নিয়ে যাওয়া
  const selectTab = (t) => {
    if (LEARN_SUBS.includes(t)) {
      setLearnSub(toLearnSub(t));
      setTab('learn');
    } else if (PARK_TABS.includes(t)) {
      setParkSub(toParkSub(t));
      setTab('parklight');
    } else {
      setTab(t);
    }
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-clip bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 text-slate-800">
      <Navbar tab={tab} onChange={selectTab} />
      <main id="main-content" key={tab} className="anim-page flex-1">
        {tab === 'home' ? (
          <>
            <HomePage onNavigate={selectTab} />
            <HomeInteractive />
            <ContactSection />
          </>
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
        ) : tab === 'parklight' ? (
          <ParkLightHub initial={parkSub} />
        ) : (
          <TrainSchedule />
        )}
      </main>
      <Footer />
      <OfflineBadge />
    </div>
  );
}
