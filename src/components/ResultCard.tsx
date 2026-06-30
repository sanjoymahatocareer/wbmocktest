import { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Clock, BookOpen, ChevronDown, ChevronUp, Share2, ArrowLeft, RefreshCw } from 'lucide-react';
import { MockTest, TestAttempt } from '../types';
import { getTestTranslation, translateUI } from '../utils/translations';

interface ResultCardProps {
  test: MockTest;
  attempt: TestAttempt;
  onClose: () => void;
  onRetake: () => void;
  language: 'EN' | 'BN';
}

export default function ResultCard({ test, attempt, onClose, onRetake, language }: ResultCardProps) {
  const transTest = getTestTranslation(test, language);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');
  const [expandedExplanation, setExpandedExplanation] = useState<{ [questionId: string]: boolean }>({});

  const accuracy = attempt.totalQuestions - attempt.skippedQuestions > 0
    ? Math.round((attempt.correctAnswers / (attempt.totalQuestions - attempt.skippedQuestions)) * 100)
    : 0;

  const toggleExplanation = (qId: string) => {
    setExpandedExplanation(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Get list of unique subjects
  const subjects = ['All', ...Array.from(new Set(transTest.questions.map((q: any) => q.subject)))];

  const filteredQuestions = selectedSubjectFilter === 'All'
    ? transTest.questions
    : transTest.questions.filter((q: any) => q.subject === selectedSubjectFilter);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return language === 'EN' ? `${mins}m ${secs}s` : `${mins}মি ${secs}সে`;
  };

  return (
    <div className="min-h-screen bg-[#f4f5f9] pb-10 text-gray-800 font-sans">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#5b1fc7] to-[#7b2ff7] text-white p-6 shadow-md rounded-b-3xl">
        <div className="max-w-md mx-auto text-left">
          <button 
            onClick={onClose}
            className="mb-4 flex items-center gap-1.5 text-xs font-bold text-purple-100 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'EN' ? "Back to Home" : "হোমে ফিরে যান"}</span>
          </button>
          
          <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full font-heading uppercase tracking-wide">
            {language === 'EN' ? "Performance Report" : "পারফরম্যান্স রিপোর্ট"}
          </span>
          <h1 className="font-heading font-extrabold text-xl mt-1 leading-snug">
            {transTest.title}
          </h1>
          <p className="text-xs text-purple-100 mt-1">
            {language === 'EN' ? "Completed on " : "সম্পন্ন হয়েছে: "}{attempt.dateCompleted}
          </p>

          {/* Core Score Circle and Grade */}
          <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-5 flex items-center justify-between border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-18 h-18 rounded-full border-4 border-amber-400 bg-white/10 flex flex-col items-center justify-center shrink-0 shadow-inner">
                <span className="text-[10px] text-amber-300 font-bold leading-none">SCORE</span>
                <span className="text-xl font-heading font-extrabold text-white mt-0.5">{attempt.score}</span>
                <span className="text-[9px] text-purple-100 font-mono">/ {attempt.totalQuestions}</span>
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-white">
                  {attempt.score >= attempt.totalQuestions * 0.75 
                    ? (language === 'EN' ? 'Excellent Work! 🏆' : 'চমৎকার পারফরম্যান্স! 🏆') 
                    : attempt.score >= attempt.totalQuestions * 0.5 
                    ? (language === 'EN' ? 'Good Progress! 👍' : 'ভালো অগ্রগতি! 👍') 
                    : (language === 'EN' ? 'Keep Practicing! 💪' : 'অনুশীলন করতে থাকুন! 💪')}
                </h3>
                <p className="text-xs text-purple-100 mt-0.5 leading-relaxed">
                  {language === 'EN' 
                    ? 'Negative marking of 0.25 was applied to incorrect responses.' 
                    : 'ভুল উত্তরের জন্য ০.২৫ নেগেティブ নম্বর কাটা হয়েছে।'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics grid */}
      <div className="max-w-md mx-auto px-4 -mt-4 text-left">
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="text-[10px] text-emerald-600 font-bold tracking-wide uppercase">
                {language === 'EN' ? "Correct" : "সঠিক"}
              </span>
              <p className="text-base font-heading font-extrabold text-emerald-900 leading-none mt-0.5">{attempt.correctAnswers}</p>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-2.5">
            <XCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <span className="text-[10px] text-red-600 font-bold tracking-wide uppercase">
                {language === 'EN' ? "Incorrect" : "ভুল"}
              </span>
              <p className="text-base font-heading font-extrabold text-red-900 leading-none mt-0.5">{attempt.incorrectAnswers}</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="text-[10px] text-amber-600 font-bold tracking-wide uppercase">
                {language === 'EN' ? "Skipped" : "এড়িয়ে গেছেন"}
              </span>
              <p className="text-base font-heading font-extrabold text-amber-900 leading-none mt-0.5">{attempt.skippedQuestions}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <span className="text-[10px] text-blue-600 font-bold tracking-wide uppercase">
                {language === 'EN' ? "Time Taken" : "ব্যয়িত সময়"}
              </span>
              <p className="text-sm font-heading font-extrabold text-blue-900 leading-none mt-1">{formatTime(attempt.timeSpentSeconds)}</p>
            </div>
          </div>
        </div>

        {/* Dynamic Accuracy Gauge */}
        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-150 mt-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-bold text-gray-500 font-heading">
              {language === 'EN' ? "ACCURACY LEVEL" : "নির্ভুলতার স্তর"}
            </span>
            <span className={`text-xs font-extrabold font-mono px-2 py-0.5 rounded ${accuracy >= 80 ? 'bg-emerald-100 text-emerald-700' : accuracy >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
              {accuracy}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${accuracy >= 80 ? 'bg-emerald-500' : accuracy >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </div>

        {/* Action button bar */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={onRetake}
            className="flex-1 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-brand-primary font-heading font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{language === 'EN' ? "Retake Practice" : "আবার চেষ্টা করুন"}</span>
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'My Mock Test Result',
                  text: `I scored ${attempt.score}/${attempt.totalQuestions} on ${transTest.title} with ${accuracy}% accuracy on WBMockTest.in!`,
                  url: window.location.href,
                }).catch(() => {});
              } else {
                alert('Result details copied to clipboard!');
              }
            }}
            className="flex-1 py-3 bg-gradient-to-r from-[#5b1fc7] to-[#7b2ff7] text-white font-heading font-bold text-xs rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-1.5 shadow-md shadow-brand-primary/15"
          >
            <Share2 className="w-3.5 h-3.5 text-purple-100" />
            <span>{language === 'EN' ? "Share Report" : "রিপোর্ট শেয়ার করুন"}</span>
          </button>
        </div>

        {/* Detailed Explanations section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="font-heading font-extrabold text-sm text-gray-900 tracking-wide">
              {language === 'EN' ? "Question-by-Question Analysis" : "প্রশ্নভিত্তিক বিস্তারিত বিশ্লেষণ"}
            </h3>
            
            {/* Subject Filters */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-[180px] no-scrollbar scroll-smooth">
              {subjects.map(subj => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubjectFilter(subj)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap shrink-0 transition-colors ${selectedSubjectFilter === subj ? 'bg-[#5b1fc7] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}
                >
                  {subj === 'All' ? (language === 'EN' ? 'All' : 'সব') : subj}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredQuestions.map((q: any, qIdx: number) => {
              const originalIdx = transTest.questions.findIndex((ogQ: any) => ogQ.id === q.id);
              const userAns = attempt.answers[q.id];
              const isCorrect = userAns === q.correctAnswer;
              const isSkipped = userAns === undefined;
              const isExpanded = expandedExplanation[q.id];

              let statusColorClass = 'border-amber-200 bg-amber-50/5';
              let statusLabel = language === 'EN' ? 'Skipped' : 'এড়িয়ে গেছেন';
              let Icon = AlertCircle;
              let iconColor = 'text-amber-500';

              if (!isSkipped) {
                if (isCorrect) {
                  statusColorClass = 'border-emerald-200 bg-emerald-50/5';
                  statusLabel = language === 'EN' ? 'Correct' : 'সঠিক';
                  Icon = CheckCircle2;
                  iconColor = 'text-emerald-500';
                } else {
                  statusColorClass = 'border-red-200 bg-red-50/5';
                  statusLabel = language === 'EN' ? 'Incorrect' : 'ভুল';
                  Icon = XCircle;
                  iconColor = 'text-red-500';
                }
              }

              return (
                <div 
                  key={q.id}
                  className={`bg-white rounded-2xl border ${statusColorClass} shadow-xs overflow-hidden transition-all`}
                >
                  {/* Top line indicator bar */}
                  <div className={`h-1.5 ${isSkipped ? 'bg-amber-400' : isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-heading font-extrabold text-gray-400 tracking-wider">
                        {language === 'EN' ? `QUESTION ${originalIdx + 1} · ${q.subject}` : `প্রশ্ন ${originalIdx + 1} · ${q.subject}`}
                      </span>
                      <div className="flex items-center gap-1">
                        <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                        <span className={`text-[10px] font-bold ${iconColor}`}>{statusLabel}</span>
                      </div>
                    </div>

                    <h4 className="font-heading font-semibold text-sm text-gray-900 leading-relaxed mb-3">
                      {q.text}
                    </h4>

                    {/* Options list showing user choice */}
                    <div className="space-y-2 text-xs font-sans">
                      {q.options.map((opt: string, oIdx: number) => {
                        const isCorrectOpt = oIdx === q.correctAnswer;
                        const isUserOpt = oIdx === userAns;

                        let optClass = 'bg-gray-50 text-gray-600 border-gray-100';
                        if (isCorrectOpt) {
                          optClass = 'bg-emerald-50 text-emerald-800 border-emerald-200 font-medium';
                        } else if (isUserOpt && !isCorrect) {
                          optClass = 'bg-red-50 text-red-800 border-red-200 font-medium';
                        }

                        return (
                          <div 
                            key={oIdx}
                            className={`p-2.5 rounded-lg border flex items-center justify-between ${optClass}`}
                          >
                            <span className="flex items-center gap-2">
                              <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${isCorrectOpt ? 'bg-emerald-500 text-white' : isUserOpt ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span>{opt}</span>
                            </span>
                            {isCorrectOpt && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold font-heading uppercase">
                                {language === 'EN' ? "Correct Answer" : "সঠিক উত্তর"}
                              </span>
                            )}
                            {isUserOpt && !isCorrect && (
                              <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold font-heading uppercase">
                                {language === 'EN' ? "Your Choice" : "আপনার উত্তর"}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation toggle button */}
                    <button
                      onClick={() => toggleExplanation(q.id)}
                      className="w-full mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-xs font-semibold text-brand-primary hover:text-brand-secondary transition-colors"
                    >
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{language === 'EN' ? "Academic Solution & Explanation" : "সমাধান ও ব্যাখ্যা"}</span>
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {/* Expanded explanation details */}
                    {isExpanded && (
                      <div className="mt-2.5 p-3.5 bg-indigo-50/50 border border-indigo-100/50 rounded-xl text-xs font-sans leading-relaxed text-gray-600 animate-fadeIn">
                        <p className="font-semibold font-heading text-brand-primary mb-1">
                          {language === 'EN' ? "Detailed Explanation:" : "বিস্তারিত ব্যাখ্যা:"}
                        </p>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
