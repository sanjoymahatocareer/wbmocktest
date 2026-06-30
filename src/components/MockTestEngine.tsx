import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle2, ChevronRight, ChevronLeft, AlertCircle, Sparkles, LogOut, Check } from 'lucide-react';
import { MockTest, TestAttempt } from '../types';
import { translateUI, getTestTranslation } from '../utils/translations';

interface MockTestEngineProps {
  test: MockTest;
  onExit: () => void;
  onSubmit: (attempt: TestAttempt) => void;
  language: 'EN' | 'BN';
}

export default function MockTestEngine({ test, onExit, onSubmit, language }: MockTestEngineProps) {
  const transTest = getTestTranslation(test, language);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: number }>({});
  const [markedForReview, setMarkedForReview] = useState<{ [questionId: string]: boolean }>({});
  const [visitedQuestions, setVisitedQuestions] = useState<{ [questionId: string]: boolean }>({ [transTest.questions[0].id]: true });
  
  // Timer state
  const [secondsRemaining, setSecondsRemaining] = useState(transTest.durationMinutes * 60);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto submit
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAutoSubmit = () => {
    submitAttempt();
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
    const qId = transTest.questions[index].id;
    setVisitedQuestions(prev => ({ ...prev, [qId]: true }));
  };

  const handleOptionSelect = (optionIndex: number) => {
    const qId = transTest.questions[currentQuestionIndex].id;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIndex }));
  };

  const handleClearResponse = () => {
    const qId = transTest.questions[currentQuestionIndex].id;
    setSelectedAnswers(prev => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
  };

  const handleMarkForReview = () => {
    const qId = transTest.questions[currentQuestionIndex].id;
    setMarkedForReview(prev => ({ ...prev, [qId]: !prev[qId] }));
    handleNext();
  };

  const handleNext = () => {
    if (currentQuestionIndex < transTest.questions.length - 1) {
      handleQuestionSelect(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      handleQuestionSelect(currentQuestionIndex - 1);
    }
  };

  const getQuestionState = (index: number) => {
    const q = transTest.questions[index];
    const isVisited = visitedQuestions[q.id];
    const isAnswered = selectedAnswers[q.id] !== undefined;
    const isMarked = markedForReview[q.id];

    if (isMarked) return 'marked';
    if (isAnswered) return 'answered';
    if (isVisited) return 'visited';
    return 'unvisited';
  };

  const submitAttempt = () => {
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;

    transTest.questions.forEach((q: any) => {
      const ans = selectedAnswers[q.id];
      if (ans === undefined) {
        skipped++;
      } else if (ans === q.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    // Score is 1 mark for correct, -0.25 negative marks for incorrect (standard Bengal competitive exam marking!)
    const scoreVal = correct - (incorrect * 0.25);
    const roundedScore = Math.max(0, parseFloat(scoreVal.toFixed(2)));

    const attempt: TestAttempt = {
      testId: test.id,
      testTitle: test.title, // store English title internally for database integrity, we localize on-the-fly
      score: roundedScore,
      totalQuestions: transTest.questions.length,
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      skippedQuestions: skipped,
      timeSpentSeconds: (transTest.durationMinutes * 60) - secondsRemaining,
      dateCompleted: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      answers: selectedAnswers
    };

    onSubmit(attempt);
  };

  const formatTime = (totalSec: number) => {
    const minutes = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = transTest.questions[currentQuestionIndex];
  const totalAnswered = Object.keys(selectedAnswers).length;
  const totalMarked = Object.keys(markedForReview).filter(k => markedForReview[k]).length;

  return (
    <div className="flex flex-col h-screen bg-[#f4f5f9] select-none text-gray-800">
      {/* Persistent Countdown Timer Strip */}
      <div className={`w-full py-2.5 px-4 shadow-xs shrink-0 flex items-center justify-between text-xs font-heading font-bold transition-colors border-b ${
        secondsRemaining < 60 
          ? 'bg-red-600 text-white border-red-700 animate-pulse' 
          : 'bg-slate-900 text-white border-slate-950'
      }`}>
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${secondsRemaining < 60 ? 'text-white animate-bounce' : 'text-purple-300'}`} />
          <span className="uppercase tracking-wider text-[10px] font-black">
            {language === 'EN' ? "TIME REMAINING" : "অবশিষ্ট সময়"}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-sm tracking-wider font-extrabold bg-white/10 px-2 py-0.5 rounded">
              {formatTime(secondsRemaining)}
            </span>
          </div>
          <span className="text-white/30 font-light">|</span>
          <span className="text-[10px] text-purple-200 font-semibold uppercase tracking-wide">
            {language === 'EN' ? `${transTest.durationMinutes} Min Duration` : `${transTest.durationMinutes} মিনিট সময়`}
          </span>
        </div>
      </div>

      {/* Visual Time Progress Indicator Bar */}
      <div className="w-full h-1 bg-slate-200 shrink-0 overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${
            secondsRemaining < 60 
              ? 'bg-red-500' 
              : secondsRemaining < 300 
                ? 'bg-amber-500' 
                : 'bg-brand-primary'
          }`}
          style={{ width: `${(secondsRemaining / (transTest.durationMinutes * 60)) * 100}%` }}
        />
      </div>

      {/* Engine Header */}
      <div className="bg-white border-b border-gray-100 p-4 shadow-xs shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setShowExitWarning(true)}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <LogOut className="w-5 h-5 rotate-180 text-red-500" />
          </button>
          <div>
            <span className="text-[10px] bg-indigo-50 text-brand-primary font-bold px-2 py-0.5 rounded-full font-heading">
              {transTest.category} Mock
            </span>
            <h1 className="font-heading font-extrabold text-sm text-gray-900 truncate max-w-[180px]">
              {transTest.title}
            </h1>
          </div>
        </div>

        {/* Answering Progress Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50 text-teal-700 font-heading font-extrabold text-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
          <span>
            {language === 'EN' 
              ? `Progress: ${totalAnswered}/${transTest.questions.length}` 
              : `অগ্রগতি: ${totalAnswered}/${transTest.questions.length}`}
          </span>
        </div>
      </div>

      {/* Main Content Area: Split on Desktop, stack or clean scrolling on mobile */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* Questions Panel */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between">
          <div>
            {/* Question Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs mb-4">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-50">
                <span className="font-heading font-extrabold text-xs text-gray-500 tracking-wider uppercase">
                  {language === 'EN' ? `QUESTION ${currentQuestionIndex + 1} OF ${transTest.questions.length}` : `প্রশ্ন ${currentQuestionIndex + 1} / ${transTest.questions.length}`}
                </span>
                <span className="text-[10px] bg-teal-50 text-teal-600 px-2 py-0.5 rounded font-mono font-bold">
                  {currentQuestion.subject}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="font-heading font-semibold text-[15px] leading-relaxed text-gray-900 mb-6 text-left">
                {currentQuestion.text}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option: string, optIdx: number) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleOptionSelect(optIdx)}
                      className={`w-full text-left p-4 rounded-xl border font-sans text-sm font-medium transition-all flex items-center justify-between active:scale-[0.99] ${
                        isSelected 
                          ? 'border-[#5b1fc7] bg-brand-primary/5 text-brand-primary ring-1 ring-brand-primary' 
                          : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-md border flex items-center justify-center text-xs font-heading font-bold ${
                          isSelected ? 'bg-brand-primary text-white border-brand-primary' : 'bg-gray-50 text-gray-500 border-gray-200'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center text-white shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center justify-between gap-2.5 bg-white p-3.5 border border-gray-100 rounded-2xl shadow-xs shrink-0 mt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearResponse}
                disabled={selectedAnswers[currentQuestion.id] === undefined}
                className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
              >
                {language === 'EN' ? "Clear" : "মুছে ফেলুন"}
              </button>
              <button
                onClick={handleMarkForReview}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                  markedForReview[currentQuestion.id]
                    ? 'bg-purple-100 text-[#5b1fc7]'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {markedForReview[currentQuestion.id] 
                  ? (language === 'EN' ? 'Unmark Review' : 'রিভিউ সরান') 
                  : (language === 'EN' ? 'Mark Review' : 'রিভিউ করুন')}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {currentQuestionIndex === transTest.questions.length - 1 ? (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-[#5b1fc7] to-[#7b2ff7] text-white rounded-lg text-xs font-bold font-heading shadow-md shadow-brand-primary/20 hover:shadow-lg transition-all"
                >
                  {language === 'EN' ? "Submit Test" : "টেস্ট জমা দিন"}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white rounded-lg text-xs font-bold font-heading flex items-center gap-1 transition-all"
                >
                  <span>{language === 'EN' ? "Save & Next" : "সংরক্ষণ ও পরবর্তী"}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Question Palette */}
        <div className="w-full md:w-[280px] bg-white border-t md:border-t-0 md:border-l border-gray-100 p-4 shrink-0 overflow-y-auto flex flex-col justify-between">
          <div>
            <h4 className="font-heading font-extrabold text-xs text-gray-900 mb-3 tracking-wider uppercase text-left">
              {language === 'EN' ? "Question Palette" : "প্রশ্ন তালিকা"}
            </h4>
            
            {/* Legend indicators */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-[10px] font-sans font-medium text-gray-500 text-left">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-emerald-600 block shrink-0" />
                <span>{language === 'EN' ? `Answered (${totalAnswered})` : `উত্তর দেওয়া হয়েছে (${totalAnswered})`}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-purple-500 border border-purple-600 block shrink-0" />
                <span>{language === 'EN' ? `Review (${totalMarked})` : `রিভিউ (${totalMarked})`}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-gray-200 border border-gray-300 block shrink-0" />
                <span>{language === 'EN' ? "Not Visited" : "দেখা হয়নি"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-white border border-red-500 block shrink-0" />
                <span>{language === 'EN' ? "Active" : "সক্রিয়"}</span>
              </div>
            </div>

            {/* Grid of question numbers */}
            <div className="grid grid-cols-5 gap-2 max-h-[140px] md:max-h-none overflow-y-auto pr-1">
              {transTest.questions.map((q: any, idx: number) => {
                const qState = getQuestionState(idx);
                const isActive = currentQuestionIndex === idx;

                let stateClass = '';
                if (isActive) {
                  stateClass = 'border-red-500 ring-2 ring-red-100 text-gray-900 bg-white font-bold';
                } else if (qState === 'marked') {
                  stateClass = 'bg-purple-500 text-white border-purple-600 font-bold';
                } else if (qState === 'answered') {
                  stateClass = 'bg-emerald-500 text-white border-emerald-600 font-bold';
                } else if (qState === 'visited') {
                  stateClass = 'bg-gray-100 text-gray-600 border-gray-300 font-semibold';
                } else {
                  stateClass = 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => handleQuestionSelect(idx)}
                    className={`h-10 rounded-lg border text-xs font-heading flex items-center justify-center transition-all ${stateClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 md:mt-0 pt-4 border-t border-gray-100">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-3 bg-indigo-50 border border-indigo-200 text-[#5b1fc7] font-heading font-extrabold text-xs rounded-xl hover:bg-brand-primary/10 transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'EN' ? "Submit Mock Test" : "মক টেস্ট জমা দিন"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation and warning modals */}
      <AnimatePresence>
        {showExitWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60" onClick={() => setShowExitWarning(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative z-10 text-left"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-lg text-gray-900 mb-2">
                {language === 'EN' ? "Leave Mock Test?" : "মক টেস্ট থেকে বের হবেন?"}
              </h4>
              <p className="text-sm text-gray-500 font-sans leading-relaxed mb-5">
                {language === 'EN' 
                  ? "Your progress for this test will not be saved. Are you sure you want to exit?" 
                  : "এই পরীক্ষার অগ্রগতি সংরক্ষিত হবে না। আপনি কি নিশ্চিত যে আপনি বের হতে চান?"}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitWarning(false)}
                  className="flex-1 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 font-heading font-bold text-xs rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {language === 'EN' ? "Cancel" : "বাতিল"}
                </button>
                <button
                  onClick={onExit}
                  className="flex-1 py-2.5 bg-red-600 text-white font-heading font-bold text-xs rounded-lg hover:bg-red-700 transition-colors"
                >
                  {language === 'EN' ? "Yes, Exit" : "হ্যাঁ, বের হবো"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60" onClick={() => setShowSubmitModal(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative z-10 text-left"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-lg text-gray-900 mb-2">
                {language === 'EN' ? "Submit Your Test?" : "আপনার টেস্ট জমা দেবেন?"}
              </h4>
              <p className="text-sm text-gray-500 font-sans leading-relaxed mb-4">
                {language === 'EN' 
                  ? `You have answered ${totalAnswered} / ${transTest.questions.length} questions. Let's analyze your accuracy!`
                  : `আপনি ${transTest.questions.length} টির মধ্যে ${totalAnswered} টি প্রশ্নের উত্তর দিয়েছেন। আপনার নির্ভুলতা পরীক্ষা করুন!`}
              </p>
              <div className="space-y-2 mb-5 bg-gray-50 p-3 rounded-xl text-xs font-sans font-medium text-gray-600">
                <div className="flex justify-between">
                  <span>{language === 'EN' ? "Answered:" : "উত্তর দেওয়া হয়েছে:"}</span>
                  <span className="font-bold text-emerald-600">{totalAnswered}</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'EN' ? "Marked for Review:" : "রিভিউয়ের জন্য চিহ্নিত:"}</span>
                  <span className="font-bold text-purple-600">{totalMarked}</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'EN' ? "Skipped:" : "এড়িয়ে গেছেন:"}</span>
                  <span className="font-bold text-amber-500">{transTest.questions.length - totalAnswered}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 font-heading font-bold text-xs rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {language === 'EN' ? "Keep Solving" : "সমাধান করতে থাকুন"}
                </button>
                <button
                  onClick={submitAttempt}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#5b1fc7] to-[#7b2ff7] text-white font-heading font-bold text-xs rounded-lg hover:shadow-lg transition-all"
                >
                  {language === 'EN' ? "Submit & Analyze" : "জমা দিন ও বিশ্লেষণ করুন"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
