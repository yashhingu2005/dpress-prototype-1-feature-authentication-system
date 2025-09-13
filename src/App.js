// src/App.js
import './App.css';
import './styles/DesignSystem.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Drills from './pages/Drills';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ModuleDetails from './pages/ModuleDetails';
import InstitutionSetup from './pages/InstitutionSetup';
import { AppProvider } from './AppContext';
import { AuthProvider } from './context/AuthContext'; 
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';   
import NotFound from './pages/NotFound';                   

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="App">
            <Layout>
              <Routes>
                {/* Public route */}
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/institution-setup" element={<InstitutionSetup />} />

                {/* Protected routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } />

                <Route path="/learn" element={
                  <ProtectedRoute>
                    <Learn />
                  </ProtectedRoute>
                } />

                <Route path="/learn/:moduleId" element={
                  <ProtectedRoute>
                    <ModuleDetails />
                  </ProtectedRoute>
                } />

                <Route path="/drills" element={
                  <ProtectedRoute>
                    <Drills />
                  </ProtectedRoute>
                } />

                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />

                {/* Admin route - requires teacher role */}
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole="teacher">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />

                {/* 404 page */}
                <Route path="/404" element={<NotFound />} />

                {/* Redirect unknown routes to 404 */}
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Layout>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider> 
  );
}

export default App;
