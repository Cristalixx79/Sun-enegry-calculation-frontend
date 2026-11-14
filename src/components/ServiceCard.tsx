import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { ServiceListItem } from '../api';
import { formatKpd, formatPrice } from '../utils/format';
import { resolveImage } from '../utils/media';
import Icon from './Icon';
import { ICON_HEART } from './icons';

interface ServiceCardProps {
  service: ServiceListItem;
  /** Показывать кнопку удаления (для своих услуг в интерфейсе пользователя) */
  showDelete: boolean;
  disabled: boolean;
  onDelete: (id: number) => void;
}

/** Карточка услуги на странице «Плитка». Клик открывает услугу в ленте. */
export default function ServiceCard({ service, showDelete, disabled, onDelete }: ServiceCardProps) {
  return (
    <div className="grid-card-wrapper">
      <Link to={`/feed/${service.id}`} className="grid-card-link">
        <Card className="grid-card">
          <Card.Img
            variant="top"
            src={resolveImage(service.image_url)}
            alt={service.title}
            className="grid-card-img"
          />
          <Card.Body className="grid-card-info">
            <Card.Title as="h3" className="grid-card-title">
              {service.title}
            </Card.Title>
            <div className="grid-card-price">{formatPrice(service.price)}</div>
            <div className="grid-card-bottom">
              <span className="grid-card-eff">КПД {formatKpd(service.kpd)}</span>
              <span className="grid-card-likes">
                <Icon path={ICON_HEART} className="heart-icon-small" />
                <span className="like-count">{service.likes_count}</span>
              </span>
            </div>
          </Card.Body>
        </Card>
      </Link>

      {showDelete && (
        <Button
          variant="dark"
          className="delete-btn"
          aria-label="Удалить"
          disabled={disabled}
          onClick={() => onDelete(service.id)}
        >
          ×
        </Button>
      )}
    </div>
  );
}
