# নতুন সেকশন যুক্ত করার ধাপ

নতুন ফাইল (এই zip-এ আছে):
- `src/components/LearnerSections.jsx`  ← একটাই কম্পোনেন্ট, ভেতরে ৩টি সেকশন
- `src/components/PreDriveChecklist.jsx` (ইন্টারঅ্যাক্টিভ ১: গাড়ি চালানোর আগে চেকলিস্ট)
- `src/components/SignFlashcards.jsx`    (ইন্টারঅ্যাক্টিভ ২: সাইন চিনি ফ্ল্যাশকার্ড)
- `src/components/QuizSection.jsx`       (কুইজ — প্রতিবার ১০টি র‍্যান্ডম প্রশ্ন)
- `src/data/quiz.js`                     (PDF থেকে ১৪৫টি প্রশ্ন)
- `src/utils/learner.js`

`src/components/HomePage.jsx`-এ:

```jsx
import LearnerSections from './LearnerSections.jsx';
// ...
<InstructorSection ... />   {/* আপনার বিদ্যমান Instructor সেকশন */}
<LearnerSections />         {/* ← এই এক লাইন যোগ করুন */}
```

নতুন প্রশ্ন যোগ: `src/data/quiz.js`-এর `RAW` অ্যারের শেষে `['প্রশ্ন','সঠিক','ভুল১','ভুল২','ভুল৩'],`
