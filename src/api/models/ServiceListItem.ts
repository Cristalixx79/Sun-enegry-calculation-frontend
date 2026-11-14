/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Элемент списка/плитки — только опубликованные услуги.
 */
export type ServiceListItem = {
    id: number;
    title: string;
    price?: (number | null);
    kpd?: (number | null);
    image_url?: (string | null);
    video_url?: (string | null);
    likes_count: number;
    /**
     * 1, если создатель услуги — текущий пользователь, иначе 0
     */
    is_own: number;
};

