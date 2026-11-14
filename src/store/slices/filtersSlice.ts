import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_KPD } from '../../utils/filter';
import { logout } from './authSlice';

interface FiltersState {
  /** Положение ползунка */
  kpdMax: number;
  /** Значение, применённое кнопкой «Отфильтровать» (уходит в запрос к бэкенду) */
  appliedKpd: number;
}

const initialState: FiltersState = {
  kpdMax: DEFAULT_KPD,
  appliedKpd: DEFAULT_KPD,
};

/** Хранит фильтр услуг в Redux. При выходе из системы сбрасывается. */
const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setKpdMax(state, action: PayloadAction<number>) {
      state.kpdMax = action.payload;
    },
    applyKpd(state) {
      state.appliedKpd = state.kpdMax;
    },
    resetFilters() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const { setKpdMax, applyKpd, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
