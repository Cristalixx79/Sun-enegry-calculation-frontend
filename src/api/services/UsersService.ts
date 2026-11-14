/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MessageOut } from '../models/MessageOut';
import type { UserLoginIn } from '../models/UserLoginIn';
import type { UserOut } from '../models/UserOut';
import type { UserRegisterIn } from '../models/UserRegisterIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Регистрация
     * Создаёт нового пользователя. Пароль сохраняется только в виде PBKDF2-хэша. Вход после регистрации не выполняется — для этого нужен `POST /api/users/login`.
     *
     * **Доступно всем.**
     * @param requestBody
     * @returns UserOut Successful Response
     * @throws ApiError
     */
    public static registerApiSolarPanelUsersRegisterPost(
        requestBody: UserRegisterIn,
    ): CancelablePromise<UserOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/solar_panel_users/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `Имя пользователя уже занято`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Аутентификация
     * Проверяет имя и пароль, создаёт сессию в Redis и выставляет cookie `session_id` (HttpOnly). После этого браузер сам отправляет cookie с остальными запросами, и становятся доступны методы создателя. Для Insomnia/Postman значение cookie можно скопировать из вкладки Application браузера в заголовок `Cookie`.
     *
     * **Доступно всем.**
     * @param requestBody
     * @returns UserOut Successful Response
     * @throws ApiError
     */
    public static loginApiSolarPanelUsersLoginPost(
        requestBody: UserLoginIn,
    ): CancelablePromise<UserOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/solar_panel_users/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Неверное имя пользователя или пароль`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Деавторизация
     * Удаляет сессию из Redis и очищает cookie. Для гостя — `401`.
     *
     * **Только создатель** (нужна сессия).
     * @returns MessageOut Successful Response
     * @throws ApiError
     */
    public static logoutApiSolarPanelUsersLogoutPost(): CancelablePromise<MessageOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/solar_panel_users/logout',
            errors: {
                401: `Гость: сессия отсутствует или истекла`,
            },
        });
    }
}
