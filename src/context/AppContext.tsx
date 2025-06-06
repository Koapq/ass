import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Challenge, UserProgress, Contest, ContestAttempt, Event, ForumTopic, ForumReply } from '../types';
import DataManager from '../utils/dataManager';

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
  register: (username: string, email: string, password: string, studentId?: string) => boolean;
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
  updateChallenge: (challengeId: string, updates: Partial<Challenge>) => boolean;
  deleteChallenge: (challengeId: string) => boolean;
  updateUserProfile: (userId: string, updates: Partial<User>) => boolean;
  changePassword: (userId: string, currentPassword: string, newPassword: string) => boolean;
  createEvent: (event: Omit<Event, 'id' | 'author' | 'authorName' | 'createdAt' | 'updatedAt'>) => boolean;
  updateEvent: (eventId: string, updates: Partial<Event>) => boolean;
  deleteEvent: (eventId: string) => boolean;
  createForumTopic: (topic: Omit<ForumTopic, 'id' | 'author' | 'authorName' | 'createdAt' | 'updatedAt' | 'replies' | 'isPinned'>) => boolean;
  replyToTopic: (topicId: string, content: string) => boolean;
  pinTopic: (topicId: string) => boolean;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const dataManager = DataManager.getInstance();

  // State derived from DataManager
  const [users, setUsers] = useState<User[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [contestAttempts, setContestAttempts] = useState<ContestAttempt[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [forumTopics, setForumTopics] = useState<ForumTopic[]>([]);

  // Load data on mount
  useEffect(() => {
    loadAllData();
    
    // Load current user from localStorage
    const savedUser = localStorage.getItem('vaic_currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const loadAllData = () => {
    setUsers(dataManager.getUsers());
    setChallenges(dataManager.getChallenges());
    setContests(dataManager.getContests());
    setUserProgress(dataManager.getUserProgress());
    setContestAttempts(dataManager.getContestAttempts());
    setEvents(dataManager.getEvents());
    setForumTopics(dataManager.getForumTopics());
  };

  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email);
    if (user && user.password === password) {
      setCurrentUser(user);
      localStorage.setItem('vaic_currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const register = (username: string, email: string, password: string, studentId?: string): boolean => {
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
      role: 'user',
      studentId: studentId || undefined
    };
    
    dataManager.addUser(newUser);
    setUsers(dataManager.getUsers());
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
    dataManager.updateUser(userId, updates);
    setUsers(dataManager.getUsers());
    
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
    
    dataManager.updateUser(userId, { password: newPassword });
    setUsers(dataManager.getUsers());
    
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
      dataManager.updateUser(currentUser.id, { score: updatedUser.score });
      setUsers(dataManager.getUsers());
      localStorage.setItem('vaic_currentUser', JSON.stringify(updatedUser));
      
      const progress: UserProgress = {
        userId: currentUser.id,
        challengeId,
        completed: true,
        score: challenge.points,
        completedAt: new Date().toISOString()
      };
      dataManager.addUserProgress(progress);
      setUserProgress(dataManager.getUserProgress());
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
    
    dataManager.addContestAttempt(attempt);
    setContestAttempts(dataManager.getContestAttempts());
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
    
    dataManager.updateContestAttempt(attemptId, updatedAttempt);
    setContestAttempts(dataManager.getContestAttempts());
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
    
    dataManager.updateContestAttempt(attemptId, updatedAttempt);
    setContestAttempts(dataManager.getContestAttempts());
    
    // Update user total score
    const updatedUser = { ...currentUser, score: currentUser.score + finalScore };
    setCurrentUser(updatedUser);
    dataManager.updateUser(currentUser.id, { score: updatedUser.score });
    setUsers(dataManager.getUsers());
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
    
    dataManager.addContest(newContest);
    setContests(dataManager.getContests());
    return true;
  };

  const addChallengeToContest = (contestId: string, challengeData: Omit<Challenge, 'id' | 'contestId'>): boolean => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    
    const newChallenge: Challenge = {
      ...challengeData,
      id: Date.now().toString(),
      contestId
    };
    
    dataManager.addChallenge(newChallenge);
    setChallenges(dataManager.getChallenges());
    setContests(dataManager.getContests());
    return true;
  };

  const updateContest = (contestId: string, updates: Partial<Contest>): boolean => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    
    dataManager.updateContest(contestId, updates);
    setContests(dataManager.getContests());
    return true;
  };

  const deleteContest = (contestId: string): boolean => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    
    dataManager.deleteContest(contestId);
    setContests(dataManager.getContests());
    setChallenges(dataManager.getChallenges());
    return true;
  };

  const updateChallenge = (challengeId: string, updates: Partial<Challenge>): boolean => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    
    dataManager.updateChallenge(challengeId, updates);
    setChallenges(dataManager.getChallenges());
    setContests(dataManager.getContests());
    return true;
  };

  const deleteChallenge = (challengeId: string): boolean => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    
    dataManager.deleteChallenge(challengeId);
    setChallenges(dataManager.getChallenges());
    setContests(dataManager.getContests());
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
    
    dataManager.addEvent(newEvent);
    setEvents(dataManager.getEvents());
    return true;
  };

  const updateEvent = (eventId: string, updates: Partial<Event>): boolean => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    
    const eventUpdates = { ...updates, updatedAt: new Date().toISOString() };
    dataManager.updateEvent(eventId, eventUpdates);
    setEvents(dataManager.getEvents());
    return true;
  };

  const deleteEvent = (eventId: string): boolean => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    
    dataManager.deleteEvent(eventId);
    setEvents(dataManager.getEvents());
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
    
    dataManager.addForumTopic(newTopic);
    setForumTopics(dataManager.getForumTopics());
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
    
    const topic = forumTopics.find(t => t.id === topicId);
    if (topic) {
      const updatedTopic = {
        ...topic,
        replies: [...topic.replies, newReply],
        updatedAt: new Date().toISOString()
      };
      
      dataManager.updateForumTopic(topicId, updatedTopic);
      setForumTopics(dataManager.getForumTopics());
    }
    return true;
  };

  const pinTopic = (topicId: string): boolean => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    
    const topic = forumTopics.find(t => t.id === topicId);
    if (topic) {
      dataManager.updateForumTopic(topicId, { isPinned: !topic.isPinned });
      setForumTopics(dataManager.getForumTopics());
    }
    return true;
  };

  const exportData = (): string => {
    return dataManager.exportData();
  };

  const importData = (jsonData: string): boolean => {
    const success = dataManager.importData(jsonData);
    if (success) {
      loadAllData();
    }
    return success;
  };

  const resetData = (): void => {
    dataManager.resetData();
    loadAllData();
    setCurrentUser(null);
    localStorage.removeItem('vaic_currentUser');
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
      updateChallenge,
      deleteChallenge,
      updateUserProfile,
      changePassword,
      createEvent,
      updateEvent,
      deleteEvent,
      createForumTopic,
      replyToTopic,
      pinTopic,
      exportData,
      importData,
      resetData
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