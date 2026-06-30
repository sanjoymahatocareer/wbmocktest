import { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { Menu, Search, Bell, BookOpen, Check, Trash2, X } from 'lucide-react';
import { NotificationItem } from '../types';
import { translateUI } from '../utils/translations';

interface HeaderProps {
  onMenuClick: () => void;
  notifications: NotificationItem[];
  setNotifications: Dispatch<SetStateAction<NotificationItem[]>>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onActiveTabChange: (tab: string) => void;
  language: 'EN' | 'BN';
}

export default function Header({ 
  onMenuClick, 
  notifications, 
  setNotifications, 
  searchQuery, 
  setSearchQuery,
  onActiveTabChange,
  language
}: HeaderProps) {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleSearchClick = () => {
    setShowSearchInput(prev => !prev);
    if (!showSearchInput) {
      setTimeout(() => searchRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 bg-white border-b border-gray-100 z-30 px-4 py-3 shadow-xs">
      <div className="flex items-center justify-between">
        {/* Left: menu + logo */}
        <div className="flex items-center gap-2.5">
          <button 
            id="hamburger-menu-btn"
            onClick={onMenuClick}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 active:scale-95 transition-all"
            aria-label="Menu"
          >
            <Menu className="w-5.5 h-5.5 stroke-[2.2]" />
          </button>
          
          <div 
            onClick={() => {
              onActiveTabChange('home');
              setSearchQuery('');
              setShowSearchInput(false);
            }}
            className="flex items-center gap-1.5 cursor-pointer select-none"
          >
            <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-tr from-[#5b1fc7] to-[#7b2ff7] flex items-center justify-center text-white shadow-lg">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="font-heading font-black text-[16px] leading-none text-slate-900 tracking-tight">
                <span className="text-[#5b1fc7]">WB</span>{translateUI('appName', language).replace('WB', '')}
              </div>
              <p className="text-[9px] text-slate-400 font-sans tracking-wider uppercase leading-none font-bold mt-0.5">{translateUI('tagline', language)}</p>
            </div>
          </div>
        </div>

        {/* Right: Search and notifications */}
        <div className="flex items-center gap-1.5 relative">
          {/* Animated Search Bar for Mobile layout */}
          <div className={`flex items-center overflow-hidden transition-all duration-300 ${showSearchInput ? 'w-[160px] md:w-[200px] opacity-100 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 mr-1' : 'w-0 opacity-0'}`}>
            <input
              ref={searchRef}
              type="text"
              placeholder={translateUI('searchPlaceholder', language)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-xs text-gray-800 focus:outline-hidden placeholder-gray-400 font-sans"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-0.5 rounded-full hover:bg-gray-200 text-gray-400">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button 
            id="search-toggle-btn"
            onClick={handleSearchClick}
            className={`p-1.5 rounded-lg active:scale-95 transition-all ${showSearchInput ? 'bg-brand-primary/10 text-brand-primary' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            <Search className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              id="notifications-bell-btn"
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className={`p-1.5 rounded-lg active:scale-95 transition-all relative ${showNotifDropdown ? 'bg-brand-primary/10 text-brand-primary' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <Bell className="w-5 h-5 stroke-[2.2]" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-red-500 border-2 border-white text-[9px] font-bold text-white rounded-full flex items-center justify-center font-mono animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown Card */}
            {showNotifDropdown && (
              <div className="absolute right-0 mt-2.5 w-[290px] bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-gray-100">
                <div className="p-3 flex items-center justify-between bg-gray-50">
                  <span className="font-heading font-bold text-xs text-gray-900">{translateUI('notifications', language)} ({unreadCount})</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-[10px] text-brand-primary font-heading font-bold hover:underline flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> {translateUI('markAllRead', language)}
                    </button>
                  )}
                </div>
                
                <div className="max-h-[250px] overflow-y-auto divide-y divide-gray-50">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-xs">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 stroke-[1.5]" />
                      {translateUI('noNotifications', language)}
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`p-3 text-left hover:bg-gray-50 transition-colors relative group ${!notif.isRead ? 'bg-brand-primary/5' : ''}`}
                      >
                        <div className="flex justify-between items-start gap-1">
                          <h5 className="font-heading font-bold text-xs text-gray-900">{notif.title}</h5>
                          <button 
                            onClick={() => clearNotification(notif.id)}
                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-1 font-sans leading-normal">{notif.description}</p>
                        <span className="text-[9px] text-gray-400 font-mono mt-1 block">{notif.time}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
