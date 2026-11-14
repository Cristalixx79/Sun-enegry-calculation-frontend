import { createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface UiState {
  /** Сколько запросов (thunk) выполняется сейчас */
  pending: number;
}

const initialState: UiState = { pending: 0 };

/**
 * Считает выполняющиеся запросы. Пока их больше нуля, на странице показывается
 * анимация загрузки, которая блокирует кнопки.
 */
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state) => {
        state.pending += 1;
      })
      .addMatcher(isFulfilled, (state) => {
        state.pending = Math.max(0, state.pending - 1);
      })
      .addMatcher(isRejected, (state) => {
        state.pending = Math.max(0, state.pending - 1);
      });
  },
});

export const selectIsBusy = (state: RootState): boolean => state.ui.pending > 0;
export default uiSlice.reducer;
