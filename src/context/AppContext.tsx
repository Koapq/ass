import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Challenge, UserProgress, Contest, ContestAttempt, Event, ForumTopic, ForumReply } from '../types';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  challenges: Challenge[];
  contests: Contest[];
  userProgress: UserProgress[];
  contestAttempts: ContestAttempt[];
  events: Event[];
  forumTopics: ForumTopic[];
  currentPage: string;
  login: (email: string, password: string) => boolean;
  register: (username: string, email: string, password: string) => boolean;
  logout: () => void;
  setCurrentPage: (page: string) => void;
  submitAnswer: (challengeId: string, answer: string) => boolean;
  getUserScore: (userId: string) => number;
  getLeaderboard: () => User[];
  getContestLeaderboard: (contestId: string) => User[];
  startContest: (contestId: string) => ContestAttempt | null;
  submitContestAnswer: (attemptId: string, challengeId: string, answer: string, timeSpent?: number) => boolean;
  finishContest: (attemptId: string) => void;
  getCurrentAttempt: (contestId: string) => ContestAttempt | null;
  getUserContestAttempts: (userId: string, contestId: string) => ContestAttempt[];
  createContest: (contest: Omit<Contest, 'id' | 'createdBy'>) => boolean;
  addChallengeToContest: (contestId: string, challenge: Omit<Challenge, 'id' | 'contestId'>) => boolean;
  updateContest: (contestId: string, updates: Partial<Contest>) => boolean;
  deleteContest: (contestId: string) => boolean;
  updateUserProfile: (userId: string, updates: Partial<User>) => boolean;
  changePassword: (userId: string, currentPassword: string, newPassword: string) => boolean;
  createEvent: (event: Omit<Event, 'id' | 'author' | 'authorName' | 'createdAt' | 'updatedAt'>) => boolean;
  updateEvent: (eventId: string, updates: Partial<Event>) => boolean;
  deleteEvent: (eventId: string) => boolean;
  createForumTopic: (topic: Omit<ForumTopic, 'id' | 'author' | 'authorName' | 'createdAt' | 'updatedAt' | 'replies' | 'isPinned'>) => boolean;
  replyToTopic: (topicId: string, content: string) => boolean;
  pinTopic: (topicId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const mockChallenges: Challenge[] = [
  {
    id: '1',
    question: 'AI là viết tắt của từ gì?',
    type: 'multiple-choice',
    options: ['Artificial Intelligence', 'Automated Intelligence', 'Advanced Intelligence', 'Applied Intelligence'],
    correctAnswer: 'Artificial Intelligence',
    points: 10,
    difficulty: 'easy',
    contestId: 'contest1'
  },
  {
    id: '2',
    question: 'Thuật toán nào thường được sử dụng cho nhận dạng hình ảnh?',
    type: 'multiple-choice',
    options: ['Linear Regression', 'Convolutional Neural Network', 'Decision Tree', 'K-Means'],
    correctAnswer: 'Convolutional Neural Network',
    points: 20,
    difficulty: 'medium',
    contestId: 'contest1'
  },
  {
    id: '3',
    question: 'Giải thích khái niệm overfitting trong machine learning.',
    type: 'text',
    correctAnswer: 'overfitting',
    points: 30,
    difficulty: 'hard',
    contestId: 'contest1'
  },
  {
    id: '4',
    question: 'Python được sử dụng phổ biến trong AI vì lý do gì?',
    type: 'multiple-choice',
    options: ['Dễ học và sử dụng', 'Có nhiều thư viện AI', 'Cộng đồng lớn', 'Tất cả các lý do trên'],
    correctAnswer: 'Tất cả các lý do trên',
    points: 15,
    difficulty: 'easy',
    contestId: 'contest2'
  },
  {
    id: '5',
    question: 'TensorFlow là gì?',
    type: 'text',
    correctAnswer: 'framework',
    points: 25,
    difficulty: 'medium',
    contestId: 'contest2'
  }
];

const mockContests: Contest[] = [
  {
    id: 'contest1',
    title: 'Kiến thức AI cơ bản',
    description: 'Cuộc thi kiểm tra kiến thức cơ bản về trí tuệ nhân tạo và machine learning',
    challenges: mockChallenges.filter(c => c.contestId === 'contest1'),
    timeLimit: 30,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true,
    maxAttempts: 3,
    createdBy: 'admin',
    isPublic: true
  },
  {
    id: 'contest2',
    title: 'Python cho AI',
    description: 'Thử thách về việc sử dụng Python trong các dự án AI',
    challenges: mockChallenges.filter(c => c.contestId === 'contest2'),
    timeLimit: 20,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true,
    maxAttempts: 2,
    createdBy: 'admin',
    isPublic: true
  }
];

const initialUsers: User[] = [
  {
    id: '1',
    username: 'AIExplorer',
    email: 'explorer@vaic.com',
    password: 'explorer123',
    score: 150,
    joinDate: '2024-01-15',
    role: 'user',
    studentId: 'SV001'
  },
  {
    id: '2',
    username: 'TechWizard',
    email: 'wizard@vaic.com',
    password: 'wizard456',
    score: 120,
    joinDate: '2024-01-20',
    role: 'user',
    studentId: 'SV002'
  },
  {
    id: '3',
    username: 'DataMaster',
    email: 'master@vaic.com',
    password: 'master789',
    score: 180,
    joinDate: '2024-01-10',
    role: 'user',
    studentId: 'SV003'
  },
  {
    id: 'admin',
    username: 'Admin',
    email: 'admin@vaic.com',
    password: 'admin2024',
    score: 999,
    joinDate: '2024-01-01',
    role: 'admin'
  }
];

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Workshop: Giới thiệu về Machine Learning',
    content: 'Tham gia workshop miễn phí về Machine Learning dành cho người mới bắt đầu. Chúng ta sẽ cùng nhau khám phá:\n\n• Khái niệm cơ bản về ML\n• Các thuật toán phổ biến\n• Thực hành với Python\n• Q&A với chuyên gia\n\nThời gian: 14:00 - 17:00, Thứ 7 tuần tới\nĐịa điểm: Phòng hội thảo A1, Tòa nhà VAIC\n\nĐăng ký ngay để không bỏ lỡ cơ hội học hỏi!',
    author: 'admin',
    authorName: 'Admin',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    isPublished: true,
    tags: ['workshop', 'machine learning', 'beginner']
  }
];

const mockForumTopics: ForumTopic[] = [
  {
    id: '1',
    title: 'Thảo luận về tương lai của AI trong giáo dục',
    content: 'AI đang thay đổi cách chúng ta học và dạy. Các bạn nghĩ sao về việc ứng dụng AI trong giáo dục? Những lợi ích và thách thức là gì?',
    author: '1',
    authorName: 'AIExplorer',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-18T09:00:00Z',
    replies: [
      {
        id: '1',
        content: 'Tôi nghĩ AI sẽ giúp cá nhân hóa việc học tập và làm cho giáo dục trở nên hiệu quả hơn. Tuy nhiên, chúng ta cũng cần cân nhắc về tính tương tác con người.',
        author: '2',
        authorName: 'TechWizard',
        createdAt: '2024-01-18T10:30:00Z',
        topicId: '1'
      }
    ],
    tags: ['AI', 'education', 'future'],
    isPinned: true
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('vaic_users');
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  });
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [contests, setContests] = useState<Contest[]>(mockContests);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [contestAttempts, setContestAttempts] = useState<ContestAttempt[]>([]);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [forumTopics, setForumTopics] = useState<ForumTopic[]>(mockForumTopics);
  const [currentPage, setCurrentPage] = useState('home');

  // Load saved data on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('vaic_currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Save users to localStorage whenever users array changes
  useEffect(() => {
    localStorage.setItem('vaic_users', JSON.stringify(users));
  }, [users]);

  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email);
    if (user && user.password === password) {
      setCurrentUser(user);
      localStorage.setItem('vaic_currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const register = (username: string, email: string, password: string): boolean => {
    if (users.find(u => u.email === email)) {
      return false;
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      password,
      score: 0,
      joinDate: new Date().toISOString().split('T')[0],
      role: 'user'
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentUser(newUser);
    localStorage.setItem('vaic_currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('vaic_currentUser');
    setCurrentPage('home');
  };

  const updateUserProfile = (userId: string, updates: Partial<User>): boolean => {
    const updatedUsers = users.map(u => u.id === userId ? { ...u, ...updates } : u);
    setUsers(updatedUsers);
    
    if (currentUser && currentUser.id === userId) {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      localStorage.setItem('vaic_currentUser', JSON.stringify(updatedUser));
    }
    return true;
  };

  const changePassword = (userId: string, currentPassword: string, newPassword: string): boolean => {
    const user = users.find(u => u.id === userId);
    if (!user || user.password !== currentPassword) {
      return false;
    }
    
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, password: newPassword } : u
    );
    setUsers(updatedUsers);
    
    if (currentUser && currentUser.id === userId) {
      const updatedUser = { ...currentUser, password: newPassword };
      setCurrentUser(updatedUser);
      localStorage.setItem('vaic_currentUser', JSON.stringify(updatedUser));
    }
    return true;
  };

  const submitAnswer = (challengeId: string, answer: string): boolean => {
    if (!currentUser) return false;
    
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return false;
    
    const isCorrect = challenge.type === 'multiple-choice' 
      ? answer === challenge.correctAnswer
      : answer.toLowerCase().includes(challenge.correctAnswer.toLowerCase());
    
    if (isCorrect) {
      const updatedUser = { ...currentUser, score: currentUser.score + challenge.points };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
      localStorage.setItem('vaic_currentUser', JSON.stringify(updatedUser));
      
      const progress: UserProgress = {
        userId: currentUser.id,
        challengeId,
        completed: true,
        score: challenge.points,
        completedAt: new Date().toISOString()
      };
      setUserProgress(prev => [...prev, progress]);
    }
    
    return isCorrect;
  };

  const startContest = (contestId: string): ContestAttempt | null => {
    if (!currentUser) return null;
    
    const contest = contests.find(c => c.id === contestId);
    if (!contest) return null;
    
    // Check if user has exceeded max attempts
    const userAttempts = contestAttempts.filter(a => a.userId === currentUser.id && a.contestId === contestId);
    if (userAttempts.length >= contest.maxAttempts) return null;
    
    const attempt: ContestAttempt = {
      id: Date.now().toString(),
      userId: currentUser.id,
      contestId,
      startTime: new Date().toISOString(),
      score: 0,
      answers: [],
      timeSpent: 0,
      isCompleted: false,
      accuracy: 0,
      speedBonus: 0
    };
    
    setContestAttempts(prev => [...prev, attempt]);
    return attempt;
  };

  const submitContestAnswer = (attemptId: string, challengeId: string, answer: string, timeSpent: number = 0): boolean => {
    const attempt = contestAttempts.find(a => a.id === attemptId);
    const challenge = challenges.find(c => c.id === challengeId);
    
    if (!attempt || !challenge) return false;
    
    const isCorrect = challenge.type === 'multiple-choice' 
      ? answer === challenge.correctAnswer
      : answer.toLowerCase().includes(challenge.correctAnswer.toLowerCase());
    
    const answerRecord = { challengeId, answer, isCorrect, timeSpent };
    const updatedAttempt = {
      ...attempt,
      answers: [...attempt.answers.filter(a => a.challengeId !== challengeId), answerRecord],
      score: attempt.score + (isCorrect ? challenge.points : 0)
    };
    
    setContestAttempts(prev => prev.map(a => a.id === attemptId ? updatedAttempt : a));
    return isCorrect;
  };

  const finishContest = (attemptId: string) => {
    const attempt = contestAttempts.find(a => a.id === attemptId);
    if (!attempt || !currentUser) return;
    
    const endTime = new Date();
    const startTime = new Date(attempt.startTime);
    const totalTimeSpent = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    
    // Calculate accuracy
    const correctAnswers = attempt.answers.filter(a => a.isCorrect).length;
    const accuracy = attempt.answers.length > 0 ? Math.round((correctAnswers / attempt.answers.length) * 100) : 0;
    
    // Calculate speed bonus based on time and accuracy
    const contest = contests.find(c => c.id === attempt.contestId);
    const timeLimit = contest ? contest.timeLimit * 60 : 1800; // default 30 minutes
    const timeRatio = Math.max(0, (timeLimit - totalTimeSpent) / timeLimit);
    const speedBonus = Math.floor(timeRatio * accuracy * 0.5); // Speed bonus based on time saved and accuracy
    
    const finalScore = attempt.score + speedBonus;
    
    const updatedAttempt = {
      ...attempt,
      endTime: endTime.toISOString(),
      timeSpent: totalTimeSpent,
      score: finalScore,
      accuracy,
      speedBonus,
      isCompleted: true
    };
    
    setContestAttempts(prev => prev.map(a => a.id === attemptId ? updatedAttempt : a));
    
    // Update user total score
    const updatedUser = { ...currentUser, score: currentUser.score + finalScore };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    localStorage.setItem('vaic_currentUser', JSON.stringify(updatedUser));
  };

  const getCurrentAttempt = (contestId: string): ContestAttempt | null => {
    if (!currentUser) return null;
    return contestAttempts.find(a => 
      a.userId === currentUser.id && 
      a.contestId === contestId && 
      !a.isCompleted
    ) || null;
  };

  const getUserContestAttempts = (userId: string, contestId: string): ContestAttempt[] => {
    return contestAttempts.filter(a => a.userId === userId && a.contestId === contestId && a.isCompleted);
  };

  const createContest = (contestData: Omit<Contest, 'id' | 'createdBy'>): boolean => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    
    const newContest: Contest = {
      ...contestData,
      id: Date.now().toString(),
      createdBy: currentUser.id,
      challenges: []
    };
    
    setContests(prev => [...prev, newContest]);
    return true;
  };

  const addChallengeToContest = (contestId: string, challengeData: Omit<Challenge, 'id' | 'contestId'>): boolean => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    
    const newChallenge: Challenge = {
      ...challengeData,
      id: Date.now().toString(),
      contestId
    };
    
    setChallenges(prev => [...prev, newChallenge]);
    setContests(prev => prev.map(c => 
      c.id === contestId 
        ? { ...c, challenges: [...c.challenges, newChallenge] }
        : c
    ));
    return true;
  };

  const updateContest = (contestId: string, updates: Partial<Contest>): boolean => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    
    setContests(prev => prev.map(c => 
      c.id === contestId ? { ...c, ...updates } : c
    ));
    return true;
  };

  const deleteContest = (contestId: string): boolean => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    
    setContests(prev => prev.filter(c => c.id !== contestId));
    setChallenges(prev => prev.filter(c => c.contestId !== contestId));
    return true;
  };

  const getUserScore = (userId: string): number => {
    return users.find(u => u.id === userId)?.score || 0;
  };

  const getLeaderboard = (): User[] => {
    return [...users].sort((a, b) => b.score - a.score);
  };

  const getContestLeaderboard = (contestId: string): User[] => {
    const contestResults = contestAttempts
      .filter(a => a.contestId === contestId && a.isCompleted)
      .reduce((acc, attempt) => {
        const existing = acc.find(r => r.userId === attempt.userId);
        if (!existing || attempt.score > existing.score) {
          const user = users.find(u => u.id === attempt.userId);
          if (user) {
            acc = acc.filter(r => r.userId !== attempt.userId);
            acc.push({
              ...user,
              score: attempt.score,
              accuracy: attempt.accuracy,
              timeSpent: attempt.timeSpent,
              userId: attempt.userId
            });
          }
        }
        return acc;
      }, [] as any[]);
    
    return contestResults.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
      return a.timeSpent - b.timeSpent;
    });
  };

  const createEvent = (eventData: Omit<Event, 'id' | 'author' | 'authorName' | 'createdAt' | 'updatedAt'>): boolean => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      author: currentUser.id,
      authorName: currentUser.username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setEvents(prev => [...prev, newEvent]);
    return true;
  };

  const updateEvent = (eventId: string, updates: Partial<Event>): boolean => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    
    setEvents(prev => prev.map(e => 
      e.id === eventId 
        ? { ...e, ...updates, updatedAt: new Date().toISOString() }
        : e
    ));
    return true;
  };

  const deleteEvent = (eventId: string): boolean => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    
    setEvents(prev => prev.filter(e => e.id !== eventId));
    return true;
  };

  const createForumTopic = (topicData: Omit<ForumTopic, 'id' | 'author' | 'authorName' | 'createdAt' | 'updatedAt' | 'replies' | 'isPinned'>): boolean => {
    if (!currentUser) return false;
    
    const newTopic: ForumTopic = {
      ...topicData,
      id: Date.now().toString(),
      author: currentUser.id,
      authorName: currentUser.username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replies: [],
      isPinned: false
    };
    
    setForumTopics(prev => [...prev, newTopic]);
    return true;
  };

  const replyToTopic = (topicId: string, content: string): boolean => {
    if (!currentUser) return false;
    
    const newReply: ForumReply = {
      id: Date.now().toString(),
      content,
      author: currentUser.id,
      authorName: currentUser.username,
      createdAt: new Date().toISOString(),
      topicId
    };
    
    setForumTopics(prev => prev.map(t => 
      t.id === topicId 
        ? { 
            ...t, 
            replies: [...t.replies, newReply],
            updatedAt: new Date().toISOString()
          }
        : t
    ));
    return true;
  };

  const pinTopic = (topicId: string): boolean => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    
    setForumTopics(prev => prev.map(t => 
      t.id === topicId ? { ...t, isPinned: !t.isPinned } : t
    ));
    return true;
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      challenges,
      contests,
      userProgress,
      contestAttempts,
      events,
      forumTopics,
      currentPage,
      login,
      register,
      logout,
      setCurrentPage,
      submitAnswer,
      getUserScore,
      getLeaderboard,
      getContestLeaderboard,
      startContest,
      submitContestAnswer,
      finishContest,
      getCurrentAttempt,
      getUserContestAttempts,
      createContest,
      addChallengeToContest,
      updateContest,
      deleteContest,
      updateUserProfile,
      changePassword,
      createEvent,
      updateEvent,
      deleteEvent,
      createForumTopic,
      replyToTopic,
      pinTopic
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};