import { ExamCategory } from '../../types';

export interface AdminStudent {
  id: string;
  name: string;
  email: string;
  phone: string;
  examsPref: ExamCategory[];
  testsTaken: number;
  avgScore: number;
  isPremium: boolean;
  joinedDate: string;
  status: 'Active' | 'Blocked';
}

export interface AdminTransaction {
  id: string;
  studentName: string;
  studentEmail: string;
  amount: number;
  plan: string;
  date: string;
  status: 'Success' | 'Failed' | 'Pending';
}

export interface AdminActivity {
  id: string;
  studentName: string;
  exam: string;
  score: string;
  percentage: number;
  time: string;
  status: 'Pass' | 'Fail';
}

export interface AdminNotificationCampaign {
  id: string;
  title: string;
  message: string;
  targetGroup: string;
  sentAt: string;
  opensCount: number;
}

export const INITIAL_ADMIN_STUDENTS: AdminStudent[] = [
  { id: 'stud-1', name: 'Sanjoy Mahato', email: 'sanjoymahato.career@gmail.com', phone: '+91 98765 43210', examsPref: ['WBCS', 'WBP Constable'], testsTaken: 12, avgScore: 84, isPremium: true, joinedDate: '2026-01-15', status: 'Active' },
  { id: 'stud-2', name: 'Ananya Roy', email: 'ananya.roy@gmail.com', phone: '+91 87654 32109', examsPref: ['WBCS', 'WBPSC'], testsTaken: 18, avgScore: 91, isPremium: true, joinedDate: '2026-02-10', status: 'Active' },
  { id: 'stud-3', name: 'Debashis Chatterjee', email: 'debashis.chat@gmail.com', phone: '+91 76543 21098', examsPref: ['SSC GD', 'Railway NTPC'], testsTaken: 6, avgScore: 68, isPremium: false, joinedDate: '2026-03-01', status: 'Active' },
  { id: 'stud-4', name: 'Priya Sen', email: 'priya.sen@gmail.com', phone: '+91 65432 10987', examsPref: ['WBP Constable', 'KP Constable'], testsTaken: 14, avgScore: 78, isPremium: false, joinedDate: '2026-03-12', status: 'Active' },
  { id: 'stud-5', name: 'Subhankar Dey', email: 'subhankar.dey@gmail.com', phone: '+91 91234 56789', examsPref: ['Bank Exams'], testsTaken: 22, avgScore: 88, isPremium: true, joinedDate: '2026-02-18', status: 'Active' },
  { id: 'stud-6', name: 'Sourav Ganguly', email: 'sourav.dada@gmail.com', phone: '+91 99988 77766', examsPref: ['WBCS', 'Bank Exams'], testsTaken: 0, avgScore: 0, isPremium: false, joinedDate: '2026-06-25', status: 'Blocked' },
  { id: 'stud-7', name: 'Riya Banerjee', email: 'riya.banerjee@gmail.com', phone: '+91 88877 66655', examsPref: ['WBPSC', 'Railway NTPC'], testsTaken: 9, avgScore: 72, isPremium: true, joinedDate: '2026-04-20', status: 'Active' }
];

export const INITIAL_ADMIN_TRANSACTIONS: AdminTransaction[] = [
  { id: 'tx-101', studentName: 'Sanjoy Mahato', studentEmail: 'sanjoymahato.career@gmail.com', amount: 149, plan: 'WBMockTest Pro Monthly', date: '2026-06-28 10:42 AM', status: 'Success' },
  { id: 'tx-102', studentName: 'Ananya Roy', studentEmail: 'ananya.roy@gmail.com', amount: 149, plan: 'WBMockTest Pro Monthly', date: '2026-06-27 03:15 PM', status: 'Success' },
  { id: 'tx-103', studentName: 'Subhankar Dey', studentEmail: 'subhankar.dey@gmail.com', amount: 149, plan: 'WBMockTest Pro Monthly', date: '2026-06-26 09:12 AM', status: 'Success' },
  { id: 'tx-104', studentName: 'Riya Banerjee', studentEmail: 'riya.banerjee@gmail.com', amount: 149, plan: 'WBMockTest Pro Monthly', date: '2026-06-25 04:30 PM', status: 'Success' },
  { id: 'tx-105', studentName: 'Amit Singha', studentEmail: 'amit.singha@gmail.com', amount: 149, plan: 'WBMockTest Pro Monthly', date: '2026-06-24 11:05 AM', status: 'Failed' },
  { id: 'tx-106', studentName: 'Mantu Das', studentEmail: 'mantu.das@gmail.com', amount: 149, plan: 'WBMockTest Pro Monthly', date: '2026-06-23 01:22 PM', status: 'Success' }
];

export const INITIAL_ADMIN_ACTIVITIES: AdminActivity[] = [
  { id: 'act-1', studentName: 'Sanjoy Mahato', exam: 'WBP Constable Mock Test – 01', score: '4/5', percentage: 80, time: '2 mins ago', status: 'Pass' },
  { id: 'act-2', studentName: 'Ananya Roy', exam: 'WBCS High-Yield Mock Test – 01', score: '9/10', percentage: 90, time: '15 mins ago', status: 'Pass' },
  { id: 'act-3', studentName: 'Priya Sen', exam: 'WBP Constable Mock Test – 01', score: '2/5', percentage: 40, time: '1 hour ago', status: 'Fail' },
  { id: 'act-4', studentName: 'Subhankar Dey', exam: 'SSC GD Practice Set – 01', score: '8/10', percentage: 80, time: '3 hours ago', status: 'Pass' },
  { id: 'act-5', studentName: 'Debashis Chatterjee', exam: 'WBPSC General Studies Mock', score: '5/10', percentage: 50, time: '5 hours ago', status: 'Pass' }
];

export const INITIAL_NOTIFICATIONS_CAMPAIGNS: AdminNotificationCampaign[] = [
  { id: 'camp-1', title: '🚨 New WBP Constable Mock Test Uploaded!', message: 'A brand new high-yield test of 5 questions is now live. Practice and review now!', targetGroup: 'WBP Constable Group', sentAt: '2026-06-28 09:00 AM', opensCount: 1420 },
  { id: 'camp-2', title: '🏆 State-wide WBCS Mega-Mock Test Series Starts Friday', message: 'Gear up for the biggest mock test of West Bengal with detailed solutions and leaderboard rankings.', targetGroup: 'All Aspirants', sentAt: '2026-06-25 11:30 AM', opensCount: 4890 },
  { id: 'camp-3', title: '⭐ Premium Features Unlocked: Detailed Score Analytics!', message: 'Check your preparation health, subjects breakdown and negative marking logs now.', targetGroup: 'Premium Users', sentAt: '2026-06-20 02:15 PM', opensCount: 890 }
];
