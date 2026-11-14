/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Тело запроса PUT /api/services/{id}/publish.
 *
 * Системные поля (id, status, creator_id, даты) сюда намеренно не входят —
 * клиент не может их передать/изменить.
 */
export type ServicePublishIn = {
    /**
     * Название (необязательно — иначе остаётся прежнее)
     */
    title?: (string | null);
    /**
     * Описание услуги
     */
    description?: string;
    /**
     * КПД панели, %
     */
    kpd: number;
    /**
     * Цена, ₽/м²
     */
    price: number;
};

