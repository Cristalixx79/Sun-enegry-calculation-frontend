import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page-message">
      <h2>Страница не найдена</h2>
      <p>Такого адреса в приложении нет.</p>
      <Link to="/feed" className="btn btn-accent">
        Перейти к ленте
      </Link>
    </div>
  );
}
