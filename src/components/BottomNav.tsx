import { useState } from 'react';
import { Nav, Navbar, Spinner } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { logoutRequest } from '../auth/authApi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import Icon from './Icon';
import { ICON_GRID, ICON_LIST, ICON_LOGOUT, ICON_PLUS, ICON_USER } from './icons';

/**
 * Нижняя навигационная панель из 4 пунктов. Для гостя: Лента, Плитка и Вход
 * («Добавление» отключено). После входа «Вход» заменяется на «Выход»,
 * а «Добавление» становится доступным.
 */
export default function BottomNav() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const [loggingOut, setLoggingOut] = useState(false);

  // Выход: запрос только через axios, состояние в Redux передаём вручную
  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logoutRequest();
    } catch {
      // сессия могла уже истечь на сервере — из интерфейса всё равно выходим
    } finally {
      setLoggingOut(false);
    }
    dispatch(logout());
    navigate('/feed');
  }

  return (
    <Navbar as="nav" className="bottom-nav" aria-label="Основная навигация">
      <Nav className="bottom-nav__list">
        <Nav.Link as={NavLink} to="/feed" className="bottom-nav__item">
          <Icon path={ICON_LIST} />
          <span>Лента</span>
        </Nav.Link>

        {isAuthenticated ? (
          <Nav.Link as={NavLink} to="/add" className="bottom-nav__item">
            <Icon path={ICON_PLUS} />
            <span>Добавление</span>
          </Nav.Link>
        ) : (
          <Nav.Link disabled className="bottom-nav__item" title="Доступно после входа">
            <Icon path={ICON_PLUS} />
            <span>Добавление</span>
          </Nav.Link>
        )}

        <Nav.Link as={NavLink} to="/tiles" className="bottom-nav__item">
          <Icon path={ICON_GRID} />
          <span>Плитка</span>
        </Nav.Link>

        {isAuthenticated ? (
          <Nav.Link
            as="button"
            type="button"
            className="bottom-nav__item bottom-nav__button"
            disabled={loggingOut}
            onClick={handleLogout}
          >
            {loggingOut ? <Spinner animation="border" size="sm" /> : <Icon path={ICON_LOGOUT} />}
            <span>Выход</span>
          </Nav.Link>
        ) : (
          <Nav.Link as={NavLink} to="/login" className="bottom-nav__item">
            <Icon path={ICON_USER} />
            <span>Вход</span>
          </Nav.Link>
        )}
      </Nav>
    </Navbar>
  );
}
