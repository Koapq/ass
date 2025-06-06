import { User, Contest, Challenge, ContestAttempt, UserProgress, Event, ForumTopic, DataStore } from '../types';

class DataManager {
  private static instance: DataManager;
  private data: DataStore;

  private constructor() {
    this.data = this.loadData();
  }

  public static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  private loadData(): DataStore {
    try {
      const savedData = localStorage.getItem('vaic_data_store');
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }

    // Return default data if no saved data exists
    return {
      users: [
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
      ],
      contests: [
        {
          id: 'contest1',
          title: 'Kiến thức AI cơ bản',
          description: 'Cuộc thi kiểm tra kiến thức cơ bản về trí tuệ nhân tạo và machine learning',
          challenges: [],
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
          challenges: [],
          timeLimit: 20,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          isActive: true,
          maxAttempts: 2,
          createdBy: 'admin',
          isPublic: true
        }
      ],
      challenges: [
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
      ],
      contestAttempts: [],
      userProgress: [],
      events: [
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
      ],
      forumTopics: [
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
      ],
      lastUpdated: new Date().toISOString()
    };
  }

  private saveData(): void {
    try {
      this.data.lastUpdated = new Date().toISOString();
      localStorage.setItem('vaic_data_store', JSON.stringify(this.data));
      
      // Also save individual data files for backup
      this.saveIndividualFiles();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  private saveIndividualFiles(): void {
    try {
      localStorage.setItem('vaic_users', JSON.stringify(this.data.users));
      localStorage.setItem('vaic_contests', JSON.stringify(this.data.contests));
      localStorage.setItem('vaic_challenges', JSON.stringify(this.data.challenges));
      localStorage.setItem('vaic_contest_attempts', JSON.stringify(this.data.contestAttempts));
      localStorage.setItem('vaic_user_progress', JSON.stringify(this.data.userProgress));
      localStorage.setItem('vaic_events', JSON.stringify(this.data.events));
      localStorage.setItem('vaic_forum_topics', JSON.stringify(this.data.forumTopics));
    } catch (error) {
      console.error('Error saving individual files:', error);
    }
  }

  // User methods
  public getUsers(): User[] {
    return this.data.users;
  }

  public addUser(user: User): void {
    this.data.users.push(user);
    this.saveData();
  }

  public updateUser(userId: string, updates: Partial<User>): void {
    const index = this.data.users.findIndex(u => u.id === userId);
    if (index !== -1) {
      this.data.users[index] = { ...this.data.users[index], ...updates };
      this.saveData();
    }
  }

  public deleteUser(userId: string): void {
    this.data.users = this.data.users.filter(u => u.id !== userId);
    this.saveData();
  }

  // Contest methods
  public getContests(): Contest[] {
    // Update contests with their challenges
    return this.data.contests.map(contest => ({
      ...contest,
      challenges: this.data.challenges.filter(c => c.contestId === contest.id)
    }));
  }

  public addContest(contest: Contest): void {
    this.data.contests.push(contest);
    this.saveData();
  }

  public updateContest(contestId: string, updates: Partial<Contest>): void {
    const index = this.data.contests.findIndex(c => c.id === contestId);
    if (index !== -1) {
      this.data.contests[index] = { ...this.data.contests[index], ...updates };
      this.saveData();
    }
  }

  public deleteContest(contestId: string): void {
    this.data.contests = this.data.contests.filter(c => c.id !== contestId);
    this.data.challenges = this.data.challenges.filter(c => c.contestId !== contestId);
    this.saveData();
  }

  // Challenge methods
  public getChallenges(): Challenge[] {
    return this.data.challenges;
  }

  public addChallenge(challenge: Challenge): void {
    this.data.challenges.push(challenge);
    this.saveData();
  }

  public updateChallenge(challengeId: string, updates: Partial<Challenge>): void {
    const index = this.data.challenges.findIndex(c => c.id === challengeId);
    if (index !== -1) {
      this.data.challenges[index] = { ...this.data.challenges[index], ...updates };
      this.saveData();
    }
  }

  public deleteChallenge(challengeId: string): void {
    this.data.challenges = this.data.challenges.filter(c => c.id !== challengeId);
    this.saveData();
  }

  // Contest Attempt methods
  public getContestAttempts(): ContestAttempt[] {
    return this.data.contestAttempts;
  }

  public addContestAttempt(attempt: ContestAttempt): void {
    this.data.contestAttempts.push(attempt);
    this.saveData();
  }

  public updateContestAttempt(attemptId: string, updates: Partial<ContestAttempt>): void {
    const index = this.data.contestAttempts.findIndex(a => a.id === attemptId);
    if (index !== -1) {
      this.data.contestAttempts[index] = { ...this.data.contestAttempts[index], ...updates };
      this.saveData();
    }
  }

  // User Progress methods
  public getUserProgress(): UserProgress[] {
    return this.data.userProgress;
  }

  public addUserProgress(progress: UserProgress): void {
    this.data.userProgress.push(progress);
    this.saveData();
  }

  // Event methods
  public getEvents(): Event[] {
    return this.data.events;
  }

  public addEvent(event: Event): void {
    this.data.events.push(event);
    this.saveData();
  }

  public updateEvent(eventId: string, updates: Partial<Event>): void {
    const index = this.data.events.findIndex(e => e.id === eventId);
    if (index !== -1) {
      this.data.events[index] = { ...this.data.events[index], ...updates };
      this.saveData();
    }
  }

  public deleteEvent(eventId: string): void {
    this.data.events = this.data.events.filter(e => e.id !== eventId);
    this.saveData();
  }

  // Forum methods
  public getForumTopics(): ForumTopic[] {
    return this.data.forumTopics;
  }

  public addForumTopic(topic: ForumTopic): void {
    this.data.forumTopics.push(topic);
    this.saveData();
  }

  public updateForumTopic(topicId: string, updates: Partial<ForumTopic>): void {
    const index = this.data.forumTopics.findIndex(t => t.id === topicId);
    if (index !== -1) {
      this.data.forumTopics[index] = { ...this.data.forumTopics[index], ...updates };
      this.saveData();
    }
  }

  public deleteForumTopic(topicId: string): void {
    this.data.forumTopics = this.data.forumTopics.filter(t => t.id !== topicId);
    this.saveData();
  }

  // Backup and restore methods
  public exportData(): string {
    return JSON.stringify(this.data, null, 2);
  }

  public importData(jsonData: string): boolean {
    try {
      const importedData = JSON.parse(jsonData);
      this.data = importedData;
      this.saveData();
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  public resetData(): void {
    localStorage.removeItem('vaic_data_store');
    localStorage.removeItem('vaic_users');
    localStorage.removeItem('vaic_contests');
    localStorage.removeItem('vaic_challenges');
    localStorage.removeItem('vaic_contest_attempts');
    localStorage.removeItem('vaic_user_progress');
    localStorage.removeItem('vaic_events');
    localStorage.removeItem('vaic_forum_topics');
    this.data = this.loadData();
  }
}

export default DataManager;