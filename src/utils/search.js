const BN_DIGITS = '০১২৩৪৫৬৭৮৯';

// বাংলা অঙ্ক (০-৯) → ইংরেজি অঙ্ক (0-9), lowercase, বাড়তি স্পেস ও জিরো-উইডথ ক্যারেক্টার বাদ
export function normalize(text = '') {
  return String(text)
    .replace(/[\u200c\u200d]/g, '')
    .replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)))
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

const isNumeric = (q) => /^\d+$/.test(q);

// শিক্ষার্থী তালিকার সার্চ: নাম (বাংলা/ইংরেজি), রেজি, ক্রমিক, পিতার নাম
export function studentMatches(s, query) {
  const q = normalize(query);
  if (!q) return true;
  if (isNumeric(q)) {
    return normalize(s.reg).startsWith(q) || normalize(s.no) === q;
  }
  return normalize(`${s.name} ${s.alias ?? ''} ${s.father}`).includes(q);
}
