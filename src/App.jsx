import { useMemo, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import HomePage from './components/HomePage.jsx';
import PageBanner from './components/PageBanner.jsx';
import SearchBar from './components/SearchBar.jsx';
import StudentList from './components/StudentList.jsx';
import TrainSchedule from './components/TrainSchedule.jsx';
import TrafficSigns from './components/TrafficSigns.jsx';
import StudyMaterials from './components/StudyMaterials.jsx';
import Footer from './components/Footer.jsx';
import OfflineBadge from './components/OfflineBadge.jsx';
import { STUDENTS, BATCH } from './data/batch.js';
import { studentMatches } from './utils/search.js';

const TABS = ['students', 'train', 'signs', 'study'];

export default function App() {
  const [query, setQuery] = useState('');
  // PWA শর্টকাট: ?tab=students / ?tab=train দিয়ে সরাসরি ট্যাব খোলা যায়
  const [tab, setTab] = useState(() => {
    const t = new URLSearchParams(window.location.search).get('tab');
    return TABS.includes(t) ? t : 'home';
  });

  // বাংলা বা ইংরেজি — যেকোনো অঙ্কে আইডি, নাম দিয়ে সার্চ
  const filteredStudents = useMemo(
    () => STUDENTS.filter((s) => studentMatches(s, query)),
    [query]
  );

  // ট্যাব বদলালে পেজের শুরুতে নিয়ে যাওয়া
  const selectTab = (t) => {
    setTab(t);
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
        ) : tab === 'signs' ? (
          <TrafficSigns />
        ) : tab === 'study' ? (
          <StudyMaterials />
        ) : (
          <TrainSchedule />
        )}
      </main>
      <Footer />
      <OfflineBadge />
    </div>
  );
}
