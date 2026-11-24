export type Body_create_service_api_services_post = {
    /**
     * Тип/название панели
     */
    title: string;
    /**
     * Изображение панели
     */
    image?: (Blob | null);
    /**
     * Короткое видео панели
     */
    video?: (Blob | null);
};
