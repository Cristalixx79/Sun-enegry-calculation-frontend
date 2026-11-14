import axios from 'axios';
import { ApiError } from '../api';

/** Бэкенд недоступен: нет ответа вообще или сервер ответил ошибкой 5xx (в том числе от прокси) */
export function isBackendUnavailable(error: unknown): boolean {
  if (error instanceof ApiError) return error.status >= 500;
  return axios.isAxiosError(error) && error.response === undefined;
}

/** Текст ошибки для пользователя */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const body = error.body as { detail?: unknown } | undefined;
    if (body && typeof body.detail === 'string') return body.detail;
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Неизвестная ошибка';
}
