import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Trophy, 
  Calendar, 
  Clock, 
  Brain,
  Save,
  X,
  Settings
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Contest, Challenge } from '../types';

const AdminPage: React.FC = () => {
  const { 
    currentUser, 
    contests, 
    challenges,
    users,
    createContest, 
    addChallengeToContest, 
    updateContest, 
    deleteContest 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'contests' | 'challenges' | 'users'>('contests');
  const [showCreateContest, setShowCreateContest] = useState(false);
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [selectedContestId, setSelectedContestId] = useState<string>('');
  const [editingContest, setEditingContest] = useState<Contest | null>(null);

  // Form states
  const [contestForm, setContestForm] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    startDate: '',
    endDate: '',
    maxAttempts: 3,
    isActive: true
  });

  const [challengeForm, setChallengeForm] = useState({
    question: '',
    type: 'multiple-choice' as 'multiple-choice' | 'text',
    options: ['', '', '', ''],
    correctAnswer: '',
    points: 10,
    difficulty: 'easy' as 'easy' | 'medium' | 'hard'
  });

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
        <div className="text-center">
          <Settings className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Truy cập bị từ chối</h2>
          <p className="text-slate-300">Bạn không có quyền truy cập trang quản trị.</p>
        </div>
      </div>
    );
  }

  const handleCreateContest = () => {
    if (createContest(contestForm)) {
      setShowCreateContest(false);
      setContestForm({
        title: '',
        description: '',
        timeLimit: 30,
        startDate: '',
        endDate: '',
        maxAttempts: 3,
        isActive: true
      });
    }
  };

  const handleCreateChallenge = () => {
    if (selectedContestId && addChallengeToContest(selectedContestId, challengeForm)) {
      setShowCreateChallenge(false);
      setChallengeForm({
        question: '',
        type: 'multiple-choice',
        options: ['', '', '', ''],
        correctAnswer: '',
        points: 10,
        difficulty: 'easy'
      });
    }
  };

  const handleUpdateContest = () => {
    if (editingContest && updateContest(editingContest.id, contestForm)) {
      setEditingContest(null);
      setContestForm({
        title: '',
        description: '',
        timeLimit: 30,
        startDate: '',
        endDate: '',
        maxAttempts: 3,
        isActive: true
      });
    }
  };

  const startEditContest = (contest: Contest) => {
    setEditingContest(contest);
    setContestForm({
      title: contest.title,
      description: contest.description,
      timeLimit: contest.timeLimit,
      startDate: contest.startDate,
      endDate: contest.endDate,
      maxAttempts: contest.maxAttempts,
      isActive: contest.isActive
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-900/20 border-green-500/50';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/50';
      case 'hard': return 'text-red-400 bg-red-900/20 border-red-500/50';
      default: return 'text-cyan-400 bg-cyan-900/20 border-cyan-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-6 py-2 mb-4">
            <Settings className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 font-mono text-sm">Admin Panel</span>
          </div>
          <h1 className="text-4xl font-bold text-white font-mono mb-2">Trang quản trị</h1>
          <p className="text-slate-300">Quản lý cuộc thi, câu hỏi và người dùng</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-6 text-center">
            <Trophy className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white font-mono">{contests.length}</div>
            <div className="text-slate-400 text-sm">Cuộc thi</div>
          </div>
          
          <div className="bg-slate-800/50 border border-green-500/20 rounded-xl p-6 text-center">
            <Brain className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white font-mono">{challenges.length}</div>
            <div className="text-slate-400 text-sm">Câu hỏi</div>
          </div>
          
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-6 text-center">
            <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white font-mono">{users.length}</div>
            <div className="text-slate-400 text-sm">Người dùng</div>
          </div>
          
          <div className="bg-slate-800/50 border border-yellow-500/20 rounded-xl p-6 text-center">
            <Calendar className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white font-mono">
              {contests.filter(c => c.isActive).length}
            </div>
            <div className="text-slate-400 text-sm">Đang hoạt động</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-slate-800/30 rounded-lg p-1">
          {[
            { id: 'contests', label: 'Cuộc thi', icon: Trophy },
            { id: 'challenges', label: 'Câu hỏi', icon: Brain },
            { id: 'users', label: 'Người dùng', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-mono text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Contests Tab */}
        {activeTab === 'contests' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white font-mono">Quản lý cuộc thi</h2>
              <button
                onClick={() => setShowCreateContest(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-2 px-4 rounded-lg font-bold transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo cuộc thi mới</span>
              </button>
            </div>

            <div className="grid gap-6">
              {contests.map((contest) => (
                <div key={contest.id} className="bg-slate-800/50 border border-cyan-500/20 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{contest.title}</h3>
                      <p className="text-slate-300 mb-4">{contest.description}</p>
                      
                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Câu hỏi:</span>
                          <span className="text-cyan-400 font-mono ml-2">{contest.challenges.length}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Thời gian:</span>
                          <span className="text-cyan-400 font-mono ml-2">{contest.timeLimit} phút</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Lượt thử:</span>
                          <span className="text-cyan-400 font-mono ml-2">{contest.maxAttempts}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Trạng thái:</span>
                          <span className={`font-mono ml-2 ${contest.isActive ? 'text-green-400' : 'text-red-400'}`}>
                            {contest.isActive ? 'Hoạt động' : 'Tạm dừng'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditContest(contest)}
                        className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteContest(contest.id)}
                        className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white font-mono">Quản lý câu hỏi</h2>
              <button
                onClick={() => setShowCreateChallenge(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-2 px-4 rounded-lg font-bold transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm câu hỏi</span>
              </button>
            </div>

            <div className="grid gap-4">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`px-2 py-1 rounded text-xs font-mono ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty.toUpperCase()}
                        </div>
                        <span className="text-green-400 font-mono text-sm">{challenge.points} điểm</span>
                        <span className="text-slate-400 text-sm">
                          Cuộc thi: {contests.find(c => c.id === challenge.contestId)?.title}
                        </span>
                      </div>
                      
                      <h4 className="text-lg font-medium text-white mb-2">{challenge.question}</h4>
                      
                      {challenge.type === 'multiple-choice' && challenge.options && (
                        <div className="space-y-1">
                          {challenge.options.map((option, index) => (
                            <div key={index} className={`text-sm ${
                              option === challenge.correctAnswer ? 'text-green-400 font-medium' : 'text-slate-400'
                            }`}>
                              {String.fromCharCode(65 + index)}. {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <button className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold text-white font-mono mb-6">Quản lý người dùng</h2>
            
            <div className="bg-slate-800/50 border border-cyan-500/20 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-4 px-6 text-cyan-300 font-mono text-sm">Tên người dùng</th>
                    <th className="text-left py-4 px-6 text-cyan-300 font-mono text-sm">Email</th>
                    <th className="text-left py-4 px-6 text-cyan-300 font-mono text-sm">Điểm</th>
                    <th className="text-left py-4 px-6 text-cyan-300 font-mono text-sm">Vai trò</th>
                    <th className="text-left py-4 px-6 text-cyan-300 font-mono text-sm">Ngày tham gia</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                      <td className="py-4 px-6 text-white font-medium">{user.username}</td>
                      <td className="py-4 px-6 text-slate-300">{user.email}</td>
                      <td className="py-4 px-6 text-green-400 font-mono">{user.score}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded text-xs font-mono ${
                          user.role === 'admin' ? 'bg-purple-900/20 text-purple-400 border border-purple-500/50' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-400 font-mono text-sm">
                        {new Date(user.joinDate).toLocaleDateString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create Contest Modal */}
        {(showCreateContest || editingContest) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 border border-cyan-500/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white font-mono">
                  {editingContest ? 'Chỉnh sửa cuộc thi' : 'Tạo cuộc thi mới'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateContest(false);
                    setEditingContest(null);
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-cyan-300 text-sm font-mono mb-2">Tên cuộc thi</label>
                  <input
                    type="text"
                    value={contestForm.title}
                    onChange={(e) => setContestForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    placeholder="Nhập tên cuộc thi"
                  />
                </div>

                <div>
                  <label className="block text-cyan-300 text-sm font-mono mb-2">Mô tả</label>
                  <textarea
                    value={contestForm.description}
                    onChange={(e) => setContestForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none"
                    rows={3}
                    placeholder="Mô tả cuộc thi"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cyan-300 text-sm font-mono mb-2">Thời gian (phút)</label>
                    <input
                      type="number"
                      value={contestForm.timeLimit}
                      onChange={(e) => setContestForm(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-cyan-300 text-sm font-mono mb-2">Số lượt thử</label>
                    <input
                      type="number"
                      value={contestForm.maxAttempts}
                      onChange={(e) => setContestForm(prev => ({ ...prev, maxAttempts: parseInt(e.target.value) }))}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cyan-300 text-sm font-mono mb-2">Ngày bắt đầu</label>
                    <input
                      type="date"
                      value={contestForm.startDate}
                      onChange={(e) => setContestForm(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-cyan-300 text-sm font-mono mb-2">Ngày kết thúc</label>
                    <input
                      type="date"
                      value={contestForm.endDate}
                      onChange={(e) => setContestForm(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={contestForm.isActive}
                    onChange={(e) => setContestForm(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-cyan-600 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500"
                  />
                  <label htmlFor="isActive" className="text-cyan-300 font-mono text-sm">
                    Kích hoạt cuộc thi
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={editingContest ? handleUpdateContest : handleCreateContest}
                    className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-3 px-6 rounded-lg font-bold transition-all duration-300"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingContest ? 'Cập nhật' : 'Tạo cuộc thi'}</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowCreateContest(false);
                      setEditingContest(null);
                    }}
                    className="bg-slate-600 hover:bg-slate-500 text-white py-3 px-6 rounded-lg font-bold transition-all duration-300"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Challenge Modal */}
        {showCreateChallenge && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 border border-cyan-500/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white font-mono">Thêm câu hỏi mới</h3>
                <button
                  onClick={() => setShowCreateChallenge(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-cyan-300 text-sm font-mono mb-2">Chọn cuộc thi</label>
                  <select
                    value={selectedContestId}
                    onChange={(e) => setSelectedContestId(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="">Chọn cuộc thi</option>
                    {contests.map((contest) => (
                      <option key={contest.id} value={contest.id}>{contest.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-cyan-300 text-sm font-mono mb-2">Câu hỏi</label>
                  <textarea
                    value={challengeForm.question}
                    onChange={(e) => setChallengeForm(prev => ({ ...prev, question: e.target.value }))}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none"
                    rows={3}
                    placeholder="Nhập câu hỏi"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-cyan-300 text-sm font-mono mb-2">Loại câu hỏi</label>
                    <select
                      value={challengeForm.type}
                      onChange={(e) => setChallengeForm(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    >
                      <option value="multiple-choice">Trắc nghiệm</option>
                      <option value="text">Tự luận</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-cyan-300 text-sm font-mono mb-2">Độ khó</label>
                    <select
                      value={challengeForm.difficulty}
                      onChange={(e) => setChallengeForm(prev => ({ ...prev, difficulty: e.target.value as any }))}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    >
                      <option value="easy">Dễ</option>
                      <option value="medium">Trung bình</option>
                      <option value="hard">Khó</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-cyan-300 text-sm font-mono mb-2">Điểm</label>
                    <input
                      type="number"
                      value={challengeForm.points}
                      onChange={(e) => setChallengeForm(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      min="1"
                    />
                  </div>
                </div>

                {challengeForm.type === 'multiple-choice' && (
                  <div>
                    <label className="block text-cyan-300 text-sm font-mono mb-2">Các lựa chọn</label>
                    <div className="space-y-3">
                      {challengeForm.options.map((option, index) => (
                        <input
                          key={index}
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...challengeForm.options];
                            newOptions[index] = e.target.value;
                            setChallengeForm(prev => ({ ...prev, options: newOptions }));
                          }}
                          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                          placeholder={`Lựa chọn ${String.fromCharCode(65 + index)}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-cyan-300 text-sm font-mono mb-2">Đáp án đúng</label>
                  {challengeForm.type === 'multiple-choice' ? (
                    <select
                      value={challengeForm.correctAnswer}
                      onChange={(e) => setChallengeForm(prev => ({ ...prev, correctAnswer: e.target.value }))}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    >
                      <option value="">Chọn đáp án đúng</option>
                      {challengeForm.options.filter(opt => opt.trim()).map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={challengeForm.correctAnswer}
                      onChange={(e) => setChallengeForm(prev => ({ ...prev, correctAnswer: e.target.value }))}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      placeholder="Từ khóa đáp án (để kiểm tra tự động)"
                    />
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleCreateChallenge}
                    className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-3 px-6 rounded-lg font-bold transition-all duration-300"
                  >
                    <Save className="w-4 h-4" />
                    <span>Thêm câu hỏi</span>
                  </button>
                  
                  <button
                    onClick={() => setShowCreateChallenge(false)}
                    className="bg-slate-600 hover:bg-slate-500 text-white py-3 px-6 rounded-lg font-bold transition-all duration-300"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;