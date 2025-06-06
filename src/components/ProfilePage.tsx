import React, { useState } from 'react';
import { User, Trophy, Calendar, Award, Clock, Target, Edit, Save, X, Upload, Camera, Lock, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ProfilePage: React.FC = () => {
  const { currentUser, contestAttempts, contests, getLeaderboard, updateUserProfile, changePassword } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [editForm, setEditForm] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    studentId: currentUser?.studentId || ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
        <div className="text-center">
          <User className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Cần đăng nhập</h2>
          <p className="text-slate-300">Vui lòng đăng nhập để xem hồ sơ.</p>
        </div>
      </div>
    );
  }

  const userAttempts = contestAttempts.filter(a => a.userId === currentUser.id && a.isCompleted);
  const leaderboard = getLeaderboard();
  const userRank = leaderboard.findIndex(u => u.id === currentUser.id) + 1;
  
  const totalAttempts = userAttempts.length;
  const averageScore = totalAttempts > 0 ? Math.round(userAttempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts) : 0;
  const bestScore = totalAttempts > 0 ? Math.max(...userAttempts.map(a => a.score)) : 0;
  const totalTimeSpent = userAttempts.reduce((sum, a) => sum + a.timeSpent, 0);
  const averageAccuracy = totalAttempts > 0 ? Math.round(userAttempts.reduce((sum, a) => sum + a.accuracy, 0) / totalAttempts) : 0;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (updateUserProfile) {
      const updates: any = {
        username: editForm.username,
        email: editForm.email,
        studentId: editForm.studentId
      };
      
      if (avatarPreview) {
        updates.avatar = avatarPreview;
      }
      
      updateUserProfile(currentUser.id, updates);
    }
    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleChangePassword = () => {
    setPasswordError('');
    setPasswordSuccess('');
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    
    if (changePassword(currentUser.id, passwordForm.currentPassword, passwordForm.newPassword)) {
      setPasswordSuccess('Đổi mật khẩu thành công!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setShowChangePassword(false);
        setPasswordSuccess('');
      }, 2000);
    } else {
      setPasswordError('Mật khẩu hiện tại không đúng');
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 150) return 'text-yellow-400';
    if (score >= 100) return 'text-green-400';
    if (score >= 50) return 'text-cyan-400';
    return 'text-slate-400';
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank <= 3) return 'text-orange-400';
    if (rank <= 10) return 'text-cyan-400';
    return 'text-slate-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-6 py-2 mb-4">
            <User className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300 font-mono text-sm">Profile</span>
          </div>
          <h1 className="text-4xl font-bold text-white font-mono mb-2">Hồ sơ cá nhân</h1>
          <p className="text-slate-300">Thông tin và thành tích của bạn</p>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-800/50 border border-cyan-500/20 rounded-2xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                {isEditing ? (
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                      {avatarPreview || currentUser.avatar ? (
                        <img 
                          src={avatarPreview || currentUser.avatar} 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-white">
                          {currentUser.username.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-cyan-600 hover:bg-cyan-500 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                    {currentUser.avatar ? (
                      <img 
                        src={currentUser.avatar} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-white">
                        {currentUser.username.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div>
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                      className="bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      placeholder="Tên người dùng"
                    />
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      placeholder="Email"
                    />
                    <input
                      type="text"
                      value={editForm.studentId}
                      onChange={(e) => setEditForm(prev => ({ ...prev, studentId: e.target.value }))}
                      className="bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      placeholder="Mã số sinh viên"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-1">{currentUser.username}</h2>
                    <p className="text-slate-300 mb-1">{currentUser.email}</p>
                    {currentUser.studentId && (
                      <p className="text-cyan-400 mb-2 font-mono text-sm">MSSV: {currentUser.studentId}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-400">
                          Tham gia: {new Date(currentUser.joinDate).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      {currentUser.role === 'admin' && (
                        <span className="px-2 py-1 bg-purple-900/20 text-purple-400 border border-purple-500/50 rounded text-xs font-mono">
                          ADMIN
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center space-x-1 bg-green-600 hover:bg-green-500 text-white py-2 px-3 rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span className="text-sm">Lưu</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({
                        username: currentUser.username,
                        email: currentUser.email,
                        studentId: currentUser.studentId || ''
                      });
                      setAvatarFile(null);
                      setAvatarPreview(null);
                    }}
                    className="flex items-center space-x-1 bg-slate-600 hover:bg-slate-500 text-white py-2 px-3 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span className="text-sm">Hủy</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-500 text-white py-2 px-3 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="text-sm">Chỉnh sửa</span>
                  </button>
                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-500 text-white py-2 px-3 rounded-lg transition-colors"
                  >
                    <Lock className="w-4 h-4" />
                    <span className="text-sm">Đổi mật khẩu</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-6 text-center">
            <Trophy className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <div className={`text-2xl font-bold font-mono ${getScoreColor(currentUser.score)}`}>
              {currentUser.score}
            </div>
            <div className="text-slate-400 text-sm">Tổng điểm</div>
          </div>
          
          <div className="bg-slate-800/50 border border-green-500/20 rounded-xl p-6 text-center">
            <Award className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className={`text-2xl font-bold font-mono ${getRankColor(userRank)}`}>
              #{userRank}
            </div>
            <div className="text-slate-400 text-sm">Xếp hạng</div>
          </div>
          
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-6 text-center">
            <Target className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white font-mono">{totalAttempts}</div>
            <div className="text-slate-400 text-sm">Lượt thi</div>
          </div>
          
          <div className="bg-slate-800/50 border border-yellow-500/20 rounded-xl p-6 text-center">
            <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white font-mono">{formatTime(totalTimeSpent)}</div>
            <div className="text-slate-400 text-sm">Thời gian học</div>
          </div>

          <div className="bg-slate-800/50 border border-orange-500/20 rounded-xl p-6 text-center">
            <Target className="w-8 h-8 text-orange-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white font-mono">{averageAccuracy}%</div>
            <div className="text-slate-400 text-sm">Độ chính xác TB</div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-slate-800/50 border border-cyan-500/20 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 font-mono">Thống kê hiệu suất</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Điểm trung bình:</span>
                <span className="text-cyan-400 font-mono font-bold">{averageScore}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Điểm cao nhất:</span>
                <span className="text-green-400 font-mono font-bold">{bestScore}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Tỷ lệ hoàn thành:</span>
                <span className="text-yellow-400 font-mono font-bold">
                  {totalAttempts > 0 ? '100%' : '0%'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Độ chính xác trung bình:</span>
                <span className="text-orange-400 font-mono font-bold">{averageAccuracy}%</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-cyan-500/20 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 font-mono">Thành tích gần đây</h3>
            <div className="space-y-3">
              {userAttempts.slice(-3).reverse().map((attempt, index) => {
                const contest = contests.find(c => c.id === attempt.contestId);
                return (
                  <div key={attempt.id} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-b-0">
                    <div>
                      <div className="text-white font-medium text-sm">{contest?.title}</div>
                      <div className="text-slate-400 text-xs">
                        {new Date(attempt.endTime!).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-mono font-bold">{attempt.score}</div>
                      <div className="text-slate-400 text-xs">{attempt.accuracy}% - {formatTime(attempt.timeSpent)}</div>
                    </div>
                  </div>
                );
              })}
              
              {userAttempts.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-slate-400 text-sm">Chưa có lượt thi nào</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contest History */}
        <div className="bg-slate-800/50 border border-cyan-500/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 font-mono">Lịch sử thi đấu</h3>
          
          {userAttempts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-cyan-300 font-mono text-sm">Cuộc thi</th>
                    <th className="text-left py-3 px-4 text-cyan-300 font-mono text-sm">Điểm</th>
                    <th className="text-left py-3 px-4 text-cyan-300 font-mono text-sm">Độ chính xác</th>
                    <th className="text-left py-3 px-4 text-cyan-300 font-mono text-sm">Thời gian</th>
                    <th className="text-left py-3 px-4 text-cyan-300 font-mono text-sm">Ngày thi</th>
                  </tr>
                </thead>
                <tbody>
                  {userAttempts.reverse().map((attempt) => {
                    const contest = contests.find(c => c.id === attempt.contestId);
                    return (
                      <tr key={attempt.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                        <td className="py-3 px-4 text-white">{contest?.title}</td>
                        <td className="py-3 px-4">
                          <span className={`font-mono font-bold ${getScoreColor(attempt.score)}`}>
                            {attempt.score}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-orange-400 font-mono">
                            {attempt.accuracy}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300 font-mono">
                          {formatTime(attempt.timeSpent)}
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-sm">
                          {new Date(attempt.endTime!).toLocaleDateString('vi-VN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-slate-400 mb-2">Chưa có lịch sử thi đấu</h4>
              <p className="text-slate-500">Hãy tham gia các cuộc thi để xây dựng lịch sử của bạn!</p>
            </div>
          )}
        </div>

        {/* Change Password Modal */}
        {showChangePassword && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 border border-purple-500/20 rounded-2xl p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white font-mono">Đổi mật khẩu</h3>
                <button
                  onClick={() => {
                    setShowChangePassword(false);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordError('');
                    setPasswordSuccess('');
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-purple-300 text-sm font-mono mb-2">Mật khẩu hiện tại</label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 pr-12 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-400"
                    >
                      {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-purple-300 text-sm font-mono mb-2">Mật khẩu mới</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 pr-12 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      placeholder="Nhập mật khẩu mới"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-400"
                    >
                      {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-purple-300 text-sm font-mono mb-2">Xác nhận mật khẩu mới</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 pr-12 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      placeholder="Xác nhận mật khẩu mới"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-400"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {passwordError && (
                  <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-3 text-green-400 text-sm">
                    {passwordSuccess}
                  </div>
                )}

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={handleChangePassword}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3 px-6 rounded-lg font-bold transition-all duration-300"
                  >
                    Đổi mật khẩu
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowChangePassword(false);
                      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      setPasswordError('');
                      setPasswordSuccess('');
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
      </div>
    </div>
  );
};

export default ProfilePage;