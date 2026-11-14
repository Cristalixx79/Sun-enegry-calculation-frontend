import { Spinner } from 'react-bootstrap';

interface LoadingOverlayProps {
  visible: boolean;
}

/**
 * Анимация загрузки поверх страницы. Пока она показана, клики по кнопкам
 * и ссылкам под ней не проходят — пользователь не может отправить второй запрос.
 */
export default function LoadingOverlay({ visible }: LoadingOverlayProps) {
  if (!visible) return null;
  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <Spinner animation="border" variant="success" />
      <span className="visually-hidden">Загрузка…</span>
    </div>
  );
}
