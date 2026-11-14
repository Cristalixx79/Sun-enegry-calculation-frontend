import axios from 'axios';
import type { UserInfo } from '../types';

/**
 * Запросы входа и выхода — только axios, вручную, без кодогенерации и без thunk.
 * Результат в Redux передаёт тот, кто вызвал функцию (LoginPage, BottomNav).
 */
const http = axios.create({ withCredentials: true });

/** Адрес домена пользователей на бэкенде (проксируется Vite, см. vite.config.ts) */
const USERS_URL = '/api/solar_panel_users';

export async function loginRequest(username: string, password: string): Promise<UserInfo> {
  const { data } = await http.post<UserInfo>(`${USERS_URL}/login`, { username, password });
  return data;
}

export async function logoutRequest(): Promise<void> {
  await http.post(`${USERS_URL}/logout`);
}

/** Понятное сообщение об ошибке для формы входа */
export function authErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Нет связи с сервером. Проверьте, что бэкенд запущен.';
    const detail = (error.response.data as { detail?: unknown } | undefined)?.detail;
    if (typeof detail === 'string') return detail;
    if (error.response.status === 422) return 'Проверьте введённые данные: имя от 3 символов, пароль от 6.';
    if (error.response.status >= 500) return 'Сервер временно недоступен.';
  }
  return 'Не удалось выполнить запрос.';
}
