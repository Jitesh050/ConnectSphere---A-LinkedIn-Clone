
import React, { useContext, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, AppContext } from './contexts/AppContext';
import AuthPage from './pages/AuthPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Main />
      </HashRouter>
    </AppProvider>
  );
};

const Main: React.FC = () => {
  const context = useContext(AppContext);

  // A small component to render header everywhere except AuthPage
  const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/auth';
    
    return (
      <div className="min-h-screen bg-background">
        {!isAuthPage && <Header />}
        <main>{children}</main>
      </div>
    );
  };
  
  // A wrapper for routes that require authentication
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (!context?.currentUser) {
      return <Navigate to="/auth" replace />;
    }
    return <>{children}</>;
  };

  useEffect(() => {
    context?.initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (context?.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/auth" element={context?.currentUser ? <Navigate to="/" /> : <AuthPage />} />
        <Route path="/" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
        <Route path="/profile/:userId" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AppLayout>
  );
};

export default App;
