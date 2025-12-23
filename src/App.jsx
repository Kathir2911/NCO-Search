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
import RoleGuard from './components/RoleGuard';
import DemoSearch from './pages/demo/DemoSearch';
import DemoDetail from './pages/demo/DemoDetail';
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

              {/* Public Demo Routes */}
              <Route path="/demo" element={<DemoSearch />} />
              <Route path="/demo/occupation/:ncoCode" element={<DemoDetail />} />

              {/* Enumerator Routes */}
              <Route path="/enumerator" element={<SearchPage />} />
              <Route path="/enumerator/occupation/:ncoCode" element={<OccupationDetail />} />

              {/* Admin Routes */}
              <Route
                path="/admin/search"
                element={
                  <RoleGuard roles={['ADMIN']}>
                    <SearchPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <RoleGuard roles={['ADMIN']}>
                    <Dashboard />
                  </RoleGuard>
                }
              />
              <Route
                path="/admin/synonyms"
                element={
                  <RoleGuard roles={['ADMIN']}>
                    <Synonyms />
                  </RoleGuard>
                }
              />
              <Route
                path="/admin/audit-logs"
                element={
                  <RoleGuard roles={['ADMIN']}>
                    <AuditLogs />
                  </RoleGuard>
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

