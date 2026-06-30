import { MockTest, UserProfile, NotificationItem, ExamCategory, GovtJobAlert } from './types';

export const POPULAR_EXAMS = [
  { id: 'wbcs', name: 'WBCS' as ExamCategory, fullName: 'West Bengal Civil Service', testsCount: '125+', code: 'WBCS', emblemColor: 'from-blue-500 to-indigo-600' },
  { id: 'wbpsc', name: 'WBPSC' as ExamCategory, fullName: 'WB Public Service Commission', testsCount: '98+', code: 'WBPSC', emblemColor: 'from-amber-500 to-orange-600' },
  { id: 'wbp', name: 'WBP Constable' as ExamCategory, fullName: 'West Bengal Police Constable', testsCount: '80+', code: 'WBP', emblemColor: 'from-indigo-500 to-purple-600' },
  { id: 'kp', name: 'KP Constable' as ExamCategory, fullName: 'Kolkata Police Constable', testsCount: '60+', code: 'KP', emblemColor: 'from-purple-500 to-pink-600' },
  { id: 'ssc', name: 'SSC GD' as ExamCategory, fullName: 'SSC General Duty Constable', testsCount: '75+', code: 'SSC GD', emblemColor: 'from-rose-500 to-red-600' },
  { id: 'railway', name: 'Railway NTPC' as ExamCategory, fullName: 'RRB Non-Technical Popular', testsCount: '120+', code: 'NTPC', emblemColor: 'from-teal-500 to-emerald-600' },
  { id: 'bank', name: 'Bank Exams' as ExamCategory, fullName: 'IBPS / SBI Clerk & PO', testsCount: '85+', code: 'Bank', emblemColor: 'from-cyan-500 to-blue-600' }
];

export const TOP_PERFORMERS = [
  { id: 'tp-1', name: 'Rahul S.', rank: 1, exam: 'WBCS 2023', avatarSeed: 'rahul', score: '88.5%', color: 'from-blue-500/10 to-indigo-500/10 border-blue-200' },
  { id: 'tp-2', name: 'Ananya D.', rank: 2, exam: 'WBPSC 2023', avatarSeed: 'ananya', score: '86.2%', color: 'from-pink-500/10 to-rose-500/10 border-pink-200' },
  { id: 'tp-3', name: 'Sourav M.', rank: 3, exam: 'KP Constable', avatarSeed: 'sourav', score: '85.4%', color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200' },
  { id: 'tp-4', name: 'Puja K.', rank: 4, exam: 'SSC GD 2023', avatarSeed: 'puja', score: '84.9%', color: 'from-amber-500/10 to-yellow-500/10 border-amber-200' }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Sanjoy Mahato',
  email: 'sanjoymahato.career@gmail.com',
  isPremium: false,
  streakDays: 5,
  totalMockTestsCompleted: 12,
  joinedDate: 'May 2026',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  examPreferences: ['WBCS', 'KP Constable', 'WBPSC']
};

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: '🏆 KP Constable Mock Test Live!',
    description: 'The all-Bengal full syllabus Mock Test 05 is now live. Practice before the exam!',
    time: '2 hours ago',
    isRead: false,
    type: 'live'
  },
  {
    id: 'notif-2',
    title: '📊 WBCS Mini Test-12 Results',
    description: 'Your result card for Indian History Quiz is ready. You scored higher than 84% of candidates.',
    time: 'Yesterday',
    isRead: false,
    type: 'result'
  },
  {
    id: 'notif-3',
    title: '⭐ Promo: Go Premium Sale',
    description: 'Get 50% off on WBMockTest premium. Unlock detailed analysis, 500+ mock papers, and doubt solver!',
    time: '2 days ago',
    isRead: true,
    type: 'general'
  }
];

export const SAMPLE_TESTS: MockTest[] = [
  {
    id: 'test-wbp-constable-01',
    title: 'WBP Constable Mock Test – 01',
    category: 'WBP Constable',
    questionsCount: 5,
    durationMinutes: 5,
    studentsRegisteredCount: '4.8K',
    isFree: true,
    difficulty: 'Medium',
    examBoard: 'West Bengal Police Recruitment Board (WBPB)',
    topic: 'General Studies & GK',
    questions: [
      {
        id: 'wbp-c-q1',
        text: 'Which governor-general abolished the Sati practice in India?',
        options: ['Lord William Bentinck', 'Lord Dalhousie', 'Lord Canning', 'Lord Curzon'],
        correctAnswer: 0,
        explanation: 'Sati was abolished in 1829 by the Governor-General Lord William Bentinck, with the help of reformer Raja Ram Mohan Roy.',
        subject: 'Indian History'
      },
      {
        id: 'wbp-c-q2',
        text: 'The Sunderbans of West Bengal is declared a World Heritage Site for its:',
        options: ['Tiger Reserve', 'Mangrove Forests & Biodiversity', 'Coal Mines', 'Hill Stations'],
        correctAnswer: 1,
        explanation: 'Sunderbans was declared a UNESCO World Heritage Site in 1987 for its unique mangrove ecosystem and vast biodiversity.',
        subject: 'Geography of West Bengal'
      },
      {
        id: 'wbp-c-q3',
        text: 'Which is the largest district in West Bengal by area?',
        options: ['South 24 Parganas', 'North 24 Parganas', 'Bardhaman', 'Paschim Medinipur'],
        correctAnswer: 0,
        explanation: 'South 24 Parganas is the largest district of West Bengal by geographical area.',
        subject: 'Geography of West Bengal'
      },
      {
        id: 'wbp-c-q4',
        text: 'What is the speed of light in vacuum?',
        options: ['3 x 10^8 m/s', '3 x 10^6 m/s', '3 x 10^10 m/s', '1.5 x 10^8 m/s'],
        correctAnswer: 0,
        explanation: 'The speed of light in a vacuum is approximately 3,000,000 meters per second, or 3 x 10^8 m/s.',
        subject: 'General Science'
      },
      {
        id: 'wbp-c-q5',
        text: 'If A is taller than B, and B is taller than C, who is the tallest?',
        options: ['A', 'B', 'C', 'Cannot be determined'],
        correctAnswer: 0,
        explanation: 'Since A > B and B > C, then A > B > C. Therefore, A is the tallest.',
        subject: 'Aptitude & Reasoning'
      }
    ]
  },
  {
    id: 'test-wbp-01',
    title: 'KP Constable Mock Test – 01',
    category: 'KP Constable',
    questionsCount: 10,
    durationMinutes: 10,
    studentsRegisteredCount: '5.2K',
    isFree: true,
    difficulty: 'Medium',
    examBoard: 'West Bengal Police Recruitment Board (WBPB)',
    topic: 'General Studies & GK',
    questions: [
      {
        id: 'wbp-q1',
        text: 'Who is the current Governor of West Bengal?',
        options: ['C. V. Ananda Bose', 'Jagdeep Dhankhar', 'Keshari Nath Tripathi', 'La. Ganesan'],
        correctAnswer: 0,
        explanation: 'Dr. C. V. Ananda Bose is the current Governor of West Bengal, assuming office in November 2022.',
        subject: 'General Knowledge'
      },
      {
        id: 'wbp-q2',
        text: 'What is the state animal of West Bengal?',
        options: ['Royal Bengal Tiger', 'Fishing Cat (Baghrol)', 'One-horned Rhinoceros', 'Indian Elephant'],
        correctAnswer: 1,
        explanation: 'The state animal of West Bengal is the Fishing Cat (Baghrol). The Royal Bengal Tiger is the national animal of India and associated with Bengal, but specifically the Fishing Cat holds the state animal status.',
        subject: 'General Knowledge'
      },
      {
        id: 'wbp-q3',
        text: 'The famous Battle of Plassey (Palashi) was fought in which year?',
        options: ['1757', '1764', '1789', '1857'],
        correctAnswer: 0,
        explanation: 'The Battle of Plassey took place on June 23, 1757, on the banks of the Bhagirathi River at Palashi (Plassey) in Bengal.',
        subject: 'Indian History'
      },
      {
        id: 'wbp-q4',
        text: 'Which district of West Bengal has the lowest literacy rate according to Census 2011?',
        options: ['Purulia', 'Uttar Dinajpur', 'Maldah', 'Alipurduar'],
        correctAnswer: 1,
        explanation: 'According to the 2011 Census, Uttar Dinajpur has the lowest literacy rate in West Bengal at approximately 59.07%.',
        subject: 'Geography of West Bengal'
      },
      {
        id: 'wbp-q5',
        text: 'Which is the highest peak of West Bengal?',
        options: ['Sandakphu', 'Falut', 'Tonglu', 'Sabargram'],
        correctAnswer: 0,
        explanation: 'Sandakphu (3,636 m) is the highest peak of the state of West Bengal, situated in the Darjeeling district on the West Bengal-Nepal border.',
        subject: 'Geography of West Bengal'
      },
      {
        id: 'wbp-q6',
        text: 'Find the odd one out from the given options: 27, 64, 125, 144, 343',
        options: ['27', '64', '144', '343'],
        correctAnswer: 2,
        explanation: '27 (3³), 64 (4³), 125 (5³) and 343 (7³) are perfect cubes. 144 (12²) is a perfect square, hence the odd one out.',
        subject: 'Aptitude & Reasoning'
      },
      {
        id: 'wbp-q7',
        text: 'If in a certain code, "BENGAL" is written as "YVMTZO", how will "KOLKATA" be written in that code?',
        options: ['PLOZPGA', 'PLOPZGZ', 'QLOQZHZ', 'PKOPYFY'],
        correctAnswer: 1,
        explanation: 'Each letter is replaced by its reverse pair (A-Z, B-Y, etc.). K-P, O-L, L-O, K-P, A-Z, T-G, A-Z. Thus "PLOPZGZ".',
        subject: 'Aptitude & Reasoning'
      },
      {
        id: 'wbp-q8',
        text: 'Which metal is present in insulin?',
        options: ['Copper', 'Iron', 'Zinc', 'Magnesium'],
        correctAnswer: 2,
        explanation: 'Zinc is an essential element for insulin synthesis, storage, and secretion within the pancreatic beta-cells.',
        subject: 'General Science'
      },
      {
        id: 'wbp-q9',
        text: 'Under which article of the Constitution can state emergency be declared (President\'s Rule)?',
        options: ['Article 352', 'Article 356', 'Article 360', 'Article 368'],
        correctAnswer: 1,
        explanation: 'Article 356 deals with the imposition of President\'s Rule in a state in case of failure of constitutional machinery.',
        subject: 'Indian Polity'
      },
      {
        id: 'wbp-q10',
        text: 'The river Teesta originates from which glacier?',
        options: ['Zemu Glacier', 'Pindari Glacier', 'Gangotri Glacier', 'Milam Glacier'],
        correctAnswer: 0,
        explanation: 'Teesta River originates from the Pahunri (or Teesta Kangse) glacier / Zemu Glacier in the Eastern Himalayas in Sikkim.',
        subject: 'Geography of West Bengal'
      }
    ]
  },
  {
    id: 'test-wbcs-01',
    title: 'WBCS Prelims Mock Test – 01',
    category: 'WBCS',
    questionsCount: 10,
    durationMinutes: 12,
    studentsRegisteredCount: '3.8K',
    isFree: true,
    difficulty: 'Hard',
    examBoard: 'West Bengal Public Service Commission (WBPSC)',
    topic: 'General Studies',
    questions: [
      {
        id: 'wbcs-q1',
        text: 'Who founded the "Atmiya Sabha" in 1815 in Calcutta?',
        options: ['Ishwar Chandra Vidyasagar', 'Raja Ram Mohan Roy', 'Debendranath Tagore', 'Keshab Chandra Sen'],
        correctAnswer: 1,
        explanation: 'Raja Ram Mohan Roy founded the Atmiya Sabha in Calcutta in 1815 to propagate monotheistic ideals and social reforms.',
        subject: 'Indian History & National Movement'
      },
      {
        id: 'wbcs-q2',
        text: 'The Farakka Barrage was constructed mainly to:',
        options: ['Save Kolkata Port from silting', 'Generate Hydroelectric Power', 'Irrigate Malda and Murshidabad', 'Control floods in Ganga river'],
        correctAnswer: 0,
        explanation: 'Farakka Barrage was constructed in 1975 to divert 40,000 cusecs of water from Ganga to Hooghly river, flushing out silt and keeping Kolkata Port navigable.',
        subject: 'Geography of West Bengal'
      },
      {
        id: 'wbcs-q3',
        text: 'Who was the first Chief Minister of West Bengal?',
        options: ['Prafulla Chandra Ghosh', 'Bidhan Chandra Roy', 'Ajoy Mukherjee', 'Siddhartha Shankar Ray'],
        correctAnswer: 0,
        explanation: 'Dr. Prafulla Chandra Ghosh was the first Chief Minister of West Bengal from August 15, 1847 to January 14, 1848.',
        subject: 'General Knowledge'
      },
      {
        id: 'wbcs-q4',
        text: 'In which year did the partition of Bengal take effect, and who was the Viceroy?',
        options: ['1905, Lord Curzon', '1906, Lord Minto', '1911, Lord Hardinge', '1905, Lord Chelmsford'],
        correctAnswer: 0,
        explanation: 'The partition of Bengal took effect on October 16, 1905, under the viceroyalty of Lord Curzon.',
        subject: 'Indian History & National Movement'
      },
      {
        id: 'wbcs-q5',
        text: 'Which sector contributes the most to the Gross State Domestic Product (GSDP) of West Bengal?',
        options: ['Agriculture', 'Manufacturing', 'Services', 'Mining & Quarrying'],
        correctAnswer: 2,
        explanation: 'Similar to the national economy, the Services sector is the largest contributor to West Bengal\'s economy (GSDP), contributing around 55-60%.',
        subject: 'Indian Economy'
      },
      {
        id: 'wbcs-q6',
        text: 'The Tropic of Cancer passes through how many districts of West Bengal?',
        options: ['3', '4', '5', '6'],
        correctAnswer: 2,
        explanation: 'The Tropic of Cancer passes through 5 districts of West Bengal: Purulia, Bankura, Paschim Bardhaman, Purba Bardhaman, and Nadia.',
        subject: 'Geography of West Bengal'
      },
      {
        id: 'wbcs-q7',
        text: 'Who wrote the play "Neel Darpan", highlighting the plight of Indigo farmers?',
        options: ['Michael Madhusudan Dutt', 'Dinabandhu Mitra', 'Bankim Chandra Chattopadhyay', 'Rabindranath Tagore'],
        correctAnswer: 1,
        explanation: 'Dinabandhu Mitra wrote the Bengali play "Neel Darpan" in 1858-1859, describing the indigo revolt and British oppression.',
        subject: 'Indian History & National Movement'
      },
      {
        id: 'wbcs-q8',
        text: 'Which country has the longest international border with West Bengal?',
        options: ['Nepal', 'Bhutan', 'Bangladesh', 'Myanmar'],
        correctAnswer: 2,
        explanation: 'West Bengal shares a massive 2,217 km long border with Bangladesh, which is the longest border of any state with Bangladesh.',
        subject: 'Geography of West Bengal'
      },
      {
        id: 'wbcs-q9',
        text: 'What is the chemical name of "Vinegar"?',
        options: ['Acetic Acid', 'Citric Acid', 'Lactic Acid', 'Tartaric Acid'],
        correctAnswer: 0,
        explanation: 'Vinegar is a liquid consisting of about 5–20% acetic acid (CH₃COOH) by volume, water, and other trace chemicals.',
        subject: 'General Science'
      },
      {
        id: 'wbcs-q10',
        text: 'The "Dandakaranya Project" is primarily located in which state/region?',
        options: ['Chhattisgarh/Odisha', 'West Bengal/Sunderbans', 'Rajasthan/Thar', 'Kerala/Western Ghats'],
        correctAnswer: 0,
        explanation: 'The Dandakaranya Project was set up by the Government of India in 1958 for the resettlement of displaced persons from East Pakistan (Bangladesh) in Bastar (Chhattisgarh) and Koraput (Odisha).',
        subject: 'Geography of India'
      }
    ]
  },
  {
    id: 'test-ssg-01',
    title: 'SSC GD Practice Test – 01',
    category: 'SSC GD',
    questionsCount: 10,
    durationMinutes: 8,
    studentsRegisteredCount: '2.9K',
    isFree: true,
    difficulty: 'Easy',
    examBoard: 'Staff Selection Commission (SSC)',
    topic: 'General Studies & GK',
    questions: [
      {
        id: 'ssg-q1',
        text: 'Under which article of the Indian Constitution is the "Right to Equality" guaranteed?',
        options: ['Articles 14 to 18', 'Articles 19 to 22', 'Articles 23 to 24', 'Articles 25 to 28'],
        correctAnswer: 0,
        explanation: 'Right to Equality is guaranteed under Articles 14 to 18 of the Constitution of India.',
        subject: 'Indian Polity'
      },
      {
        id: 'ssg-q2',
        text: 'The famous folk dance "Ghoomar" is associated with which Indian state?',
        options: ['Gujarat', 'Rajasthan', 'Punjab', 'Maharashtra'],
        correctAnswer: 1,
        explanation: 'Ghoomar is a traditional folk dance of Rajasthan, performed primarily by women on festive occasions.',
        subject: 'Indian Culture'
      },
      {
        id: 'ssg-q3',
        text: 'Which is the largest gland in the human body?',
        options: ['Thyroid Gland', 'Pancreas', 'Liver', 'Pituitary Gland'],
        correctAnswer: 2,
        explanation: 'The liver is the largest internal organ and the largest gland in the human body.',
        subject: 'General Science'
      },
      {
        id: 'ssg-q4',
        text: 'In which state is the Kaziranga National Park, famous for one-horned rhinos, located?',
        options: ['Assam', 'West Bengal', 'Uttarakhand', 'Odisha'],
        correctAnswer: 0,
        explanation: 'Kaziranga National Park is a protected area in the northeast Indian state of Assam, home to the world\'s largest population of great Indian one-horned rhinoceroses.',
        subject: 'Geography of India'
      },
      {
        id: 'ssg-q5',
        text: 'A sum of money doubles itself in 10 years at simple interest. What is the rate of interest per annum?',
        options: ['5%', '10%', '12%', '15%'],
        correctAnswer: 1,
        explanation: 'Let Principal be P. Simple Interest = P (since money doubles). Time T = 10. SI = (P * R * T) / 100 => P = (P * R * 10) / 100 => R = 10%.',
        subject: 'Elementary Mathematics'
      },
      {
        id: 'ssg-q6',
        text: 'Identify the synonym of the word: "OBSTACLE"',
        options: ['Assistance', 'Barrier', 'Catalyst', 'Support'],
        correctAnswer: 1,
        explanation: 'An obstacle is something that blocks one\'s way or prevents progress. A barrier is a direct synonym.',
        subject: 'English Language'
      },
      {
        id: 'ssg-q7',
        text: 'In which year did the Swadeshi Movement start in India?',
        options: ['1905', '1915', '1920', '1930'],
        correctAnswer: 0,
        explanation: 'The Swadeshi Movement was proclaimed on August 7, 1905, at the Calcutta Town Hall, Bengal, in response to the partition of Bengal.',
        subject: 'Indian History'
      },
      {
        id: 'ssg-q8',
        text: 'Who is known as the "Father of the Indian Constitution"?',
        options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Dr. B. R. Ambedkar', 'Dr. Rajendra Prasad'],
        correctAnswer: 2,
        explanation: 'Dr. Bhimrao Ramji Ambedkar is recognized as the chief architect and Father of the Indian Constitution.',
        subject: 'Indian Polity'
      },
      {
        id: 'ssg-q9',
        text: 'Which planet is known as the "Red Planet"?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 1,
        explanation: 'Mars is known as the Red Planet due to the large amount of iron oxide (rust) on its surface, giving it a reddish appearance.',
        subject: 'General Science'
      },
      {
        id: 'ssg-q10',
        text: 'The Scurvy disease is caused by the deficiency of which vitamin?',
        options: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'],
        correctAnswer: 2,
        explanation: 'Scurvy is a disease resulting from a lack of Vitamin C (ascorbic acid). It causes weakness, gum disease, and skin hemorrhages.',
        subject: 'General Science'
      }
    ]
  },
  {
    id: 'test-wbpsc-clerk-01',
    title: 'WBPSC Clerkship Mock Test – 01',
    category: 'WBPSC',
    questionsCount: 10,
    durationMinutes: 10,
    studentsRegisteredCount: '1.9K',
    isFree: false,
    difficulty: 'Medium',
    examBoard: 'West Bengal Public Service Commission (WBPSC)',
    topic: 'General Studies',
    questions: [
      {
        id: 'wbpsc-q1',
        text: 'Who wrote the national anthem of Bangladesh, "Amar Shonar Bangla"?',
        options: ['Kazi Nazrul Islam', 'Rabindranath Tagore', 'Satyajit Ray', 'Jibanananda Das'],
        correctAnswer: 1,
        explanation: 'Rabindranath Tagore wrote "Amar Shonar Bangla" in 1905 during the partition of Bengal. It was later adopted as the national anthem of Bangladesh in 1971.',
        subject: 'General Studies'
      },
      {
        id: 'wbpsc-q2',
        text: 'Choose the correct preposition: "He is senior _____ me by two years."',
        options: ['than', 'to', 'from', 'with'],
        correctAnswer: 1,
        explanation: 'The adjective "senior" is followed by the preposition "to" (senior to me, junior to me, superior to me).',
        subject: 'English Language'
      }
    ]
  }
];

export const MOCK_TEST_HISTORY = [
  {
    testId: 'test-wbp-01',
    testTitle: 'WBP Constable Mock Test – 01',
    score: 8,
    totalQuestions: 10,
    correctAnswers: 8,
    incorrectAnswers: 1,
    skippedQuestions: 1,
    timeSpentSeconds: 450,
    dateCompleted: 'June 25, 2026',
    answers: {
      'wbp-q1': 0,
      'wbp-q2': 1,
      'wbp-q3': 0,
      'wbp-q4': 1,
      'wbp-q5': 0,
      'wbp-q6': 2,
      'wbp-q7': 1,
      'wbp-q8': 2,
      'wbp-q9': 0 // incorrect (correct was 1)
    }
  },
  {
    testId: 'test-ssg-01',
    testTitle: 'SSC GD Practice Test – 01',
    score: 9,
    totalQuestions: 10,
    correctAnswers: 9,
    incorrectAnswers: 1,
    skippedQuestions: 0,
    timeSpentSeconds: 320,
    dateCompleted: 'June 27, 2026',
    answers: {
      'ssg-q1': 0,
      'ssg-q2': 1,
      'ssg-q3': 2,
      'ssg-q4': 0,
      'ssg-q5': 1,
      'ssg-q6': 1,
      'ssg-q7': 0,
      'ssg-q8': 2,
      'ssg-q9': 0, // incorrect
      'ssg-q10': 2
    }
  }
];

export const GOVT_JOB_ALERTS: GovtJobAlert[] = [
  {
    id: 'job-1',
    titleEn: 'WBP Constable Recruitment 2026',
    titleBn: 'পশ্চিমবঙ্গ পুলিশ কনস্টেবল নিয়োগ ২০২৬',
    departmentEn: 'West Bengal Police Recruitment Board (WBPRB)',
    departmentBn: 'পশ্চিমবঙ্গ পুলিশ রিক্রুটমেন্ট বোর্ড (WBPRB)',
    vacancies: 10255,
    deadline: 'July 15, 2026',
    deadlineBn: '১৫ জুলাই, ২০২৬',
    eligibilityEn: 'Madhyamik (Class 10th) Pass',
    eligibilityBn: 'মাধ্যমিক (দশম শ্রেণী) পাস',
    statusEn: 'Apply Now',
    statusBn: 'আবেদন করুন',
    badgeColor: 'bg-emerald-500 text-white',
    salaryEn: 'Rs. 22,700 - 58,500/month',
    salaryBn: 'প্রতি মাসে ২২,৭০০ - ৫৮,৫০০ টাকা',
    examName: 'WBP Constable'
  },
  {
    id: 'job-2',
    titleEn: 'WBCS Exam Notification 2026',
    titleBn: 'WBCS পরীক্ষার বিজ্ঞপ্তি ২০২৬',
    departmentEn: 'West Bengal Public Service Commission (WBPSC)',
    departmentBn: 'পশ্চিমবঙ্গ পাবলিক সার্ভিস কমিশন (WBPSC)',
    vacancies: 250,
    deadline: 'August 30, 2026',
    deadlineBn: '৩০ আগস্ট, ২০২৬',
    eligibilityEn: 'Graduate in Any Discipline',
    eligibilityBn: 'যেকোনো বিষয়ে স্নাতক (গ্র্যাজুয়েট)',
    statusEn: 'Notification Out',
    statusBn: 'বিজ্ঞপ্তি প্রকাশিত',
    badgeColor: 'bg-indigo-500 text-white',
    salaryEn: 'Rs. 56,100 - 1,44,300/month (Group A)',
    salaryBn: 'প্রতি মাসে ৫৬,১০০ - ১,৪৪,৩০০ টাকা (গ্রুপ এ)',
    examName: 'WBCS'
  },
  {
    id: 'job-3',
    titleEn: 'Kolkata Police SI & Sergeant Exam Date',
    titleBn: 'কলকাতা পুলিশ এসআই এবং সার্জেন্ট পরীক্ষার তারিখ',
    departmentEn: 'Kolkata Police (KP)',
    departmentBn: 'কলকাতা পুলিশ (KP)',
    vacancies: 460,
    deadline: 'August 10, 2026',
    deadlineBn: '১০ আগস্ট, ২০২৬',
    eligibilityEn: 'Graduate with Physical Standards',
    eligibilityBn: 'শারীরিক যোগ্যতা সহ স্নাতক ডিগ্রি',
    statusEn: 'Exam Date Out',
    statusBn: 'পরীক্ষার তারিখ',
    badgeColor: 'bg-rose-500 text-white',
    salaryEn: 'Rs. 32,100 - 82,900/month',
    salaryBn: 'প্রতি মাসে ৩২,১০০ - ৮২,৯০০ টাকা',
    examName: 'KP Constable'
  },
  {
    id: 'job-4',
    titleEn: 'WBPSC Food Sub-Inspector (Food SI) Result',
    titleBn: 'পশ্চিমবঙ্গ ফুড সাব-ইন্সপেক্টর (Food SI) ফলাফল',
    departmentEn: 'West Bengal Public Service Commission (WBPSC)',
    departmentBn: 'পশ্চিমবঙ্গ পাবলিক সার্ভিস কমিশন (WBPSC)',
    vacancies: 480,
    deadline: 'Completed',
    deadlineBn: 'সম্পন্ন হয়েছে',
    eligibilityEn: 'Madhyamik Pass with Bengali language proficiency',
    eligibilityBn: 'বাংলা ভাষা জ্ঞান সহ মাধ্যমিক পাস',
    statusEn: 'Result Declared',
    statusBn: 'ফলাফল প্রকাশিত',
    badgeColor: 'bg-amber-500 text-slate-900',
    salaryEn: 'Rs. 22,700 - 58,500/month',
    salaryBn: 'প্রতি মাসে ২২,৭০০ - ৫৮,৫০০ টাকা',
    examName: 'WBPSC'
  },
  {
    id: 'job-5',
    titleEn: 'WBPSC Clerkship Admit Card Out',
    titleBn: 'পশ্চিমবঙ্গ ক্লার্কশিপ পরীক্ষার অ্যাডমিট কার্ড',
    departmentEn: 'West Bengal Public Service Commission (WBPSC)',
    departmentBn: 'পশ্চিমবঙ্গ পাবলিক সার্ভিস কমিশন (WBPSC)',
    vacancies: 3900,
    deadline: 'July 25, 2026',
    deadlineBn: '২৫ জুলাই, ২০২৬',
    eligibilityEn: 'Madhyamik & Computer Typing',
    eligibilityBn: 'মাধ্যমিক পাস এবং কম্পিউটার টাইপিং',
    statusEn: 'Admit Card',
    statusBn: 'অ্যাডমিট কার্ড',
    badgeColor: 'bg-blue-500 text-white',
    salaryEn: 'Rs. 22,700 - 58,500/month',
    salaryBn: 'প্রতি মাসে ২২,৭০০ - ৫৮,৫০০ টাকা',
    examName: 'WBPSC'
  }
];
