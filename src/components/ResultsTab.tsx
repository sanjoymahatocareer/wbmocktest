import { useState } from 'react';
import { Award, Calendar, BarChart2, Eye } from 'lucide-react';
import { TestAttempt, MockTest } from '../types';
import { SAMPLE_TESTS } from '../mockData';
import { translateUI, getTestTranslation } from '../utils/translations';

interface ResultsTabProps {
  attempts: TestAttempt[];
  onViewDetails: (test: MockTest, attempt: TestAttempt) => void;
  language: 'EN' | 'BN';
}

export default function ResultsTab({ attempts, onViewDetails, language }: ResultsTabProps) {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  if (attempts.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 font-sans max-w-sm mx-auto my-12 bg-white rounded-2xl border border-gray-100 shadow-xs">
        <Award className="w-12 h-12 mx-auto text-gray-300 stroke-[1.2] mb-3" />
        <h4 className="font-heading font-extrabold text-sm text-gray-800">
          {translateUI('noHistoryTitle', language)}
        </h4>
        <p className="text-xs text-gray-400 mt-1 max-w-[220px] mx-auto">
          {translateUI('noHistoryDesc', language)}
        </p>
      </div>
    );
  }

  // Calculate cumulative stats
  const totalCorrect = attempts.reduce((acc, curr) => acc + curr.correctAnswers, 0);
  const totalIncorrect = attempts.reduce((acc, curr) => acc + curr.incorrectAnswers, 0);
  const totalSkipped = attempts.reduce((acc, curr) => acc + curr.skippedQuestions, 0);
  const totalQuestionsSolved = totalCorrect + totalIncorrect;
  const avgAccuracy = totalQuestionsSolved > 0 ? Math.round((totalCorrect / totalQuestionsSolved) * 100) : 0;
  const highestScore = Math.max(...attempts.map(a => a.score));

  // Get list of unique categories from completed tests
  const categories = ['All', ...Array.from(new Set(attempts.map(a => {
    const originalTest = SAMPLE_TESTS.find(t => t.id === a.testId);
    return originalTest ? originalTest.category : 'General';
  })))];

  const filteredAttempts = selectedCategoryFilter === 'All'
    ? attempts
    : attempts.filter(a => {
        const originalTest = SAMPLE_TESTS.find(t => t.id === a.testId);
        return originalTest && originalTest.category === selectedCategoryFilter;
      });

  return (
    <div className="p-4 space-y-4 font-sans text-gray-800">
      <div>
        <h1 className="font-heading font-black text-2xl text-slate-900 leading-none tracking-tight">
          {language === 'EN' ? "Your Progress Report" : "আপনার অগ্রগতি রিপোর্ট"}
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-sans font-medium">
          {language === 'EN' ? "Real-time stats from your attempted mock test series" : "আপনার দেওয়া মক টেস্ট সিরিজ থেকে রিয়েল-টাইম পরিসংখ্যান"}
        </p>
      </div>

      {/* Stats Summary Cards */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-slate-50">
          <BarChart2 className="w-4 h-4 text-[#5b1fc7]" />
          <span className="font-heading font-black text-xs text-slate-900 uppercase tracking-wider">
            {language === 'EN' ? "Preparation Health" : "প্রস্তুতির অবস্থা"}
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-indigo-50/50 p-2 rounded-xl text-center">
            <span className="text-[10px] text-[#5b1fc7] font-black block leading-none">
              {translateUI('statTests', language).toUpperCase()}
            </span>
            <span className="text-lg font-heading font-black text-slate-900 mt-0.5 inline-block">{attempts.length}</span>
            <span className="text-[9px] text-slate-400 block font-mono">
              {language === 'EN' ? "Attempted" : "অংশগ্রহণকৃত"}
            </span>
          </div>
          <div className="bg-emerald-50 p-2 rounded-xl text-center">
            <span className="text-[10px] text-emerald-600 font-black block leading-none">
              {language === 'EN' ? "ACCURACY" : "নির্ভুলতা"}
            </span>
            <span className="text-lg font-heading font-black text-slate-900 mt-0.5 inline-block">{avgAccuracy}%</span>
            <span className="text-[9px] text-slate-400 block font-mono">
              {language === 'EN' ? "Avg Score" : "গড় নম্বর"}
            </span>
          </div>
          <div className="bg-amber-50 p-2 rounded-xl text-center">
            <span className="text-[10px] text-amber-600 font-black block leading-none">
              {language === 'EN' ? "MAX SCORE" : "সর্বোচ্চ স্কোর"}
            </span>
            <span className="text-lg font-heading font-black text-slate-900 mt-0.5 inline-block">{highestScore}</span>
            <span className="text-[9px] text-slate-400 block font-mono">
              {language === 'EN' ? "High Mark" : "সর্বোচ্চ নম্বর"}
            </span>
          </div>
        </div>

        {/* Custom Visual Bar Chart representing recent scores */}
        <div className="mt-4 pt-4 border-t border-gray-50">
          <span className="text-[10px] font-heading font-extrabold text-gray-400 tracking-wider block mb-2 uppercase">
            {language === 'EN' ? "Score Trend (Recent first)" : "স্কোরের ট্রেন্ড (সাম্প্রতিক প্রথম)"}
          </span>
          <div className="h-16 flex items-end justify-around gap-2 px-1 py-1 bg-gray-50 rounded-xl">
            {attempts.slice(-5).reverse().map((att, index) => {
              const heightPct = Math.max(15, Math.round((att.score / att.totalQuestions) * 100));
              const transTest = SAMPLE_TESTS.find(t => t.id === att.testId);
              const displayTitle = transTest ? getTestTranslation(transTest, language).title : att.testTitle;
              return (
                <div key={index} className="flex-1 flex flex-col items-center group cursor-pointer relative">
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-1 bg-gray-900 text-white font-mono font-bold text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {att.score}/{att.totalQuestions}
                  </div>
                  
                  {/* Visual Bar */}
                  <div 
                    className="w-full bg-gradient-to-t from-brand-primary to-brand-secondary rounded-t-xs hover:opacity-80 transition-all duration-300"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[8px] text-gray-400 font-heading font-semibold mt-1 truncate max-w-[50px]">
                    {displayTitle.replace(' মক টেস্ট', '').replace(' মক', '').replace(' Mock Test', '').replace(' Practice Test', '')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex items-center justify-between mt-6 mb-2">
        <span className="text-xs font-black text-slate-500 font-heading tracking-wide">
          {language === 'EN' ? "ATTEMPT HISTORY" : "মক টেস্টের ইতিহাস"}
        </span>
        
        {/* Horizontal Category scroll */}
        <div className="flex gap-1 overflow-x-auto max-w-[200px] no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-black whitespace-nowrap shrink-0 transition-colors ${selectedCategoryFilter === cat ? 'bg-[#5b1fc7] text-white shadow-sm' : 'bg-white text-slate-500 border border-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* List of attempts */}
      <div className="space-y-3">
        {filteredAttempts.map((att, idx) => {
          const originalTest = SAMPLE_TESTS.find(t => t.id === att.testId);
          const transTest = originalTest ? getTestTranslation(originalTest, language) : null;
          const displayTitle = transTest ? transTest.title : att.testTitle;
          return (
            <div 
              key={idx}
              className="bg-white border border-gray-100 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-3 relative overflow-hidden group text-left"
            >
              {/* Visual side marker */}
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-brand-primary" />
              
              <div className="flex-1 min-w-0 pl-1.5">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[9px] font-mono font-bold bg-indigo-50 text-brand-primary px-1.5 py-0.5 rounded">
                    {transTest ? transTest.category : 'Mock'}
                  </span>
                  <div className="flex items-center gap-0.5 text-[9px] font-mono text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>{att.dateCompleted}</span>
                  </div>
                </div>

                <h3 className="font-heading font-bold text-sm text-gray-900 truncate leading-snug group-hover:text-brand-primary transition-colors">
                  {displayTitle}
                </h3>

                {/* Score Summary Metrics */}
                <div className="flex gap-3 text-[10px] text-gray-500 font-mono mt-1.5">
                  <span className="text-emerald-600 font-bold">✓ {att.correctAnswers} {language === 'EN' ? "Correct" : "সঠিক"}</span>
                  <span className="text-red-500 font-bold">✗ {att.incorrectAnswers} {language === 'EN' ? "Wrong" : "ভুল"}</span>
                  <span className="text-gray-400 font-bold">○ {att.skippedQuestions} {language === 'EN' ? "Skipped" : "এড়িয়ে গেছেন"}</span>
                </div>
              </div>

              {/* Score breakdown display */}
              <div className="text-right shrink-0">
                <div className="font-heading font-extrabold text-base text-gray-900 leading-none">
                  {att.score}
                </div>
                <div className="text-[9px] text-gray-400 font-mono leading-none mt-0.5">
                  / {att.totalQuestions} {language === 'EN' ? "Marks" : "নম্বর"}
                </div>
                
                <button
                  onClick={() => {
                    if (originalTest) {
                      onViewDetails(originalTest, att);
                    }
                  }}
                  className="mt-2 text-[10px] font-heading font-bold text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 px-2 py-1 rounded-lg flex items-center gap-0.5 transition-colors ml-auto"
                >
                  <Eye className="w-3 h-3" />
                  <span>{language === 'EN' ? "Review" : "বিশ্লেষণ"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
