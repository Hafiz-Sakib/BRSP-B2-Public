// ব্যাচ, ইনস্ট্রাক্টর ও শিক্ষার্থী তালিকার ডেটা — এখানে এডিট করলেই পুরো অ্যাপে আপডেট হবে
// MEMBERS: আইডি, পূর্ণ বাংলা নাম, পিতার নাম। alias শুধু সার্চের জন্য (স্ক্রিনে দেখানো হয় না)
// ⚠️ এই পাবলিক ভার্সনে শিক্ষার্থীদের মোবাইল নম্বর (BSP / বিকাশ / WhatsApp) ইচ্ছাকৃতভাবে রাখা হয়নি
// ব্যাচ ও ইনস্ট্রাক্টর
export const BATCH = "BRSP Batch 2 – Morning";
export const INSTRUCTOR = "রেজাউল স্যার";
export const INSTRUCTOR_FULL_NAME = "জনাব রেজাউল ইসলাম";
export const INSTRUCTOR_ROLE = "অপারেটিং ইনস্ট্রাক্টর";
export const INSTRUCTOR_BIO = [
  "জনাব রেজাউল ইসলাম স্যার একজন অপারেটিং ইনস্ট্রাক্টর। তিনি রাজশাহী বিভাগের বগুড়া জেলার শাহজানপুর উপজেলায় জন্মগ্রহণ করেন।",
  "কর্মজীবনে তিনি ঝিনাইদহ, পাবনা ও চট্টগ্রামের ট্রাক ডিপোতে কাজ করেছেন। বর্তমানে তিনি চট্টগ্রামের হাটহাজারীর নতুন পাড়ায় অবস্থিত বাস ডিপোতে কর্মরত আছেন।",
  "একই সঙ্গে তিনি বাংলাদেশ সরকার ও বিশ্বব্যাংকের অধীন প্রকল্পের ড্রাইভিং কোর্সে আমাদের ব্যাচ ২-এর অপারেটিং ইনস্ট্রাক্টর হিসেবে দায়িত্ব পালন করছেন।",
  "মানুষ হিসেবে তিনি খুবই ভদ্র একজন মানুষ এবং শিক্ষার্থীদের প্রতি অত্যন্ত ভদ্র ও আন্তরিক।",
];
export const INSTRUCTOR_FACTS = [
  ["জন্মস্থান", "শাহজানপুর, বগুড়া (রাজশাহী বিভাগ)"],
  ["পূর্বের কর্মস্থল", "ঝিনাইদহ, পাবনা ও চট্টগ্রাম ট্রাক ডিপো"],
  ["বর্তমান কর্মস্থল", "বাস ডিপো, নতুন পাড়া, হাটহাজারী, চট্টগ্রাম"],
];
export const INSTRUCTOR_PHONE = "01711901564";
export const INSTRUCTOR_PHONE_DISPLAY = "০১৭১১-৯০১৫৬৪";
// প্রকল্প পরিচিতি (হেডার ও ফুটারে দেখানো হয়)
export const PROJECT_NAME = "বাংলাদেশ সড়ক নিরাপত্তা প্রকল্প (BRSP)";
export const COURSE_NAME = "মোটরযান ড্রাইভিং ও বেসিক রক্ষণাবেক্ষণ প্রশিক্ষণ কোর্স";
export const CENTER_NAME = "বিআরটিসি চট্টগ্রাম বাস ডিপো ও প্রশিক্ষণ কেন্দ্র";
export const ADMISSION_FORM_URL = "/BRTC_BRSP_Admission_Form.pdf";
export const MEDICAL_FORM_URL = "/BRTC_Medical_Certificate_Form-2.pdf";
// হেডারের ফরম কার্ডে দেখানো ফরমের তালিকা — নতুন ফরম যোগ করতে এখানে একটি লাইন যোগ করুন
export const FORMS = [
  {
    title: "ভর্তি আবেদন ফরম",
    desc: "বিআরটিসি–বিআরএসপি প্রশিক্ষণ কোর্সে ভর্তির ফরম (PDF)",
    url: ADMISSION_FORM_URL,
    filename: "BRTC_BRSP_Admission_Form.pdf",
  },
  {
    title: "মেডিকেল সার্টিফিকেট (ফরম-২)",
    desc: "ড্রাইভিং লাইসেন্সের জন্য রেজিস্টার্ড ডাক্তারের মেডিকেল সার্টিফিকেট (PDF)",
    url: MEDICAL_FORM_URL,
    filename: "BRTC_Medical_Certificate_Form-2.pdf",
    note: "medical",
  },
];

export const MEMBERS = [
  { id: 72, name: "মোঃ তারিকুল ইসলাম", alias: "Tarikul Tariqul Islam Mohammad Md", father: "মোঃ নুরুল ইসলাম" },
  { id: 87, name: "মোহাম্মদ ইয়াছবীর আহমদ", alias: "Yasbir Yasbin Yasir Ahmed Ahmad", father: "মোঃ ইলিয়াছ" },
  { id: 88, name: "মোঃ ওসমান গনি", alias: "Osman Usman Gani Ghani", father: "মোঃ আবু তাহের" },
  { id: 92, name: "মোঃ আব্বাস উদ্দীন", alias: "Abbas Abbas Uddin", father: "মোঃ আবু" },
  { id: 93, name: "সোহেল ছাকিব", alias: "Sohel Shohel Sakib Shakib", father: "জি. এম. মনজুর মোর্শেদ" },
  { id: 98, name: "মোহাম্মদ মিশকাতুল ইসলাম", alias: "Mishkatul Mishkat Islam", father: "মোহাম্মদ রফিক আহমদ" },
  { id: 102, name: "তানজিলুল ইসলাম", alias: "Tanjil Tanzil Tanjilul Islam", father: "মনিরুল ইসলাম" },
  { id: 103, name: "শুভ্র রায়", alias: "Shuvro Ray Roy Subro Shubro Shuvra", father: "শংকর রায়" },
  { id: 104, name: "মোঃ হাফিজুর রহমান সাকিব", alias: "Hafiz Hafij Hafizur Hafijur Rahman সাকিব sakib Sakib", father: "আহমদ নুর" },
  { id: 108, name: "সাজিদুর রহমান", alias: "Sajidur Sajid Rahman", father: "কবির আহম্মদ" },
  { id: 111, name: "মোঃ মশিউর রহমান", alias: "Moshiur Mashiur Moshiur Rahman", father: "মোঃ মজিবর" },
  { id: 117, name: "নাজমুল আলম ইজবা", alias: "Nazmul Alam Ijba Ezba Ejba", father: "মোঃ ইব্রাহীম" },
  { id: 119, name: "আবু সাইদ মোঃ শাহেদ", alias: "Abu Saeed Said Sayed Shahed Shahid", father: "আবু তাহের" },
  { id: 120, name: "সাইদুল ইসলাম", alias: "Saidul Saiful Islam", father: "মোহাম্মদ সোলায়মান" },
  { id: 123, name: "মোঃ সাকিব আলম", alias: "Sakib Shakib Alam", father: "মোঃ শাহ আলম" },
  { id: 124, name: "মোঃ আসাদুল ইসলাম", alias: "Asadul Asaduzzaman Islam", father: "মোঃ সিরাজুল ইসলাম" },
  { id: 130, name: "জিহাদ হোসেন", alias: "Jihad Zihad Hossain Hosen Hussain", father: "নুর নবি" },
  { id: 140, name: "ওমর ফারুক তাফহীম", alias: "Omar Umar Faruk Faruque Tafhim Tahfim", father: "নুরুল আক্তার" },
  { id: 153, name: "রাজি আল হাবিব", alias: "Razi Raji Al Habib", father: "হাবিবুল আনোয়ার" },
  { id: 155, name: "মোঃ দিদারুল আলম", alias: "Didarul Didar Alam", father: "মোঃ খলিলুর রহমান" },
  { id: 167, name: "মোঃ আরিফুল ইসলাম", alias: "Ariful Arif Islam", father: "নুর মোহাম্মদ" },
  { id: 173, name: "প্রান্ত কুমার নাথ", alias: "Prantha Pranta Prantho Kumar Nath", father: "সমীর কুমার নাথ" },
  { id: 177, name: "মোঃ শামছুদ্দিন ইসলাম অপু", alias: "Shamsuddin Shamsuddin Shamsud-din Islam Opu Apu", father: "মোঃ সহীদুল ইসলাম" },
  { id: 180, name: "মোহাম্মদ আজিজুল হাকিম মেহেরাজ", alias: "Azizul Aziz Hakim Mehraz Mehraj Meheraj", father: "আবদুল হাসিম" },
  { id: 581, name: "মোঃ আনিছুর রহমান", alias: "Anisur Anis Rahman Mohammad Md", father: "মোঃ আনোয়ার পাশা" },
];

const BN = '০১২৩৪৫৬৭৮৯';
const toBn = (n) => String(n).replace(/\d/g, (d) => BN[d]);

// শিক্ষার্থী তালিকা (কোনো ফোন নম্বর নেই)
export const STUDENTS = MEMBERS.map((m, i) => ({
  no: toBn(i + 1),
  reg: toBn(m.id),
  name: m.name,
  alias: m.alias,
  father: m.father,
}));
