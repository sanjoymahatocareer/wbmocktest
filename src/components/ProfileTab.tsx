import { useState, Dispatch, SetStateAction } from 'react';
import { UserProfile, ExamCategory } from '../types';
import { Sparkles, Calendar, BookOpen, Flame, Check, Mail, Settings } from 'lucide-react';

interface ProfileTabProps {
  user: UserProfile;
  setUser: Dispatch<SetStateAction<UserProfile>>;
  onGoPremium: () => void;
  language: 'EN' | 'BN';
}

const EXAM_OPTIONS: ExamCategory[] = ['WBCS', 'WBPSC', 'WBP Constable', 'KP Constable', 'SSC GD', 'Railway NTPC', 'Bank Exams'];

export default function ProfileTab({ user, setUser, onGoPremium, language }: ProfileTabProps) {
  const [showPreferencesEdit, setShowPreferencesEdit] = useState(false);

  const togglePreference = (pref: ExamCategory) => {
    setUser(prev => {
      const isSelected = prev.examPreferences.includes(pref);
      let updated: ExamCategory[] = [];
      if (isSelected) {
        updated = prev.examPreferences.filter(p => p !== pref);
      } else {
        updated = [...prev.examPreferences, pref];
      }
      return { ...prev, examPreferences: updated };
    });
  };

  // Mock days checkin calendar representation for June 2026
  const mockStudyDays = [1, 2, 4, 5, 8, 9, 10, 11, 12, 15, 16, 21, 22, 23, 24, 25, 26, 27, 28, 29];

  return (
    <div className="p-4 space-y-4 font-sans text-gray-800">
      {/* Upper Profile Info */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs relative overflow-hidden text-left">
        {/* Settings Gear */}
        <button className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-50 text-gray-400">
          <Settings className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-primary/10 shadow-sm"
            />
            {user.isPremium && (
              <span className="absolute -bottom-1 -right-1 w-5.5 h-5.5 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center text-amber-900 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
              </span>
            )}
          </div>
          
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-heading font-extrabold text-base text-gray-950 leading-tight">
                {user.name}
              </h2>
              {user.isPremium && (
                <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold font-heading px-1.5 py-0.5 rounded-full border border-amber-200">PRO</span>
              )}
            </div>
            
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <span>{user.email}</span>
            </p>
            
            <p className="text-[10px] text-gray-400 mt-1 font-mono">
              {language === 'EN' ? "Student ID: " : "শিক্ষার্থী আইডি: "}#WB-94254-2026
            </p>
          </div>
        </div>

        {/* Streak & Completion Stats */}
        <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-3 bg-rose-50/50 p-2.5 rounded-xl border border-rose-100/50">
            <div className="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block leading-none uppercase">
                {language === 'EN' ? "DAILY STREAK" : "স্ট্রিক ধারাবাহিকতা"}
              </span>
              <span className="text-sm font-heading font-extrabold text-rose-900">
                {user.streakDays} {language === 'EN' ? "Days" : "দিন"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-brand-primary/5 p-2.5 rounded-xl border border-brand-primary/10">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-brand-primary shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block leading-none uppercase">
                {language === 'EN' ? "COMPLETED" : "সম্পন্ন মক"}
              </span>
              <span className="text-sm font-heading font-extrabold text-brand-primary">
                {user.totalMockTestsCompleted} {language === 'EN' ? "Mocks" : "মক"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium upgrade callout */}
      {!user.isPremium && (
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl p-4 text-gray-900 shadow-md text-left flex justify-between items-center gap-4">
          <div className="space-y-1">
            <h3 className="font-heading font-extrabold text-sm flex items-center gap-1.5 text-gray-950">
              <Sparkles className="w-4 h-4 fill-current" /> 
              {language === 'EN' ? "Upgrade to Premium" : "প্রিমিয়াম সাবস্ক্রিপশন নিন"}
            </h3>
            <p className="text-[11px] text-gray-800 leading-normal font-sans">
              {language === 'EN' 
                ? "Get unlimited mock papers, deep analytics, and all answers instantly!"
                : "আনলিমিটেড মক পেপার, বিস্তারিত বিশ্লেষণ এবং সব উত্তর তৎক্ষণাৎ পান!"}
            </p>
          </div>
          <button 
            onClick={onGoPremium}
            className="px-3.5 py-1.5 bg-gray-950 text-white hover:bg-gray-900 font-heading font-extrabold text-xs rounded-xl shadow-md transition-colors whitespace-nowrap"
          >
            {language === 'EN' ? "Go Pro ⭐" : "প্রো মেম্বার ⭐"}
          </button>
        </div>
      )}

      {/* Study Streak Activity Tracker Calendar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-xs text-left">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-brand-primary" />
            <span className="font-heading font-bold text-xs text-gray-900 uppercase tracking-wider">
              {language === 'EN' ? "Study Attendance" : "পড়াশোনার উপস্থিতি"}
            </span>
          </div>
          <span className="text-[10px] font-mono text-gray-400 font-bold">
            {language === 'EN' ? "JUNE 2026" : "জুন ২০২৬"}
          </span>
        </div>

        {/* Calendar Days grid */}
        <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] font-bold text-gray-400">
          {language === 'EN' ? (
            <><span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span></>
          ) : (
            <><span>র</span><span>সো</span><span>ম</span><span>বু</span><span>বৃ</span><span>শু</span><span>শ</span></>
          )}
          
          {/* Pad dates for June 2026 (Starts on a Monday) */}
          <span className="opacity-0">0</span>
          
          {Array.from({ length: 30 }, (_, i) => {
            const dayNum = i + 1;
            const isStudied = mockStudyDays.includes(dayNum);
            return (
              <span 
                key={dayNum}
                className={`h-6.5 w-6.5 mx-auto rounded-md flex items-center justify-center text-xs transition-colors ${isStudied ? 'bg-emerald-500 text-white font-bold shadow-xs' : 'bg-gray-50 text-gray-400'}`}
              >
                {dayNum}
              </span>
            );
          })}
        </div>
        <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-gray-50 text-[10px] text-gray-400 font-sans">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" /> 
            {language === 'EN' ? "Studied (Check-in)" : "অনুশীলন সম্পন্ন হয়েছে"}
          </span>
          <span>
            {language === 'EN' ? "Target: 25 mock sessions" : "লক্ষ্য: ২৫টি মক সেশন"}
          </span>
        </div>
      </div>

      {/* Exam Preferences section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-xs text-left">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-heading font-bold text-xs text-gray-900 uppercase tracking-wider">
            {language === 'EN' ? "Exam Preferences" : "পরীক্ষার পছন্দসমূহ"}
          </h3>
          <button 
            onClick={() => setShowPreferencesEdit(!showPreferencesEdit)}
            className="text-xs font-heading font-bold text-brand-primary hover:underline"
          >
            {showPreferencesEdit 
              ? (language === 'EN' ? 'Save Details' : 'সংরক্ষণ করুন') 
              : (language === 'EN' ? 'Manage' : 'পরিবর্তন করুন')}
          </button>
        </div>

        {showPreferencesEdit ? (
          <div className="flex flex-wrap gap-1.5">
            {EXAM_OPTIONS.map(opt => {
              const isSelected = user.examPreferences.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => togglePreference(opt)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${isSelected ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                >
                  <span className="flex items-center gap-1">
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{opt}</span>
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {user.examPreferences.map(pref => (
              <span 
                key={pref} 
                className="px-3 py-1 bg-indigo-50 text-brand-primary border border-indigo-100/50 rounded-full text-xs font-semibold"
              >
                {pref}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
