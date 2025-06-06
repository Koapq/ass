import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle, XCircle, ArrowRight, Trophy, Clock, Play, Flag, Award, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Contest, ContestAttempt } from '../types';

const ChallengesPage: React.FC = () => {
  const { 
    contests, 
    currentUser, 
    startContest, 
    submitContestAnswer, 
    finishContest, 
    getCurrentAttempt,
    getUserContestAttempts
  } = useApp();
  
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<ContestAttempt | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [textAnswer, setTextAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [feedback, setFeedback] = useState<{ show: boolean; correct: boolean; message: string }>({
    show: false,
    correct: false,
    message: ''
  });

  // Timer effect
  useEffect(() => {
    if (currentAttempt && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleFinishContest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentAttempt, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartContest = (contest: Contest) => {
    const attempt = startContest(contest.id);
    if (attempt) {
      setCurrentAttempt(attempt);
      setSelectedContest(contest);
      setTimeLeft(contest.timeLimit * 60);
      setCurrentQuestionIndex(0);
      setQuestionStartTime(Date.now());
      setFeedback({ show: false, correct: false, message: '' });
    }
  };

  const handleSubmitAnswer = () => {
    if (!currentAttempt || !selectedContest) return;
    
    const currentQuestion = selectedContest.challenges[currentQuestionIndex];
    const answer = currentQuestion.type === 'multiple-choice' ? selectedAnswer : textAnswer;
    const questionTime = Math.floor((Date.now() - questionStartTime) / 1000);
    
    if (!answer.trim()) {
      setFeedback({
        show: true,
        correct: false,
        message: 'Vui lòng chọn hoặc nhập câu trả lời!'
      });
      return;
    }

    const isCorrect = submitContestAnswer(currentAttempt.id, currentQuestion.id, answer, questionTime);
    
    setFeedback({
      show: true,
      correct: isCorrect,
      message: isCorrect 
        ? `Chính xác! +${currentQuestion.points} điểm`
        : 'Câu trả lời chưa đúng'
    });

    setSelectedAnswer('');
    setTextAnswer('');
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < selectedContest!.challenges.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
      setFeedback({ show: false, correct: false, message: '' });
    } else {
      handleFinishContest();
    }
  };

  const handleFinishContest = () => {
    if (currentAttempt) {
      finishContest(currentAttempt.id);
      setCurrentAttempt(null);
      setSelectedContest(null);
      setTimeLeft(0);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-900/20 border-green-500/50';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/50';
      case 'hard': return 'text-red-400 bg-red-900/20 border-red-500/50';
      default: return 'text-cyan-400 bg-cyan-900/20 border-cyan-500/50';
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
        <div className="text-center">
          <Brain className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Cần đăng nhập</h2>
          <p className="text-slate-300">Vui lòng đăng nhập để tham gia thử thách.</p>
        </div>
      </div>
    );
  }

  // Contest in progress
  if (currentAttempt && selectedContest) {
    const currentQuestion = selectedContest.challenges[currentQuestionIndex];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Contest Header */}
          <div className="bg-slate-800/50 border border-cyan-500/20 rounded-2xl p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white font-mono">{selectedContest.title}</h1>
                <p className="text-slate-300">
                  Câu {currentQuestionIndex + 1} / {selectedContest.challenges.length}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-mono font-bold ${timeLeft < 300 ? 'text-red-400' : 'text-cyan-400'}`}>
                  <Clock className="w-5 h-5 inline mr-2" />
                  {formatTime(timeLeft)}
                </div>
                <p className="text-slate-400 text-sm">Thời gian còn lại</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / selectedContest.challenges.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-slate-800/50 border border-cyan-500/20 rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className={`px-3 py-1 rounded-full border text-xs font-mono ${getDifficultyColor(currentQuestion.difficulty)}`}>
                {currentQuestion.difficulty.toUpperCase()}
              </div>
              <div className="flex items-center space-x-2 text-green-400">
                <Trophy className="w-4 h-4" />
                <span className="font-mono text-sm">{currentQuestion.points} điểm</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-8 leading-relaxed">
              {currentQuestion.question}
            </h2>

            {/* Answer Options */}
            <div className="space-y-4 mb-8">
              {currentQuestion.type === 'multiple-choice' ? (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedAnswer === option
                          ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300'
                          : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={option}
                        checked={selectedAnswer === option}
                        onChange={(e) => setSelectedAnswer(e.target.value)}
                        className="w-4 h-4 text-cyan-600 bg-slate-700 border-slate-600 focus:ring-cyan-500"
                      />
                      <span className="flex-1">{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div>
                  <label className="block text-cyan-300 text-sm font-mono mb-2">
                    Nhập câu trả lời của bạn:
                  </label>
                  <textarea
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-4 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors resize-none"
                    rows={4}
                    placeholder="Nhập câu trả lời chi tiết..."
                  />
                </div>
              )}
            </div>

            {/* Feedback */}
            {feedback.show && (
              <div className={`p-4 rounded-lg border mb-6 ${
                feedback.correct 
                  ? 'bg-green-900/20 border-green-500/50 text-green-400'
                  : 'bg-red-900/20 border-red-500/50 text-red-400'
              }`}>
                <div className="flex items-center space-x-2">
                  {feedback.correct ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  <span className="font-medium">{feedback.message}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              {!feedback.show ? (
                <button
                  onClick={handleSubmitAnswer}
                  className="flex-1 py-3 px-6 rounded-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white transition-all duration-300 transform hover:scale-105"
                >
                  Gửi câu trả lời
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-lg font-bold transition-all duration-300"
                >
                  <span>
                    {currentQuestionIndex < selectedContest.challenges.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              
              <button
                onClick={handleFinishContest}
                className="bg-red-600 hover:bg-red-500 text-white py-3 px-6 rounded-lg font-bold transition-all duration-300"
              >
                <Flag className="w-4 h-4 inline mr-2" />
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Contest selection
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-6 py-2 mb-4">
            <Brain className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300 font-mono text-sm">AI Challenges</span>
          </div>
          <h1 className="text-4xl font-bold text-white font-mono mb-2">Chọn cuộc thi</h1>
          <p className="text-slate-300">Chọn cuộc thi phù hợp với trình độ của bạn</p>
        </div>

        {/* User Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-6 text-center">
            <Award className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white font-mono">{currentUser.score}</div>
            <div className="text-slate-400 text-sm">Tổng điểm</div>
          </div>
          
          <div className="bg-slate-800/50 border border-green-500/20 rounded-xl p-6 text-center">
            <Trophy className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white font-mono">
              {contests.filter(c => getCurrentAttempt(c.id)).length}
            </div>
            <div className="text-slate-400 text-sm">Đang tham gia</div>
          </div>
          
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-6 text-center">
            <Brain className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white font-mono">{contests.length}</div>
            <div className="text-slate-400 text-sm">Cuộc thi có sẵn</div>
          </div>
        </div>

        {/* Contests Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contests.filter(c => c.isActive).map((contest) => {
            const existingAttempt = getCurrentAttempt(contest.id);
            const userAttempts = getUserContestAttempts ? getUserContestAttempts(currentUser.id, contest.id) : [];
            const hasExceededAttempts = userAttempts.length >= contest.maxAttempts;
            
            return (
              <div key={contest.id} className="bg-slate-800/50 border border-cyan-500/20 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">{contest.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{contest.description}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Số câu hỏi:</span>
                    <span className="text-cyan-400 font-mono">{contest.challenges.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Thời gian:</span>
                    <span className="text-cyan-400 font-mono">{contest.timeLimit} phút</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Lượt thử:</span>
                    <span className="text-cyan-400 font-mono">
                      {userAttempts.length}/{contest.maxAttempts}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Tổng điểm:</span>
                    <span className="text-green-400 font-mono">
                      {contest.challenges.reduce((sum, c) => sum + c.points, 0)}
                    </span>
                  </div>
                </div>

                {hasExceededAttempts && (
                  <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
                    <div className="flex items-center space-x-2 text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Đã hết lượt thử</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleStartContest(contest)}
                  disabled={!!existingAttempt || hasExceededAttempts}
                  className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-300 ${
                    existingAttempt
                      ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      : hasExceededAttempts
                      ? 'bg-red-600/50 text-red-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white transform hover:scale-105'
                  }`}
                >
                  <Play className="w-4 h-4 inline mr-2" />
                  {existingAttempt 
                    ? 'Đang tham gia' 
                    : hasExceededAttempts 
                    ? 'Hết lượt' 
                    : 'Bắt đầu thi'
                  }
                </button>
              </div>
            );
          })}
        </div>

        {contests.filter(c => c.isActive).length === 0 && (
          <div className="text-center py-16">
            <Brain className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400 mb-2">Chưa có cuộc thi nào</h3>
            <p className="text-slate-500">Các cuộc thi mới sẽ được cập nhật sớm!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengesPage;