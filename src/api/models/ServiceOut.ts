/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Полное представление услуги (лента, черновик, результат создания/публикации).
 */
export type ServiceOut = {
    id: number;
    title: string;
    description: string;
    status: string;
    kpd?: (number | null);
    price?: (number | null);
    image_url?: (string | null);
    video_url?: (string | null);
    creator_id: number;
    is_own: number;
    likes_count: number;
    created_at: string;
    updated_at: string;
};

