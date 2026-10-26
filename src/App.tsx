import { Navigate, Route, Routes } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import FeedPage from './pages/FeedPage';
import NotFoundPage from './pages/NotFoundPage';
import TilesPage from './pages/TilesPage';

export default function App() {
  return (
    <div className="app-wrapper">
      <Routes>
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/feed/:id" element={<FeedPage />} />
        <Route path="/tiles" element={<TilesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <BottomNav />
    </div>
  );
}
