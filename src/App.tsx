import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import { LoginPage, RegisterPage } from './components/AuthPages';
import ChallengesPage from './components/ChallengesPage';
import LeaderboardPage from './components/LeaderboardPage';
import ProfilePage from './components/ProfilePage';
import AdminPage from './components/AdminPage';
import EventsPage from './components/EventsPage';
import ForumPage from './components/ForumPage';

const AppRouter: React.FC = () => {
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'challenges':
        return <ChallengesPage />;
      case 'leaderboard':
        return <LeaderboardPage />;
      case 'events':
        return <EventsPage />;
      case 'forum':
        return <ForumPage />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 relative">
      <Sidebar />
      <main className="w-full">
        {renderPage()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;