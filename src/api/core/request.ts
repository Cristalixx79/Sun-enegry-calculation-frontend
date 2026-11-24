import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

import { ApiError } from './ApiError';
import type { ApiRequestOptions } from './ApiRequestOptions';
import type { OpenAPIConfig } from './OpenAPI';

const isDefined = <T>(value: T | null | undefined): value is Exclude<T, null | undefined> =>
    value !== undefined && value !== null;

const getUrl = (config: OpenAPIConfig, options: ApiRequestOptions): string => {
    const path = options.url.replace(/{(.*?)}/g, (substring: string, group: string) => {
        if (options.path && group in options.path) {
            return encodeURI(String(options.path[group]));
        }
        return substring;
    });
    return `${config.BASE}${path}`;
};

const getQuery = (query?: Record<string, unknown>): Record<string, unknown> | undefined => {
    if (!query) return undefined;
    return Object.fromEntries(Object.entries(query).filter(([, value]) => isDefined(value)));
};

const getFormData = (options: ApiRequestOptions): FormData | undefined => {
    if (!options.formData) return undefined;
    const formData = new FormData();
    Object.entries(options.formData)
        .filter(([, value]) => isDefined(value))
        .forEach(([key, value]) => {
            if (value instanceof Blob) {
                formData.append(key, value);
            } else {
                formData.append(key, String(value));
            }
        });
    return formData;
};

const catchErrorCodes = (options: ApiRequestOptions, response: AxiosResponse, url: string): void => {
    const errors: Record<number, string> = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        500: 'Internal Server Error',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        ...options.errors,
    };

    const status = response.status;
    const ok = status >= 200 && status < 300;
    if (!ok) {
        const error = errors[status];
        throw new ApiError(
            options,
            { url, ok, status, statusText: response.statusText, body: response.data },
            error ?? 'Generic Error',
        );
    }
};

/**
 * Запрос к API через axios (так же, как в коде, который создаёт генератор).
 * Ответы с кодами не 2xx превращаются в ApiError; сетевая ошибка (нет ответа)
 * пробрасывается как есть.
 */
export async function request<T>(config: OpenAPIConfig, options: ApiRequestOptions): Promise<T> {
    const url = getUrl(config, options);
    const formData = getFormData(options);

    const headers: Record<string, string> = { Accept: 'application/json', ...config.HEADERS };
    if (formData === undefined && options.body !== undefined) {
        headers['Content-Type'] = options.mediaType ?? 'application/json';
    }

    const axiosConfig: AxiosRequestConfig = {
        url,
        method: options.method,
        headers,
        params: getQuery(options.query),
        data: formData ?? options.body,
        withCredentials: config.WITH_CREDENTIALS,
    };

    let response: AxiosResponse;
    try {
        response = await axios.request(axiosConfig);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            response = error.response;
        } else {
            throw error;
        }
    }

    catchErrorCodes(options, response, url);
    return response.data as T;
}
