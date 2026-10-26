import { Link } from 'react-router-dom';
import { DEFAULT_IMAGE } from '../utils/media';

export default function NotFoundPage() {
  return (
    <div className="page-message">
      <img src={DEFAULT_IMAGE} alt="Изображение по умолчанию" className="not-found-img" />
      <h2>Страница не найдена</h2>
      <p>Такого адреса в приложении нет.</p>
      <Link to="/feed" className="btn btn-accent">
        Перейти к ленте
      </Link>
    </div>
  );
}
