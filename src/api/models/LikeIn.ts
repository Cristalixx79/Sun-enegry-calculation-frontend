/**
 * Тело запроса POST /api/solar_panel_services/{id}/like.
 */
export type LikeIn = {
    /**
     * 1 — поставить лайк, 0 — снять лайк
     */
    value: number;
};
