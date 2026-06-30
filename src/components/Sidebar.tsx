import { motion } from 'motion/react';
import { X, BookOpen, Calendar, HelpCircle, Award, ShieldAlert, Sparkles, Languages, Share2 } from 'lucide-react';
import { UserProfile } from '../types';
import { translateUI } from '../utils/translations';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onGoPremium: () => void;
  language: 'EN' | 'BN';
  setLanguage: (lang: 'EN' | 'BN') => void;
  onOpenAdmin: () => void;
  onSelectJobAlerts?: () => void;
}

export default function Sidebar({ isOpen, onClose, user, onGoPremium, language, setLanguage, onOpenAdmin, onSelectJobAlerts }: SidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar Content */}
      <motion.div 
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50 shadow-2xl flex flex-col justify-between overflow-y-auto"
      >
        <div>
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="font-heading font-bold text-gray-900 text-lg">
                  <span className="text-[#5b1fc7]">WB</span>{translateUI('appName', language).replace('WB', '')}
                </span>
                <p className="text-[10px] text-gray-500 font-sans">{translateUI('tagline', language)}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User profile brief */}
          <div className="p-4 bg-gray-50 flex items-center gap-3">
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-primary/20"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-heading font-semibold text-gray-900 text-sm truncate flex items-center gap-1.5">
                {user.name}
                {user.isPremium && (
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                )}
              </h4>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>

          {/* Nav links */}
          <div className="p-4 space-y-1.5">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-primary transition-all text-left">
              <Calendar className="w-4 h-4 text-brand-primary" />
              <span>{translateUI('examCalendar', language)}</span>
              <span className="ml-auto text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold font-mono">NEW</span>
            </button>
            <button 
              onClick={() => {
                onClose();
                if (onSelectJobAlerts) onSelectJobAlerts();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-primary transition-all text-left"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>{translateUI('jobAlerts', language)}</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-primary transition-all text-left">
              <Languages className="w-4 h-4 text-emerald-500" />
              <div className="flex items-center justify-between flex-1">
                <span>{translateUI('appLanguage', language)}</span>
                <div className="flex bg-gray-100 p-0.5 rounded-md text-xs font-bold font-sans">
                  <span 
                    onClick={(e) => { e.stopPropagation(); setLanguage('EN'); }}
                    className={`px-1.5 py-0.5 rounded ${language === 'EN' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500'}`}
                  >
                    EN
                  </span>
                  <span 
                    onClick={(e) => { e.stopPropagation(); setLanguage('BN'); }}
                    className={`px-1.5 py-0.5 rounded ${language === 'BN' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500'}`}
                  >
                    বাং
                  </span>
                </div>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-primary transition-all text-left">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              <span>{translateUI('syllabusGuide', language)}</span>
            </button>
            <button 
              onClick={() => {
                onClose();
                if (navigator.share) {
                  navigator.share({
                    title: 'WBMockTest',
                    text: 'Practice mock tests for West Bengal competitive exams!',
                    url: window.location.href,
                  }).catch(() => {});
                } else {
                  alert('Link copied to clipboard!');
                }
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-primary transition-all text-left"
            >
              <Share2 className="w-4 h-4 text-pink-500" />
              <span>{translateUI('shareFriends', language)}</span>
            </button>
            <button 
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:text-[#5b1fc7] transition-all text-left bg-indigo-50/40 border border-indigo-100/50 mt-2"
            >
              <ShieldAlert className="w-4 h-4 text-[#5b1fc7]" />
              <span>{translateUI('adminConsole', language)}</span>
            </button>
          </div>
        </div>

        {/* Premium Upgrade bottom card */}
        <div className="p-4 border-t border-gray-100">
          {!user.isPremium ? (
            <div className="p-3.5 bg-gradient-to-br from-[#5b1fc7] to-[#7b2ff7] rounded-xl text-white relative overflow-hidden shadow-md">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full translate-x-4 -translate-y-4 blur-sm" />
              <span className="inline-flex items-center gap-1 text-[10px] bg-amber-400 text-gray-900 font-bold px-1.5 py-0.5 rounded-full mb-2">
                <Sparkles className="w-2.5 h-2.5 fill-current" /> BEST VALUE
              </span>
              <h5 className="font-heading font-bold text-sm mb-1 text-white">{translateUI('unlockPremium', language)}</h5>
              <p className="text-[11px] text-purple-100 mb-3">{translateUI('premiumSubtitle', language)}</p>
              <button 
                onClick={() => {
                  onClose();
                  onGoPremium();
                }}
                className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-heading font-bold text-xs py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 shadow-sm shadow-amber-500/20"
              >
                {translateUI('upgradeNowArrow', language)}
              </button>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Sparkles className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h5 className="font-heading font-bold text-xs text-emerald-900">{translateUI('premiumActive', language)}</h5>
                <p className="text-[10px] text-emerald-600 font-medium">{translateUI('premiumActiveSubtitle', language)}</p>
              </div>
            </div>
          )}
          
          <div className="text-center mt-3">
            <span className="text-[10px] text-gray-400 font-mono">{translateUI('version', language)}</span>
          </div>
        </div>
      </motion.div>
    </>
  );
}
