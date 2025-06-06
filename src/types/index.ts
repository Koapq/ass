export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  score: number;
  joinDate: string;
  role: 'user' | 'admin';
  studentId?: string;
  avatar?: string;
}

export interface Challenge {
  id: string;
  question: string;
  type: 'multiple-choice' | 'text';
  options?: string[];
  correctAnswer: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  contestId: string;
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  challenges: Challenge[];
  timeLimit: number; // in minutes
  startDate: string;
  endDate: string;
  isActive: boolean;
  maxAttempts: number;
  createdBy: string;
  isPublic: boolean;
}

export interface UserProgress {
  userId: string;
  challengeId: string;
  completed: boolean;
  score: number;
  completedAt: string;
}

export interface ContestAttempt {
  id: string;
  userId: string;
  contestId: string;
  startTime: string;
  endTime?: string;
  score: number;
  answers: { challengeId: string; answer: string; isCorrect: boolean; timeSpent: number }[];
  timeSpent: number; // in seconds
  isCompleted: boolean;
  accuracy: number; // percentage
  speedBonus: number;
}

export interface Event {
  id: string;
  title: string;
  content: string;
  author: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  tags: string[];
}

export interface ForumTopic {
  id: string;
  title: string;
  content: string;
  author: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  replies: ForumReply[];
  tags: string[];
  isPinned: boolean;
}

export interface ForumReply {
  id: string;
  content: string;
  author: string;
  authorName: string;
  createdAt: string;
  topicId: string;
}

export interface DataStore {
  users: User[];
  contests: Contest[];
  challenges: Challenge[];
  contestAttempts: ContestAttempt[];
  userProgress: UserProgress[];
  events: Event[];
  forumTopics: ForumTopic[];
  lastUpdated: string;
}