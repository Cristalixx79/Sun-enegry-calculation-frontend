import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserInfo } from '../../types';

interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

/**
 * Состояние интерфейса пользователя после авторизации. Запросы входа и выхода
 * выполняются вручную через axios (src/auth/authApi.ts), а результат сюда
 * передают вызовами setUser / logout — без thunk и кодогенерации.
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserInfo>) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
