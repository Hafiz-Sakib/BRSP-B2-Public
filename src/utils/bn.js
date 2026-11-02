// ইংরেজি অঙ্ককে বাংলা অঙ্কে রূপান্তর
export const bnNum = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);
