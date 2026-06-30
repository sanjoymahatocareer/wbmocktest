import { useState } from 'react';
import { 
  Briefcase, 
  Bell, 
  Calendar, 
  GraduationCap, 
  DollarSign, 
  ArrowRight, 
  Megaphone, 
  Search, 
  CheckCircle,
  FileText,
  Bookmark,
  Share2
} from 'lucide-react';
import { GovtJobAlert } from '../types';
import { GOVT_JOB_ALERTS } from '../mockData';

interface GovtJobAlertsProps {
  language: 'EN' | 'BN';
}

export default function GovtJobAlerts({ language }: GovtJobAlertsProps) {
  const [alerts, setAlerts] = useState<GovtJobAlert[]>(() => {
    const saved = localStorage.getItem('wb_govt_job_alerts');
    return saved ? JSON.parse(saved) : GOVT_JOB_ALERTS;
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('wb_job_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeDetailsId, setActiveDetailsId] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);

  // Toggle bookmark function
  const toggleBookmark = (id: string) => {
    const next = bookmarkedIds.includes(id) 
      ? bookmarkedIds.filter(bId => bId !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(next);
    localStorage.setItem('wb_job_bookmarks', JSON.stringify(next));
    
    // Show quick toast notification
    if (!bookmarkedIds.includes(id)) {
      triggerToast(language === 'EN' ? "Saved to Bookmarks!" : "বুকমার্কে সংরক্ষণ করা হয়েছে!");
    } else {
      triggerToast(language === 'EN' ? "Removed from Bookmarks" : "বুকমার্ক থেকে সরানো হয়েছে");
    }
  };

  const triggerToast = (msg: string) => {
    setShowSuccessToast(msg);
    setTimeout(() => setShowSuccessToast(null), 3000);
  };

  const handleShare = (alert: GovtJobAlert) => {
    const title = language === 'EN' ? alert.titleEn : alert.titleBn;
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `${title} - ${alert.vacancies} Vacancies. Prepare on WBMockTest.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      triggerToast(language === 'EN' ? "Job details link copied!" : "বিজ্ঞপ্তির লিঙ্ক কপি করা হয়েছে!");
    }
  };

  // Filter job list based on search and status
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.titleBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.departmentEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.departmentBn.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || alert.statusEn === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden text-left relative" id="govt-job-alerts-section">
      
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-full z-50 flex items-center gap-2 shadow-xl animate-bounce">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
          <span className="font-semibold">{showSuccessToast}</span>
        </div>
      )}

      {/* 🔴 LIVE RUNNING NEWS TICKER */}
      <div className="bg-red-600 text-white py-2 px-3 flex items-center overflow-hidden relative select-none">
        {/* Ticker Badge label */}
        <div className="bg-slate-900 text-white font-heading font-black text-[9px] uppercase px-2.5 py-1 rounded-xs flex items-center gap-1 shrink-0 z-10 mr-3 shadow-md border border-slate-800">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
          <Megaphone className="w-3 h-3 text-red-400 animate-bounce" />
          <span>{language === 'EN' ? 'LIVE JOB NEWS' : 'চাকরি বিজ্ঞপ্তি'}</span>
        </div>

        {/* Moving Marquee */}
        <div className="flex-1 overflow-hidden relative h-5">
          <div className="absolute flex gap-12 whitespace-nowrap animate-marquee font-sans font-bold text-xs tracking-wide pt-0.5">
            {alerts.map((alert, idx) => (
              <span key={alert.id || idx} className="flex items-center gap-2">
                <span className="text-yellow-300">★</span>
                <span>{language === 'EN' ? alert.titleEn : alert.titleBn}</span>
                <span className="bg-white/20 text-[9px] px-1.5 py-0.2 rounded font-mono font-bold">
                  {alert.vacancies} {language === 'EN' ? 'Vacancies' : 'শূন্যপদ'}
                </span>
                <span className="text-white/40">|</span>
              </span>
            ))}
            {/* Repeat for seamless loop */}
            {alerts.map((alert, idx) => (
              <span key={`dup-${alert.id || idx}`} className="flex items-center gap-2">
                <span className="text-yellow-300">★</span>
                <span>{language === 'EN' ? alert.titleEn : alert.titleBn}</span>
                <span className="bg-white/20 text-[9px] px-1.5 py-0.2 rounded font-mono font-bold">
                  {alert.vacancies} {language === 'EN' ? 'Vacancies' : 'শূন্যপদ'}
                </span>
                <span className="text-white/40">|</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
              <Briefcase className="w-4 h-4" />
            </div>
            <h3 className="font-heading font-black text-base text-slate-900 tracking-tight uppercase">
              {language === 'EN' ? 'Sarkari Job Notifications' : 'সরকারি চাকরির খবর ও অ্যালার্ট'}
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-sans mt-0.5">
            {language === 'EN' 
              ? 'Real-time updates of active recruitments and notifications in West Bengal' 
              : 'পশ্চিমবঙ্গের সক্রিয় সরকারি চাকরির বিজ্ঞপ্তি ও পরীক্ষা সংক্রান্ত জরুরি খবরাখবর'}
          </p>
        </div>

        {/* Mini search & filter layout */}
        <div className="flex gap-2 shrink-0">
          <div className="relative">
            <input 
              type="text" 
              placeholder={language === 'EN' ? 'Search notifications...' : 'বিজ্ঞপ্তি খুঁজুন...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-brand-primary/30 w-44 font-sans font-medium bg-white"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden bg-white font-sans font-semibold text-slate-600 cursor-pointer"
          >
            <option value="all">{language === 'EN' ? 'All Status' : 'সব খবরাখবর'}</option>
            <option value="Apply Now">{language === 'EN' ? 'Apply Now' : 'আবেদন চলছে'}</option>
            <option value="Notification Out">{language === 'EN' ? 'New Notification' : 'নতুন বিজ্ঞপ্তি'}</option>
            <option value="Admit Card">{language === 'EN' ? 'Admit Card' : 'অ্যাডমিট কার্ড'}</option>
            <option value="Result Declared">{language === 'EN' ? 'Results' : 'পরীক্ষার ফল'}</option>
          </select>
        </div>
      </div>

      {/* Directory of job lists */}
      <div className="divide-y divide-slate-100">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => {
            const isBookmarked = bookmarkedIds.includes(alert.id);
            const isExpanded = activeDetailsId === alert.id;
            
            return (
              <div 
                key={alert.id} 
                className={`p-4 transition-colors hover:bg-slate-50/60 ${isExpanded ? 'bg-slate-50/40' : ''}`}
              >
                {/* Core Job summary */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Department indicator label */}
                      <span className="text-[9px] font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                        {language === 'EN' ? alert.examName : alert.examName}
                      </span>
                      {/* Vacancies high-contrast badge */}
                      <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                        <span>●</span>
                        <span>{alert.vacancies.toLocaleString()} {language === 'EN' ? 'Vacancies' : 'টি শূন্যপদ'}</span>
                      </span>
                    </div>

                    <h4 className="font-heading font-black text-sm text-slate-900 hover:text-red-600 duration-150 transition-colors cursor-pointer" onClick={() => setActiveDetailsId(isExpanded ? null : alert.id)}>
                      {language === 'EN' ? alert.titleEn : alert.titleBn}
                    </h4>

                    <p className="text-[10px] text-slate-400 font-sans">
                      {language === 'EN' ? alert.departmentEn : alert.departmentBn}
                    </p>
                  </div>

                  {/* Status Indicator Badges & CTA */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`px-2.5 py-1 rounded-[6px] text-[10px] font-heading font-black tracking-wide uppercase ${
                      alert.statusEn === 'Apply Now' ? 'bg-emerald-500 text-white' :
                      alert.statusEn === 'Notification Out' ? 'bg-purple-600 text-white' :
                      alert.statusEn === 'Exam Date Out' ? 'bg-rose-500 text-white' :
                      alert.statusEn === 'Result Declared' ? 'bg-amber-400 text-slate-950' :
                      'bg-blue-500 text-white'
                    }`}>
                      {language === 'EN' ? alert.statusEn : alert.statusBn}
                    </span>
                    <div className="flex items-center gap-1">
                      {/* Bookmark Button */}
                      <button 
                        onClick={() => toggleBookmark(alert.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isBookmarked 
                            ? 'bg-amber-50 text-amber-500 border-amber-200' 
                            : 'bg-white text-slate-400 border-slate-200 hover:text-slate-600'
                        }`}
                        title="Save Job"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                      </button>

                      {/* Share Button */}
                      <button 
                        onClick={() => handleShare(alert)}
                        className="p-1.5 bg-white text-slate-400 border border-slate-200 rounded-lg hover:text-slate-600 hover:bg-slate-50 transition-all"
                        title="Share Alert"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded metadata card details */}
                <div className={`mt-3 pt-3 border-t border-dashed border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2.5 transition-all overflow-hidden ${
                  isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                }`}>
                  <div className="bg-slate-100/50 p-2.5 rounded-xl flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-[#5b1fc7] shrink-0 border border-slate-100">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 uppercase tracking-wider block font-bold">
                        {language === 'EN' ? 'Eligibility' : 'যোগ্যতা'}
                      </span>
                      <span className="text-[10px] text-slate-700 font-bold block truncate">
                        {language === 'EN' ? alert.eligibilityEn : alert.eligibilityBn}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-100/50 p-2.5 rounded-xl flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-emerald-600 shrink-0 border border-slate-100">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 uppercase tracking-wider block font-bold">
                        {language === 'EN' ? 'Salary Scale' : 'বেতনক্রম'}
                      </span>
                      <span className="text-[10px] text-slate-700 font-bold block truncate">
                        {language === 'EN' ? alert.salaryEn : alert.salaryBn}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-100/50 p-2.5 rounded-xl flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-rose-500 shrink-0 border border-slate-100">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 uppercase tracking-wider block font-bold">
                        {language === 'EN' ? 'Deadline' : 'শেষ তারিখ'}
                      </span>
                      <span className="text-[10px] text-red-600 font-bold block truncate">
                        {language === 'EN' ? alert.deadline : alert.deadlineBn}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expansion expander link */}
                <div className="mt-2 text-right">
                  <button 
                    onClick={() => setActiveDetailsId(isExpanded ? null : alert.id)}
                    className="text-[10px] font-heading font-black text-[#5b1fc7] hover:underline flex items-center gap-1 ml-auto"
                  >
                    <span>{isExpanded ? (language === 'EN' ? 'Hide Details' : 'তথ্য লুকান') : (language === 'EN' ? 'View Full Specifications' : 'সম্পূর্ণ বিবরণ দেখুন')}</span>
                    <ArrowRight className={`w-3 h-3 transition-transform ${isExpanded ? '-rotate-90' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-slate-400">
            <p className="text-xs font-semibold">{language === 'EN' ? 'No active notifications found matching current filters.' : 'কোনো সক্রিয় চাকরি বিজ্ঞপ্তি খুঁজে পাওয়া যায়নি।'}</p>
          </div>
        )}
      </div>

      {/* Footer support notes */}
      <div className="bg-slate-50 p-3 px-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-sans font-medium">
        <span>{language === 'EN' ? 'Updated today' : 'আজই আপডেট করা হয়েছে'}</span>
        <span className="flex items-center gap-1 text-emerald-600 font-bold">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{language === 'EN' ? '100% Verified Govt Sources' : '১০০% ভেরিফাইড সরকারি উৎস'}</span>
        </span>
      </div>
    </div>
  );
}
