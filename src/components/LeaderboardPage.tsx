import React, { useState } from 'react';
import { Trophy, Medal, Award, Calendar, Users, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

const LeaderboardPage: React.FC = () => {
  const { getLeaderboard, getContestLeaderboard, currentUser, contests } = useApp();
  const [selectedType, setSelectedType] = useState<'overall' | 'contest'>('overall');
  const [selectedContest, setSelectedContest] = useState<string>('');
  const [showContestDropdown, setShowContestDropdown] = useState(false);

  const overallLeaderboard = getLeaderboard();
  const contestLeaderboard = selectedContest ? getContestLeaderboard(selectedContest) : [];
  const currentLeaderboard = selectedType === 'overall' ? overallLeaderboard : contestLeaderboard;

  const publicContests = contests.filter(c => c.isPublic);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-slate-300" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-400" />;
      default:
        return <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-white text-sm font-bold">{rank}</div>;
    }
  };

  const getRankColors = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/50';
      case 2:
        return 'bg-gradient-to-r from-slate-400/20 to-slate-500/20 border-slate-400/50';
      case 3:
        return 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/50';
      default:
        return 'bg-slate-800/30 border-slate-600/50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 150) return 'text-yellow-400';
    if (score >= 100) return 'text-green-400';
    if (score >= 50) return 'text-cyan-400';
    return 'text-slate-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-6 py-2 mb-4">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-300 font-mono text-sm">Leaderboard</span>
          </div>
          <h1 className="text-4xl font-bold text-white font-mono mb-2">Bảng xếp hạng</h1>
          <p className="text-slate-300">Xem ai đang dẫn đầu trong cộng đồng AI</p>
        </div>

        {/* Leaderboard Type Selection */}
        <div className="flex space-x-1 mb-8 bg-slate-800/30 rounded-lg p-1">
          <button
            onClick={() => {
              setSelectedType('overall');
              setSelectedContest('');
            }}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              selectedType === 'overall'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            <span className="font-mono text-sm">Tổng điểm</span>
          </button>
          
          <button
            onClick={() => setSelectedType('contest')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              selectedType === 'contest'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            <span className="font-mono text-sm">Cuộc thi</span>
          </button>
        </div>

        {/* Contest Selection */}
        {selectedType === 'contest' && (
          <div className="mb-8">
            <div className="relative">
              <button
                onClick={() => setShowContestDropdown(!showContestDropdown)}
                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg py-3 px-4 text-white flex items-center justify-between hover:bg-slate-800/70 transition-colors"
              >
                <span>
                  {selectedContest 
                    ? contests.find(c => c.id === selectedContest)?.title 
                    : 'Chọn cuộc thi'
                  }
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showContestDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {publicContests.map((contest) => (
                    <button
                      key={contest.id}
                      onClick={() => {
                        setSelectedContest(contest.id);
                        setShowContestDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 text-white hover:bg-slate-700 transition-colors border-b border-slate-700 last:border-b-0"
                    >
                      <div className="font-medium">{contest.title}</div>
                      <div className="text-sm text-slate-400">{contest.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-6 text-center">
            <Users className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white font-mono">{currentLeaderboard.length}</div>
            <div className="text-slate-400 text-sm">Thành viên</div>
          </div>
          
          <div className="bg-slate-800/50 border border-green-500/20 rounded-xl p-6 text-center">
            <Trophy className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white font-mono">
              {currentLeaderboard[0]?.score || 0}
            </div>
            <div className="text-slate-400 text-sm">Điểm cao nhất</div>
          </div>
          
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-6 text-center">
            <Award className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white font-mono">
              {currentUser ? currentLeaderboard.findIndex(u => u.id === currentUser.id) + 1 || '-' : '-'}
            </div>
            <div className="text-slate-400 text-sm">Hạng của bạn</div>
          </div>
        </div>

        {/* Top 3 Podium */}
        {currentLeaderboard.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white font-mono mb-6 text-center">Top 3 thành viên xuất sắc</h2>
            <div className="flex justify-center items-end space-x-4">
              {currentLeaderboard.slice(0, 3).map((user, index) => {
                const rank = index + 1;
                const heights = ['h-32', 'h-40', 'h-28'];
                const height = heights[rank === 1 ? 1 : rank === 2 ? 0 : 2];
                
                return (
                  <div key={user.id} className={`${height} w-24 flex flex-col justify-end items-center`}>
                    <div className={`w-full ${getRankColors(rank)} border rounded-t-lg p-4 text-center`}>
                      <div className="mb-2">{getRankIcon(rank)}</div>
                      <div className="text-white font-bold text-sm truncate">{user.username}</div>
                      <div className={`font-mono text-sm ${getScoreColor(user.score)}`}>{user.score}</div>
                    </div>
                    <div className="w-full bg-slate-700 h-8 rounded-b-lg flex items-center justify-center">
                      <span className="text-white font-bold">#{rank}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="bg-slate-800/50 border border-cyan-500/20 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-bold text-white font-mono">
              {selectedType === 'overall' ? 'Bảng xếp hạng tổng' : 
               selectedContest ? `Bảng xếp hạng: ${contests.find(c => c.id === selectedContest)?.title}` : 
               'Chọn cuộc thi để xem bảng xếp hạng'}
            </h2>
          </div>
          
          {currentLeaderboard.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-4 px-6 text-cyan-300 font-mono text-sm">Hạng</th>
                    <th className="text-left py-4 px-6 text-cyan-300 font-mono text-sm">Thành viên</th>
                    <th className="text-left py-4 px-6 text-cyan-300 font-mono text-sm">Điểm</th>
                    {selectedType === 'contest' && (
                      <>
                        <th className="text-left py-4 px-6 text-cyan-300 font-mono text-sm">Độ chính xác</th>
                        <th className="text-left py-4 px-6 text-cyan-300 font-mono text-sm">Thời gian</th>
                      </>
                    )}
                    <th className="text-left py-4 px-6 text-cyan-300 font-mono text-sm">Ngày tham gia</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLeaderboard.map((user, index) => {
                    const rank = index + 1;
                    const isCurrentUser = currentUser?.id === user.id;
                    
                    return (
                      <tr 
                        key={user.id} 
                        className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${
                          isCurrentUser ? 'bg-cyan-900/20' : ''
                        }`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            {getRankIcon(rank)}
                            <span className={`font-mono ${rank <= 3 ? 'text-white font-bold' : 'text-slate-400'}`}>
                              #{rank}
                            </span>
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            {user.avatar ? (
                              <img 
                                src={user.avatar} 
                                alt="Avatar" 
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                                rank === 1 ? 'bg-yellow-500' :
                                rank === 2 ? 'bg-slate-400' :
                                rank === 3 ? 'bg-orange-500' :
                                'bg-slate-600'
                              }`}>
                                {user.username.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className={`font-medium ${isCurrentUser ? 'text-cyan-300' : 'text-white'}`}>
                                {user.username}
                                {isCurrentUser && <span className="ml-2 text-xs text-cyan-400">(Bạn)</span>}
                              </div>
                              <div className="text-slate-400 text-sm">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <span className={`font-mono font-bold text-lg ${getScoreColor(user.score)}`}>
                            {user.score}
                          </span>
                        </td>
                        
                        {selectedType === 'contest' && (
                          <>
                            <td className="py-4 px-6">
                              <span className="text-green-400 font-mono">
                                {user.accuracy ? `${user.accuracy}%` : '-'}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-cyan-400 font-mono">
                                {user.timeSpent ? `${Math.floor(user.timeSpent / 60)}:${(user.timeSpent % 60).toString().padStart(2, '0')}` : '-'}
                              </span>
                            </td>
                          </>
                        )}
                        
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2 text-slate-400">
                            <Calendar className="w-4 h-4" />
                            <span className="font-mono text-sm">
                              {new Date(user.joinDate).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-400 mb-2">
                {selectedType === 'contest' && !selectedContest 
                  ? 'Chọn cuộc thi để xem bảng xếp hạng'
                  : 'Chưa có dữ liệu'
                }
              </h3>
            </div>
          )}
        </div>

        {/* Motivation Message */}
        {currentUser && currentLeaderboard.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/20 rounded-2xl p-6 text-center">
            <h3 className="text-lg font-bold text-white mb-2">
              {currentLeaderboard.findIndex(u => u.id === currentUser.id) + 1 <= 3 
                ? '🎉 Chúc mừng! Bạn đang trong Top 3!'
                : '💪 Tiếp tục cố gắng để leo lên vị trí cao hơn!'
              }
            </h3>
            <p className="text-slate-300 text-sm">
              Hãy tham gia thêm các thử thách để tăng điểm và cạnh tranh với các thành viên khác.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;