import React from 'react';
import { Users, Trophy, Brain, BookOpen, Code, Lightbulb, Target, Calendar, Star, ArrowRight, CheckCircle, Zap, Cpu, Network } from 'lucide-react';
import { useApp } from '../context/AppContext';

const HomePage: React.FC = () => {
  const { setCurrentPage, currentUser } = useApp();

  const handleJoinClick = () => {
    if (currentUser) {
      setCurrentPage('challenges');
    } else {
      setCurrentPage('register');
    }
  };

  const roadmapSteps = [
    {
      title: 'Khởi đầu với AI',
      description: 'Tìm hiểu các khái niệm cơ bản về trí tuệ nhân tạo',
      icon: BookOpen,
      color: 'from-green-400 to-cyan-500',
      topics: ['Machine Learning cơ bản', 'Python cho AI', 'Toán học AI']
    },
    {
      title: 'Thực hành Deep Learning',
      description: 'Xây dựng và huấn luyện mạng neural đầu tiên',
      icon: Brain,
      color: 'from-cyan-400 to-blue-500',
      topics: ['Neural Networks', 'TensorFlow/PyTorch', 'Computer Vision']
    },
    {
      title: 'Dự án thực tế',
      description: 'Áp dụng kiến thức vào các bài toán thực tế',
      icon: Code,
      color: 'from-blue-400 to-purple-500',
      topics: ['NLP Projects', 'Image Recognition', 'Data Analysis']
    },
    {
      title: 'Chuyên gia AI',
      description: 'Nghiên cứu sâu và đóng góp cho cộng đồng',
      icon: Star,
      color: 'from-purple-400 to-pink-500',
      topics: ['Research Papers', 'Open Source', 'AI Ethics']
    }
  ];

  const clubFeatures = [
    {
      icon: Users,
      title: 'Cộng đồng 500+ thành viên',
      description: 'Kết nối với những người đam mê AI từ khắp Việt Nam'
    },
    {
      icon: Calendar,
      title: 'Workshop hàng tuần',
      description: 'Các buổi học và thảo luận chuyên sâu về AI'
    },
    {
      icon: Trophy,
      title: 'Cuộc thi AI thường niên',
      description: 'Tham gia các cuộc thi lập trình AI với giải thưởng hấp dẫn'
    },
    {
      icon: Lightbulb,
      title: 'Mentorship 1-1',
      description: 'Được hướng dẫn bởi các chuyên gia AI hàng đầu'
    }
  ];

  const achievements = [
    { number: '500+', label: 'Thành viên tích cực' },
    { number: '50+', label: 'Dự án AI hoàn thành' },
    { number: '20+', label: 'Workshop chuyên sâu' },
    { number: '95%', label: 'Tỷ lệ hài lòng' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Neural Network Animation */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="absolute top-32 left-32 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
          <div className="absolute top-16 right-20 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-40 w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-20 left-20 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-32 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
          
          {/* Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="line1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="line2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path d="M 50 100 Q 200 50 350 120 T 600 80" stroke="url(#line1)" strokeWidth="1" fill="none" className="animate-pulse" />
            <path d="M 100 200 Q 300 150 500 220 T 800 180" stroke="url(#line2)" strokeWidth="1" fill="none" className="animate-pulse" />
            <path d="M 150 300 Q 400 250 650 320 T 900 280" stroke="url(#line1)" strokeWidth="1" fill="none" className="animate-pulse" />
          </svg>
        </div>

        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-cyan-500/20 rotate-45 animate-spin-slow"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 border border-purple-500/20 rotate-12 animate-bounce-slow"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rotate-45 animate-pulse"></div>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-full blur-2xl animate-pulse"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 pt-20">
            {/* AI Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full px-6 py-3 mb-8 backdrop-blur-sm">
              <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
              <span className="text-cyan-300 font-mono text-sm">Powered by Artificial Intelligence</span>
              <Zap className="w-4 h-4 text-yellow-400 animate-bounce" />
            </div>

            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 font-mono leading-tight">
              <span className="inline-block animate-fade-in-up">Chào mừng đến với</span>
              <br />
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
                VAIC AI Club
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up-delayed">
              Nơi kết nối những tâm hồn đam mê trí tuệ nhân tạo. Khám phá, học hỏi và thử thách bản thân 
              cùng cộng đồng AI hàng đầu Việt Nam.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={handleJoinClick}
                className="group relative inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 animate-fade-in-up-delayed"
              >
                <span className="font-mono">
                  {currentUser ? 'Bắt đầu thử thách' : 'Tham gia ngay'}
                </span>
                <Brain className="w-5 h-5 group-hover:animate-pulse" />
                
                {/* Glowing effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
              </button>

              <div className="flex items-center space-x-2 text-slate-400">
                <Network className="w-5 h-5 animate-pulse" />
                <span className="font-mono text-sm">Kết nối với 500+ thành viên</span>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="group bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 hover:bg-slate-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:scale-105 animate-fade-in-up">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:animate-pulse">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 font-mono">Thử thách trí tuệ</h3>
              <p className="text-slate-300 leading-relaxed">
                Giải quyết các câu hỏi về AI, machine learning và deep learning với độ khó tăng dần.
              </p>
            </div>
            
            <div className="group bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 hover:bg-slate-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:scale-105 animate-fade-in-up-delayed">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-cyan-600 rounded-lg flex items-center justify-center mb-6 group-hover:animate-pulse">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 font-mono">Cộng đồng sôi động</h3>
              <p className="text-slate-300 leading-relaxed">
                Kết nối với những người cùng đam mê AI, chia sẻ kiến thức và học hỏi lẫn nhau.
              </p>
            </div>
            
            <div className="group bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 hover:bg-slate-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:scale-105 animate-fade-in-up-more-delayed">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg flex items-center justify-center mb-6 group-hover:animate-pulse">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 font-mono">Bảng xếp hạng</h3>
              <p className="text-slate-300 leading-relaxed">
                Tranh tài với các thành viên khác và leo lên vị trí cao nhất trong bảng xếp hạng.
              </p>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-gradient-to-r from-slate-800/30 to-slate-700/30 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 mb-16 animate-fade-in-up">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-6 font-mono">Về VAIC AI Club</h2>
              <p className="text-slate-300 text-lg leading-relaxed max-w-4xl mx-auto">
                VAIC AI Club được thành lập với mục tiêu tạo ra một cộng đồng học tập AI chất lượng cao, 
                nơi mọi người có thể phát triển kỹ năng, mở rộng kiến thức và cùng nhau xây dựng tương lai 
                của trí tuệ nhân tạo tại Việt Nam. Chúng tôi tin rằng AI không chỉ là công nghệ, 
                mà là chìa khóa mở ra những cơ hội vô hạn.
              </p>
            </div>

            {/* Club Features */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {clubFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:animate-pulse">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                      <p className="text-slate-300">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Achievements */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center group">
                  <div className="text-3xl font-bold text-cyan-400 font-mono mb-2 group-hover:animate-pulse">
                    {achievement.number}
                  </div>
                  <div className="text-slate-300 text-sm">{achievement.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Roadmap */}
          <div className="mb-16 animate-fade-in-up">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-6 font-mono">Lộ trình học tập</h2>
              <p className="text-slate-300 text-lg max-w-3xl mx-auto">
                Từ người mới bắt đầu đến chuyên gia AI, chúng tôi có lộ trình học tập phù hợp cho mọi cấp độ
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {roadmapSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative group">
                    <div className="bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 hover:bg-slate-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:scale-105">
                      <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-lg flex items-center justify-center mb-6 group-hover:animate-pulse`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="text-sm text-cyan-400 font-mono mb-2">Bước {index + 1}</div>
                      <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                      <p className="text-slate-300 text-sm mb-4">{step.description}</p>
                      
                      <div className="space-y-2">
                        {step.topics.map((topic, topicIndex) => (
                          <div key={topicIndex} className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-400" />
                            <span className="text-slate-400 text-xs">{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Arrow connector */}
                    {index < roadmapSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                        <ArrowRight className="w-6 h-6 text-cyan-400 animate-pulse" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 text-center animate-fade-in-up">
            <h3 className="text-2xl font-bold text-white mb-4 font-mono">Sẵn sàng bắt đầu hành trình AI?</h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Tham gia cùng hàng trăm thành viên khác trong việc khám phá và chinh phục thế giới trí tuệ nhân tạo. 
              Hành trình của bạn bắt đầu từ đây!
            </p>
            <button
              onClick={handleJoinClick}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <span className="font-mono">
                {currentUser ? 'Tiếp tục học tập' : 'Đăng ký miễn phí'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;