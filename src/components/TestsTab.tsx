import { useState } from 'react';
import { Search, SlidersHorizontal, BookOpen, Clock, Users, ArrowRight, Sparkles, Filter, RefreshCw } from 'lucide-react';
import { MockTest, ExamCategory, UserProfile } from '../types';
import { POPULAR_EXAMS } from '../mockData';
import { translateUI, getTestTranslation } from '../utils/translations';

interface TestsTabProps {
  user: UserProfile;
  tests: MockTest[];
  onStartTest: (test: MockTest) => void;
  onGoPremium: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  language: 'EN' | 'BN';
}

export default function TestsTab({ user, tests, onStartTest, onGoPremium, searchQuery, setSearchQuery, language }: TestsTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory | 'All'>('All');
  const [filterFreeOnly, setFilterFreeOnly] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedExamBoard, setSelectedExamBoard] = useState<string>('All');

  // Dynamic extraction of unique Topics (subjects) across all tests
  const availableTopics = Array.from(
    new Set(
      tests.reduce<string[]>((acc, test) => {
        const transTest = getTestTranslation(test, language);
        if (transTest.topic) acc.push(transTest.topic);
        transTest.questions.forEach((q: any) => {
          if (q.subject) acc.push(q.subject);
        });
        return acc;
      }, [])
    )
  ).sort();

  // Dynamic extraction of unique Exam Boards across all tests
  const availableExamBoards = Array.from(
    new Set(
      tests.map(test => {
        const transTest = getTestTranslation(test, language);
        return transTest.examBoard;
      }).filter(Boolean) as string[]
    )
  ).sort();

  // Filter tests based on state
  const filteredTests = tests.filter(test => {
    const transTest = getTestTranslation(test, language);
    // 1. Search Query
    const matchesSearch = transTest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          transTest.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (transTest.examBoard && transTest.examBoard.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (transTest.topic && transTest.topic.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // 2. Exam Category (Browse by WBCS, WBP Constable, SSC GD, etc.)
    const matchesCategory = selectedCategory === 'All' || transTest.category === selectedCategory;
    
    // 3. Free Only
    const matchesFree = !filterFreeOnly || transTest.isFree;

    // 4. Topic
    const matchesTopic = selectedTopic === 'All' || 
                         transTest.topic === selectedTopic ||
                         transTest.questions.some((q: any) => q.subject === selectedTopic);

    // 5. Difficulty
    const matchesDifficulty = selectedDifficulty === 'All' || transTest.difficulty === selectedDifficulty;

    // 6. Exam Board
    const matchesExamBoard = selectedExamBoard === 'All' || transTest.examBoard === selectedExamBoard;

    return matchesSearch && matchesCategory && matchesFree && matchesTopic && matchesDifficulty && matchesExamBoard;
  });

  const activeFiltersCount = 
    (selectedTopic !== 'All' ? 1 : 0) + 
    (selectedDifficulty !== 'All' ? 1 : 0) + 
    (selectedExamBoard !== 'All' ? 1 : 0) + 
    (filterFreeOnly ? 1 : 0);

  return (
    <div className="p-4 space-y-4 font-sans text-gray-800">
      {/* Header section */}
      <div>
        <h1 className="font-heading font-black text-2xl text-slate-900 leading-none tracking-tight">
          {language === 'EN' ? "Mock Test Series" : "মক টেস্ট সিরিজ"}
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-sans font-medium">
          {language === 'EN' ? "Practice papers curated by top experts of West Bengal" : "পশ্চিমবঙ্গের শীর্ষস্থানীয় শিক্ষকদের দ্বারা প্রস্তুত প্র্যাকটিস পেপার"}
        </p>
      </div>

      {/* Search & Filter Row */}
      <div className="flex gap-2">
        <div className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 flex items-center gap-2 shadow-xs">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input 
            type="text" 
            placeholder={language === 'EN' ? "Search exams, boards, or topics..." : "পরীক্ষা, বোর্ড বা বিষয় খুঁজুন..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-xs text-gray-800 focus:outline-hidden placeholder-gray-400 font-medium"
          />
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`px-3 py-2 border rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-all shadow-xs relative ${showFilters ? 'bg-[#5b1fc7] border-[#5b1fc7] text-white' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{language === 'EN' ? "Filters" : "ফিল্টার"}</span>
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#f5b800] text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-xs">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Interactive Filters Panel */}
      {showFilters && (
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-lg space-y-4 animate-fadeIn text-left">
          <div className="grid grid-cols-2 gap-3">
            {/* Exam Board Filter */}
            <div>
              <span className="text-[10px] font-heading font-black text-slate-400 tracking-wider block mb-1.5 uppercase">
                {language === 'EN' ? "Exam Board" : "পরীক্ষা বোর্ড"}
              </span>
              <select 
                value={selectedExamBoard}
                onChange={(e) => setSelectedExamBoard(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#5b1fc7] focus:border-[#5b1fc7] transition-all"
              >
                <option value="All">{language === 'EN' ? "All Boards" : "সব বোর্ড"}</option>
                {availableExamBoards.map(board => (
                  <option key={board} value={board}>{board}</option>
                ))}
              </select>
            </div>

            {/* Topic Filter */}
            <div>
              <span className="text-[10px] font-heading font-black text-slate-400 tracking-wider block mb-1.5 uppercase">
                {language === 'EN' ? "Topic / Subject" : "টপিক / বিষয়"}
              </span>
              <select 
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#5b1fc7] focus:border-[#5b1fc7] transition-all"
              >
                <option value="All">{language === 'EN' ? "All Topics" : "সব টপিক"}</option>
                {availableTopics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Difficulty Filter */}
            <div>
              <span className="text-[10px] font-heading font-black text-slate-400 tracking-wider block mb-1.5 uppercase">
                {translateUI('difficulty', language)}
              </span>
              <div className="flex gap-1">
                {['All', 'Easy', 'Medium', 'Hard'].map((diff) => {
                  const isActive = selectedDifficulty === diff;
                  const diffLabel = diff === 'All' ? (language === 'EN' ? 'All' : 'সব') 
                    : diff === 'Easy' ? (language === 'EN' ? 'Easy' : 'সহজ') 
                    : diff === 'Medium' ? (language === 'EN' ? 'Medium' : 'মাঝারি') 
                    : (language === 'EN' ? 'Hard' : 'কঠিন');
                  return (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-black border transition-all uppercase tracking-wide ${
                        isActive 
                          ? diff === 'Easy' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500'
                            : diff === 'Medium' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                            : diff === 'Hard' ? 'bg-rose-50 border-rose-500 text-rose-700 ring-1 ring-rose-500'
                            : 'bg-indigo-50 border-[#5b1fc7] text-[#5b1fc7] ring-1 ring-[#5b1fc7]'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {diffLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Access Type Filter */}
            <div>
              <span className="text-[10px] font-heading font-black text-slate-400 tracking-wider block mb-1.5 uppercase">
                {language === 'EN' ? "Access Type" : "অ্যাক্সেসের ধরন"}
              </span>
              <div className="flex gap-1">
                <button 
                  type="button"
                  onClick={() => setFilterFreeOnly(false)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide border transition-all ${!filterFreeOnly ? 'bg-indigo-50 border-[#5b1fc7] text-[#5b1fc7] ring-1 ring-[#5b1fc7]' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {language === 'EN' ? "All" : "সব"}
                </button>
                <button 
                  type="button"
                  onClick={() => setFilterFreeOnly(true)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide border transition-all ${filterFreeOnly ? 'bg-indigo-50 border-[#5b1fc7] text-[#5b1fc7] ring-1 ring-[#5b1fc7]' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {translateUI('free', language)}
                </button>
              </div>
            </div>
          </div>

          {/* Reset Filters Option inside Panel */}
          {activeFiltersCount > 0 && (
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setSelectedTopic('All');
                  setSelectedDifficulty('All');
                  setSelectedExamBoard('All');
                  setFilterFreeOnly(false);
                }}
                className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#5b1fc7] hover:text-[#7b2ff7] bg-indigo-50/50 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{language === 'EN' ? "Reset Panel" : "প্যানেল রিসেট"}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Horizontal Exam category filters */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-1">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === 'All' ? 'bg-[#5b1fc7] text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
        >
          {language === 'EN' ? "All Exams" : "সব পরীক্ষা"}
        </button>
        {POPULAR_EXAMS.map(exam => (
          <button
            key={exam.id}
            onClick={() => setSelectedCategory(exam.name)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === exam.name ? 'bg-[#5b1fc7] text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            {exam.name}
          </button>
        ))}
      </div>

      {/* Tests Listing */}
      <div className="space-y-3.5">
        {filteredTests.length === 0 ? (
          <div className="bg-white border border-gray-150 rounded-2xl p-8 text-center text-gray-500">
            <BookOpen className="w-10 h-10 mx-auto text-gray-300 stroke-[1.5] mb-2" />
            <h4 className="font-heading font-bold text-sm text-gray-800">
              {language === 'EN' ? "No mock tests found" : "কোনো মক টেস্ট পাওয়া যায়নি"}
            </h4>
            <p className="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto font-sans">
              {language === 'EN' ? "Try modifying your search or clearing the active filters." : "আপনার সার্চ পরিবর্তন বা ফিল্টার নিষ্ক্রিয় করে আবার চেষ্টা করুন।"}
            </p>
            <button 
              onClick={() => { 
                setSelectedCategory('All'); 
                setFilterFreeOnly(false); 
                setSearchQuery(''); 
                setSelectedTopic('All');
                setSelectedDifficulty('All');
                setSelectedExamBoard('All');
              }}
              className="mt-4 text-xs font-heading font-black text-[#5b1fc7] hover:underline inline-flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{language === 'EN' ? "Reset All Filters" : "সব ফিল্টার রিসেট করুন"}</span>
            </button>
          </div>
        ) : (
          filteredTests.map(test => {
            const isPremiumLocked = !test.isFree && !user.isPremium;
            const transTest = getTestTranslation(test, language);
            const difficultyLabel = transTest.difficulty === 'Easy' ? (language === 'EN' ? 'EASY' : 'সহজ')
              : transTest.difficulty === 'Medium' ? (language === 'EN' ? 'MEDIUM' : 'মাঝারি')
              : (language === 'EN' ? 'HARD' : 'কঠিন');
            return (
              <div 
                key={transTest.id}
                className="bg-white border border-slate-100 rounded-[20px] p-4 shadow-xs hover:shadow-md transition-all relative overflow-hidden group text-left"
              >
                {/* Visual badge border */}
                <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${transTest.isFree ? 'bg-emerald-500' : 'bg-[#5b1fc7]'}`} />
                
                <div className="flex justify-between items-start mb-2.5 pl-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {transTest.category}
                    </span>
                    <span className={`text-[10px] font-black font-heading px-1.5 py-0.5 rounded ${transTest.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' : transTest.difficulty === 'Medium' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                      {difficultyLabel}
                    </span>
                    {transTest.topic && (
                      <span className="text-[10px] font-sans font-bold bg-indigo-50/50 text-[#5b1fc7] px-1.5 py-0.5 rounded">
                        {transTest.topic}
                      </span>
                    )}
                  </div>
                  
                  {transTest.isFree ? (
                    <span className="text-[10px] font-heading font-black text-emerald-600 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 uppercase tracking-wide shrink-0">
                      {translateUI('free', language).toUpperCase()}
                    </span>
                  ) : (
                    <span className="text-[10px] font-heading font-black text-[#5b1fc7] px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 flex items-center gap-0.5 uppercase tracking-wide shrink-0">
                      <Sparkles className="w-2.5 h-2.5 fill-current" /> {translateUI('premium', language).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="pl-2">
                  <h3 className="font-heading font-black text-sm text-slate-900 leading-snug tracking-tight group-hover:text-[#5b1fc7] transition-colors">
                    {transTest.title}
                  </h3>
                  
                  {transTest.examBoard && (
                    <p className="text-[11px] text-slate-500 font-sans font-semibold mt-1 flex items-center gap-1">
                      <span className="text-slate-400">🏛️</span> {transTest.examBoard}
                    </p>
                  )}
                  
                  {/* Metadata Row */}
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-2.5 font-mono">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-500">{transTest.questionsCount} {translateUI('questions', language)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-500">{transTest.durationMinutes} {language === 'EN' ? "Mins" : "মিনিট"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-500">{transTest.studentsRegisteredCount} {language === 'EN' ? "Studs" : "পরীক্ষার্থী"}</span>
                    </div>
                  </div>

                  {/* CTA button */}
                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {language === 'EN' ? "Syl: Latest syllabus pattern" : "সিলেবাস: সর্বশেষ সিলেবাস প্যাটার্ন"}
                    </span>
                    
                    {isPremiumLocked ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); onGoPremium(); }}
                        className="px-4 py-1.5 bg-[#f5b800] hover:bg-[#e0a800] text-slate-900 font-heading font-black text-xs rounded-xl transition-all shadow-sm flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 fill-current" />
                        <span>{language === 'EN' ? "Unlock" : "আনলক"}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onStartTest(test)}
                        className="px-4 py-1.5 bg-[#5b1fc7] hover:bg-[#7b2ff7] text-white font-heading font-black text-xs rounded-xl transition-all shadow-md shadow-[#5b1fc7]/10 flex items-center gap-0.5 group-hover:translate-x-0.5 duration-200"
                      >
                        <span>{translateUI('startExam', language)}</span>
                        <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Extra Premium Callout Card for Free Users */}
      {!user.isPremium && (
        <div className="bg-gradient-to-br from-[#5b1fc7] to-[#7b2ff7] rounded-2xl p-5 text-white shadow-xl relative overflow-hidden mt-6 text-left">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-6 -translate-y-6 blur-md" />
          <div className="flex justify-between items-start mb-3">
            <span className="inline-flex items-center gap-1 text-[10px] bg-amber-400 text-gray-900 font-bold px-2 py-0.5 rounded-full">
              <Sparkles className="w-2.5 h-2.5 fill-current" /> ALL-EXAMS ACCESS
            </span>
            <span className="text-xs font-extrabold font-mono text-amber-300">Save 50%</span>
          </div>
          <h3 className="font-heading font-bold text-base mb-1.5 text-white">
            {language === 'EN' ? "Ace Your West Bengal Govt Exams!" : "পশ্চিমবঙ্গ সরকারি পরীক্ষার প্রস্তুতি মজবুত করুন!"}
          </h3>
          <p className="text-xs text-purple-100 leading-relaxed mb-4">
            {language === 'EN' 
              ? "Unlock 1,000+ premium mock tests, previous question bank papers, and deep scorecard analysis!"
              : "১,০০০+ প্রিমিয়াম মক টেস্ট, বিগত বছরের প্রশ্নব্যাঙ্ক এবং গভীর স্কোরকার্ড বিশ্লেষণ আনলক করুন!"}
          </p>
          <button
            onClick={onGoPremium}
            className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-heading font-bold text-xs py-2.5 rounded-xl transition-all text-center flex items-center justify-center gap-1 shadow-md shadow-amber-500/25"
          >
            {translateUI('upgradeNowArrow', language)}
          </button>
        </div>
      )}
    </div>
  );
}
