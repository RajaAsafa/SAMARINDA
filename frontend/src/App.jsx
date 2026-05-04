import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import CategoryPage from './pages/CategoryPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import NewsListPage from './pages/admin/NewsListPage';
import CategoryManagePage from './pages/admin/CategoryManagePage';
import NewsFormPage from './pages/admin/NewsFormPage';
import CommentManagePage from './pages/admin/CommentManagePage';
import UserManagePage from './pages/admin/UserManagePage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/berita/:slug" element={<DetailPage />} />
        <Route path="/kategori/:id" element={<CategoryPage />} />
        <Route path="/staff-only" element={<LoginPage />} />

        {/* Admin Routes */}
        <Route path="/office" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="berita" element={<NewsListPage />} />
          <Route path="berita/baru" element={<NewsFormPage />} />
          <Route path="berita/edit/:slug" element={<NewsFormPage />} />
          <Route path="kategori" element={<CategoryManagePage />} />
          <Route path="komentar" element={<CommentManagePage />} />
          <Route path="pengguna" element={<UserManagePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
