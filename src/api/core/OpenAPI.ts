/* Повторяет структуру файлов, которые создаёт генератор openapi-typescript-codegen (--client axios). */
/* Эти файлы перезаписываются командой `npm run generate-api`. */

export type OpenAPIConfig = {
    BASE: string;
    VERSION: string;
    WITH_CREDENTIALS: boolean;
    CREDENTIALS: 'include' | 'omit' | 'same-origin';
    HEADERS?: Record<string, string>;
};

export const OpenAPI: OpenAPIConfig = {
    BASE: '',
    VERSION: '0.4.0',
    WITH_CREDENTIALS: false,
    CREDENTIALS: 'include',
};
