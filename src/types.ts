export type ExamCategory = 'WBCS' | 'WBPSC' | 'KP Constable' | 'WBP Constable' | 'SSC GD' | 'Railway NTPC' | 'Bank Exams';

export interface Question {
  id: string;
  text: string;
  textBn?: string;
  options: string[];
  optionsBn?: string[];
  correctAnswer: number; // index of correct option
  explanation: string;
  explanationBn?: string;
  subject: string;
  subjectBn?: string;
}

export interface MockTest {
  id: string;
  title: string;
  titleBn?: string;
  category: ExamCategory;
  questionsCount: number;
  durationMinutes: number;
  studentsRegisteredCount: string;
  isFree: boolean;
  questions: Question[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  examBoard?: string;
  examBoardBn?: string;
  topic?: string;
  topicBn?: string;
}

export interface TestAttempt {
  testId: string;
  testTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  timeSpentSeconds: number;
  dateCompleted: string;
  answers: { [questionId: string]: number }; // questionId -> selectedOptionIndex
}

export interface UserProfile {
  name: string;
  email: string;
  isPremium: boolean;
  streakDays: number;
  totalMockTestsCompleted: number;
  joinedDate: string;
  avatarUrl: string;
  examPreferences: ExamCategory[];
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  type: 'live' | 'result' | 'general';
}

export interface GovtJobAlert {
  id: string;
  titleEn: string;
  titleBn: string;
  departmentEn: string;
  departmentBn: string;
  vacancies: number;
  deadline: string;
  deadlineBn: string;
  eligibilityEn: string;
  eligibilityBn: string;
  statusEn: 'Apply Now' | 'Notification Out' | 'Result Declared' | 'Admit Card' | 'Exam Date Out';
  statusBn: 'আবেদন করুন' | 'বিজ্ঞপ্তি প্রকাশিত' | 'ফলাফল প্রকাশিত' | 'অ্যাডমিট কার্ড' | 'পরীক্ষার তারিখ';
  badgeColor: string;
  salaryEn: string;
  salaryBn: string;
  examName: string;
}

