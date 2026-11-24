/* Повторяет index.ts генератора: единая точка импорта клиента API. */
export { ApiError } from './core/ApiError';
export { OpenAPI } from './core/OpenAPI';
export type { OpenAPIConfig } from './core/OpenAPI';

export type { Body_create_service_api_services_post } from './models/Body_create_service_api_services_post';
export type { LikeIn } from './models/LikeIn';
export type { LikeOut } from './models/LikeOut';
export type { ServiceListItem } from './models/ServiceListItem';
export type { ServiceOut } from './models/ServiceOut';
export type { ServicePublishIn } from './models/ServicePublishIn';

export { ServicesService } from './services/ServicesService';
