import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

import ProfilePage from './pages/ProfilePage';
import SkillsManagementPage from './pages/SkillsManagementPage';
import SkillsConfigurationPage from './pages/SkillsConfigurationPage';
import CategoriesPage from './pages/CategoriesPage';
import SubcategoriesPage from './pages/SubcategoriesPage';
import TagsPage from './pages/TagsPage';
import SkillsMasterListPage from './pages/SkillsMasterListPage';
import ProjectsListPage from './pages/ProjectsListPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ResourcesListPage from './pages/ResourcesListPage';
import GroupManagementPage from './pages/GroupManagementPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/projects" element={<ProjectsListPage />} />
              <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
              <Route path="/resources" element={<ResourcesListPage />} />
              <Route path="/groups" element={<GroupManagementPage />} />
              <Route path="/skills-management" element={<SkillsManagementPage />} />
              <Route path="/skills-configuration" element={<SkillsConfigurationPage />} />
              <Route path="/skills-configuration/categories" element={<CategoriesPage />} />
              <Route path="/skills-configuration/subcategories" element={<SubcategoriesPage />} />
              <Route path="/skills-configuration/tags" element={<TagsPage />} />
              <Route path="/skills-configuration/skills" element={<SkillsMasterListPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
