import { Navigate, Route, Routes } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import LoadingOverlay from './components/LoadingOverlay';
import StatusBar from './components/StatusBar';
import AddPage from './pages/AddPage';
import FeedPage from './pages/FeedPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import TilesPage from './pages/TilesPage';
import { useAppSelector } from './store/hooks';
import { selectIsBusy } from './store/slices/uiSlice';

export default function App() {
  // Пока выполняется любой запрос (thunk), показывается анимация, блокирующая кнопки
  const isBusy = useAppSelector(selectIsBusy);

  return (
    <div className="app-wrapper" aria-busy={isBusy}>
      <Routes>
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/feed/:id" element={<FeedPage />} />
        <Route path="/tiles" element={<TilesPage />} />
        <Route path="/add" element={<AddPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <StatusBar />
      <BottomNav />
      <LoadingOverlay visible={isBusy} />
    </div>
  );
}
