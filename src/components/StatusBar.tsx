import { Alert, Badge } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearError } from '../store/slices/solarPanelsSlice';

/**
 * Сообщения поверх страниц: ошибка последнего запроса и метка, что данные
 * показаны из mock-коллекции (бэкенд недоступен, интерфейс гостя).
 */
export default function StatusBar() {
  const dispatch = useAppDispatch();
  const error = useAppSelector((s) => s.solarPanels.error);
  const source = useAppSelector((s) => s.solarPanels.source);

  return (
    <>
      {source === 'mock' && (
        <Badge bg="warning" text="dark" className="source-badge">
          Демо-данные: бэкенд недоступен
        </Badge>
      )}
      {error && (
        <Alert variant="danger" dismissible className="top-alert" onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}
    </>
  );
}
