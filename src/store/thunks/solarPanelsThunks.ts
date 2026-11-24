import { createAsyncThunk } from '@reduxjs/toolkit';
import { ServicesService } from '../../api';
import type { LikeOut, ServiceListItem, ServiceOut, ServicePublishIn } from '../../api';
import { MOCK_ONLY } from '../../config';
import { mockFeed, mockListItems } from '../../mocks/mockApi';
import type { DataSource } from '../../types';
import { getErrorMessage, isBackendUnavailable } from '../../utils/errors';

/**
 * Thunk-и домена услуг (солнечных панелей). Запросы к веб-сервису выполняет
 * сгенерированный клиент (src/api, ServicesService), thunk-и называются по теме.
 *
 * Для гостя при недоступном бэкенде данные берутся из mock-коллекции
 * (аргумент allowMock = true только у гостя). В режиме MOCK_ONLY (GitHub Pages)
 * запросов к бэкенду нет вообще.
 */

type ThunkConfig = { rejectValue: string };

/** Список панелей с фильтром по КПД (плитка) */
export const fetchSolarPanels = createAsyncThunk<
  { items: ServiceListItem[]; source: DataSource },
  { kpdMax: number; allowMock: boolean },
  ThunkConfig
>('solarPanels/fetchAll', async ({ kpdMax, allowMock }, { rejectWithValue }) => {
  if (MOCK_ONLY) return { items: mockListItems(kpdMax), source: 'mock' };
  try {
    const items = await ServicesService.listServicesApiServicesGet(kpdMax);
    return { items, source: 'api' };
  } catch (error) {
    if (allowMock && isBackendUnavailable(error)) {
      return { items: mockListItems(kpdMax), source: 'mock' };
    }
    return rejectWithValue(getErrorMessage(error));
  }
});

/** Лента: первая панель, панель по id или следующая после id (next = true) */
export const fetchSolarPanelFeed = createAsyncThunk<
  { feed: ServiceOut; source: DataSource },
  { id?: number; next?: boolean; allowMock: boolean },
  ThunkConfig
>('solarPanels/fetchFeed', async ({ id, next = false, allowMock }, { rejectWithValue }) => {
  if (MOCK_ONLY) return { feed: mockFeed(id, next), source: 'mock' };
  try {
    const feed =
      id === undefined
        ? await ServicesService.getFeedApiServicesFeedGet()
        : await ServicesService.getFeedByIdApiServicesFeedServiceIdGet(id, next);
    return { feed, source: 'api' };
  } catch (error) {
    if (allowMock && isBackendUnavailable(error)) {
      return { feed: mockFeed(id, next), source: 'mock' };
    }
    return rejectWithValue(getErrorMessage(error));
  }
});

/** Черновик текущего создателя (или null, если черновика нет) */
export const fetchSolarPanelDraft = createAsyncThunk<ServiceOut | null, void, ThunkConfig>(
  'solarPanels/fetchDraft',
  async (_, { rejectWithValue }) => {
    try {
      return await ServicesService.getMyDraftApiServicesDraftGet();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/** Создание черновика панели с изображением и видео (multipart/form-data) */
export const createSolarPanel = createAsyncThunk<
  ServiceOut,
  { title: string; image: File | null; video: File | null },
  ThunkConfig
>('solarPanels/create', async ({ title, image, video }, { rejectWithValue }) => {
  try {
    return await ServicesService.createServiceApiServicesPost({ title, image, video });
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

/** Публикация черновика: draft -> published */
export const publishSolarPanel = createAsyncThunk<
  ServiceOut,
  { id: number; body: ServicePublishIn },
  ThunkConfig
>('solarPanels/publish', async ({ id, body }, { rejectWithValue }) => {
  try {
    return await ServicesService.publishServiceApiServicesServiceIdPublishPut(id, body);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

/** Удаление своей панели (soft delete); возвращает id удалённой панели */
export const deleteSolarPanel = createAsyncThunk<number, number, ThunkConfig>(
  'solarPanels/delete',
  async (id, { rejectWithValue }) => {
    try {
      await ServicesService.deleteServiceApiServicesServiceIdDelete(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/** Поставить (value = 1) или снять (value = 0) лайк */
export const likeSolarPanel = createAsyncThunk<LikeOut, { id: number; value: 0 | 1 }, ThunkConfig>(
  'solarPanels/like',
  async ({ id, value }, { rejectWithValue }) => {
    try {
      return await ServicesService.likeServiceApiServicesServiceIdLikePost(id, { value });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
