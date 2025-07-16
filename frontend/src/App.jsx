import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import { MessageProvider } from './context/MessageContext';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import RealMatchingComponent from './components/RealMatchingComponent';
import MatchesView from './components/MatchesView';
import Messages from './components/Messages';
import ProfileCompletion from './components/ProfileCompletion';
import ViewProfile from './components/ViewProfile';
import EditProfile from './components/EditProfile';
import Settings from './components/Settings';
import FlowTest from './components/FlowTest';
import AuthCallback from './components/AuthCallback';
import Events from './pages/Events';
import Lounge from './pages/Lounge';
import Resources from './pages/Resources';
import Policies from './pages/Policies';
import SafetyTips from './pages/SafetyTips';
import CommunityGuidelines from './pages/CommunityGuidelines';
import Disclaimers from './pages/Disclaimers';
import { useAuth } from './context/AuthContext';

// Layout component for authenticated pages
const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Layout component for public pages (accessible without login)
const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// App content component that can use auth context
const AppContent = () => {
  const { user } = useAuth();
  
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth-callback" element={<AuthCallback />} />
          
          {/* Public Routes with Header (accessible without login) */}
          <Route
            path="/events"
            element={
              <PublicLayout>
                <Events />
              </PublicLayout>
            }
          />
          <Route
            path="/lounge"
            element={
              <PublicLayout>
                <Lounge />
              </PublicLayout>
            }
          />
          <Route
            path="/resources"
            element={
              <PublicLayout>
                <Resources />
              </PublicLayout>
            }
          />
          <Route
            path="/policies"
            element={
              <PublicLayout>
                <Policies />
              </PublicLayout>
            }
          />
          <Route
            path="/safety-tips"
            element={
              <PublicLayout>
                <SafetyTips />
              </PublicLayout>
            }
          />
          <Route
            path="/community-guidelines"
            element={
              <PublicLayout>
                <CommunityGuidelines />
              </PublicLayout>
            }
          />
          <Route
            path="/disclaimers"
            element={
              <PublicLayout>
                <Disclaimers />
              </PublicLayout>
            }
          />
          
          {/* Protected Routes with Header */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <AuthenticatedLayout>
                  <Dashboard />
                </AuthenticatedLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/matches"
            element={
              <PrivateRoute>
                <AuthenticatedLayout>
                  <MatchesView />
                </AuthenticatedLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/discover"
            element={
              <PrivateRoute>
                <AuthenticatedLayout>
                  <RealMatchingComponent />
                </AuthenticatedLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <PrivateRoute>
                <AuthenticatedLayout>
                  <Messages />
                </AuthenticatedLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile-completion"
            element={
              <PrivateRoute>
                <AuthenticatedLayout>
                  <ProfileCompletion />
                </AuthenticatedLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <PrivateRoute>
                <AuthenticatedLayout>
                  <ViewProfile />
                </AuthenticatedLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <PrivateRoute>
                <AuthenticatedLayout>
                  <EditProfile />
                </AuthenticatedLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <AuthenticatedLayout>
                  <Settings />
                </AuthenticatedLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/test-flow"
            element={
              <PrivateRoute>
                <AuthenticatedLayout>
                  <FlowTest />
                </AuthenticatedLayout>
              </PrivateRoute>
            }
          />
          
          {/* Redirect any unknown routes to dashboard if authenticated, otherwise to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

function App() {
  return (
    <AuthProvider>
      <MessageProvider>
        <AppContent />
      </MessageProvider>
    </AuthProvider>
  );
}

export default App;