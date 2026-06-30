import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, BookOpen, FileText, Users, BarChart3, CreditCard, 
  BellRing, Settings, Search, Plus, Trash2, Edit2, Sparkles, Calendar, 
  ArrowUpRight, Check, X, SlidersHorizontal, Filter, Download, 
  RefreshCw, AlertCircle, UploadCloud, ChevronRight, UserCheck, ShieldAlert,
  Moon, Sun, Globe, Volume2, Briefcase, GraduationCap, Lock, Unlock,
  ArrowLeft, Crown, DollarSign, Send, PlusCircle, Smartphone, AlertTriangle,
  Play, Pause, Clock
} from 'lucide-react';
import { MockTest, ExamCategory, UserProfile, Question } from '../types';
import { 
  AdminStudent, AdminTransaction, AdminActivity, AdminNotificationCampaign,
  INITIAL_ADMIN_STUDENTS, INITIAL_ADMIN_TRANSACTIONS, INITIAL_ADMIN_ACTIVITIES,
  INITIAL_NOTIFICATIONS_CAMPAIGNS
} from './admin/adminData';

interface AdminConsoleProps {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  tests: MockTest[];
  setTests: React.Dispatch<React.SetStateAction<MockTest[]>>;
  onCloseAdmin: () => void;
  popularExams: any[];
  setPopularExams: React.Dispatch<React.SetStateAction<any[]>>;
  topPerformers: any[];
  setTopPerformers: React.Dispatch<React.SetStateAction<any[]>>;
  homepageContent: any;
  setHomepageContent: React.Dispatch<React.SetStateAction<any>>;
  notifications: any[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function AdminConsole({
  user,
  setUser,
  tests,
  setTests,
  onCloseAdmin,
  popularExams,
  setPopularExams,
  topPerformers,
  setTopPerformers,
  homepageContent,
  setHomepageContent,
  notifications,
  setNotifications
}: AdminConsoleProps) {
  
  // Auth & PIN Protection
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('wb_admin_unlocked') === 'true';
  });
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  
  // Tabs: dashboard, tests, content, students, more
  const [adminTab, setAdminTab] = useState<'dashboard' | 'tests' | 'content' | 'students' | 'more'>('dashboard');
  
  // "More" sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<'exams' | 'questions' | 'live-tests' | 'payments' | 'notifications' | 'settings' | null>(null);

  const [adminRole, setAdminRole] = useState<'Super Admin' | 'Editor'>('Super Admin');
  const [adminSearchQuery, setAdminSearchQuery] = useState<string>('');

  // Local Administrative States (simulated reactive records)
  const [students, setStudents] = useState<AdminStudent[]>(() => {
    const saved = localStorage.getItem('wb_admin_students');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_STUDENTS;
  });
  const [transactions, setTransactions] = useState<AdminTransaction[]>(() => {
    const saved = localStorage.getItem('wb_admin_transactions');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_TRANSACTIONS;
  });
  const [activities, setActivities] = useState<AdminActivity[]>(() => {
    const saved = localStorage.getItem('wb_admin_activities');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_ACTIVITIES;
  });
  const [campaigns, setCampaigns] = useState<AdminNotificationCampaign[]>(() => {
    const saved = localStorage.getItem('wb_admin_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS_CAMPAIGNS;
  });

  // Filters for lists
  const [qExamFilter, setQExamFilter] = useState<string>('All');
  const [qSubjectFilter, setQSubjectFilter] = useState<string>('All');
  const [qDifficultyFilter, setQDifficultyFilter] = useState<string>('All');
  const [studentStatusFilter, setStudentStatusFilter] = useState<string>('All');

  // Modals & Action States
  const [showCreateTestModal, setShowCreateTestModal] = useState<boolean>(false);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState<boolean>(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState<boolean>(false);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<AdminStudent | null>(null);
  
  // Create Test Form State
  const [newTestTitle, setNewTestTitle] = useState<string>('');
  const [newTestCategory, setNewTestCategory] = useState<ExamCategory>('WBCS');
  const [newTestDuration, setNewTestDuration] = useState<number>(30);
  const [newTestDifficulty, setNewTestDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [newTestIsFree, setNewTestIsFree] = useState<boolean>(true);
  const [newTestBoard, setNewTestBoard] = useState<string>('West Bengal Public Service Commission (WBPSC)');
  const [newTestTopic, setNewTestTopic] = useState<string>('General Studies');
  const [newTestQuestions, setNewTestQuestions] = useState<Partial<Question>[]>([
    { id: 'q-1', text: 'What is the capital of West Bengal?', options: ['Kolkata', 'Howrah', 'Siliguri', 'Durgapur'], correctAnswer: 0, explanation: 'Kolkata is the capital and largest city of West Bengal.', subject: 'Geography' }
  ]);

  // Editing Test Form State
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [editTestTitle, setEditTestTitle] = useState<string>('');
  const [editTestCategory, setEditTestCategory] = useState<ExamCategory>('WBCS');
  const [editTestDuration, setEditTestDuration] = useState<number>(30);
  const [editTestIsFree, setEditTestIsFree] = useState<boolean>(true);

  // New Single Question Form State
  const [newQText, setNewQText] = useState<string>('');
  const [newQOptions, setNewQOptions] = useState<string[]>(['', '', '', '']);
  const [newQCorrectIdx, setNewQCorrectIdx] = useState<number>(0);
  const [newQExplanation, setNewQExplanation] = useState<string>('');
  const [newQSubject, setNewQSubject] = useState<string>('History');
  const [newQDifficulty, setNewQDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [newQTargetTestId, setNewQTargetTestId] = useState<string>('');

  // Content Customizer Editor States (clones for draft before Publish)
  const [contentDraft, setContentDraft] = useState<any>(null);
  const [showExamCustomizer, setShowExamCustomizer] = useState<boolean>(false);
  const [showPerformerCustomizer, setShowPerformerCustomizer] = useState<boolean>(false);

  // Add Item States inside Content Customizer
  const [newExamName, setNewExamName] = useState<string>('');
  const [newExamCode, setNewExamCode] = useState<string>('');
  const [newExamTestsCount, setNewExamTestsCount] = useState<number>(10);
  
  const [newPerformerName, setNewPerformerName] = useState<string>('');
  const [newPerformerRank, setNewPerformerRank] = useState<number>(1);
  const [newPerformerExam, setNewPerformerExam] = useState<string>('');
  const [newPerformerSeed, setNewPerformerSeed] = useState<string>('sanjoy');

  // New Student Form State
  const [showAddStudentModal, setShowAddStudentModal] = useState<boolean>(false);
  const [newStudentName, setNewStudentName] = useState<string>('');
  const [newStudentEmail, setNewStudentEmail] = useState<string>('');
  const [newStudentPhone, setNewStudentPhone] = useState<string>('');
  const [newStudentExam, setNewStudentExam] = useState<ExamCategory>('WBCS');
  const [newStudentPremium, setNewStudentPremium] = useState<boolean>(false);

  // Bulk Import States
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bulkImportStatus, setBulkImportStatus] = useState<string>('');
  const [importedQuestionsCount, setImportedQuestionsCount] = useState<number>(0);

  // New Notification Broadcaster State
  const [newNotifTitle, setNewNotifTitle] = useState<string>('');
  const [newNotifBody, setNewNotifBody] = useState<string>('');
  const [newNotifTargetGroup, setNewNotifTargetGroup] = useState<'All' | 'Premium Only' | 'Free Only'>('All');

  // Config setup
  const [adminLockPin, setAdminLockPin] = useState<string>(() => {
    return localStorage.getItem('wb_admin_lock_pin') || '1234';
  });

  // Toasts
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'info' | 'danger'>('success');

  const showToast = (msg: string, type: 'success' | 'info' | 'danger' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Sync admin records to localStorage
  useEffect(() => {
    localStorage.setItem('wb_admin_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('wb_admin_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('wb_admin_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('wb_admin_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  // Load Content Draft when Content tab is opened
  useEffect(() => {
    if (homepageContent) {
      setContentDraft(JSON.parse(JSON.stringify(homepageContent)));
    }
  }, [homepageContent, adminTab]);

  // Handle Lock Screen unlock
  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === adminLockPin) {
      setIsUnlocked(true);
      sessionStorage.setItem('wb_admin_unlocked', 'true');
      setPinError('');
      showToast('Welcome back, Admin!', 'success');
    } else {
      setPinError('Incorrect Secret PIN. Please try again.');
      setEnteredPin('');
    }
  };

  const handleBypassUnlock = () => {
    setEnteredPin(adminLockPin);
    setIsUnlocked(true);
    sessionStorage.setItem('wb_admin_unlocked', 'true');
    setPinError('');
    showToast('Admin Console Unlocked via Bypass', 'success');
  };

  const handleLogout = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem('wb_admin_unlocked');
    setEnteredPin('');
    showToast('Logged out of Admin Console', 'info');
  };

  // Create Test Form Question additions
  const addQuestionToForm = () => {
    setNewTestQuestions(prev => [
      ...prev,
      { 
        id: `q-${prev.length + 1}`, 
        text: '', 
        options: ['', '', '', ''], 
        correctAnswer: 0, 
        explanation: '', 
        subject: 'General Knowledge' 
      }
    ]);
  };

  const removeQuestionFromForm = (idx: number) => {
    if (newTestQuestions.length <= 1) return;
    setNewTestQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const updateFormQuestion = (idx: number, key: string, value: any) => {
    setNewTestQuestions(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [key]: value };
      return copy;
    });
  };

  const updateFormOption = (qIdx: number, optIdx: number, val: string) => {
    setNewTestQuestions(prev => {
      const copy = [...prev];
      const opts = [...(copy[qIdx].options || ['', '', '', ''])];
      opts[optIdx] = val;
      copy[qIdx] = { ...copy[qIdx], options: opts };
      return copy;
    });
  };

  // Test creation action
  const handleCreateTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestTitle.trim()) {
      showToast('Please enter a test title', 'danger');
      return;
    }

    const testId = `t-${Date.now()}`;
    const formattedQuestions: Question[] = newTestQuestions.map((q, idx) => ({
      id: q.id || `q-${idx}-${Date.now()}`,
      text: q.text || `Question ${idx + 1}`,
      options: q.options && q.options.length === 4 ? q.options as [string, string, string, string] : ['A', 'B', 'C', 'D'],
      correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : 0,
      explanation: q.explanation || 'Solution description not available.',
      subject: q.subject || 'General Knowledge'
    }));

    const newTest: MockTest = {
      id: testId,
      title: newTestTitle,
      category: newTestCategory,
      durationMinutes: newTestDuration,
      questionsCount: formattedQuestions.length,
      studentsRegisteredCount: '150',
      isFree: newTestIsFree,
      examBoard: newTestBoard,
      topic: newTestTopic,
      questions: formattedQuestions,
      difficulty: newTestDifficulty
    };

    setTests(prev => [newTest, ...prev]);
    showToast(`Test "${newTestTitle}" created successfully!`, 'success');

    // Add administrative activity
    const newAct: AdminActivity = {
      id: `act-${Date.now()}`,
      studentName: 'Admin System',
      exam: `${newTestTitle} Created`,
      score: 'N/A',
      percentage: 0,
      time: 'Just Now',
      status: 'Pass'
    };
    setActivities(prev => [newAct, ...prev]);

    // Reset Form
    setNewTestTitle('');
    setNewTestDuration(30);
    setNewTestIsFree(true);
    setNewTestQuestions([{ id: 'q-1', text: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '', subject: 'Geography' }]);
    setShowCreateTestModal(false);
  };

  // Delete test action
  const handleDeleteTest = (id: string, title: string) => {
    if (confirm(`Are you absolutely sure you want to delete "${title}"? This cannot be undone.`)) {
      setTests(prev => prev.filter(t => t.id !== id));
      showToast('Test deleted successfully', 'success');

      const newAct: AdminActivity = {
        id: `act-${Date.now()}`,
        studentName: 'Admin System',
        exam: `Deleted test: ${title}`,
        score: 'N/A',
        percentage: 0,
        time: 'Just Now',
        status: 'Pass'
      };
      setActivities(prev => [newAct, ...prev]);
    }
  };

  // Toggle Free / Premium for Test
  const handleToggleTestFree = (id: string, current: boolean) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, isFree: !current } : t));
    showToast(`Test access toggled to ${!current ? 'Free' : 'Premium'}`, 'success');
  };

  // Save changes to test being edited
  const handleSaveEditTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTestTitle.trim()) {
      showToast('Title cannot be empty', 'danger');
      return;
    }
    setTests(prev => prev.map(t => t.id === editingTestId ? { 
      ...t, 
      title: editTestTitle, 
      category: editTestCategory,
      durationMinutes: editTestDuration,
      isFree: editTestIsFree 
    } : t));
    
    showToast('Test updated successfully', 'success');
    setEditingTestId(null);
  };

  // Add individual question to an existing test
  const handleAddQuestionToTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQTargetTestId) {
      showToast('Please select a test', 'danger');
      return;
    }
    if (!newQText.trim()) {
      showToast('Question text cannot be empty', 'danger');
      return;
    }

    const questionObj: Question = {
      id: `q-${Date.now()}`,
      text: newQText,
      options: newQOptions as [string, string, string, string],
      correctAnswer: newQCorrectIdx,
      explanation: newQExplanation,
      subject: newQSubject
    };

    setTests(prev => prev.map(t => {
      if (t.id === newQTargetTestId) {
        const updatedQs = [...(t.questions || []), questionObj];
        return {
          ...t,
          questions: updatedQs,
          questionsCount: updatedQs.length
        };
      }
      return t;
    }));

    showToast('Question added successfully to the test!', 'success');
    
    // Reset Form
    setNewQText('');
    setNewQOptions(['', '', '', '']);
    setNewQExplanation('');
    setShowAddQuestionModal(false);
  };

  // Bulk CSV import simulator
  const triggerBulkFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBulkImportStatus('Parsing file...');
    setTimeout(() => {
      // Simulate reading and parsing CSV columns
      const count = Math.floor(Math.random() * 25) + 15; // Mock importing 15 to 40 questions
      setImportedQuestionsCount(count);
      setBulkImportStatus('Adding to Question Bank...');

      setTimeout(() => {
        // Find first test or WBCS to append mock parsed questions
        if (tests.length > 0) {
          const target = tests[0];
          const newQs: Question[] = [];
          for (let i = 1; i <= count; i++) {
            newQs.push({
              id: `q-bulk-${Date.now()}-${i}`,
              text: `Auto-imported Exam Question #${i} regarding WBCS syllabus?`,
              options: ['Option A', 'Option B (Correct)', 'Option C', 'Option D'],
              correctAnswer: 1,
              explanation: 'Syllabus reference explanation loaded.',
              subject: 'General Knowledge'
            });
          }

          setTests(prev => prev.map(t => {
            if (t.id === target.id) {
              const updated = [...(t.questions || []), ...newQs];
              return {
                ...t,
                questions: updated,
                questionsCount: updated.length
              };
            }
            return t;
          }));
        }

        showToast(`Successfully imported ${count} questions!`, 'success');
        setBulkImportStatus('');
        setShowBulkImportModal(false);
      }, 1200);
    }, 1000);
  };

  // Publish homepage content changes live
  const handlePublishHomepage = () => {
    if (!contentDraft) return;
    
    // Simulate real database saving with immediate push animation
    setHomepageContent(JSON.parse(JSON.stringify(contentDraft)));
    showToast('Homepage changes published live! 🚀', 'success');

    const newAct: AdminActivity = {
      id: `act-${Date.now()}`,
      studentName: 'Admin System',
      exam: 'Content Publish',
      score: '100%',
      percentage: 100,
      time: 'Just Now',
      status: 'Pass'
    };
    setActivities(prev => [newAct, ...prev]);
  };

  // Add Exam Category to Homepage content draft
  const handleAddExamCategoryDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamName.trim()) return;

    const draftCode = newExamCode.trim() || newExamName.slice(0, 4).toUpperCase();
    const emblemColors = [
      'from-purple-500 to-indigo-600',
      'from-amber-400 to-orange-500',
      'from-teal-400 to-emerald-600',
      'from-pink-500 to-rose-600',
      'from-blue-500 to-cyan-500'
    ];
    const pickedColor = emblemColors[Math.floor(Math.random() * emblemColors.length)];

    const newExamObj = {
      id: `ex-${Date.now()}`,
      name: newExamName,
      code: draftCode,
      testsCount: newExamTestsCount,
      emblemColor: pickedColor
    };

    setPopularExams(prev => [...prev, newExamObj]);
    showToast(`Exam category "${newExamName}" added. Tap Publish to go live!`, 'info');

    // Reset Form
    setNewExamName('');
    setNewExamCode('');
    setNewExamTestsCount(10);
    setShowExamCustomizer(false);
  };

  const handleDeleteExamCategoryDraft = (id: string, name: string) => {
    if (confirm(`Remove "${name}" category?`)) {
      setPopularExams(prev => prev.filter(item => item.id !== id));
      showToast('Category removed from queue. Click Publish to persist.', 'info');
    }
  };

  // Add Top Performer to Homepage draft
  const handleAddPerformerDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPerformerName.trim() || !newPerformerExam.trim()) return;

    const bgs = [
      'from-purple-500/10 to-indigo-500/10 border-purple-100',
      'from-amber-500/10 to-orange-500/10 border-amber-100',
      'from-emerald-500/10 to-teal-500/10 border-emerald-100',
      'from-pink-500/10 to-rose-500/10 border-pink-100'
    ];
    const pickedBg = bgs[Math.floor(Math.random() * bgs.length)];

    const newPerfObj = {
      id: `p-${Date.now()}`,
      name: newPerformerName,
      rank: newPerformerRank,
      exam: newPerformerExam,
      avatarSeed: newPerformerSeed,
      color: pickedBg
    };

    setTopPerformers(prev => [...prev, newPerfObj]);
    showToast(`Performer "${newPerformerName}" added to the list. Tap Publish to go live!`, 'info');

    // Reset Form
    setNewPerformerName('');
    setNewPerformerRank(1);
    setNewPerformerExam('');
    setShowPerformerCustomizer(false);
  };

  const handleDeletePerformerDraft = (id: string, name: string) => {
    if (confirm(`Remove "${name}" from top performers list?`)) {
      setTopPerformers(prev => prev.filter(item => item.id !== id));
      showToast('Performer removed. Click Publish to save.', 'info');
    }
  };

  // Broadcast campaign alert (notification campaign + public notification link)
  const handleBroadcastCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotifTitle.trim() || !newNotifBody.trim()) {
      showToast('Please fill all notification fields', 'danger');
      return;
    }

    const campaignId = `camp-${Date.now()}`;
    const newCampaign: AdminNotificationCampaign = {
      id: campaignId,
      title: newNotifTitle,
      message: newNotifBody,
      sentAt: 'Just Now',
      targetGroup: newNotifTargetGroup,
      opensCount: 0
    };

    setCampaigns(prev => [newCampaign, ...prev]);

    // Push into public notifications state of App.tsx
    const newPublicNotif = {
      id: `n-${Date.now()}`,
      title: newNotifTitle,
      message: newNotifBody,
      time: 'Just Now',
      isRead: false
    };
    setNotifications(prev => [newPublicNotif, ...prev]);

    showToast('Notification broadcast sent live to all students!', 'success');

    // Reset
    setNewNotifTitle('');
    setNewNotifBody('');
    setActiveSubTab('notifications'); // show campaigns tab
  };

  // Add student action
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentPhone.trim()) {
      showToast('Name and Phone are required', 'danger');
      return;
    }

    const stdId = `std-${Date.now()}`;
    const newStd: AdminStudent = {
      id: stdId,
      name: newStudentName,
      email: newStudentEmail || `${newStudentName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: newStudentPhone,
      examsPref: [newStudentExam],
      testsTaken: 0,
      avgScore: 0,
      isPremium: newStudentPremium,
      joinedDate: 'Just Now',
      status: 'Active'
    };

    setStudents(prev => [newStd, ...prev]);
    showToast(`Student "${newStudentName}" registered successfully!`, 'success');

    // Add activity
    setActivities(prev => [{
      id: `act-${Date.now()}`,
      studentName: newStudentName,
      exam: 'Registration',
      score: 'Pro',
      percentage: 100,
      time: 'Just Now',
      status: 'Pass'
    }, ...prev]);

    // Reset
    setNewStudentName('');
    setNewStudentEmail('');
    setNewStudentPhone('');
    setShowAddStudentModal(false);
  };

  // Toggle Premium Status for Student
  const handleToggleStudentPremium = (studentId: string, currentStatus: boolean) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, isPremium: !currentStatus } : s));
    showToast(`Premium status updated`, 'success');
  };

  // Toggle Block Status for Student
  const handleToggleStudentBlock = (studentId: string, currentStatus: 'Active' | 'Blocked') => {
    const nextStatus = currentStatus === 'Active' ? 'Blocked' : 'Active';
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: nextStatus } : s));
    showToast(`Student has been ${nextStatus === 'Blocked' ? 'Blocked' : 'Activated'}`, 'info');
  };

  // Filter lists based on states
  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(adminSearchQuery.toLowerCase()) || 
                          test.category.toLowerCase().includes(adminSearchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) || 
                          student.phone.includes(adminSearchQuery);
    const matchesStatus = studentStatusFilter === 'All' ? true : student.status === studentStatusFilter;
    const matchesPremium = studentStatusFilter === 'Premium' ? student.isPremium : true;
    return matchesSearch && matchesStatus && (studentStatusFilter !== 'Premium' || matchesPremium);
  });

  // Main layout render starts
  return (
    <div className="min-h-screen bg-[#0b0717] flex items-center justify-center p-0 md:p-6 select-none font-sans overflow-y-auto">
      
      {/* Toast Alert floating inside mobile frame */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] animate-bounce w-[90%] max-w-[380px] bg-white rounded-2xl p-4 shadow-2xl border-l-4 flex items-center gap-3 border-[#5b1fc7] text-gray-900">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[#5b1fc7] shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs font-semibold leading-snug">{toastMessage}</div>
        </div>
      )}

      {/* Modern Device frame: portraits PWA perfectly on desktop, native container on phone */}
      <div className="w-full max-w-[430px] min-h-screen md:min-h-[880px] md:max-h-[920px] bg-[#f4f5f9] md:rounded-[40px] md:shadow-2xl overflow-hidden flex flex-col relative border border-purple-950/20 md:my-4">
        
        {/* Device camera notch simulation on desktop */}
        <div className="hidden md:flex bg-[#0b0717] h-6 justify-center items-center relative shrink-0">
          <div className="w-24 h-4 bg-black rounded-b-xl absolute top-0" />
        </div>

        {/* LOCK SCREEN (PIN SECURITY AUTHENTICATION) */}
        {!isUnlocked ? (
          <div className="flex-1 bg-gradient-to-br from-[#1a1133] to-[#0d071a] flex flex-col justify-between p-6 text-white animate-fadeIn">
            {/* Logo */}
            <div className="text-center mt-12 space-y-2">
              <div className="w-16 h-16 bg-[#5b1fc7] rounded-[22px] flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20 border border-purple-400/20">
                <Lock className="w-8 h-8 text-[#f5b800]" />
              </div>
              <h2 className="font-heading font-black text-2xl text-white tracking-wide mt-4">
                WB<span className="text-[#f5b800]">MockTest</span> Console
              </h2>
              <p className="text-xs text-purple-200 font-sans leading-none">Security Protected Admin Workspace</p>
            </div>

            {/* Input & keypad */}
            <div className="my-auto space-y-6 max-w-[280px] mx-auto w-full">
              <form onSubmit={handleUnlockSubmit} className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-[10px] text-purple-300 font-mono font-bold tracking-widest uppercase block">ENTER ADMIN PIN</span>
                  <input 
                    type="password" 
                    pattern="[0-9]*"
                    inputMode="numeric"
                    maxLength={6}
                    value={enteredPin}
                    onChange={(e) => setEnteredPin(e.target.value)}
                    placeholder="••••"
                    className="w-full bg-white/5 border border-purple-500/30 rounded-2xl py-3.5 text-center text-2xl tracking-widest font-heading font-black text-white focus:outline-none focus:border-[#f5b800] focus:ring-1 focus:ring-[#f5b800] placeholder-purple-400/30 transition-all shadow-inner"
                  />
                  {pinError && (
                    <span className="text-[10px] text-red-400 font-semibold block mt-1 animate-pulse">{pinError}</span>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[#5b1fc7] hover:bg-[#7b2ff7] active:scale-95 transition-all text-white font-heading font-black text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                >
                  <Unlock className="w-4 h-4 text-[#f5b800]" />
                  <span>Authenticate Session</span>
                </button>
              </form>

              {/* Developer Bypass Button */}
              <button 
                onClick={handleBypassUnlock}
                className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-purple-200 py-2.5 rounded-xl font-medium tracking-wide"
              >
                Simulate Dev Unlock (PIN: {adminLockPin})
              </button>
            </div>

            {/* Bottom Credit */}
            <div className="text-center text-[9px] text-purple-400 font-mono select-none">
              v2.4.1 SECURE SHELL · WEST BENGAL CO-OP
            </div>
          </div>
        ) : (
          
          /* UNLOCKED MAIN WORKSPACE CONTAINER */
          <div className="flex-1 flex flex-col h-full bg-[#f4f5f9] relative">
            
            {/* MOBILE TOP BAR NAVIGATION HEADER */}
            <header className="bg-gradient-to-r from-[#2c1b56] to-[#452b85] px-4 py-3.5 text-white flex items-center justify-between shadow-md shrink-0">
              <div className="flex items-center gap-2">
                <button 
                  onClick={onCloseAdmin}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center active:scale-95 transition-all"
                  title="Return to Public Site"
                >
                  <ArrowLeft className="w-5 h-5 text-purple-200" />
                </button>
                <div>
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="text-xs font-mono font-bold bg-[#f5b800] text-slate-900 px-1.5 py-0.5 rounded-sm">ADMIN</span>
                    <span className="text-[10px] font-sans text-purple-200">{adminRole}</span>
                  </div>
                  <h1 className="font-heading font-black text-base mt-0.5">WBMockTest Console</h1>
                </div>
              </div>

              {/* Quick actions & Profile */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleLogout}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-purple-200 hover:text-red-400 hover:bg-red-500/10 active:scale-95 transition-all"
                  title="Logout Session"
                >
                  <Lock className="w-4 h-4" />
                </button>
                <div className="w-9 h-9 rounded-full overflow-hidden border border-[#f5b800]">
                  <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=admin" alt="Admin Profile" className="w-full h-full object-cover" />
                </div>
              </div>
            </header>

            {/* SECTIONS / PRIMARY TAB PANELS */}
            <main className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
              
              {/* ======================================= */}
              {/* 1. DASHBOARD TAB */}
              {/* ======================================= */}
              {adminTab === 'dashboard' && !activeSubTab && (
                <div className="space-y-4 animate-fadeIn text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-heading font-black text-lg text-slate-900">Console Dashboard</h2>
                      <p className="text-[10px] text-gray-400 font-sans leading-none mt-0.5">WBMockTest platform analytics</p>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-[#5b1fc7] bg-purple-50 border border-purple-100 px-2 py-1 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse" />
                      Live Server OK
                    </span>
                  </div>

                  {/* 4 KPIs grid (Swipeable aesthetic on mobile) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-2xl p-3 shadow-xs border border-gray-100 flex flex-col justify-between h-[85px]">
                      <div className="flex justify-between items-center text-gray-400">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span className="text-[8px] font-mono font-bold text-[#16a34a]">+12%</span>
                      </div>
                      <div>
                        <span className="text-lg font-heading font-black text-gray-900 leading-none">{students.length}</span>
                        <span className="text-[9px] text-gray-400 font-sans block mt-0.5">Total Registered</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-3 shadow-xs border border-gray-100 flex flex-col justify-between h-[85px]">
                      <div className="flex justify-between items-center text-gray-400">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span className="text-[8px] font-mono font-bold text-[#16a34a]">+4%</span>
                      </div>
                      <div>
                        <span className="text-lg font-heading font-black text-gray-900 leading-none">{tests.length}</span>
                        <span className="text-[9px] text-gray-400 font-sans block mt-0.5">Active Tests</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-3 shadow-xs border border-gray-100 flex flex-col justify-between h-[85px]">
                      <div className="flex justify-between items-center text-gray-400">
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        <span className="text-[8px] font-mono font-bold text-[#16a34a]">+22%</span>
                      </div>
                      <div>
                        <span className="text-lg font-heading font-black text-gray-900 leading-none">
                          ₹{transactions.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[9px] text-gray-400 font-sans block mt-0.5">Month Revenue</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-3 shadow-xs border border-gray-100 flex flex-col justify-between h-[85px]">
                      <div className="flex justify-between items-center text-gray-400">
                        <BarChart3 className="w-4 h-4 text-pink-600" />
                        <span className="text-[8px] font-mono font-bold text-[#ef4444]">-2%</span>
                      </div>
                      <div>
                        <span className="text-lg font-heading font-black text-gray-900 leading-none">
                          {activities.length * 8}
                        </span>
                        <span className="text-[9px] text-gray-400 font-sans block mt-0.5">Attempts Today</span>
                      </div>
                    </div>
                  </div>

                  {/* Revenue / Subscriptions Tracker */}
                  <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-gray-100 space-y-2">
                    <span className="text-[10px] text-gray-400 font-mono font-bold block">PRO SUBSCRIPTION TIERS</span>
                    <div className="flex justify-between items-end">
                      <div className="space-y-0.5">
                        <h4 className="font-heading font-black text-sm text-gray-900">₹149 / mo Combo Plan</h4>
                        <p className="text-[9px] text-gray-500 font-sans">Active ratio is 45% of total users base</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-heading font-black text-[#5b1fc7] block">₹28,500</span>
                        <span className="text-[8px] text-gray-400 font-sans">Projected Annual Run Rate</span>
                      </div>
                    </div>
                    {/* Simulated visual status bar */}
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                      <div className="bg-[#5b1fc7] h-full" style={{ width: '45%' }} />
                      <div className="bg-[#f5b800] h-full" style={{ width: '15%' }} />
                      <div className="bg-emerald-500 h-full" style={{ width: '40%' }} />
                    </div>
                  </div>

                  {/* Real-time Ticker Activity Stream */}
                  <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-heading font-black text-xs text-gray-800 tracking-wider uppercase">Live Activity Logs</h3>
                      <button 
                        onClick={() => {
                          showToast('Refreshing real-time feeds...', 'info');
                          setActivities(prev => [{
                            id: `act-${Date.now()}`,
                            studentName: students[Math.floor(Math.random() * students.length)].name,
                            exam: 'Active Testing Mock Exam',
                            score: '10/10',
                            percentage: 100,
                            time: 'Just Now',
                            status: 'Pass'
                          }, ...prev]);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-purple-600 hover:bg-slate-50"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3.5 overflow-hidden max-h-[220px]">
                      {activities.slice(0, 4).map((act) => {
                        return (
                          <div key={act.id} className="flex gap-2.5 items-start text-xs border-b border-gray-50 pb-2">
                            <span className="px-2 py-1 rounded-md font-mono text-[9px] uppercase font-black shrink-0 bg-indigo-100 text-indigo-700">
                              ACTIVITY
                            </span>
                            <div className="flex-1 space-y-0.5">
                              <p className="font-sans text-gray-700 text-[11px] leading-snug">
                                <span className="font-bold text-gray-950">{act.studentName}</span> completed <span className="font-semibold text-gray-900">{act.exam}</span> with <span className="text-[#16a34a] font-bold">{act.score} ({act.percentage}%)</span>.
                              </p>
                              <span className="text-[8px] text-gray-400 font-mono block">{act.time}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================= */}
              {/* 2. TESTS CRUD TAB */}
              {/* ======================================= */}
              {adminTab === 'tests' && !activeSubTab && (
                <div className="space-y-4 animate-fadeIn text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-heading font-black text-lg text-slate-900">Manage Mock Tests</h2>
                      <p className="text-[10px] text-gray-400 font-sans leading-none mt-0.5">Full CRUD capability for examinees</p>
                    </div>
                    <button 
                      onClick={() => setShowCreateTestModal(true)}
                      className="px-3.5 py-1.5 bg-[#5b1fc7] hover:bg-[#7b2ff7] text-white font-heading font-black text-xs rounded-full shadow-md shadow-purple-500/20 flex items-center gap-1.5 select-none"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Create Test</span>
                    </button>
                  </div>

                  {/* Search and Filters */}
                  <div className="bg-white rounded-2xl p-3 shadow-xs border border-gray-100 flex items-center gap-2">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <input 
                      type="text" 
                      value={adminSearchQuery}
                      onChange={(e) => setAdminSearchQuery(e.target.value)}
                      placeholder="Search mock tests by name..."
                      className="flex-1 bg-transparent text-xs text-gray-800 placeholder-slate-400 focus:outline-none"
                    />
                    {adminSearchQuery && (
                      <button onClick={() => setAdminSearchQuery('')} className="p-0.5 bg-gray-100 text-gray-500 rounded-full">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Interactive Test List */}
                  <div className="space-y-3">
                    {filteredTests.map((test) => (
                      <div key={test.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-xs relative overflow-hidden text-left">
                        
                        {/* Tags */}
                        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                          <span className="px-2 py-0.5 bg-purple-50 text-[#5b1fc7] font-mono text-[8px] uppercase font-black rounded-sm border border-purple-100">
                            {test.category}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-50 text-slate-600 font-sans text-[8px] font-semibold rounded-sm">
                            {test.durationMinutes} Mins
                          </span>
                          <button 
                            onClick={() => handleToggleTestFree(test.id, test.isFree)}
                            className={`px-2 py-0.5 font-sans text-[8px] font-black rounded-full select-none ${test.isFree ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-[#f5b800] border border-amber-100'}`}
                          >
                            {test.isFree ? 'Free Access' : 'Premium'}
                          </button>
                        </div>

                        {/* Test details */}
                        <h3 className="font-heading font-black text-sm text-gray-950 leading-tight mb-1">{test.title}</h3>
                        <p className="text-[10px] text-gray-500 font-sans">
                          {test.questionsCount} Questions · {test.questionsCount * 2} Marks · {test.examBoard}
                        </p>

                        {/* Actions drawer-style row */}
                        <div className="mt-3.5 pt-2.5 border-t border-slate-50 flex justify-between items-center">
                          <button 
                            onClick={() => {
                              setEditingTestId(test.id);
                              setEditTestTitle(test.title);
                              setEditTestCategory(test.category);
                              setEditTestDuration(test.durationMinutes);
                              setEditTestIsFree(test.isFree);
                            }}
                            className="text-[10px] font-heading font-black text-purple-600 hover:text-purple-700 flex items-center gap-1 active:scale-95 transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit details</span>
                          </button>

                          <button 
                            onClick={() => handleDeleteTest(test.id, test.title)}
                            className="text-[10px] font-heading font-black text-[#ef4444] hover:text-red-700 flex items-center gap-1 active:scale-95 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>

                        {/* Slide open Form if actively editing this specific Test */}
                        {editingTestId === test.id && (
                          <form onSubmit={handleSaveEditTest} className="mt-4 p-3 bg-purple-50/50 border border-purple-100 rounded-xl space-y-3.5 animate-fadeIn">
                            <span className="text-[10px] font-heading font-black text-[#5b1fc7] block">Quick Editor</span>
                            <div className="space-y-1">
                              <label className="text-[8px] font-sans font-bold text-gray-400 block uppercase">Test Title</label>
                              <input 
                                type="text"
                                value={editTestTitle}
                                onChange={(e) => setEditTestTitle(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 font-medium focus:outline-none focus:border-purple-500"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-[8px] font-sans font-bold text-gray-400 block uppercase">Exam Category</label>
                                <select 
                                  value={editTestCategory}
                                  onChange={(e) => setEditTestCategory(e.target.value as ExamCategory)}
                                  className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 font-medium focus:outline-none"
                                >
                                  <option value="WBCS">WBCS</option>
                                  <option value="WBP Constable">WBP Constable</option>
                                  <option value="SSC GD">SSC GD</option>
                                  <option value="WBPSC">WBPSC</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[8px] font-sans font-bold text-gray-400 block uppercase">Duration (mins)</label>
                                <input 
                                  type="number"
                                  value={editTestDuration}
                                  onChange={(e) => setEditTestDuration(Number(e.target.value))}
                                  className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 font-medium focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="flex gap-2 justify-end pt-2">
                              <button 
                                type="button" 
                                onClick={() => setEditingTestId(null)}
                                className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-sans font-bold text-[10px] rounded-lg"
                              >
                                Cancel
                              </button>
                              <button 
                                type="submit" 
                                className="px-3.5 py-1.5 bg-[#5b1fc7] hover:bg-[#7b2ff7] text-white font-heading font-black text-[10px] rounded-lg"
                              >
                                Save Changes
                              </button>
                            </div>
                          </form>
                        )}

                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ======================================= */}
              {/* 3. CONTENT EDITOR (HOMEPAGE DESIGNER) */}
              {/* ======================================= */}
              {adminTab === 'content' && !activeSubTab && contentDraft && (
                <div className="space-y-4 animate-fadeIn text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-heading font-black text-lg text-slate-900">Homepage Customizer</h2>
                      <p className="text-[10px] text-gray-400 font-sans leading-none mt-0.5">Control visual elements in real-time</p>
                    </div>
                    <button 
                      onClick={handlePublishHomepage}
                      className="px-4 py-2 bg-[#16a34a] text-white font-heading font-black text-xs rounded-full shadow-lg shadow-green-500/10 flex items-center gap-1.5 active:scale-95 transition-all select-none animate-pulse"
                    >
                      <span>Publish Live 🚀</span>
                    </button>
                  </div>

                  {/* SECTION 1: HERO CUSTOMIZER */}
                  <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-3.5">
                    <span className="text-[10px] font-heading font-black text-[#5b1fc7] tracking-wider uppercase block pb-1 border-b border-gray-100">1. Hero Banner Content</span>
                    
                    <div className="space-y-1">
                      <label className="text-[8px] font-sans font-black text-gray-400 block uppercase">Banner Small Badge</label>
                      <input 
                        type="text" 
                        value={contentDraft.heroBadge || ''} 
                        onChange={(e) => setContentDraft({ ...contentDraft, heroBadge: e.target.value })}
                        className="w-full bg-slate-50 border border-gray-100 rounded-xl py-2 px-3 text-xs text-gray-800 font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-sans font-black text-gray-400 block uppercase">Main Heading Text</label>
                      <input 
                        type="text" 
                        value={contentDraft.heroHeading || ''} 
                        onChange={(e) => setContentDraft({ ...contentDraft, heroHeading: e.target.value })}
                        className="w-full bg-slate-50 border border-gray-100 rounded-xl py-2 px-3 text-xs text-gray-800 font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-sans font-black text-gray-400 block uppercase">Gold Highlighted Word</label>
                      <input 
                        type="text" 
                        value={contentDraft.heroHighlight || ''} 
                        onChange={(e) => setContentDraft({ ...contentDraft, heroHighlight: e.target.value })}
                        className="w-full bg-slate-50 border border-gray-100 rounded-xl py-2 px-3 text-xs text-gray-800 font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-sans font-black text-gray-400 block uppercase">CTA Button Text</label>
                      <input 
                        type="text" 
                        value={contentDraft.heroBtnText || ''} 
                        onChange={(e) => setContentDraft({ ...contentDraft, heroBtnText: e.target.value })}
                        className="w-full bg-slate-50 border border-gray-100 rounded-xl py-2 px-3 text-xs text-gray-800 font-semibold"
                      />
                    </div>
                  </div>

                  {/* SECTION 2: STATS STRIP CUSTOMIZER */}
                  <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-3.5">
                    <span className="text-[10px] font-heading font-black text-[#5b1fc7] tracking-wider uppercase block pb-1 border-b border-gray-100">2. Stats Counter Items</span>
                    <div className="space-y-2">
                      {contentDraft.stats?.map((st: any, idx: number) => (
                        <div key={st.id || idx} className="grid grid-cols-2 gap-2">
                          <input 
                            type="text" 
                            value={st.value} 
                            placeholder="Value"
                            onChange={(e) => {
                              const updatedStats = [...contentDraft.stats];
                              updatedStats[idx].value = e.target.value;
                              setContentDraft({ ...contentDraft, stats: updatedStats });
                            }}
                            className="bg-slate-50 border border-gray-100 rounded-xl py-1.5 px-2.5 text-xs font-bold text-gray-800"
                          />
                          <input 
                            type="text" 
                            value={st.label} 
                            placeholder="Label"
                            onChange={(e) => {
                              const updatedStats = [...contentDraft.stats];
                              updatedStats[idx].label = e.target.value;
                              setContentDraft({ ...contentDraft, stats: updatedStats });
                            }}
                            className="bg-slate-50 border border-gray-100 rounded-xl py-1.5 px-2.5 text-xs text-gray-700"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 3: POPULAR EXAMS BADGES QUEUE */}
                  <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-3">
                    <div className="flex justify-between items-center pb-1 border-b border-gray-100">
                      <span className="text-[10px] font-heading font-black text-[#5b1fc7] tracking-wider uppercase block">3. Popular Exam Badges</span>
                      <button 
                        onClick={() => setShowExamCustomizer(true)}
                        className="p-1 text-[#5b1fc7] hover:bg-purple-50 rounded-full flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>

                    {showExamCustomizer && (
                      <form onSubmit={handleAddExamCategoryDraft} className="p-3 bg-purple-50/50 rounded-xl space-y-2.5 border border-purple-100 animate-fadeIn">
                        <span className="text-[9px] font-heading font-black text-purple-700 block">Add Exam Card</span>
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. WB Audit Accounts" 
                            value={newExamName} 
                            onChange={(e) => setNewExamName(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg py-1 px-2 text-xs"
                          />
                          <input 
                            type="text" 
                            placeholder="Badge code (e.g. WBAA)" 
                            value={newExamCode} 
                            onChange={(e) => setNewExamCode(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg py-1 px-2 text-xs"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] text-slate-500 font-sans">Mock tests count:</span>
                            <input 
                              type="number" 
                              value={newExamTestsCount} 
                              onChange={(e) => setNewExamTestsCount(Number(e.target.value))}
                              className="w-12 bg-white border border-slate-200 rounded-lg text-xs p-1"
                            />
                          </div>
                          <div className="flex gap-1.5">
                            <button type="button" onClick={() => setShowExamCustomizer(false)} className="px-2 py-1 bg-slate-200 rounded-md text-[9px] font-bold">Cancel</button>
                            <button type="submit" className="px-2 py-1 bg-[#5b1fc7] text-white rounded-md text-[9px] font-bold">Add Badge</button>
                          </div>
                        </div>
                      </form>
                    )}

                    {/* Active exams drafts */}
                    <div className="space-y-2">
                      {popularExams.map((ex) => (
                        <div key={ex.id} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-xl text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center font-bold text-[#5b1fc7] text-[9px]">
                              {ex.code || ex.name.slice(0, 3)}
                            </span>
                            <span className="font-semibold text-slate-800">{ex.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-purple-700 font-bold">{ex.testsCount} tests</span>
                            <button 
                              onClick={() => handleDeleteExamCategoryDraft(ex.id, ex.name)}
                              className="text-[#ef4444] hover:text-red-700 font-bold"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 4: OUR TOP PERFORMERS QUEUE */}
                  <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-3">
                    <div className="flex justify-between items-center pb-1 border-b border-gray-100">
                      <span className="text-[10px] font-heading font-black text-[#5b1fc7] tracking-wider uppercase block">4. Top Performers Cards</span>
                      <button 
                        onClick={() => setShowPerformerCustomizer(true)}
                        className="p-1 text-[#5b1fc7] hover:bg-purple-50 rounded-full flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>

                    {showPerformerCustomizer && (
                      <form onSubmit={handleAddPerformerDraft} className="p-3 bg-purple-50/50 rounded-xl space-y-2.5 border border-purple-100 animate-fadeIn">
                        <span className="text-[9px] font-heading font-black text-purple-700 block">Add Performer Card</span>
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="text" 
                            required
                            placeholder="Student Name" 
                            value={newPerformerName} 
                            onChange={(e) => setNewPerformerName(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg py-1 px-2 text-xs"
                          />
                          <input 
                            type="text" 
                            required
                            placeholder="Exam name (e.g. WBCS Topper)" 
                            value={newPerformerExam} 
                            onChange={(e) => setNewPerformerExam(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg py-1 px-2 text-xs"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-slate-500">Rank:</span>
                            <input 
                              type="number" 
                              value={newPerformerRank} 
                              onChange={(e) => setNewPerformerRank(Number(e.target.value))}
                              className="w-10 bg-white border border-slate-200 rounded-lg text-xs p-1"
                            />
                            <span className="text-[9px] text-slate-500">Avatar:</span>
                            <input 
                              type="text" 
                              value={newPerformerSeed} 
                              onChange={(e) => setNewPerformerSeed(e.target.value)}
                              className="w-16 bg-white border border-slate-200 rounded-lg text-xs p-1"
                            />
                          </div>
                          <div className="flex gap-1.5">
                            <button type="button" onClick={() => setShowPerformerCustomizer(false)} className="px-2 py-1 bg-slate-200 rounded-md text-[9px] font-bold">Cancel</button>
                            <button type="submit" className="px-2 py-1 bg-[#5b1fc7] text-white rounded-md text-[9px] font-bold">Add Card</button>
                          </div>
                        </div>
                      </form>
                    )}

                    {/* Active performers draft list */}
                    <div className="space-y-2">
                      {topPerformers.map((perf) => (
                        <div key={perf.id} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-xl text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-200">
                              <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${perf.avatarSeed || perf.name}`} alt={perf.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-semibold text-slate-800">{perf.name}</span>
                            <span className="text-[9px] text-amber-500 font-bold font-mono">Rank {perf.rank}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] text-slate-400 font-medium truncate max-w-[80px]">{perf.exam}</span>
                            <button 
                              onClick={() => handleDeletePerformerDraft(perf.id, perf.name)}
                              className="text-[#ef4444] hover:text-red-700 font-bold"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 5: PREMIUM BANNER CUSTOMIZER */}
                  <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-3.5">
                    <span className="text-[10px] font-heading font-black text-[#5b1fc7] tracking-wider uppercase block pb-1 border-b border-gray-100">5. Promotional Premium Banner</span>
                    
                    <div className="space-y-1">
                      <label className="text-[8px] font-sans font-black text-gray-400 block uppercase">Premium Title</label>
                      <input 
                        type="text" 
                        value={contentDraft.premiumBannerTitle || ''} 
                        onChange={(e) => setContentDraft({ ...contentDraft, premiumBannerTitle: e.target.value })}
                        className="w-full bg-slate-50 border border-gray-100 rounded-xl py-2 px-3 text-xs text-gray-800 font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-sans font-black text-gray-400 block uppercase">Premium Details Text</label>
                      <input 
                        type="text" 
                        value={contentDraft.premiumBannerText || ''} 
                        onChange={(e) => setContentDraft({ ...contentDraft, premiumBannerText: e.target.value })}
                        className="w-full bg-slate-50 border border-gray-100 rounded-xl py-2 px-3 text-xs text-gray-800 font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-sans font-black text-gray-400 block uppercase">Premium Button Text</label>
                      <input 
                        type="text" 
                        value={contentDraft.premiumBannerBtnText || ''} 
                        onChange={(e) => setContentDraft({ ...contentDraft, premiumBannerBtnText: e.target.value })}
                        className="w-full bg-slate-50 border border-gray-100 rounded-xl py-2 px-3 text-xs text-gray-800 font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================= */}
              {/* 4. STUDENTS TAB */}
              {/* ======================================= */}
              {adminTab === 'students' && !activeSubTab && (
                <div className="space-y-4 animate-fadeIn text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-heading font-black text-lg text-slate-900">Registered Students</h2>
                      <p className="text-[10px] text-gray-400 font-sans leading-none mt-0.5">Control access tiers & audit profiles</p>
                    </div>
                    <button 
                      onClick={() => setShowAddStudentModal(true)}
                      className="px-3.5 py-1.5 bg-[#5b1fc7] hover:bg-[#7b2ff7] text-white font-heading font-black text-xs rounded-full shadow-md shadow-purple-500/20 flex items-center gap-1 select-none"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Register</span>
                    </button>
                  </div>

                  {/* Search and filter bar */}
                  <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-gray-100 space-y-2">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                      <Search className="w-4 h-4 text-slate-400 shrink-0" />
                      <input 
                        type="text" 
                        value={adminSearchQuery}
                        onChange={(e) => setAdminSearchQuery(e.target.value)}
                        placeholder="Search student by name or phone..."
                        className="flex-1 bg-transparent text-xs text-gray-800 placeholder-slate-400 focus:outline-none"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-sans font-bold text-gray-400 uppercase">TIER FILTERS:</span>
                      <div className="flex gap-1">
                        {['All', 'Active', 'Blocked', 'Premium'].map((filt) => (
                          <button 
                            key={filt}
                            onClick={() => setStudentStatusFilter(filt)}
                            className={`px-2.5 py-1 text-[8px] font-heading font-black rounded-full select-none ${studentStatusFilter === filt ? 'bg-[#5b1fc7] text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                          >
                            {filt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Students list */}
                  <div className="space-y-3">
                    {filteredStudents.map((std) => (
                      <div 
                        key={std.id}
                        onClick={() => setSelectedStudentDetail(std)}
                        className="bg-white border border-gray-100 rounded-2xl p-4 shadow-xs relative overflow-hidden flex justify-between items-center text-left hover:border-purple-200 cursor-pointer transition-all"
                      >
                        <div className="flex gap-3 items-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[#5b1fc7] shrink-0">
                            {std.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 leading-none">
                              <h3 className="font-heading font-black text-sm text-gray-900 leading-none">{std.name}</h3>
                              {std.isPremium && (
                                <span className="bg-amber-100 text-amber-800 text-[8px] font-heading font-black px-1 rounded flex items-center gap-0.5">
                                  <Crown className="w-2.5 h-2.5" /> PRO
                                </span>
                              )}
                            </div>
                            <p className="text-[9px] text-gray-400 font-sans mt-1">{std.phone} · {std.email}</p>
                            <span className="text-[9px] text-purple-700 font-mono block mt-0.5">{std.testsTaken} Mock Tests Taken</span>
                          </div>
                        </div>

                        {/* Status / quick blocks */}
                        <div className="text-right">
                          <span className={`inline-block px-2.5 py-0.5 text-[8px] font-heading font-black rounded-full ${std.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-[#ef4444]'}`}>
                            {std.status}
                          </span>
                          <span className="text-[8px] text-gray-400 font-mono block mt-1.5">{std.avgScore}% AVG</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ======================================= */}
              {/* 5. MORE / UTILITIES TAB */}
              {/* ======================================= */}
              {adminTab === 'more' && !activeSubTab && (
                <div className="space-y-4 animate-fadeIn text-left">
                  <h2 className="font-heading font-black text-lg text-slate-900">Advanced Utilities</h2>
                  
                  {/* Grid of utility sub-menus */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <button 
                      onClick={() => setActiveSubTab('exams')}
                      className="bg-white hover:bg-purple-50/20 border border-slate-100 rounded-3xl p-4 shadow-xs text-left space-y-2 cursor-pointer transition-all active:scale-95 flex flex-col justify-between h-[110px]"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#5b1fc7] flex items-center justify-center">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-heading font-black text-xs text-slate-800 block">Exam Categories</h4>
                        <span className="text-[8px] text-slate-400 font-sans leading-none block mt-0.5">Edit board catalogs</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => setActiveSubTab('questions')}
                      className="bg-white hover:bg-purple-50/20 border border-slate-100 rounded-3xl p-4 shadow-xs text-left space-y-2 cursor-pointer transition-all active:scale-95 flex flex-col justify-between h-[110px]"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-heading font-black text-xs text-slate-800 block">Question Bank</h4>
                        <span className="text-[8px] text-slate-400 font-sans leading-none block mt-0.5">Add & import questions</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => setActiveSubTab('live-tests')}
                      className="bg-white hover:bg-purple-50/20 border border-slate-100 rounded-3xl p-4 shadow-xs text-left space-y-2 cursor-pointer transition-all active:scale-95 flex flex-col justify-between h-[110px]"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#ef4444] flex items-center justify-center">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-heading font-black text-xs text-slate-800 block">Live Exam Schedules</h4>
                        <span className="text-[8px] text-slate-400 font-sans leading-none block mt-0.5">Interactive live tickers</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => setActiveSubTab('payments')}
                      className="bg-white hover:bg-purple-50/20 border border-slate-100 rounded-3xl p-4 shadow-xs text-left space-y-2 cursor-pointer transition-all active:scale-95 flex flex-col justify-between h-[110px]"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-heading font-black text-xs text-slate-800 block">Payments Setup</h4>
                        <span className="text-[8px] text-slate-400 font-sans leading-none block mt-0.5">Revenue & billing</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => setActiveSubTab('notifications')}
                      className="bg-white hover:bg-purple-50/20 border border-slate-100 rounded-3xl p-4 shadow-xs text-left space-y-2 cursor-pointer transition-all active:scale-95 flex flex-col justify-between h-[110px]"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <BellRing className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-heading font-black text-xs text-slate-800 block">Notifications Log</h4>
                        <span className="text-[8px] text-slate-400 font-sans leading-none block mt-0.5">Broadcast push campaigns</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => setActiveSubTab('settings')}
                      className="bg-white hover:bg-purple-50/20 border border-slate-100 rounded-3xl p-4 shadow-xs text-left space-y-2 cursor-pointer transition-all active:scale-95 flex flex-col justify-between h-[110px]"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center">
                        <Settings className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-heading font-black text-xs text-slate-800 block">System Settings</h4>
                        <span className="text-[8px] text-slate-400 font-sans leading-none block mt-0.5">Console parameters</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* ======================================= */}
              {/* SUB-TAB DETAILS SCREENS */}
              {/* ======================================= */}

              {/* A. QUESTIONS BANK SECTION */}
              {activeSubTab === 'questions' && (
                <div className="space-y-4 animate-fadeIn text-left">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setActiveSubTab(null)} className="p-1 hover:bg-slate-100 rounded-full">
                      <ArrowLeft className="w-4 h-4 text-slate-700" />
                    </button>
                    <div>
                      <h2 className="font-heading font-black text-base text-slate-900 leading-tight">Question Bank Repository</h2>
                      <span className="text-[8px] font-mono text-slate-400">Database audits</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setShowAddQuestionModal(true)}
                      className="px-3.5 py-2.5 bg-[#5b1fc7] text-white rounded-2xl font-heading font-black text-[10px] shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Question
                    </button>
                    <button 
                      onClick={() => setShowBulkImportModal(true)}
                      className="px-3.5 py-2.5 bg-[#f5b800] text-slate-950 rounded-2xl font-heading font-black text-[10px] shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <UploadCloud className="w-3.5 h-3.5" /> CSV Bulk Import
                    </button>
                  </div>

                  {/* Search filters */}
                  <div className="bg-white rounded-2xl p-3 shadow-xs border border-gray-100 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-500 text-[8px]">EXAM SYLLABUS FILTER:</span>
                      <select 
                        value={qSubjectFilter} 
                        onChange={(e) => setQSubjectFilter(e.target.value)}
                        className="bg-slate-50 border border-gray-100 rounded-lg p-1 text-[10px]"
                      >
                        <option value="All">All Subjects</option>
                        <option value="Geography">Geography</option>
                        <option value="History">History</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Constitution">Indian Constitution</option>
                      </select>
                    </div>
                  </div>

                  {/* Active questions directory */}
                  <div className="space-y-3">
                    {tests.flatMap(t => t.questions || []).filter(q => qSubjectFilter === 'All' ? true : q.subject === qSubjectFilter).map((q, idx) => (
                      <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-xs space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-mono text-[8px] font-black rounded-sm border border-indigo-100">
                            {q.subject}
                          </span>
                          <span className="text-[8px] text-gray-400 font-mono">Q-ID: {q.id.slice(0, 8)}</span>
                        </div>
                        <h4 className="font-heading font-extrabold text-xs text-gray-900 leading-normal">{q.text}</h4>
                        <div className="grid grid-cols-2 gap-1.5">
                          {q.options.map((opt, oIdx) => (
                            <span 
                              key={oIdx} 
                              className={`p-2 rounded-xl text-[10px] font-medium border leading-tight ${oIdx === q.correctAnswer ? 'bg-emerald-50 border-emerald-100 text-emerald-800 font-bold' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                            >
                              {oIdx + 1}. {opt}
                            </span>
                          ))}
                        </div>
                        {q.explanation && (
                          <p className="text-[9px] text-gray-400 font-sans italic pt-1 border-t border-slate-50">
                            Sol: {q.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* B. EXAM CATEGORIES CATALOGUE */}
              {activeSubTab === 'exams' && (
                <div className="space-y-4 animate-fadeIn text-left">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setActiveSubTab(null)} className="p-1 hover:bg-slate-100 rounded-full">
                      <ArrowLeft className="w-4 h-4 text-slate-700" />
                    </button>
                    <div>
                      <h2 className="font-heading font-black text-base text-slate-900 leading-tight">Board Exam Catalogs</h2>
                      <span className="text-[8px] font-mono text-slate-400">Exam streams setup</span>
                    </div>
                  </div>

                  {/* Exam Categories directory */}
                  <div className="bg-white rounded-3xl p-4 shadow-xs border border-gray-100 space-y-4">
                    <span className="text-[10px] font-heading font-black text-purple-700 tracking-wider block uppercase border-b border-gray-100 pb-1">AVAILABLE STREAMS</span>
                    <div className="space-y-3">
                      {[
                        { name: 'WBCS', board: 'West Bengal Public Service Commission', count: tests.filter(t => t.category === 'WBCS').length },
                        { name: 'WBP Constable', board: 'West Bengal Police Recruitment Board', count: tests.filter(t => t.category === 'WBP Constable').length },
                        { name: 'SSC GD', board: 'Staff Selection Commission (Govt of India)', count: tests.filter(t => t.category === 'SSC GD').length },
                        { name: 'WBPSC', board: 'Academic subject modules catalog', count: tests.filter(t => t.category === 'WBPSC').length }
                      ].map((examCat, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs pb-3 border-b border-gray-50">
                          <div>
                            <span className="font-heading font-black text-sm text-slate-900 block">{examCat.name}</span>
                            <span className="text-[9px] text-slate-400 font-sans mt-0.5 block">{examCat.board}</span>
                          </div>
                          <span className="bg-[#5b1fc7]/10 text-[#5b1fc7] font-mono font-bold px-2.5 py-1 rounded-full text-[10px]">
                            {examCat.count} Active
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* C. LIVE EXAMS SCHEDULES AND ACTIVE LIVE TICKER */}
              {activeSubTab === 'live-tests' && (
                <div className="space-y-4 animate-fadeIn text-left">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setActiveSubTab(null)} className="p-1 hover:bg-slate-100 rounded-full">
                      <ArrowLeft className="w-4 h-4 text-slate-700" />
                    </button>
                    <div>
                      <h2 className="font-heading font-black text-base text-slate-900 leading-tight">Live Test Coordinator</h2>
                      <span className="text-[8px] font-mono text-slate-400">Schedule examinations</span>
                    </div>
                  </div>

                  {/* Active Live Examination Tracker */}
                  <div className="bg-gradient-to-br from-[#2c1b56] to-[#452b85] text-white rounded-3xl p-5 shadow-xl space-y-3.5 relative overflow-hidden">
                    <div className="flex justify-between items-center">
                      <span className="px-2.5 py-1 bg-red-500 text-white rounded-full font-heading font-black text-[8px] tracking-wider uppercase animate-pulse">
                        LIVE EXAM LIVE NOW
                      </span>
                      <span className="text-[10px] font-mono text-purple-200">Room #1092</span>
                    </div>

                    <div>
                      <h3 className="font-heading font-black text-base text-white">WBCS Full Preliminary Mini-Mock 2026</h3>
                      <p className="text-[10px] text-purple-200 font-sans mt-0.5">Scheduled slots ends in 45 minutes</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center pt-2">
                      <div className="bg-white/10 rounded-2xl p-2">
                        <span className="text-sm font-heading font-black text-[#f5b800] block">82</span>
                        <span className="text-[8px] text-purple-200 block font-sans">Active Examinees</span>
                      </div>
                      <div className="bg-white/10 rounded-2xl p-2">
                        <span className="text-sm font-heading font-black text-[#f5b800] block">59</span>
                        <span className="text-[8px] text-purple-200 block font-sans">Submitted already</span>
                      </div>
                      <div className="bg-white/10 rounded-2xl p-2">
                        <span className="text-sm font-heading font-black text-[#f5b800] block">23</span>
                        <span className="text-[8px] text-purple-200 block font-sans">Answering now</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* D. PAYMENTS SETUP & LOGS */}
              {activeSubTab === 'payments' && (
                <div className="space-y-4 animate-fadeIn text-left">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setActiveSubTab(null)} className="p-1 hover:bg-slate-100 rounded-full">
                      <ArrowLeft className="w-4 h-4 text-slate-700" />
                    </button>
                    <div>
                      <h2 className="font-heading font-black text-base text-slate-900 leading-tight">Payments & Receipts Logs</h2>
                      <span className="text-[8px] font-mono text-slate-400">Revenue auditing</span>
                    </div>
                  </div>

                  {/* Transactions summary */}
                  <div className="bg-white rounded-3xl p-4 shadow-xs border border-gray-100 space-y-3">
                    <span className="text-[10px] font-heading font-black text-purple-700 tracking-wider block uppercase border-b border-gray-100 pb-1">RECENT REVENUE RECIEPTS</span>
                    <div className="space-y-3">
                      {transactions.map((tr) => (
                        <div key={tr.id} className="flex justify-between items-center text-xs border-b border-gray-50 pb-2.5">
                          <div>
                            <span className="font-heading font-black text-gray-950 block">{tr.studentName}</span>
                            <span className="text-[9px] text-gray-400 font-mono mt-0.5 block">{tr.date} · {tr.plan}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-heading font-black text-[#16a34a] block">+₹{tr.amount}</span>
                            <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 font-sans text-[8px] font-bold rounded-sm inline-block">
                              {tr.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* E. BROADCAST NOTIFICATIONS MODULE */}
              {activeSubTab === 'notifications' && (
                <div className="space-y-4 animate-fadeIn text-left">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setActiveSubTab(null)} className="p-1 hover:bg-slate-100 rounded-full">
                      <ArrowLeft className="w-4 h-4 text-slate-700" />
                    </button>
                    <div>
                      <h2 className="font-heading font-black text-base text-slate-900 leading-tight">Broadcast Notifications Campaign</h2>
                      <span className="text-[8px] font-mono text-slate-400">Push alert composer</span>
                    </div>
                  </div>

                  {/* Composer form */}
                  <form onSubmit={handleBroadcastCampaignSubmit} className="bg-white rounded-3xl p-4 shadow-xs border border-gray-100 space-y-4">
                    <span className="text-[10px] font-heading font-black text-[#5b1fc7] block pb-1 border-b border-gray-100 uppercase">COMPOSE BROADCAST</span>
                    
                    <div className="space-y-1">
                      <label className="text-[8px] font-sans font-bold text-gray-400 uppercase">Alert Title</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. WBCS Admit Cards Released" 
                        value={newNotifTitle} 
                        onChange={(e) => setNewNotifTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-sans font-bold text-gray-400 uppercase">Alert Body Message</label>
                      <textarea 
                        required
                        placeholder="Write dynamic in-app notification message here..." 
                        value={newNotifBody} 
                        onChange={(e) => setNewNotifBody(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-3 text-xs h-16 resize-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-sans font-bold text-gray-400 uppercase">Target Audience Group</label>
                      <select 
                        value={newNotifTargetGroup} 
                        onChange={(e) => setNewNotifTargetGroup(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 text-xs font-semibold"
                      >
                        <option value="All">All Registered Students</option>
                        <option value="Premium Only">Premium Tier Only</option>
                        <option value="Free Only">Free Tier Only</option>
                      </select>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-[#5b1fc7] hover:bg-[#7b2ff7] active:scale-95 text-white font-heading font-black text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/10"
                    >
                      <Send className="w-3.5 h-3.5 text-[#f5b800]" />
                      <span>Broadcast Alert Live</span>
                    </button>
                  </form>

                  {/* Notification campaigns history log */}
                  <div className="bg-white rounded-3xl p-4 shadow-xs border border-gray-100 space-y-3.5 text-xs">
                    <span className="text-[10px] font-heading font-black text-purple-700 tracking-wider block uppercase border-b border-gray-100 pb-1">BROADCAST LOGS</span>
                    <div className="space-y-3">
                      {campaigns.map((camp) => (
                        <div key={camp.id} className="border-b border-gray-50 pb-2.5">
                          <div className="flex justify-between items-center">
                            <span className="font-heading font-black text-slate-900 block">{camp.title}</span>
                            <span className="text-[8px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-full font-bold uppercase">{camp.targetGroup}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-sans leading-snug mt-1">{camp.message}</p>
                          <div className="flex items-center gap-3 text-[9px] text-slate-400 mt-2 font-mono">
                            <span>Sent: {camp.sentAt}</span>
                            <span>Opens: {camp.opensCount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* F. SYSTEM SETTINGS & PIN SETUP */}
              {activeSubTab === 'settings' && (
                <div className="space-y-4 animate-fadeIn text-left">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setActiveSubTab(null)} className="p-1 hover:bg-slate-100 rounded-full">
                      <ArrowLeft className="w-4 h-4 text-slate-700" />
                    </button>
                    <div>
                      <h2 className="font-heading font-black text-base text-slate-900 leading-tight">System Settings Parameters</h2>
                      <span className="text-[8px] font-mono text-slate-400">Security setup</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-4 shadow-xs border border-gray-100 space-y-4 text-xs">
                    <span className="text-[10px] font-heading font-black text-purple-700 tracking-wider block uppercase border-b border-gray-100 pb-1">CONSOLE SECURITY LOCK</span>
                    
                    <div className="space-y-1">
                      <label className="text-[8px] font-sans font-bold text-gray-400 uppercase">Admin Secret Lock PIN</label>
                      <input 
                        type="password" 
                        value={adminLockPin} 
                        onChange={(e) => {
                          setAdminLockPin(e.target.value);
                          localStorage.setItem('wb_admin_lock_pin', e.target.value);
                          showToast('Secret lock PIN updated successfully!', 'success');
                        }}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 text-xs tracking-wider"
                      />
                      <span className="text-[9px] text-slate-400 block mt-1 leading-normal">
                        This PIN secures access to the Admin whiteboard console. Change this immediately to restrict access.
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </main>

            {/* FLOATING ACTION PLUS BUTTON SITTING ABOVE BOTTOM NAVIGATION BAR */}
            {adminTab !== 'content' && !activeSubTab && (
              <button 
                onClick={() => {
                  if (adminTab === 'dashboard') {
                    setActiveSubTab('notifications');
                  } else if (adminTab === 'tests') {
                    setShowCreateTestModal(true);
                  } else if (adminTab === 'students') {
                    setShowAddStudentModal(true);
                  } else if (adminTab === 'more') {
                    setShowAddQuestionModal(true);
                  }
                }}
                className="absolute bottom-[72px] right-5 z-20 w-12 h-12 bg-gradient-to-tr from-[#5b1fc7] to-[#7b2ff7] rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-500/30 border border-purple-400/20 active:scale-95 transition-all hover:rotate-90 duration-300"
                title="Quick Add Action"
              >
                <Plus className="w-6 h-6 stroke-[3] text-[#f5b800]" />
              </button>
            )}

            {/* BOTTOM PORTRAIT NAVIGATION PWA TAB BAR (5 TABS) */}
            <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-3 py-2 flex justify-between items-center z-10 shrink-0 shadow-inner">
              {[
                { tab: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                { tab: 'tests', icon: BookOpen, label: 'Tests' },
                { tab: 'content', icon: Sparkles, label: 'Content' },
                { tab: 'students', icon: Users, label: 'Students' },
                { tab: 'more', icon: SlidersHorizontal, label: 'More' }
              ].map((nav) => {
                const isSelected = adminTab === nav.tab && !activeSubTab;
                return (
                  <button 
                    key={nav.tab}
                    onClick={() => {
                      setAdminTab(nav.tab as any);
                      setActiveSubTab(null);
                    }}
                    className="flex flex-col items-center gap-1 py-1 px-3 focus:outline-none select-none transition-all duration-150 active:scale-90 shrink-0"
                  >
                    <div className={`p-1 rounded-xl transition-all ${isSelected ? 'bg-purple-100 text-[#5b1fc7]' : 'text-slate-400'}`}>
                      <nav.icon className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <span className={`text-[8px] font-heading font-extrabold tracking-tight ${isSelected ? 'text-[#5b1fc7]' : 'text-slate-400'}`}>
                      {nav.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* ======================================= */}
            {/* OVERLAY MODAL FORM POPUPS (PWA OPTIMIZED) */}
            {/* ======================================= */}

            {/* I. CREATE TEST MODAL */}
            {showCreateTestModal && (
              <div className="absolute inset-0 bg-black/60 z-50 flex items-end justify-center select-none animate-fadeIn">
                <div className="bg-white rounded-t-[32px] w-full max-h-[90%] overflow-y-auto p-5 space-y-4 text-left animate-slideUp border-t border-[#f5b800]/20">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <h3 className="font-heading font-black text-base text-gray-950">Create New Mock Test</h3>
                    <button onClick={() => setShowCreateTestModal(false)} className="p-1 bg-slate-100 text-slate-500 rounded-full">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateTestSubmit} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-[8px] font-sans font-bold text-gray-400 block uppercase">Test Subject / Title</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. History MCQ Mock Test VIII" 
                        value={newTestTitle} 
                        onChange={(e) => setNewTestTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 text-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[8px] font-sans font-bold text-gray-400 block uppercase">Duration (Minutes)</label>
                        <input 
                          type="number" 
                          required
                          value={newTestDuration} 
                          onChange={(e) => setNewTestDuration(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 text-slate-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-sans font-bold text-gray-400 block uppercase">Difficulty Tier</label>
                        <select 
                          value={newTestDifficulty} 
                          onChange={(e) => setNewTestDifficulty(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 text-slate-800 font-semibold"
                        >
                          <option value="Easy">Easy Tier</option>
                          <option value="Medium">Medium Tier</option>
                          <option value="Hard">Hard Tier</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[8px] font-sans font-bold text-gray-400 block uppercase">Exam Stream</label>
                        <select 
                          value={newTestCategory} 
                          onChange={(e) => setNewTestCategory(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 text-slate-800 font-semibold"
                        >
                          <option value="WBCS">WBCS</option>
                          <option value="WBP Constable">WBP Constable</option>
                          <option value="SSC GD">SSC GD</option>
                          <option value="WBPSC">WBPSC</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-sans font-bold text-gray-400 block uppercase">Access Level</label>
                        <select 
                          value={newTestIsFree ? "Free" : "Premium"} 
                          onChange={(e) => setNewTestIsFree(e.target.value === "Free")}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 text-slate-800 font-semibold"
                        >
                          <option value="Free">Free mock test</option>
                          <option value="Premium">Premium tier only</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3.5 border-t border-slate-100 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-heading font-black text-purple-700 block uppercase">EXAMINATION QUESTIONS ({newTestQuestions.length})</span>
                        <button 
                          type="button" 
                          onClick={addQuestionToForm}
                          className="px-2 py-1 bg-purple-50 text-purple-700 font-bold rounded flex items-center gap-1 text-[9px]"
                        >
                          <Plus className="w-3 h-3" /> Add Question
                        </button>
                      </div>

                      {newTestQuestions.map((q, qIdx) => (
                        <div key={qIdx} className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl space-y-3 relative">
                          <button 
                            type="button"
                            onClick={() => removeQuestionFromForm(qIdx)}
                            className="absolute top-2.5 right-2.5 text-slate-400 hover:text-red-500 font-bold"
                          >
                            Remove
                          </button>
                          
                          <div className="space-y-1.5">
                            <label className="text-[8px] font-sans font-bold text-gray-400 uppercase">Question #{qIdx + 1} Text</label>
                            <input 
                              type="text" 
                              required
                              placeholder="Write MCQ Question..." 
                              value={q.text || ''} 
                              onChange={(e) => updateFormQuestion(qIdx, 'text', e.target.value)}
                              className="w-[85%] bg-white border border-slate-100 rounded-lg p-2"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[8px] font-sans font-bold text-gray-400 uppercase">Options (Provide Exactly 4)</label>
                            <div className="grid grid-cols-2 gap-1.5">
                              {[0, 1, 2, 3].map((optIdx) => (
                                <input 
                                  key={optIdx} 
                                  type="text" 
                                  required
                                  placeholder={`Option ${optIdx + 1}`} 
                                  value={q.options?.[optIdx] || ''} 
                                  onChange={(e) => updateFormOption(qIdx, optIdx, e.target.value)}
                                  className="bg-white border border-slate-100 rounded-lg p-1.5 text-[10px]"
                                />
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[8px] font-sans font-bold text-gray-400 uppercase">Correct Answer</label>
                              <select 
                                value={q.correctAnswer || 0} 
                                onChange={(e) => updateFormQuestion(qIdx, 'correctAnswer', Number(e.target.value))}
                                className="w-full bg-white border border-slate-100 rounded-lg p-1.5"
                              >
                                <option value={0}>Option 1</option>
                                <option value={1}>Option 2</option>
                                <option value={2}>Option 3</option>
                                <option value={3}>Option 4</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[8px] font-sans font-bold text-gray-400 uppercase">MCQ subject</label>
                              <input 
                                type="text" 
                                value={q.subject || ''} 
                                onChange={(e) => updateFormQuestion(qIdx, 'subject', e.target.value)}
                                className="w-full bg-white border border-slate-100 rounded-lg p-1.5"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-[#5b1fc7] text-white font-heading font-black py-3 rounded-2xl text-xs active:scale-95 transition-all shadow-md shadow-purple-500/10"
                    >
                      Assemble & Publish Mock Test
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* II. ADD SINGLE QUESTION MODAL */}
            {showAddQuestionModal && (
              <div className="absolute inset-0 bg-black/60 z-50 flex items-end justify-center select-none animate-fadeIn">
                <div className="bg-white rounded-t-[32px] w-full p-5 space-y-4 text-left animate-slideUp border-t border-purple-500/20 animate-slideUp">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <h3 className="font-heading font-black text-base text-gray-950">Add Single Question</h3>
                    <button onClick={() => setShowAddQuestionModal(false)} className="p-1 bg-slate-100 text-slate-500 rounded-full">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleAddQuestionToTest} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-[8px] font-sans font-bold text-gray-400 block uppercase">Target Mock Test</label>
                      <select 
                        required
                        value={newQTargetTestId} 
                        onChange={(e) => setNewQTargetTestId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 text-slate-800 font-semibold"
                      >
                        <option value="">-- Choose Target Exam --</option>
                        {tests.map(t => (
                          <option key={t.id} value={t.id}>{t.title} ({t.category})</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-sans font-bold text-gray-400 block uppercase">Question Text</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Which ruler introduced dynamic coin reforms?" 
                        value={newQText} 
                        onChange={(e) => setNewQText(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-3"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {[0, 1, 2, 3].map((idx) => (
                        <div key={idx} className="space-y-1">
                          <label className="text-[8px] font-sans font-bold text-gray-400 block uppercase">Option #{idx + 1}</label>
                          <input 
                            type="text" 
                            required
                            placeholder={`Provide Option #${idx + 1}`} 
                            value={newQOptions[idx]} 
                            onChange={(e) => {
                              const copy = [...newQOptions];
                              copy[idx] = e.target.value;
                              setNewQOptions(copy);
                            }}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 px-2.5"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[8px] font-sans font-bold text-gray-400 block uppercase">Correct Option Number</label>
                        <select 
                          value={newQCorrectIdx} 
                          onChange={(e) => setNewQCorrectIdx(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 font-semibold"
                        >
                          <option value={0}>Option 1</option>
                          <option value={1}>Option 2</option>
                          <option value={2}>Option 3</option>
                          <option value={3}>Option 4</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-sans font-bold text-gray-400 block uppercase">MCQ subject</label>
                        <input 
                          type="text" 
                          value={newQSubject} 
                          onChange={(e) => setNewQSubject(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-sans font-bold text-gray-400 block uppercase">Answer Explanation details</label>
                      <input 
                        type="text" 
                        placeholder="Provide details about the correct historical or factual background..." 
                        value={newQExplanation} 
                        onChange={(e) => setNewQExplanation(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 px-3"
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-[#5b1fc7] text-white font-heading font-black py-3 rounded-2xl text-xs active:scale-95 transition-all"
                    >
                      Save Question into Mock Exam
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* III. BULK IMPORT MODAL */}
            {showBulkImportModal && (
              <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 select-none animate-fadeIn">
                <div className="bg-white rounded-[24px] w-full max-w-[360px] p-5 space-y-4 text-left animate-scaleIn">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <h3 className="font-heading font-black text-sm text-gray-950">Bulk Import Questions</h3>
                    <button onClick={() => setShowBulkImportModal(false)} className="p-1 bg-slate-100 text-slate-500 rounded-full">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs text-slate-500">
                    <p className="font-sans leading-relaxed">
                      Choose a formatted <strong>CSV / Excel (.xlsx)</strong> file. Ensure columns follow the structure:
                    </p>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-[9px] text-slate-600">
                      question, option1, option2, option3, option4, correct_answer_index, explanation, subject
                    </div>

                    {/* Drag and Drop simulate zone */}
                    <div 
                      onClick={triggerBulkFileClick}
                      className="h-32 border-2 border-dashed border-purple-300 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer bg-purple-50/50 hover:bg-purple-50 transition-all text-center p-3 select-none"
                    >
                      <UploadCloud className="w-8 h-8 text-[#5b1fc7] animate-bounce" />
                      <span className="font-heading font-extrabold text-[#5b1fc7]">Click to select CSV file</span>
                      <span className="text-[8px]">or drop your spreadsheet file here</span>
                    </div>

                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleBulkFileChange}
                      accept=".csv, .xlsx, .xls"
                      className="hidden" 
                    />

                    {bulkImportStatus && (
                      <div className="py-2 flex items-center justify-center gap-2 text-purple-700 font-bold">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{bulkImportStatus}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* IV. ADD STUDENT MODAL */}
            {showAddStudentModal && (
              <div className="absolute inset-0 bg-black/60 z-50 flex items-end justify-center select-none animate-fadeIn">
                <div className="bg-white rounded-t-[32px] w-full p-5 space-y-4 text-left animate-slideUp border-t border-purple-500/20">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <h3 className="font-heading font-black text-base text-gray-950">Register New Student</h3>
                    <button onClick={() => setShowAddStudentModal(false)} className="p-1 bg-slate-100 text-slate-500 rounded-full">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleAddStudentSubmit} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-[8px] font-sans font-bold text-gray-400 block uppercase">Student Full Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Sanjoy Banerjee" 
                        value={newStudentName} 
                        onChange={(e) => setNewStudentName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 text-slate-800 font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[8px] font-sans font-bold text-gray-400 block uppercase">Phone Number</label>
                        <input 
                          type="tel" 
                          required
                          placeholder="+91 XXXXX XXXXX" 
                          value={newStudentPhone} 
                          onChange={(e) => setNewStudentPhone(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 text-slate-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-sans font-bold text-gray-400 block uppercase">Email Address (Optional)</label>
                        <input 
                          type="email" 
                          placeholder="student@example.com" 
                          value={newStudentEmail} 
                          onChange={(e) => setNewStudentEmail(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-sans font-bold text-gray-400 block uppercase">Exam preference stream</label>
                      <select 
                        value={newStudentExam} 
                        onChange={(e) => setNewStudentExam(e.target.value as ExamCategory)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 text-slate-800 font-semibold"
                      >
                        <option value="WBCS">WBCS</option>
                        <option value="WBP Constable">WBP Constable</option>
                        <option value="SSC GD">SSC GD</option>
                        <option value="WBPSC">WBPSC</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-sans font-bold text-gray-400 block uppercase">Premium Tier Status</label>
                      <select 
                        value={newStudentPremium ? "Premium" : "Free"} 
                        onChange={(e) => setNewStudentPremium(e.target.value === "Premium")}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 text-slate-800 font-semibold"
                      >
                        <option value="Free">Free Basic Access</option>
                        <option value="Premium">Premium Pro Combo Access</option>
                      </select>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-[#5b1fc7] text-white font-heading font-black py-3 rounded-2xl text-xs active:scale-95 transition-all shadow-md shadow-purple-500/10"
                    >
                      Register Student Record
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* V. STUDENT DETAIL & ACCESS CONTROL PANEL DRAWER */}
            {selectedStudentDetail && (
              <div className="absolute inset-0 bg-black/60 z-50 flex items-end justify-center select-none animate-fadeIn">
                <div className="bg-white rounded-t-[32px] w-full p-5 space-y-4 text-left animate-slideUp border-t border-purple-500/20 max-h-[85%] overflow-y-auto">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <div>
                      <h3 className="font-heading font-black text-base text-gray-950">Student Access Console</h3>
                      <span className="text-[8px] font-mono text-slate-400">UID: {selectedStudentDetail.id}</span>
                    </div>
                    <button onClick={() => setSelectedStudentDetail(null)} className="p-1 bg-slate-100 text-slate-500 rounded-full">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4 text-xs text-slate-700">
                    <div className="flex gap-3 items-center bg-slate-50 rounded-2xl p-3 border border-slate-100">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-[#5b1fc7]/10 flex items-center justify-center font-bold text-[#5b1fc7] text-lg">
                        {selectedStudentDetail.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-heading font-black text-sm text-slate-900 leading-none">{selectedStudentDetail.name}</h4>
                        <span className="text-[10px] text-slate-500 font-mono block mt-1">{selectedStudentDetail.phone}</span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">{selectedStudentDetail.email}</span>
                      </div>
                    </div>

                    {/* Stats metrics */}
                    <div className="grid grid-cols-2 gap-2 text-center text-xs font-heading font-extrabold text-slate-950">
                      <div className="bg-purple-50/50 rounded-xl p-2.5">
                        <span className="text-sm text-[#5b1fc7] block">{selectedStudentDetail.testsTaken} Exams</span>
                        <span className="text-[8px] text-slate-400 block font-normal">Attempted Exams</span>
                      </div>
                      <div className="bg-emerald-50/50 rounded-xl p-2.5">
                        <span className="text-sm text-emerald-700 block">{selectedStudentDetail.avgScore}% score</span>
                        <span className="text-[8px] text-slate-400 block font-normal">Average Percent</span>
                      </div>
                    </div>

                    {/* Access Controls Forms */}
                    <div className="space-y-3.5 border-t border-slate-100 pt-3">
                      <span className="text-[10px] font-heading font-black text-slate-400 block uppercase">ACCOUNTS LEVEL ADJUSTMENT</span>
                      
                      <div className="flex justify-between items-center bg-slate-50 rounded-xl p-3.5">
                        <div>
                          <span className="font-bold text-slate-900 block">Premium Combo Status</span>
                          <span className="text-[9px] text-slate-400 font-sans leading-none block mt-0.5">Toggle unlimited mock examination files</span>
                        </div>
                        <button 
                          onClick={() => {
                            handleToggleStudentPremium(selectedStudentDetail.id, selectedStudentDetail.isPremium);
                            setSelectedStudentDetail({ ...selectedStudentDetail, isPremium: !selectedStudentDetail.isPremium });
                          }}
                          className={`px-3 py-1.5 font-heading font-black text-[10px] rounded-lg select-none ${selectedStudentDetail.isPremium ? 'bg-amber-100 text-amber-800' : 'bg-[#5b1fc7] text-white'}`}
                        >
                          {selectedStudentDetail.isPremium ? 'Downgrade Access' : 'Grant Premium'}
                        </button>
                      </div>

                      <div className="flex justify-between items-center bg-slate-50 rounded-xl p-3.5">
                        <div>
                          <span className="font-bold text-slate-900 block">Access Permission Tier</span>
                          <span className="text-[9px] text-slate-400 font-sans leading-none block mt-0.5">Restrict block this student on abuse</span>
                        </div>
                        <button 
                          onClick={() => {
                            handleToggleStudentBlock(selectedStudentDetail.id, selectedStudentDetail.status);
                            setSelectedStudentDetail({ 
                              ...selectedStudentDetail, 
                              status: selectedStudentDetail.status === 'Active' ? 'Blocked' : 'Active' 
                            });
                          }}
                          className={`px-3 py-1.5 font-heading font-black text-[10px] rounded-lg select-none ${selectedStudentDetail.status === 'Active' ? 'bg-rose-100 text-[#ef4444]' : 'bg-emerald-100 text-emerald-800'}`}
                        >
                          {selectedStudentDetail.status === 'Active' ? 'Restrict Block' : 'Activate Access'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
