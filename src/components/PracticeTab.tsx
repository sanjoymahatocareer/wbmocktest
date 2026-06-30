import { useState, MouseEvent } from 'react';
import { Bookmark, Sparkles, HelpCircle, Layers, CheckCircle, ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';

interface Flashcard {
  id: string;
  category: string;
  question: string;
  answer: string;
  fact: string;
}

const PRACTICE_CARDS_EN: Flashcard[] = [
  {
    id: 'f-1',
    category: 'Geography of West Bengal',
    question: 'With how many Indian states does West Bengal share its borders?',
    answer: '5 States',
    fact: 'West Bengal shares its borders with Odisha, Jharkhand, Bihar, Sikkim, and Assam. Jharkhand shares the longest border with West Bengal.'
  },
  {
    id: 'f-2',
    category: 'Indian History',
    question: 'Who founded the "Sadharna Brahmo Samaj" in Calcutta in 1878?',
    answer: 'Anand Mohan Bose & Shibnath Sastri',
    fact: 'It was formed by a group of leaders like Shibnath Sastri, Anand Mohan Bose, Umesh Chandra Dutta, following differences with Keshab Chandra Sen.'
  },
  {
    id: 'f-3',
    category: 'Polity & Constitution',
    question: 'What is the maximum strength of the West Bengal Legislative Assembly?',
    answer: '294 Members',
    fact: 'The West Bengal Legislative Assembly (Vidhan Sabha) is unicameral with 294 directly elected members.'
  },
  {
    id: 'f-4',
    category: 'General Science',
    question: 'Which gas is responsible for the yellow color in deep borehole "mustard gas" or marshlands?',
    answer: 'Methane (CH₄)',
    fact: 'Methane is also known as swamp gas or marsh gas, commonly produced by anaerobic decomposition of organic matter in water-logged marshy soils.'
  },
  {
    id: 'f-5',
    category: 'Geography of West Bengal',
    question: 'Which National Park in West Bengal is famous for the Red Panda?',
    answer: 'Singalila National Park',
    fact: 'Located in Darjeeling district, Singalila National Park is a high altitude park home to Red Pandas, Black Bears, and leopards.'
  }
];

const PRACTICE_CARDS_BN: Flashcard[] = [
  {
    id: 'f-1',
    category: 'পশ্চিমবঙ্গের ভূগোল',
    question: 'পশ্চিমবঙ্গ ভারতের কয়টি রাজ্যের সাথে সীমানা ভাগ করে নিয়েছে?',
    answer: '৫টি রাজ্য',
    fact: 'পশ্চিমবঙ্গ ওড়িশা, ঝাড়খণ্ড, বিহার, সিকিম এবং আসামের সাথে সীমানা ভাগ করে। ঝাড়খণ্ড পশ্চিমবঙ্গের সাথে দীর্ঘতম সীমানা ভাগ করে নিয়েছে।'
  },
  {
    id: 'f-2',
    category: 'ভারতের ইতিহাস',
    question: '১৮৭৮ সালে কলকাতায় কে "সাধারণ ব্রাহ্মসমাজ" প্রতিষ্ঠা করেছিলেন?',
    answer: 'আনন্দমোহন বসু এবং শিবনাথ শাস্ত্রী',
    fact: 'কেশবচন্দ্র সেনের সাথে মতপার্থক্যের পর শিবনাথ শাস্ত্রী, আনন্দমোহন বসু, উমেশচন্দ্র দত্তের মতো সমাজ সংস্কারক নেতাদের উদ্যোগে এটি গঠিত হয়েছিল।'
  },
  {
    id: 'f-3',
    category: 'রাষ্ট্রবিজ্ঞান ও সংবিধান',
    question: 'পশ্চিমবঙ্গ বিধানসভার সর্বোচ্চ সদস্য সংখ্যা কত?',
    answer: '২৯৪ জন সদস্য',
    fact: 'পশ্চিমবঙ্গ বিধানসভা (বিধানসভা) হলো ২৯৪ জন সরাসরি নির্বাচিত সদস্য নিয়ে গঠিত একটি এককক্ষ বিশিষ্ট আইনসভা।'
  },
  {
    id: 'f-4',
    category: 'সাধারণ বিজ্ঞান',
    question: 'জলাভূমি থেকে উৎপন্ন কোন গ্যাসটি সাধারণত "মার্শ গ্যাস" নামে পরিচিত?',
    answer: 'মিথেন (CH₄)',
    fact: 'মিথেন গ্যাস জলাভূমিতে জৈব পদার্থের পচনের ফলে প্রাকৃতিকভাবে উৎপন্ন হয় বলে একে মার্শ গ্যাস বলা হয়।'
  },
  {
    id: 'f-5',
    category: 'পশ্চিমবঙ্গের ভূগোল',
    question: 'পশ্চিমবঙ্গের কোন জাতীয় উদ্যান রেড পান্ডার জন্য বিখ্যাত?',
    answer: 'সিঙ্গালিলা জাতীয় উদ্যান',
    fact: 'দার্জিলিং জেলায় উচ্চ পার্বত্য অঞ্চলে অবস্থিত সিঙ্গালিলা জাতীয় উদ্যান রেড পান্ডা, কালো ভাল্লুক এবং চিতাবাঘের প্রধান বাসস্থান।'
  }
];

interface PracticeTabProps {
  language: 'EN' | 'BN';
}

export default function PracticeTab({ language }: PracticeTabProps) {
  const cards = language === 'EN' ? PRACTICE_CARDS_EN : PRACTICE_CARDS_BN;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [savedCards, setSavedCards] = useState<{ [cardId: string]: boolean }>({});
  const [solvedCards, setSolvedCards] = useState<{ [cardId: string]: boolean }>({});

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  const toggleSave = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    setSavedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const markAsSolved = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    setSolvedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const resetDeck = () => {
    setCurrentIdx(0);
    setIsFlipped(false);
    setSolvedCards({});
  };

  const activeCard = cards[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / cards.length) * 100);
  const totalSolved = Object.keys(solvedCards).filter(k => solvedCards[k]).length;

  return (
    <div className="p-4 space-y-4 font-sans text-gray-800">
      <div>
        <h1 className="font-heading font-black text-2xl text-slate-900 leading-none tracking-tight">
          {language === 'EN' ? "Smart Flashcards" : "স্মার্ট ফ্ল্যাশকার্ড"}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {language === 'EN' ? "High-yield short questions for rapid West Bengal GK revision" : "পশ্চিমবঙ্গ সাধারণ জ্ঞানের দ্রুত রিভিশনের জন্য গুরুত্বপূর্ণ সংক্ষিপ্ত প্রশ্ন"}
        </p>
      </div>

      {/* Stats Board */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex justify-between items-center text-left">
        <div>
          <span className="text-[10px] text-slate-400 font-mono block font-bold uppercase tracking-wider">
            {language === 'EN' ? "REVISION DECK" : "রিভিশন ডেক"}
          </span>
          <h3 className="font-heading font-black text-sm text-slate-800">
            {language === 'EN' ? "West Bengal Core Quiz" : "পশ্চিমবঙ্গ মূল কুইজ"}
          </h3>
        </div>
        <div className="flex gap-4 text-xs font-heading font-black">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 block font-mono">
              {language === 'EN' ? "SOLVED" : "সমাধান হয়েছে"}
            </span>
            <span className="text-emerald-600 font-black">{totalSolved} / {cards.length}</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-slate-400 block font-mono">
              {language === 'EN' ? "REMAINING" : "বাকি আছে"}
            </span>
            <span className="text-[#5b1fc7] font-black">{cards.length - totalSolved}</span>
          </div>
        </div>
      </div>

      {/* Interactive 3D Flip Card Container */}
      <div className="flex justify-center py-2">
        <div 
          onClick={toggleFlip}
          className="w-full max-w-sm h-64 cursor-pointer relative perspective-1000 select-none group"
        >
          {/* Card Frame with standard flip */}
          <div className={`w-full h-full relative transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            
            {/* FRONT SIDE */}
            <div className="absolute inset-0 bg-white border border-slate-150 rounded-[24px] p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-between backface-hidden text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-indigo-50 text-[#5b1fc7] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-heading">
                  {activeCard.category}
                </span>
                <button 
                  onClick={(e) => toggleSave(activeCard.id, e)}
                  className="p-1 rounded-full hover:bg-slate-50 text-slate-400 hover:text-[#5b1fc7] transition-all"
                >
                  <Bookmark className={`w-4 h-4 ${savedCards[activeCard.id] ? 'text-amber-500 fill-amber-500' : ''}`} />
                </button>
              </div>

              {/* Question Text */}
              <div className="my-auto py-3">
                <p className="text-[9px] text-slate-400 font-mono font-bold tracking-wider uppercase mb-1">
                  {language === 'EN' ? "Question:" : "প্রশ্ন:"}
                </p>
                <h2 className="font-heading font-black text-[17px] leading-snug text-slate-900">
                  {activeCard.question}
                </h2>
              </div>

              {/* Footer hint */}
              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-50 pt-3">
                <span className="font-bold flex items-center gap-1 text-[10px]">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                  <span>{language === 'EN' ? "Click anywhere to reveal answer" : "উত্তর দেখতে যেকোনো জায়গায় ক্লিক করুন"}</span>
                </span>
                <span className="font-mono text-[10px] font-bold text-slate-400">{currentIdx + 1} / {cards.length}</span>
              </div>
            </div>

            {/* BACK SIDE */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#5b1fc7] to-[#7b2ff7] text-white border border-[#5b1fc7] rounded-[24px] p-6 shadow-lg flex flex-col justify-between backface-hidden rotate-y-180 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-white/20 text-white font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-heading">
                  {language === 'EN' ? "Reveal Answer 💡" : "উত্তর দেখুন 💡"}
                </span>
                <button 
                  onClick={(e) => markAsSolved(activeCard.id, e)}
                  className="p-1 rounded-full hover:bg-white/10 text-purple-100 hover:text-white transition-all"
                >
                  <CheckCircle className={`w-5 h-5 ${solvedCards[activeCard.id] ? 'text-emerald-300 fill-emerald-300' : ''}`} />
                </button>
              </div>

              {/* Answer & Fact */}
              <div className="my-auto py-2">
                <p className="text-[10px] text-purple-200 font-mono font-bold tracking-wide uppercase mb-1">
                  {language === 'EN' ? "Answer:" : "উত্তর:"}
                </p>
                <h3 className="font-heading font-extrabold text-lg text-white mb-2 leading-tight">
                  {activeCard.answer}
                </h3>
                <p className="text-[11px] text-indigo-100 font-sans leading-relaxed border-l-2 border-indigo-200/40 pl-2.5">
                  {activeCard.fact}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-purple-200 border-t border-white/10 pt-3">
                <span className="font-semibold text-[10px] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>{language === 'EN' ? "Flip back to hide" : "লুকাতে আবার ক্লিক করুন"}</span>
                </span>
                <span className="font-mono text-[10px] font-bold text-indigo-200">{currentIdx + 1} / {cards.length}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-sm mx-auto px-1 flex flex-col gap-1.5 text-left">
        <div className="flex justify-between items-center text-[10px] font-mono font-bold text-gray-400">
          <span>{language === 'EN' ? "PROGRESS" : "অগ্নিগতির হার"}</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div 
            className="bg-[#5b1fc7] h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Flashcard Slider Controls */}
      <div className="flex justify-center items-center gap-4 mt-2">
        <button 
          onClick={handlePrev}
          className="w-11 h-11 rounded-full border border-slate-100 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-800 transition-colors shadow-md active:scale-90"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        <button 
          onClick={resetDeck}
          className="px-4 py-2 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 flex items-center gap-1.5 text-xs font-black text-slate-700 transition-colors shadow-md"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{language === 'EN' ? "Reset Deck" : "ডেক রিসেট"}</span>
        </button>

        <button 
          onClick={handleNext}
          className="w-11 h-11 rounded-full border border-slate-100 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-800 transition-colors shadow-md active:scale-90"
        >
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Study Info Tip banner */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-left max-w-sm mx-auto mt-4">
        <div className="flex gap-2.5 items-start">
          <Layers className="w-5 h-5 text-[#5b1fc7] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-heading font-bold text-xs text-indigo-950">
              {language === 'EN' ? "Revision Tip: Active Recall" : "রিভিশন টিপ: সক্রিয়ভাবে স্মরণ করা"}
            </h4>
            <p className="text-[11px] text-indigo-600 leading-normal mt-1">
              {language === 'EN' 
                ? "Active recall is the most effective way to lock state-specific facts in your long term memory. Flip cards regularly!"
                : "সক্রিয়ভাবে স্মরণ করার পদ্ধতিটি আপনার স্মৃতিতে তথ্য গেঁথে রাখার সবচেয়ে কার্যকর উপায়। নিয়মিত কার্ড উল্টে অনুশীলন করুন!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
