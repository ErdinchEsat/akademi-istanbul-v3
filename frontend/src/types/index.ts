
export enum UserRole {
  GUEST = 'GUEST',
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN',
  TENANT_ADMIN = 'TENANT_ADMIN'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  tenantId?: string;
  email?: string;
  title?: string; // For profile bio
  points?: number; // Gamification
}

export interface Tenant {
  id: string;
  name: string;
  logo: string;
  color: string; // Tailwind color class prefix e.g. 'blue'
  type: 'Municipality' | 'Corporate' | 'University';
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: string[];
  correctOption: number;
}

export interface CourseModule {
  id: number;
  title: string;
  duration: string; // e.g., "12 dk"
  type: 'video' | 'quiz' | 'document' | 'live';
  isCompleted: boolean;
  quizData?: QuizQuestion[]; // If type is quiz
}

export interface Course {
  id: string;
  title: string;
  tenantId: string;
  category: string;
  imageUrl: string;
  progress?: number; // 0-100
  instructor: string;
  totalModules: number;
  completedModules: number;
  rating: number;
  isLive?: boolean;
  nextLiveDate?: string;
  description?: string;
  modules?: CourseModule[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Tam Zamanlı' | 'Yarı Zamanlı' | 'Staj';
  postedDate: string;
  matchScore: number; // AI matching score
  logo: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface ForumPost {
  id: string;
  user: string;
  avatar: string;
  date: string;
  content: string;
  likes: number;
  replies: number;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  trend: 'up' | 'down' | 'same';
}

export enum ViewState {
  LANDING = 'LANDING',
  ACADEMY_SELECTION = 'ACADEMY_SELECTION',
  DASHBOARD = 'DASHBOARD',
  COURSE_PLAYER = 'COURSE_PLAYER',
  CATALOG = 'CATALOG',
  ADMIN_PANEL = 'ADMIN_PANEL',
  CAREER_CENTER = 'CAREER_CENTER',
  CERTIFICATES = 'CERTIFICATES',
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS',
  SUPPORT = 'SUPPORT',
  LOGIN = 'LOGIN',
  STUDENT_ANALYTICS = 'STUDENT_ANALYTICS',
  SYSTEM_LOGS = 'SYSTEM_LOGS',
  ACTIVATION = 'ACTIVATION',
  STUDIO_BOOKING = 'STUDIO_BOOKING',
  COMMERCE_CART = 'COMMERCE_CART',
  COMMERCE_INVOICES = 'COMMERCE_INVOICES',
  COMMERCE_CHECKOUT = 'COMMERCE_CHECKOUT',
  COMMERCE_SUCCESS = 'COMMERCE_SUCCESS',
  COMMERCE_FAILURE = 'COMMERCE_FAILURE',
  GRANT_APPLICATIONS = 'GRANT_APPLICATIONS',
  // New Education Sub-menus
  EDUCATION_EBOOKS = 'EDUCATION_EBOOKS',
  EDUCATION_VIDEOS = 'EDUCATION_VIDEOS',
  EDUCATION_LIVE = 'EDUCATION_LIVE',
  EDUCATION_ASSIGNMENTS = 'EDUCATION_ASSIGNMENTS',
  EDUCATION_QUIZZES = 'EDUCATION_QUIZZES',
  EDUCATION_EXAMS = 'EDUCATION_EXAMS',
  CAREER_JOBS = 'CAREER_JOBS',
  CAREER_CV = 'CAREER_CV'
}