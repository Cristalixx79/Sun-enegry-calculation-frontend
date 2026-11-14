/** Данные пользователя, которые возвращает метод входа и хранит Redux */
export interface UserInfo {
  id: number;
  username: string;
}

/** Откуда получены данные: из веб-сервиса или из mock-коллекции */
export type DataSource = 'api' | 'mock';
