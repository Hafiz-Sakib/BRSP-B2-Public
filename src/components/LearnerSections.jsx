import PreDriveChecklist from './PreDriveChecklist.jsx';
import SignFlashcards from './SignFlashcards.jsx';
import QuizSection from './QuizSection.jsx';

// HomePage-এ Instructor সেকশনের ঠিক পরে এই একটি কম্পোনেন্ট বসালেই হবে:
//   <LearnerSections />
export default function LearnerSections() {
  return (
    <div className="bg-slate-50">
      <PreDriveChecklist />
      <SignFlashcards />
      <QuizSection />
    </div>
  );
}
