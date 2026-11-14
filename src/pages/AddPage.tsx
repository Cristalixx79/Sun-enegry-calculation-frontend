import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import type { ServiceOut } from '../api';
import Icon from '../components/Icon';
import { ICON_PLUS } from '../components/icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectIsBusy } from '../store/slices/uiSlice';
import { createSolarPanel, fetchSolarPanelDraft, publishSolarPanel } from '../store/thunks/solarPanelsThunks';
import { resolveImage, resolveVideo } from '../utils/media';

interface UploadBoxProps {
  id: string;
  label: string;
  placeholder: string;
  accept: string;
  /** Что показывать в превью: изображение или видео */
  kind: 'image' | 'video';
  file: File | null;
  disabled: boolean;
  onChange: (file: File | null) => void;
}

/**
 * Поле загрузки файла в виде кликабельного блока (как на странице из лабораторной №1).
 * После выбора файла под блоком сразу показывается его превью (локально, без отправки).
 */
function UploadBox({ id, label, placeholder, accept, kind, file, disabled, onChange }: UploadBoxProps) {
  // Адрес для превью выбранного файла; при смене файла и при закрытии страницы освобождается
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.files?.[0] ?? null);
  }

  return (
    <Form.Group className="form-block">
      <Form.Label>{label}</Form.Label>
      <label className={`upload-box${file ? ' has-file' : ''}`} htmlFor={id}>
        <input
          type="file"
          id={id}
          accept={accept}
          disabled={disabled}
          className="file-input"
          onChange={handleChange}
        />
        <Icon path={ICON_PLUS} className="upload-icon" />
        <span className="file-name">{file ? file.name : placeholder}</span>
      </label>

      {previewUrl && (
        <div className="media-preview selected-preview">
          {kind === 'image' ? (
            <img src={previewUrl} alt="Превью изображения" className="media-preview-img" />
          ) : (
            <video src={previewUrl} className="media-preview-img" controls muted playsInline />
          )}
        </div>
      )}
    </Form.Group>
  );
}

/** Шаг 1: у создателя нет черновика — форма создания (изображение, видео, тип панели) */
function CreateDraftForm({ disabled }: { disabled: boolean }) {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch(createSolarPanel({ title: title.trim(), image, video }));
  }

  return (
    <Form onSubmit={handleSubmit}>
      <UploadBox
        id="image-input"
        label="Изображение"
        placeholder="Загрузить изображение"
        accept="image/*"
        kind="image"
        file={image}
        disabled={disabled}
        onChange={setImage}
      />
      <UploadBox
        id="video-input"
        label="Видео"
        placeholder="Загрузить видео"
        accept="video/*"
        kind="video"
        file={video}
        disabled={disabled}
        onChange={setVideo}
      />
      <Form.Group className="form-block" controlId="panel-type">
        <Form.Label>Тип панели</Form.Label>
        <Form.Control
          type="text"
          placeholder="Монокристаллическая панель"
          required
          maxLength={100}
          value={title}
          disabled={disabled}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Form.Group>
      <Button type="submit" variant="success" className="btn-accent btn-wide" disabled={disabled}>
        Далее
      </Button>
    </Form>
  );
}

/** Шаг 2: черновик есть — форма публикации (описание, КПД, цена) */
function PublishDraftForm({ draft, disabled }: { draft: ServiceOut; disabled: boolean }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [title, setTitle] = useState(draft.title);
  const [description, setDescription] = useState(draft.description);
  const [kpd, setKpd] = useState(draft.kpd != null ? String(draft.kpd) : '');
  const [price, setPrice] = useState(draft.price != null ? String(draft.price) : '');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = await dispatch(
      publishSolarPanel({
        id: draft.id,
        body: { title: title.trim(), description: description.trim(), kpd: Number(kpd), price: Number(price) },
      }),
    );
    if (publishSolarPanel.fulfilled.match(result)) navigate('/tiles');
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="form-block">
        <Form.Label>Изображение</Form.Label>
        <div className="media-preview">
          <img src={resolveImage(draft.image_url)} alt="Изображение панели" className="media-preview-img" />
        </div>
      </Form.Group>
      <Form.Group className="form-block">
        <Form.Label>Видео</Form.Label>
        <div className="media-preview">
          <video
            src={resolveVideo(draft.video_url)}
            poster={resolveImage(draft.image_url)}
            className="media-preview-img"
            controls
            muted
            playsInline
          />
        </div>
      </Form.Group>

      <Form.Group className="form-block" controlId="publish-title">
        <Form.Label>Тип панели</Form.Label>
        <Form.Control
          type="text"
          required
          maxLength={100}
          value={title}
          disabled={disabled}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="form-block" controlId="publish-description">
        <Form.Label>Описание</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          maxLength={500}
          placeholder="Краткое описание"
          value={description}
          disabled={disabled}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="form-block" controlId="publish-kpd">
        <Form.Label>КПД (%)</Form.Label>
        <Form.Control
          type="number"
          min={0}
          max={100}
          step={1}
          required
          placeholder="22"
          value={kpd}
          disabled={disabled}
          onChange={(e) => setKpd(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="form-block" controlId="publish-price">
        <Form.Label>Цена (₽/м²)</Form.Label>
        <Form.Control
          type="number"
          min={0}
          step="any"
          required
          placeholder="5000"
          value={price}
          disabled={disabled}
          onChange={(e) => setPrice(e.target.value)}
        />
      </Form.Group>

      <Button type="submit" variant="success" className="btn-accent btn-wide" disabled={disabled}>
        Опубликовать
      </Button>
    </Form>
  );
}

/** Страница добавления услуги: только для пользователя (создателя) */
export default function AddPage() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const draft = useAppSelector((s) => s.solarPanels.draft);
  const isBusy = useAppSelector(selectIsBusy);
  // true, когда запрос черновика завершён
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchSolarPanelDraft()).then(() => setLoaded(true));
    }
  }, [dispatch, isAuthenticated]);

  // Гость на эту страницу попасть не может — отправляем на страницу входа
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <>
      <header className="form-page-header">
        <h1>{draft ? 'Публикация панели' : 'Черновик панели'}</h1>
      </header>
      <main className="form-scroll">
        {loaded && (draft ? (
          <PublishDraftForm key={draft.id} draft={draft} disabled={isBusy} />
        ) : (
          <CreateDraftForm disabled={isBusy} />
        ))}
      </main>
    </>
  );
}
