import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardList, 
  Users, 
  ShieldCheck, 
  Trophy, 
  BookOpen, 
  Building, 
  Book, 
  FileText, 
  Calendar, 
  BarChart, 
  Sparkles, 
  Crown, 
  MapPin, 
  CheckCircle, 
  HelpCircle,
  Home,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Check,
  Smartphone,
  CheckSquare,
  BookmarkCheck,
  User
} from 'lucide-react';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MockTestEngine from './components/MockTestEngine';
import ResultCard from './components/ResultCard';
import TestsTab from './components/TestsTab';
import ResultsTab from './components/ResultsTab';
import PracticeTab from './components/PracticeTab';
import ProfileTab from './components/ProfileTab';
import AdminConsole from './components/AdminConsole';
import GovtJobAlerts from './components/GovtJobAlerts';

import { MockTest, TestAttempt, UserProfile, NotificationItem, ExamCategory } from './types';
import { SAMPLE_TESTS, POPULAR_EXAMS, TOP_PERFORMERS, INITIAL_USER_PROFILE, NOTIFICATIONS } from './mockData';

// Helper to map string icon names to Lucide icons
const getIconByName = (name: string) => {
  switch (name) {
    case 'ClipboardList': return ClipboardList;
    case 'Users': return Users;
    case 'ShieldCheck': return ShieldCheck;
    case 'Trophy': return Trophy;
    case 'Building': return Building;
    case 'Book': return Book;
    case 'FileText': return FileText;
    case 'Calendar': return Calendar;
    case 'BarChart': return BarChart;
    default: return HelpCircle;
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'BN'>(() => {
    const saved = localStorage.getItem('wb_language');
    return (saved === 'EN' || saved === 'BN') ? saved : 'BN';
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dynamic persistent states
  const [popularExams, setPopularExams] = useState<any[]>(() => {
    const saved = localStorage.getItem('wb_popular_exams');
    return saved ? JSON.parse(saved) : POPULAR_EXAMS;
  });

  const [topPerformers, setTopPerformers] = useState<any[]>(() => {
    const saved = localStorage.getItem('wb_top_performers');
    return saved ? JSON.parse(saved) : TOP_PERFORMERS;
  });

  const [tests, setTests] = useState<MockTest[]>(() => {
    const saved = localStorage.getItem('wb_mock_tests');
    return saved ? JSON.parse(saved) : SAMPLE_TESTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('wb_notifications');
    return saved ? JSON.parse(saved) : NOTIFICATIONS;
  });

  const [homepageContent, setHomepageContent] = useState<any>(() => {
    const saved = localStorage.getItem('wb_homepage_content');
    return saved ? JSON.parse(saved) : {
      heroBadge: "Your Success Our Mission",
      heroHeading: "Competitive Exam Preparation",
      heroHighlight: "Preparation",
      heroBullets: [
        "Free Mock Tests",
        "Topic Wise Tests",
        "Previous Year Papers",
        "Detailed Solutions & Analytics"
      ],
      heroBtnText: "Start Mock Test",
      stats: [
        { id: '1', icon: 'ClipboardList', value: '10,000+', label: 'Tests' },
        { id: '2', icon: 'Users', value: '50,000+', label: 'Users' },
        { id: '3', icon: 'ShieldCheck', value: '100%', label: 'Free Tests' },
        { id: '4', icon: 'Trophy', value: "Topper's", label: 'Choice' }
      ],
      quickIcons: [
        { id: '1', icon: 'ClipboardList', label: 'All Tests', tab: 'tests', style: 'bg-purple-100 text-purple-700' },
        { id: '2', icon: 'Building', label: 'Govt. Exams', tab: 'tests', style: 'bg-emerald-100 text-emerald-700' },
        { id: '3', icon: 'Book', label: 'Subject Tests', tab: 'tests', style: 'bg-amber-100 text-amber-700' },
        { id: '4', icon: 'FileText', label: 'Previous Papers', tab: 'tests', style: 'bg-blue-100 text-blue-700' },
        { id: '5', icon: 'Calendar', label: 'Daily Tests', tab: 'practice', style: 'bg-rose-100 text-rose-700' },
        { id: '6', icon: 'BarChart', label: 'Performance', tab: 'results', style: 'bg-indigo-100 text-indigo-700' }
      ],
      premiumBannerTitle: "Unlock WBMockTest Premium",
      premiumBannerText: "WBMockTest Pro Combo",
      premiumBannerBtnText: "Upgrade Now →"
    };
  });

  // App state
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  // Sync states to local storage automatically on any update
  useEffect(() => {
    localStorage.setItem('wb_mock_tests', JSON.stringify(tests));
  }, [tests]);

  useEffect(() => {
    localStorage.setItem('wb_popular_exams', JSON.stringify(popularExams));
  }, [popularExams]);

  useEffect(() => {
    localStorage.setItem('wb_top_performers', JSON.stringify(topPerformers));
  }, [topPerformers]);

  useEffect(() => {
    localStorage.setItem('wb_homepage_content', JSON.stringify(homepageContent));
  }, [homepageContent]);

  useEffect(() => {
    localStorage.setItem('wb_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('wb_language', language);
  }, [language]);
  
  // Test module state
  const [activeMockTest, setActiveMockTest] = useState<MockTest | null>(null);
  const [activeAttempt, setActiveAttempt] = useState<TestAttempt | null>(null);
  const [selectedReviewTest, setSelectedReviewTest] = useState<MockTest | null>(null);
  
  // Modal state
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  // Handle live mock test triggers
  const handleStartTest = (test: MockTest) => {
    if (!test.isFree && !user.isPremium) {
      setShowPremiumModal(true);
      return;
    }
    setActiveMockTest(test);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle mock test submission
  const handleTestSubmit = (attempt: TestAttempt) => {
    setAttempts(prev => [attempt, ...prev]);
    setUser(prev => ({
      ...prev,
      totalMockTestsCompleted: prev.totalMockTestsCompleted + 1,
      streakDays: prev.streakDays + 1
    }));
    
    // Auto open score/result card for the completed test
    const originalTest = tests.find(t => t.id === attempt.testId);
    if (originalTest) {
      setSelectedReviewTest(originalTest);
      setActiveAttempt(attempt);
    }
    
    // Clear the active test player state
    setActiveMockTest(null);

    // Add a congratulations notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `🏆 Test Submitted: ${attempt.testTitle}`,
      description: `You completed the test. Score: ${attempt.score}/${attempt.totalQuestions}. Click here to review detailed solutions!`,
      time: 'Just now',
      isRead: false,
      type: 'result'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleRetake = () => {
    if (selectedReviewTest) {
      const testToRetake = selectedReviewTest;
      setActiveAttempt(null);
      setSelectedReviewTest(null);
      handleStartTest(testToRetake);
    }
  };

  const handlePaymentSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPaymentSuccess(true);
    setTimeout(() => {
      setUser(prev => ({ ...prev, isPremium: true }));
      setShowPremiumModal(false);
      setPaymentSuccess(false);
      setCardHolder('');
      setCardNumber('');
      
      // Add success notification
      const premiumNotif: NotificationItem = {
        id: `notif-premium-${Date.now()}`,
        title: '⭐ Premium Activated Successfully!',
        description: 'Thank you for upgrading! You now have unlimited access to all 500+ mock tests and detailed analytics.',
        time: 'Just now',
        isRead: false,
        type: 'general'
      };
      setNotifications(prev => [premiumNotif, ...prev]);
    }, 1800);
  };

  const selectExamFromPopular = (examName: ExamCategory) => {
    setActiveTab('tests');
    // Set search query or filter by that category
    setSearchQuery(examName);
  };

  if (isAdminMode) {
    return (
      <AdminConsole 
        tests={tests}
        setTests={setTests}
        user={user}
        setUser={setUser}
        popularExams={popularExams}
        setPopularExams={setPopularExams}
        topPerformers={topPerformers}
        setTopPerformers={setTopPerformers}
        homepageContent={homepageContent}
        setHomepageContent={setHomepageContent}
        notifications={notifications}
        setNotifications={setNotifications}
        onCloseAdmin={() => setIsAdminMode(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-0 md:p-6 select-none font-sans">
      {/* Mobile Frame Container: to give the precise 720x1480 portrait aesthetic on desktop, but native feel on real mobile */}
      <div className="w-full max-w-[480px] min-h-screen md:min-h-[920px] bg-[#f4f5f9] md:rounded-[40px] md:shadow-2xl overflow-hidden flex flex-col relative border border-gray-200/50">
        
        {/* Status Bar simulation on mobile layout */}
        <div className="hidden md:flex bg-white px-6 py-2.5 items-center justify-between text-xs font-mono font-bold text-gray-500 shrink-0 border-b border-gray-100">
          <span className="flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5 text-gray-400" />
            <span>WBMockTest Mobile App</span>
          </span>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span>9:41 AM · LTE</span>
          </div>
        </div>

        {/* Dynamic Navigation Sidebar Drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <Sidebar 
              isOpen={sidebarOpen} 
              onClose={() => setSidebarOpen(false)}
              user={user}
              onGoPremium={() => setShowPremiumModal(true)}
              language={language}
              setLanguage={setLanguage}
              onOpenAdmin={() => setIsAdminMode(true)}
              onSelectJobAlerts={() => {
                setActiveTab('home');
                setSearchQuery('');
                setTimeout(() => {
                  const element = document.getElementById('govt-job-alerts-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }, 150);
              }}
            />
          )}
        </AnimatePresence>

        {/* Active Mock Test Player View */}
        {activeMockTest ? (
          <MockTestEngine 
            test={activeMockTest}
            onExit={() => setActiveMockTest(null)}
            onSubmit={handleTestSubmit}
            language={language}
          />
        ) : activeAttempt && selectedReviewTest ? (
          /* Result/Solutions review View */
          <ResultCard 
            test={selectedReviewTest}
            attempt={activeAttempt}
            onClose={() => {
              setActiveAttempt(null);
              setSelectedReviewTest(null);
            }}
            onRetake={handleRetake}
            language={language}
          />
        ) : (
          /* Standard Multi-Tab App Navigation */
          <>
            {/* Navigation Header */}
            <Header 
              onMenuClick={() => setSidebarOpen(true)}
              notifications={notifications}
              setNotifications={setNotifications}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onActiveTabChange={(tab) => setActiveTab(tab)}
              language={language}
            />

            {/* Main scrollable body area */}
            <main className="flex-1 overflow-y-auto pb-24">
              
              {/* Force displaying TestsTab if search query exists */}
              {searchQuery && activeTab !== 'tests' && (
                <div className="bg-brand-primary/5 px-4 py-2 flex items-center justify-between border-b border-brand-primary/10">
                  <span className="text-xs font-semibold text-brand-primary">Displaying search results...</span>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-[11px] font-bold text-[#5b1fc7] hover:underline"
                  >
                    Clear Search
                  </button>
                </div>
              )}

              {/* Render Selected View Tab */}
              {searchQuery ? (
                <TestsTab 
                  user={user}
                  tests={tests}
                  onStartTest={handleStartTest}
                  onGoPremium={() => setShowPremiumModal(true)}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  language={language}
                />
              ) : activeTab === 'home' ? (
                /* 🏠 HOME SCREEN TAB */
                <div className="p-4 space-y-4 animate-fadeIn text-left">
                  
                  {/* Hero banner (purple gradient card) */}
                  <div className="bg-gradient-to-br from-[#5b1fc7] to-[#7b2ff7] rounded-[24px] p-6 text-white relative overflow-hidden shadow-xl">
                    {/* Glowing decorative orbs */}
                    <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
                    <div className="absolute top-1/2 left-1/4 w-28 h-28 bg-amber-400/10 rounded-full blur-xl" />

                    {/* High-contrast Top-Right Badge like in design HTML */}
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl flex items-center gap-1.5 shadow-xs">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-[8px] font-heading font-black uppercase tracking-wider text-white">
                        {homepageContent.heroBadge || "Your Success Our Mission"}
                      </span>
                    </div>

                    <div className="flex justify-between items-start pt-3">
                      {/* Left: Banner text and specs */}
                      <div className="space-y-4 max-w-[240px] relative z-10">
                        <span className="inline-block px-3 py-1 bg-[#f5b800] text-slate-900 text-[9px] font-black uppercase rounded-full tracking-wider shadow-sm">
                          Best Platform for
                        </span>
                        
                        <h1 className="font-heading font-black text-[25px] leading-tight tracking-tight text-white">
                          {homepageContent.heroHeading ? (
                            homepageContent.heroHighlight && homepageContent.heroHeading.includes(homepageContent.heroHighlight) ? (
                              <>
                                {homepageContent.heroHeading.split(homepageContent.heroHighlight)[0]}
                                <span className="text-[#f5b800]">{homepageContent.heroHighlight}</span>
                                {homepageContent.heroHeading.split(homepageContent.heroHighlight)[1] || ''}
                              </>
                            ) : (
                              homepageContent.heroHeading
                            )
                          ) : (
                            <>
                              Competitive Exam<br />
                              <span className="text-[#f5b800]">Preparation</span>
                            </>
                          )}
                        </h1>

                        {/* Bullet checklist */}
                        <div className="space-y-2 text-xs font-sans font-semibold">
                          {(homepageContent.heroBullets || [
                            'Free Mock Tests',
                            'Topic Wise Tests',
                            'Previous Year Papers',
                            'Detailed Solutions & Analytics'
                          ]).map((bullet: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="w-4.5 h-4.5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                <Check className="w-2.5 h-2.5 text-green-300 stroke-[3.5]" />
                              </span>
                              <span className="text-purple-50">{bullet}</span>
                            </div>
                          ))}
                        </div>

                        {/* CTA button (Pill design with robust fonts and transition scaling) */}
                        <button
                          onClick={() => handleStartTest(tests[0])}
                          className="mt-2 px-5 py-3 bg-white text-[#5b1fc7] font-heading font-black text-xs rounded-full shadow-lg shadow-black/15 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 select-none"
                        >
                          <span>{homepageContent.heroBtnText || "Start Mock Test"}</span>
                          <ChevronRight className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>

                      {/* Right: Beautiful built-in vector illustration */}
                      <div className="relative flex flex-col items-center select-none max-w-[150px] self-end">
                        {/* Custom SVG Student vector Illustration */}
                        <svg className="w-28 h-28 select-none" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {/* Student head */}
                          <circle cx="60" cy="40" r="16" fill="#FCE0CE" />
                          {/* Hair (glasses & smart look) */}
                          <path d="M44 34C44 26 50 22 60 22C70 22 76 26 76 34C76 35 73 34 70 34C60 34 60 32 60 32C60 32 50 34 44 34Z" fill="#3C2F2F" />
                          {/* Purple Hoodie */}
                          <path d="M36 75C36 58 44 54 60 54C76 54 84 58 84 75V90H36V75Z" fill="#7b2ff7" />
                          <path d="M48 54L60 62L72 54" stroke="#5b1fc7" strokeWidth="2.5" />
                          {/* Glasses */}
                          <rect x="47" y="36" width="9" height="6" rx="1.5" stroke="#1A1A1A" strokeWidth="1.5" fill="none" />
                          <rect x="64" y="36" width="9" height="6" rx="1.5" stroke="#1A1A1A" strokeWidth="1.5" fill="none" />
                          <line x1="56" y1="39" x2="64" y2="39" stroke="#1A1A1A" strokeWidth="1.5" />
                          {/* Smiling Face details */}
                          <path d="M57 46C57 48 63 48 63 46" stroke="#C28766" strokeWidth="1.5" strokeLinecap="round" />
                          {/* Laptop with 'W' */}
                          <rect x="42" y="70" width="36" height="20" rx="2" fill="#E5E7EB" />
                          <path d="M32 90H88C88 90 84 96 80 96H40C36 96 32 90 32 90Z" fill="#9CA3AF" />
                          <text x="56" y="83" fill="#5b1fc7" fontSize="10" fontWeight="bold" fontFamily="system-ui">W</text>
                          {/* Book stacks */}
                          <rect x="88" y="78" width="22" height="5" rx="1" fill="#F59E0B" />
                          <rect x="86" y="83" width="24" height="5" rx="1" fill="#EF4444" />
                          <rect x="84" y="88" width="26" height="5" rx="1" fill="#3B82F6" />
                        </svg>
                      </div>
                    </div>

                    {/* Carousel Dots indicator */}
                    <div className="flex justify-center gap-1.5 mt-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    </div>
                  </div>

                  {/* Stats strip (white card, 4 columns) */}
                  <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-gray-100/80 grid grid-cols-4 gap-2 text-center">
                    {(homepageContent.stats || [
                      { id: '1', icon: 'ClipboardList', value: '10,000+', label: 'Tests' },
                      { id: '2', icon: 'Users', value: '50,000+', label: 'Users' },
                      { id: '3', icon: 'ShieldCheck', value: '100%', label: 'Free Tests' },
                      { id: '4', icon: 'Trophy', value: "Topper's", label: 'Choice' }
                    ]).map((st: any, idx: number) => {
                      const IconComponent = getIconByName(st.icon);
                      const colors = [
                        'bg-purple-50 text-[#5b1fc7]',
                        'bg-pink-50 text-pink-600',
                        'bg-emerald-50 text-emerald-600',
                        'bg-amber-50 text-amber-600'
                      ];
                      return (
                        <div key={st.id || idx} className="flex flex-col items-center">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${colors[idx % 4]}`}>
                            <IconComponent className="w-4.5 h-4.5" />
                          </div>
                          <span className="text-[11px] font-heading font-extrabold text-gray-900 leading-none">{st.value}</span>
                          <span className="text-[8px] text-gray-400 font-sans mt-0.5">{st.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick-access icons row (6 circular icons) */}
                  <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-gray-100/80 grid grid-cols-6 gap-1 text-center">
                    {(homepageContent.quickIcons || [
                      { id: '1', icon: 'ClipboardList', label: 'All Tests', tab: 'tests', style: 'bg-purple-100 text-purple-700' },
                      { id: '2', icon: 'Building', label: 'Govt. Exams', tab: 'tests', style: 'bg-emerald-100 text-emerald-700' },
                      { id: '3', icon: 'Book', label: 'Subject Tests', tab: 'tests', style: 'bg-amber-100 text-amber-700' },
                      { id: '4', icon: 'FileText', label: 'Previous Papers', tab: 'tests', style: 'bg-blue-100 text-blue-700' },
                      { id: '5', icon: 'Calendar', label: 'Daily Tests', tab: 'practice', style: 'bg-rose-100 text-rose-700' },
                      { id: '6', icon: 'BarChart', label: 'Performance', tab: 'results', style: 'bg-indigo-100 text-indigo-700' }
                    ]).map((qa: any, idx: number) => {
                      const IconComponent = getIconByName(qa.icon);
                      return (
                        <button 
                          key={qa.id || idx} 
                          onClick={() => setActiveTab(qa.tab)}
                          className="flex flex-col items-center focus:outline-hidden active:scale-95 transition-all"
                        >
                          <div className={`w-9.5 h-9.5 rounded-full flex items-center justify-center mb-1.5 shadow-xs ${qa.style}`}>
                            <IconComponent className="w-4.5 h-4.5" />
                          </div>
                          <span className="text-[8px] font-heading font-bold text-gray-600 leading-tight tracking-tight whitespace-nowrap overflow-hidden max-w-[62px]">
                            {qa.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* "Popular Exams" section */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <h2 className="font-heading font-black text-sm text-slate-900 tracking-wide uppercase">Popular Exams</h2>
                      <button 
                        onClick={() => setActiveTab('tests')}
                        className="text-xs font-heading font-black text-[#5b1fc7] hover:underline"
                      >
                        View All
                      </button>
                    </div>

                    {/* Horizontal scroll of 6 exam badges */}
                    <div className="flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth pb-1.5">
                      {popularExams.map(exam => (
                        <div 
                          key={exam.id}
                          onClick={() => selectExamFromPopular(exam.name)}
                          className="bg-white border border-slate-100 rounded-2xl p-3 shadow-xs hover:shadow-md transition-all shrink-0 w-[110px] text-center cursor-pointer select-none relative overflow-hidden group"
                        >
                          <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${exam.emblemColor || 'from-purple-500 to-indigo-600'} text-white flex items-center justify-center mx-auto mb-2 text-xs font-heading font-black shadow-sm group-hover:scale-105 duration-200`}>
                            {exam.code || exam.name.slice(0, 4).toUpperCase()}
                          </div>
                          <span className="text-[10px] font-heading font-black text-gray-800 block truncate">{exam.name}</span>
                          <span className="text-[9px] text-[#5b1fc7] font-mono font-bold mt-0.5 block">{exam.testsCount || '0+'} Tests</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* "Live Mock Tests" section */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <h2 className="font-heading font-black text-sm text-slate-900 tracking-wide uppercase">Live Mock Tests</h2>
                        <span className="px-2 py-0.5 bg-red-500 text-white text-[9px] font-black rounded-sm uppercase tracking-wider animate-pulse">LIVE</span>
                      </div>
                      <button 
                        onClick={() => setActiveTab('tests')}
                        className="text-xs font-heading font-black text-[#5b1fc7] hover:underline"
                      >
                        View All
                      </button>
                    </div>

                    {/* List of mock test cards */}
                    <div className="space-y-2.5">
                      {tests.slice(0, 3).map((test, index) => {
                        const isPremiumLocked = !test.isFree && !user.isPremium;
                        return (
                          <div 
                            key={test.id}
                            className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-3 relative overflow-hidden group hover:border-slate-200 transition-all"
                          >
                            {/* Color bar indicator */}
                            <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${index === 0 ? 'bg-indigo-500' : index === 1 ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                            
                            <div className="flex-1 min-w-0 pl-1.5">
                              <h3 className="font-heading font-black text-xs.5 text-slate-900 truncate leading-snug group-hover:text-[#5b1fc7] transition-all">
                                {test.title}
                              </h3>
                              <p className="text-[9px] text-slate-400 font-mono mt-1">
                                {test.questionsCount} Questions · {test.durationMinutes} Minutes · 👥 {test.studentsRegisteredCount} Students
                              </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-[10px] font-heading font-black text-green-600 mb-0.5 uppercase tracking-wide">FREE</span>
                              
                              <button
                                onClick={() => handleStartTest(test)}
                                className="px-4 py-2 bg-[#5b1fc7] hover:bg-[#7b2ff7] text-white font-heading font-black text-xs rounded-lg shadow-sm transition-all active:scale-95"
                              >
                                Start Test
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                             {/* "Go Premium" banner (purple gradient card with yellow accent) */}
                  <div className="bg-gradient-to-r from-[#5b1fc7] to-[#9156f7] rounded-[20px] p-5 text-white flex items-center gap-4 shadow-lg shadow-purple-200/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full translate-x-4 -translate-y-4 blur-sm pointer-events-none" />
                    
                    <div className="w-12 h-12 bg-[#f5b800] rounded-full flex items-center justify-center text-white shadow-inner shrink-0 animate-pulse">
                      <Crown className="w-6 h-6 text-slate-900 fill-slate-900" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-heading font-black text-lg text-white">
                        {homepageContent.premiumBannerTitle || "Go Premium ⭐"}
                      </h4>
                      <p className="text-[11px] text-purple-100 font-sans mt-0.5">
                        {homepageContent.premiumBannerText || "Unlock All Tests, Detailed Analysis, All India Rank & More"}
                      </p>
                    </div>

                    <button
                      onClick={() => setShowPremiumModal(true)}
                      className="px-5 py-2.5 bg-[#f5b800] hover:bg-[#e0a800] text-slate-900 font-heading font-black text-xs rounded-full shadow-md shadow-black/10 transition-all active:scale-95 shrink-0"
                    >
                      {homepageContent.premiumBannerBtnText || "Upgrade Now →"}
                    </button>
                  </div>

                  {/* "Our Top Performers" section */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <h2 className="font-heading font-black text-sm text-slate-900 tracking-wide uppercase">Our Top Performers</h2>
                      <span className="text-xs font-heading font-black text-slate-400">View All</span>
                    </div>

                    {/* Horizontal grid of performers */}
                    <div className="grid grid-cols-4 gap-2">
                      {topPerformers.map(perf => (
                        <div 
                          key={perf.id}
                          className={`bg-gradient-to-br border rounded-2xl p-2 text-center shadow-xs flex flex-col justify-between h-[115px] ${perf.color || 'from-[#5b1fc7]/10 to-indigo-500/10 border-indigo-100'}`}
                        >
                          <div className="relative mx-auto mb-1">
                            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white ring-2 ring-brand-primary/10">
                              <img 
                                src={perf.photoUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${perf.avatarSeed || perf.name}`} 
                                alt={perf.name} 
                                className="w-full h-full object-cover bg-gray-50"
                              />
                            </div>
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-gray-900 font-bold text-[8px] rounded-full flex items-center justify-center shadow-sm">
                              {perf.rank}
                            </span>
                          </div>
                          
                          <div>
                            <span className="text-[9px] font-heading font-bold text-gray-900 truncate block">{perf.name}</span>
                            <span className="text-[8px] text-gray-400 block font-mono">Rank {perf.rank}</span>
                          </div>
                          <span className="text-[8px] bg-white text-brand-primary font-bold px-1 py-0.5 rounded-sm font-heading block mt-1 truncate">
                            {perf.exam}
                          </span>
                        </div>
                      ))}
                    </div>              </div>
                  </div>

                  {/* 💼 GOVERNMENT JOB NOTIFICATIONS SECTION */}
                  <GovtJobAlerts language={language} />

                </div>
              ) : activeTab === 'tests' ? (
                /* 📝 TESTS TAB */
                <TestsTab 
                  user={user}
                  tests={tests}
                  onStartTest={handleStartTest}
                  onGoPremium={() => setShowPremiumModal(true)}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  language={language}
                />
              ) : activeTab === 'results' ? (
                /* 📊 RESULTS TAB */
                <ResultsTab 
                  attempts={attempts}
                  onViewDetails={(test, att) => {
                    setSelectedReviewTest(test);
                    setActiveAttempt(att);
                  }}
                  language={language}
                />
              ) : activeTab === 'practice' ? (
                /* 📖 PRACTICE TAB (Flashcards revision) */
                <PracticeTab language={language} />
              ) : (
                /* 👥 PROFILE TAB */
                <ProfileTab 
                  user={user}
                  setUser={setUser}
                  onGoPremium={() => setShowPremiumModal(true)}
                  language={language}
                />
              )}

            </main>

            {/* Bottom navigation bar (dark purple) */}
            <nav className="absolute bottom-0 left-0 right-0 bg-[#1e133d] border-t border-purple-950/40 px-4 py-2 flex items-center justify-around z-30 shadow-2xl shrink-0">
              {[
                { id: 'home', icon: Home, label: 'Home' },
                { id: 'tests', icon: ClipboardList, label: 'Tests' },
                { id: 'practice', icon: BookOpen, label: 'Practice', isRaised: true },
                { id: 'results', icon: BarChart, label: 'Results' },
                { id: 'profile', icon: User, label: 'Profile' }
              ].map(item => {
                const isActive = activeTab === item.id;
                
                if (item.isRaised) {
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); setSearchQuery(''); }}
                      className="relative -top-5 flex flex-col items-center focus:outline-hidden"
                    >
                      <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#5b1fc7] to-[#7b2ff7] border-4 border-[#f4f5f9] flex items-center justify-center text-white shadow-lg shadow-brand-primary/20 active:scale-95 transition-all">
                        <item.icon className="w-5.5 h-5.5 text-white" />
                      </div>
                      <span className="font-heading font-extrabold text-[9px] text-[#5b1fc7] mt-1">Practice</span>
                    </button>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setSearchQuery(''); }}
                    className={`flex flex-col items-center py-1 px-2.5 focus:outline-hidden transition-all ${isActive ? 'text-white' : 'text-purple-300/60 hover:text-purple-100'}`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-[9px] font-heading font-bold mt-1.5">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </>
        )}

      </div>

      {/* Confetti-style beautiful Modal for Premium checkout flow */}
      <AnimatePresence>
        {showPremiumModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowPremiumModal(false)} />
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl relative z-10 text-left"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center gap-3 mb-4.5 pb-2 border-b border-gray-50">
                <div className="w-11 h-11 bg-amber-400 text-gray-900 rounded-2xl flex items-center justify-center shadow-md animate-pulse shrink-0">
                  <Crown className="w-5.5 h-5.5 fill-current" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-gray-950 leading-tight">Unlock WBMockTest Premium</h3>
                  <p className="text-xs text-gray-500 font-sans leading-none mt-0.5">Instant unlimited study access</p>
                </div>
              </div>

              {paymentSuccess ? (
                <div className="py-8 text-center space-y-3.5 animate-fadeIn">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-scaleIn">
                    <Check className="w-7 h-7 stroke-[3]" />
                  </div>
                  <h4 className="font-heading font-extrabold text-lg text-emerald-950">Payment Successful!</h4>
                  <p className="text-xs text-gray-500 max-w-[200px] mx-auto font-sans leading-relaxed">
                    Welcome to the Pro family, Sanjoy! All tests and explanations are now unlocked.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  {/* Bullet points of pro value */}
                  <div className="space-y-2 text-xs font-sans font-medium text-gray-600">
                    {[
                      'Access 1,000+ mock tests and topic quizzes',
                      'Step-by-step academic solutions and guidelines',
                      'Detailed score analytics with negative-marking',
                      'Syllabus mapping and performance history log'
                    ].map((bull, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                        <span className="leading-tight">{bull}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Toggle simulated */}
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 flex justify-between items-center text-left">
                    <div>
                      <span className="text-[10px] text-amber-500 font-bold font-heading">MEMBERSHIP PLAN</span>
                      <p className="text-sm font-heading font-extrabold text-gray-900 mt-0.5">WBMockTest Pro Combo</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-heading font-extrabold text-brand-primary">₹149</span>
                      <span className="text-[10px] text-gray-400 font-mono"> / mo</span>
                    </div>
                  </div>

                  {/* Simulated payment inputs */}
                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[10px] font-heading font-extrabold text-gray-400 block mb-1">PAYMENT NAME</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Sanjoy Mahato"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-brand-primary focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-heading font-extrabold text-gray-400 block mb-1">MOCK CREDIT CARD NUMBER</label>
                      <div className="flex bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 items-center gap-2 focus-within:border-brand-primary focus-within:bg-white">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <input 
                          type="text" 
                          required
                          maxLength={19}
                          placeholder="4111 2222 3333 4444"
                          value={cardNumber}
                          onChange={(e) => {
                            // formatting card numbers with spaces
                            const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                            setCardNumber(val);
                          }}
                          className="w-full bg-transparent border-none text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowPremiumModal(false)}
                      className="flex-1 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 font-heading font-bold text-xs rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-gradient-to-r from-[#5b1fc7] to-[#7b2ff7] text-white font-heading font-bold text-xs rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-1 shadow-md shadow-brand-primary/10"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-100" />
                      <span>Activate Premium</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
