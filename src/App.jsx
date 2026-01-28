import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RoleProvider } from './context/RoleContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import GetStarted from './pages/GetStarted';
import Login from './pages/Login';
import SearchPage from './pages/SearchPage';
import OccupationDetail from './pages/OccupationDetail';
import Dashboard from './pages/admin/Dashboard';
import Synonyms from './pages/admin/Synonyms';
import AuditLogs from './pages/admin/AuditLogs';
import ProtectedRoute from './components/ProtectedRoute';
import DemoSearch from './pages/demo/DemoSearch';
import DemoDetail from './pages/demo/DemoDetail';
import AboutUs from './pages/AboutUs';
import Guidelines from './pages/Guidelines';
import SavedSearches from './pages/SavedSearches';
import HowItWorks from './pages/HowItWorks';
import BackToTop from './components/BackToTop';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <RoleProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />

            <Routes>
              {/* Get Started Landing Page - DEFAULT */}
              <Route path="/" element={<GetStarted />} />

              {/* Login Page */}
              <Route path="/login" element={<Login />} />

              {/* About Us Page */}
              <Route path="/about" element={<AboutUs />} />

              {/* Informational Pages */}
              <Route path="/guidelines" element={<Guidelines />} />
              <Route path="/saved-searches" element={<SavedSearches />} />
              <Route path="/how-it-works" element={<HowItWorks />} />

              {/* Public Demo Routes */}
              <Route path="/demo" element={<DemoSearch />} />
              <Route path="/demo/occupation/:ncoCode" element={<DemoDetail />} />

              {/* Enumerator Routes */}
              <Route path="/enumerator" element={
                <ProtectedRoute roles={['ENUMERATOR']}>
                  <SearchPage />
                </ProtectedRoute>
              } />
              <Route path="/enumerator/occupation/:ncoCode" element={
                <ProtectedRoute roles={['ENUMERATOR']}>
                  <OccupationDetail />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route
                path="/admin/search"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <SearchPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/synonyms"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <Synonyms />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/audit-logs"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <AuditLogs />
                  </ProtectedRoute>
                }
              />
            </Routes>

            {/* Back to Top Button */}
            <BackToTop />
          </div>
        </RoleProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

