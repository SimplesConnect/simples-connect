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
import EnhancedMatching from './components/EnhancedMatching';
// import MatchingPreferences from './components/MatchingPreferences'; // Removed - uses non-existent DB columns

import Resources from './pages/Resources';
import AboutUs from './pages/AboutUs';
import FAQs from './pages/FAQs';
import ContactUs from './pages/ContactUs';
import Policies from './pages/Policies';
import SafetyTips from './pages/SafetyTips';
import CommunityGuidelines from './pages/CommunityGuidelines';
import Disclaimers from './pages/Disclaimers';

// Blog post imports
import HowToSetUpProfile from './pages/blog/HowToSetUpProfile';
import FirstWeekGuide from './pages/blog/FirstWeekGuide';
import PrivacySettingsGuide from './pages/blog/PrivacySettingsGuide';
import FiveThingsUgandansUnderstand from './pages/blog/FiveThingsUgandansUnderstand';
import FeelingGroundedWhenHomesick from './pages/blog/FeelingGroundedWhenHomesick';
import BalancingTwoCultures from './pages/blog/BalancingTwoCultures';
import StaySafeWhileConnecting from './pages/blog/StaySafeWhileConnecting';
import BlockingReportingControl from './pages/blog/BlockingReportingControl';
import MentalHealthDiaspora from './pages/blog/MentalHealthDiaspora';
import PromoteBusinessWithoutSpamming from './pages/blog/PromoteBusinessWithoutSpamming';
import NetworkingDiasporaQuality from './pages/blog/NetworkingDiasporaQuality';
import BuildBrandSocialMedia from './pages/blog/BuildBrandSocialMedia';

import { useAuth } from './context/AuthContext';

// Admin components
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';

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
            path="/resources"
            element={
              <PublicLayout>
                <Resources />
              </PublicLayout>
            }
          />
          <Route
            path="/about"
            element={
              <PublicLayout>
                <AboutUs />
              </PublicLayout>
            }
          />
          <Route
            path="/faqs"
            element={
              <PublicLayout>
                <FAQs />
              </PublicLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicLayout>
                <ContactUs />
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

          {/* Blog Post Routes */}
          <Route
            path="/resources/profile-setup"
            element={
              <PublicLayout>
                <HowToSetUpProfile />
              </PublicLayout>
            }
          />
          <Route
            path="/resources/first-week-guide"
            element={
              <PublicLayout>
                <FirstWeekGuide />
              </PublicLayout>
            }
          />
          <Route
            path="/resources/privacy-settings"
            element={
              <PublicLayout>
                <PrivacySettingsGuide />
              </PublicLayout>
            }
          />
          <Route
            path="/resources/five-things-ugandans-understand"
            element={
              <PublicLayout>
                <FiveThingsUgandansUnderstand />
              </PublicLayout>
            }
          />
          <Route
            path="/resources/feeling-grounded-homesick"
            element={
              <PublicLayout>
                <FeelingGroundedWhenHomesick />
              </PublicLayout>
            }
          />
          <Route
            path="/resources/balancing-two-cultures"
            element={
              <PublicLayout>
                <BalancingTwoCultures />
              </PublicLayout>
            }
          />
          <Route
            path="/resources/stay-safe-connecting"
            element={
              <PublicLayout>
                <StaySafeWhileConnecting />
              </PublicLayout>
            }
          />
          <Route
            path="/resources/blocking-reporting-control"
            element={
              <PublicLayout>
                <BlockingReportingControl />
              </PublicLayout>
            }
          />
          <Route
            path="/resources/mental-health-diaspora"
            element={
              <PublicLayout>
                <MentalHealthDiaspora />
              </PublicLayout>
            }
          />
          <Route
            path="/resources/promote-business-without-spamming"
            element={
              <PublicLayout>
                <PromoteBusinessWithoutSpamming />
              </PublicLayout>
            }
          />
          <Route
            path="/resources/networking-diaspora-quality"
            element={
              <PublicLayout>
                <NetworkingDiasporaQuality />
              </PublicLayout>
            }
          />
          <Route
            path="/resources/build-brand-social-media"
            element={
              <PublicLayout>
                <BuildBrandSocialMedia />
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
          {/* Enhanced Matching Routes */}
          <Route path="/enhanced-discover" element={<PrivateRoute><EnhancedMatching /></PrivateRoute>} />
          
          {/* Admin Routes - No header/footer for clean admin interface */}
          <Route 
            path="/admin" 
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <PrivateRoute>
                <UserManagement />
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