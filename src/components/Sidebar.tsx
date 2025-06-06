import React, { useState, useRef, useEffect } from 'react';
import { Home, UserPlus, LogIn, Brain, Trophy, LogOut, User, Settings, Calendar, MessageSquare, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Sidebar: React.FC = () => {
  const { currentPage, setCurrentPage, currentUser, logout } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'register', label: 'Đăng ký', icon: UserPlus, hideWhenLoggedIn: true },
    { id: 'login', label: 'Đăng nhập', icon: LogIn, hideWhenLoggedIn: true },
    { id: 'challenges', label: 'Thử thách', icon: Brain, requireAuth: true },
    { id: 'leaderboard', label: 'Bảng xếp hạng', icon: Trophy },
    { id: 'events', label: 'Sự kiện', icon: Calendar },
    { id: 'forum', label: 'Diễn đàn', icon: MessageSquare, requireAuth: true },
    { id: 'profile', label: 'Hồ sơ', icon: User, requireAuth: true },
    { id: 'admin', label: 'Quản trị', icon: Settings, requireAuth: true, adminOnly: true },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuClick = (itemId: string) => {
    setCurrentPage(itemId);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="fixed top-4 right-4 z-50" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={toggleMenu}
        className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-white/20"
      >
        {currentUser ? (
          currentUser.avatar ? (
            <img 
              src={currentUser.avatar} 
              alt="Avatar" 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-white text-lg font-bold">
              {currentUser.username.charAt(0).toUpperCase()}
            </span>
          )
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 right-0 w-80 bg-slate-900/95 backdrop-blur-sm border border-cyan-500/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* User Info */}
          {currentUser && (
            <div className="p-6 border-b border-cyan-500/20 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {currentUser.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt="Avatar" 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {currentUser.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-cyan-300 text-sm font-mono">Xin chào,</p>
                    <p className="text-white font-semibold text-sm">{currentUser.username}</p>
                  </div>
                </div>
                <button
                  onClick={toggleMenu}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-green-400 text-sm font-mono mb-1">
                  Điểm: {currentUser.score}
                </p>
                {currentUser.role === 'admin' && (
                  <span className="inline-block px-2 py-1 bg-purple-900/20 text-purple-400 border border-purple-500/50 rounded text-xs font-mono">
                    ADMIN
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <div className="p-4 max-h-96 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems
                .filter(item => {
                  if (item.hideWhenLoggedIn && currentUser) return false;
                  if (item.requireAuth && !currentUser) return false;
                  if (item.adminOnly && (!currentUser || currentUser.role !== 'admin')) return false;
                  return true;
                })
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleMenuClick(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                          isActive
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                            : 'text-slate-300 hover:bg-slate-800/50 hover:text-cyan-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-mono text-sm">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
            </ul>

            {/* Logout Button */}
            {currentUser && (
              <div className="mt-4 pt-4 border-t border-cyan-500/20">
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-900/20 hover:text-red-400 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-mono text-sm">Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;