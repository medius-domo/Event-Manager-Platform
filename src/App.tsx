import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import EventRegistrationPage from './components/EventRegistrationPage';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading application...</div>
        </div>
      </div>
    );
  }

  const eventMatch = currentPath.match(/^\/event\/([^/]+)$/);
  if (eventMatch) {
    return <EventRegistrationPage slug={eventMatch[1]} />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return <AdminDashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
