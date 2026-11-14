import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import filtersReducer from './slices/filtersSlice';
import solarPanelsReducer from './slices/solarPanelsSlice';
import uiReducer from './slices/uiSlice';

/** Хранилище Redux Toolkit. В режиме разработки подключается redux-devtools. */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    filters: filtersReducer,
    solarPanels: solarPanelsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
