import { createSlice, isPending, isRejected } from '@reduxjs/toolkit';
import type { ServiceListItem, ServiceOut } from '../../api';
import type { DataSource } from '../../types';
import {
  createSolarPanel,
  deleteSolarPanel,
  fetchSolarPanelDraft,
  fetchSolarPanelFeed,
  fetchSolarPanels,
  likeSolarPanel,
  publishSolarPanel,
} from '../thunks/solarPanelsThunks';
import { logout } from './authSlice';

interface SolarPanelsState {
  /** Список для плитки */
  items: ServiceListItem[];
  /** Панель, показанная в ленте */
  feed: ServiceOut | null;
  /** Черновик текущего создателя */
  draft: ServiceOut | null;
  /** Панели, которым пользователь поставил лайк в этой сессии интерфейса */
  likedIds: number[];
  source: DataSource;
  error: string | null;
}

const initialState: SolarPanelsState = {
  items: [],
  feed: null,
  draft: null,
  likedIds: [],
  source: 'api',
  error: null,
};

const solarPanelsSlice = createSlice({
  name: 'solarPanels',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSolarPanels.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.source = action.payload.source;
      })
      .addCase(fetchSolarPanelFeed.fulfilled, (state, action) => {
        state.feed = action.payload.feed;
        state.source = action.payload.source;
      })
      .addCase(fetchSolarPanelDraft.fulfilled, (state, action) => {
        state.draft = action.payload;
      })
      .addCase(createSolarPanel.fulfilled, (state, action) => {
        state.draft = action.payload;
      })
      .addCase(publishSolarPanel.fulfilled, (state) => {
        state.draft = null;
      })
      .addCase(deleteSolarPanel.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter((item) => item.id !== id);
        if (state.draft && state.draft.id === id) state.draft = null;
        if (state.feed && state.feed.id === id) state.feed = null;
      })
      .addCase(likeSolarPanel.fulfilled, (state, action) => {
        const { service_id, liked, likes_count } = action.payload;
        const item = state.items.find((i) => i.id === service_id);
        if (item) item.likes_count = likes_count;
        if (state.feed && state.feed.id === service_id) state.feed.likes_count = likes_count;
        const already = state.likedIds.includes(service_id);
        if (liked && !already) state.likedIds.push(service_id);
        if (!liked && already) state.likedIds = state.likedIds.filter((id) => id !== service_id);
      })
      // выход из системы: данные пользователя (в том числе признак is_own) сбрасываются
      .addCase(logout, () => initialState)
      .addMatcher(isPending, (state) => {
        state.error = null;
      })
      .addMatcher(isRejected, (state, action) => {
        state.error = (action.payload as string | undefined) ?? action.error.message ?? 'Ошибка запроса';
      });
  },
});

export const { clearError } = solarPanelsSlice.actions;
export default solarPanelsSlice.reducer;
