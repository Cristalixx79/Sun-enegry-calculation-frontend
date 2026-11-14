/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_create_service_api_solar_panel_services_post } from '../models/Body_create_service_api_solar_panel_services_post';
import type { LikeIn } from '../models/LikeIn';
import type { LikeOut } from '../models/LikeOut';
import type { ServiceListItem } from '../models/ServiceListItem';
import type { ServiceOut } from '../models/ServiceOut';
import type { ServicePublishIn } from '../models/ServicePublishIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ServicesService {
    /**
     * Список опубликованных услуг (плитка)
     * Возвращает **только опубликованные** услуги (черновики и удалённые не отдаются). Фильтрация выполняется на бэкенде: `kpd_below_than` — верхняя граница КПД.
     *
     * **Доступно всем** — результат не зависит от cookie. Для аутентифицированного пользователя поле `is_own` = 1 у его услуг, для гостя всегда 0.
     * @param kpdBelowThan Показать услуги с КПД не выше указанного, %
     * @returns ServiceListItem Successful Response
     * @throws ApiError
     */
    public static listServicesApiServicesGet(
        kpdBelowThan?: (number | null),
    ): CancelablePromise<Array<ServiceListItem>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/solar_panel_services',
            query: {
                'kpd_below_than': kpdBelowThan,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Добавить услугу (создать черновик)
     * Создаёт черновик услуги и загружает файлы изображения и короткого видео (`multipart/form-data`). Файлы сохраняются в Minio под сгенерированными латинскими именами, в БД пишутся только имена.
     *
     * Создатель (`creator_id`) **подставляется автоматически** из сессии, системные поля (id, статус, создатель, даты) с клиента не принимаются.
     *
     * **Только создатель** (нужна сессия).
     * @param formData
     * @returns ServiceOut Successful Response
     * @throws ApiError
     */
    public static createServiceApiServicesPost(
        formData: Body_create_service_api_solar_panel_services_post,
    ): CancelablePromise<ServiceOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/solar_panel_services',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                401: `Гость: сессия отсутствует или истекла (нужен вход через POST /api/users/login)`,
                409: `Недопустимый переход статуса / конфликт состояния`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Лента: первая опубликованная услуга
     * Лента без указания id — первая опубликованная услуга. **Доступно всем.**
     * @returns ServiceOut Successful Response
     * @throws ApiError
     */
    public static getFeedApiServicesFeedGet(): CancelablePromise<ServiceOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/solar_panel_services/feed',
            errors: {
                404: `Нет опубликованных услуг`,
            },
        });
    }
    /**
     * Лента: услуга по id или следующая за ней
     * Возвращает опубликованную услугу с указанным id. С параметром `next=true` возвращает следующую опубликованную услугу по кругу. **Доступно всем.**
     * @param serviceId Идентификатор услуги
     * @param next true — перейти к следующей услуге
     * @returns ServiceOut Successful Response
     * @throws ApiError
     */
    public static getFeedByIdApiServicesFeedServiceIdGet(
        serviceId: number,
        next: boolean = false,
    ): CancelablePromise<ServiceOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/solar_panel_services/feed/{service_id}',
            path: {
                'service_id': serviceId,
            },
            query: {
                'next': next,
            },
            errors: {
                404: `Услуга не найдена (или удалена)`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Черновик текущего пользователя
     * Возвращает черновик аутентифицированного пользователя (id не указывается — у пользователя не более одного черновика) или `null`, если черновика нет.
     *
     * **Только создатель** (нужна сессия).
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getMyDraftApiServicesDraftGet(): CancelablePromise<(ServiceOut | null)> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/solar_panel_services/draft',
            errors: {
                401: `Гость: сессия отсутствует или истекла (нужен вход через POST /api/users/login)`,
            },
        });
    }
    /**
     * Опубликовать услугу
     * Публикация: переводит **свой** черновик в статус `published` и сохраняет описание, КПД и цену. Обратного перехода в черновик не существует.
     *
     * Для гостя — `401`; для чужой услуги — `403`; если услуга уже не черновик — `409`.
     *
     * **Только создатель** (нужна сессия).
     * @param serviceId Идентификатор услуги
     * @param requestBody
     * @returns ServiceOut Successful Response
     * @throws ApiError
     */
    public static publishServiceApiServicesServiceIdPublishPut(
        serviceId: number,
        requestBody: ServicePublishIn,
    ): CancelablePromise<ServiceOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/solar_panel_services/{service_id}/publish',
            path: {
                'service_id': serviceId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Гость: сессия отсутствует или истекла (нужен вход через POST /api/users/login)`,
                403: `Услуга принадлежит другому пользователю`,
                404: `Услуга не найдена (или удалена)`,
                409: `Недопустимый переход статуса / конфликт состояния`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Удалить услугу (soft delete)
     * Мягкое удаление: статус услуги меняется на `deleted`, запись остаётся в БД, но больше не отдаётся клиенту. Только **своя** услуга.
     *
     * **Только создатель** (нужна сессия).
     * @param serviceId Идентификатор услуги
     * @returns void
     * @throws ApiError
     */
    public static deleteServiceApiServicesServiceIdDelete(
        serviceId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/solar_panel_services/{service_id}',
            path: {
                'service_id': serviceId,
            },
            errors: {
                401: `Гость: сессия отсутствует или истекла (нужен вход через POST /api/users/login)`,
                403: `Услуга принадлежит другому пользователю`,
                404: `Услуга не найдена (или удалена)`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Поставить или снять лайк
     * Лайк от текущего пользователя опубликованной услуге: `value = 1` ставит лайк, `value = 0` снимает. Повторный вызов ничего не дублирует.
     *
     * **Только создатель** (нужна сессия).
     * @param serviceId Идентификатор услуги
     * @param requestBody
     * @returns LikeOut Successful Response
     * @throws ApiError
     */
    public static likeServiceApiServicesServiceIdLikePost(
        serviceId: number,
        requestBody: LikeIn,
    ): CancelablePromise<LikeOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/solar_panel_services/{service_id}/like',
            path: {
                'service_id': serviceId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Гость: сессия отсутствует или истекла (нужен вход через POST /api/users/login)`,
                404: `Услуга не найдена (или удалена)`,
                422: `Validation Error`,
            },
        });
    }
}
