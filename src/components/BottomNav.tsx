import { Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Icon from './Icon';
import { ICON_GRID, ICON_LIST, ICON_PLUS, ICON_USER } from './icons';

/**
 * Нижняя навигационная панель из 4 пунктов.
 * Доступны «Лента» и «Плитка»; «Добавление» и «Вход» появятся в следующих
 * лабораторных (авторизация, интерфейс создателя), поэтому сейчас отключены.
 */
export default function BottomNav() {
  return (
    <Navbar as="nav" className="bottom-nav" aria-label="Основная навигация">
      <Nav className="bottom-nav__list">
        <Nav.Link as={NavLink} to="/feed" className="bottom-nav__item">
          <Icon path={ICON_LIST} />
          <span>Лента</span>
        </Nav.Link>

        <Nav.Link disabled className="bottom-nav__item" title="Недоступно в этой версии">
          <Icon path={ICON_PLUS} />
          <span>Добавление</span>
        </Nav.Link>

        <Nav.Link as={NavLink} to="/tiles" className="bottom-nav__item">
          <Icon path={ICON_GRID} />
          <span>Плитка</span>
        </Nav.Link>

        <Nav.Link disabled className="bottom-nav__item" title="Недоступно в этой версии">
          <Icon path={ICON_USER} />
          <span>Вход</span>
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}
