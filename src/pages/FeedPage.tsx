import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import BackgroundVideo from '../components/BackgroundVideo';
import Icon from '../components/Icon';
import { ICON_ARROW, ICON_BOLT, ICON_CUBE, ICON_HEART } from '../components/icons';
import { PUBLISHED_SERVICES } from '../mocks/services';
import type { Service } from '../types';
import { formatKpd, formatPrice } from '../utils/format';
import { resolveImage, resolveVideo } from '../utils/media';

const DESCRIPTION_LIMIT = 80;

interface FeedViewProps {
  service: Service;
  onNext: () => void;
}

function FeedView({ service, onNext }: FeedViewProps) {
  const [expanded, setExpanded] = useState(false);

  const image = resolveImage(service.image_url);
  const video = resolveVideo(service.video_url);

  const description = service.description;
  const isLong = description.length > DESCRIPTION_LIMIT;
  const shownText =
    expanded || !isLong ? description : `${description.slice(0, DESCRIPTION_LIMIT)}...`;

  return (
    <div className="feed">
      <BackgroundVideo src={video} poster={image} />

      <div className="content-overlay">
        <div className="icon-stack">
          <div className="icon-btn like-btn" aria-label={`Лайков: ${service.likes_count}`}>
            <Icon path={ICON_HEART} className="heart-icon" />
            <span className="like-count">{service.likes_count}</span>
          </div>

          <Button variant="dark" className="icon-btn next-btn" onClick={onNext} aria-label="Следующая карточка">
            <Icon path={ICON_ARROW} className="arrow-icon" />
          </Button>

          <div className="icon-btn info-btn" aria-label="КПД">
            <Icon path={ICON_BOLT} className="info-icon" />
            <span className="info-value">{formatKpd(service.kpd)}</span>
          </div>

          <div className="icon-btn info-btn" aria-label="Цена за м²">
            <Icon path={ICON_CUBE} className="info-icon" />
            <span className="info-value">{formatPrice(service.price)}</span>
          </div>
        </div>

        <div className="info-card">
          <h2>{service.title}</h2>
          <p className="desc">
            {shownText}{' '}
            {isLong && (
              <Button variant="link" className="more-link" onClick={() => setExpanded(!expanded)}>
                {expanded ? 'Меньше' : 'Ещё'}
              </Button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FeedPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (PUBLISHED_SERVICES.length === 0) {
    return (
      <div className="page-message">
        <h2>Нет опубликованных услуг</h2>
      </div>
    );
  }

  const foundIndex = PUBLISHED_SERVICES.findIndex((s) => String(s.id) === id);
  const index = foundIndex === -1 ? 0 : foundIndex;
  const service = PUBLISHED_SERVICES[index];
  const next = PUBLISHED_SERVICES[(index + 1) % PUBLISHED_SERVICES.length];

  return <FeedView key={service.id} service={service} onNext={() => navigate(`/feed/${next.id}`)} />;
}
