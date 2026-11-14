import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import type { ServiceOut } from '../api';
import BackgroundVideo from '../components/BackgroundVideo';
import Icon from '../components/Icon';
import { ICON_ARROW, ICON_BOLT, ICON_CUBE, ICON_HEART } from '../components/icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectIsBusy } from '../store/slices/uiSlice';
import { fetchSolarPanelFeed, likeSolarPanel } from '../store/thunks/solarPanelsThunks';
import { formatKpd, formatPrice } from '../utils/format';
import { resolveImage, resolveVideo } from '../utils/media';

/** Сколько символов описания показывается до нажатия «Ещё» */
const DESCRIPTION_LIMIT = 80;

interface FeedViewProps {
  service: ServiceOut;
  liked: boolean;
  disabled: boolean;
  onNext: () => void;
  onLike: () => void;
}

function FeedView({ service, liked, disabled, onNext, onLike }: FeedViewProps) {
  // Локальное состояние компонента: раскрыто ли полное описание
  const [expanded, setExpanded] = useState(false);

  const description = service.description;
  const isLong = description.length > DESCRIPTION_LIMIT;
  const shownText =
    expanded || !isLong ? description : `${description.slice(0, DESCRIPTION_LIMIT)}...`;

  return (
    <div className="feed">
      <BackgroundVideo src={resolveVideo(service.video_url)} poster={resolveImage(service.image_url)} />

      <div className="content-overlay">
        <div className="icon-stack">
          <Button
            variant="dark"
            className={`icon-btn like-btn${liked ? ' liked' : ''}`}
            disabled={disabled}
            onClick={onLike}
            aria-label={liked ? 'Снять лайк' : 'Поставить лайк'}
            aria-pressed={liked}
          >
            <Icon path={ICON_HEART} className="heart-icon" />
            <span className="like-count">{service.likes_count}</span>
          </Button>

          <Button
            variant="dark"
            className="icon-btn next-btn"
            disabled={disabled}
            onClick={onNext}
            aria-label="Следующая карточка"
          >
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
  const dispatch = useAppDispatch();

  const feed = useAppSelector((s) => s.solarPanels.feed);
  const likedIds = useAppSelector((s) => s.solarPanels.likedIds);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const isBusy = useAppSelector(selectIsBusy);

  const numericId = id === undefined ? undefined : Number(id);

  // Загружаем панель при открытии страницы или смене адреса. Если нужная
  // панель уже загружена (после кнопки «Следующая»), повторный запрос не нужен.
  useEffect(() => {
    if (numericId !== undefined && feed !== null && feed.id === numericId) return;
    dispatch(fetchSolarPanelFeed({ id: numericId, allowMock: !isAuthenticated }));
    // эффект зависит только от адреса страницы
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numericId]);

  async function handleNext() {
    if (feed === null) return;
    const result = await dispatch(
      fetchSolarPanelFeed({ id: feed.id, next: true, allowMock: !isAuthenticated }),
    );
    if (fetchSolarPanelFeed.fulfilled.match(result)) {
      navigate(`/feed/${result.payload.feed.id}`);
    }
  }

  function handleLike() {
    if (feed === null) return;
    // Гость поставить лайк не может — отправляем на страницу входа
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const liked = likedIds.includes(feed.id);
    dispatch(likeSolarPanel({ id: feed.id, value: liked ? 0 : 1 }));
  }

  if (feed === null) {
    return isBusy ? null : (
      <div className="page-message">
        <h2>Нет опубликованных услуг</h2>
      </div>
    );
  }

  // key сбрасывает локальное состояние (раскрытое описание) при смене услуги
  return (
    <FeedView
      key={feed.id}
      service={feed}
      liked={likedIds.includes(feed.id)}
      disabled={isBusy}
      onNext={handleNext}
      onLike={handleLike}
    />
  );
}
