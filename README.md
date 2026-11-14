# Vibes — фронтенд (Лабораторная работа №6)

SPA на React + TypeScript с компонентами React-Bootstrap. Данные берутся из веб-сервиса
(FastAPI), состояние хранится в Redux Toolkit, запросы идут через axios и клиент,
сгенерированный по Swagger. Дизайн перенесён из лабораторной №1.

## Запуск

Нужен Node.js 18 и новее. Бэкенд, PostgreSQL, Redis и MinIO запускаются отдельно
(см. проект бэкенда и `docker-compose.yml`).

```
npm install
npm run dev        # http://localhost:5173
npm run build      # проверка типов и сборка в папку dist
npm run preview    # просмотр собранной версии (с тем же прокси)
npm run generate-api   # перегенерировать клиент API (бэкенд должен быть запущен)
```

Без запущенного бэкенда приложение тоже открывается: гость видит данные из mock-коллекции
(вверху показывается метка «Демо-данные: бэкенд недоступен»).

Для расширения браузера **Redux DevTools** хранилище подключается автоматически
в режиме разработки.

## Прокси (вместо CORS)

Браузер обращается только к адресу приложения, а Vite пересылает запросы
(`vite.config.ts`):

| Маршрут | Куда |
|---|---|
| `/api/...` (`/api/solar_panel_services`, `/api/solar_panel_users`) | FastAPI, `http://127.0.0.1:8000` |
| `/s3/...` | MinIO, `http://127.0.0.1:9000` (изображения и видео услуг) |

Бэкенд отдаёт в `image_url` и `video_url` прямой адрес MinIO
(`http://localhost:9000/solar-panels/...`). Функция `toS3Proxy` (`src/utils/media.ts`)
переписывает такой адрес на `/s3/solar-panels/...`. Если MinIO у вас на другом адресе,
скопируйте `.env.example` в `.env` и поправьте `VITE_S3_ORIGIN`.

Чтобы картинки открывались в браузере, у бакета в MinIO должно быть разрешено анонимное
чтение: веб-консоль `http://localhost:9001` → Buckets → `solar-panels` → Access Policy → Public.

## Кодогенерация клиента API (axios)

Клиент генерируется по Swagger бэкенда (`/openapi.json`) утилитой
`openapi-typescript-codegen` с клиентом axios:

```
npm run generate-api
```

Результат — папка `src/api`: `core/request.ts` (вызовы axios, класс `ApiError`),
`models/` (типы `ServiceOut`, `ServiceListItem`, `LikeOut` и другие) и
`services/ServicesService.ts` (методы доменов услуг, например
`ServicesService.listServicesApiServicesGet`). Имена методов берутся из `operationId`,
который FastAPI формирует сам.

Имена методов клиента формируются из `operationId`, который FastAPI собирает из имени
функции и адреса. Проект рассчитан на такие имена методов:

| Метод клиента | Метод веб-сервиса |
|---|---|
| `listServicesApiServicesGet` | `GET /api/solar_panel_services` |
| `createServiceApiServicesPost` | `POST /api/solar_panel_services` |
| `getFeedApiServicesFeedGet` | `GET /api/solar_panel_services/feed` |
| `getFeedByIdApiServicesFeedServiceIdGet` | `GET /api/solar_panel_services/feed/{id}` |
| `getMyDraftApiServicesDraftGet` | `GET /api/solar_panel_services/draft` |
| `publishServiceApiServicesServiceIdPublishPut` | `PUT /api/solar_panel_services/{id}/publish` |
| `deleteServiceApiServicesServiceIdDelete` | `DELETE /api/solar_panel_services/{id}` |
| `likeServiceApiServicesServiceIdLikePost` | `POST /api/solar_panel_services/{id}/like` |

Если после `npm run generate-api` имена получились другими (например, с `SolarPanelServices`
в середине), задайте их на бэкенде параметром `operation_id` у каждого метода роутера,
например `@router.get("", operation_id="list_services_api_services_get")`, и сгенерируйте клиент заново.

В репозитории лежит подготовленный вариант `src/api`, повторяющий структуру вывода
генератора, чтобы проект запускался сразу. Запустите `npm run generate-api` при работающем
бэкенде — файлы будут заменены настоящими сгенерированными, остальной код менять не нужно.
Папка `src/api` генератором очищается, поэтому ручной код (авторизация, настройка) лежит
вне её: `src/auth/authApi.ts`, `src/apiConfig.ts`.

## Redux Toolkit

Хранилище — `src/store/index.ts`, типизированные хуки — `src/store/hooks.ts`.

| Срез (`src/store/slices`) | Что хранит |
|---|---|
| `filtersSlice` | фильтр по КПД: положение ползунка `kpdMax` и применённое значение `appliedKpd`; сбрасывается при выходе |
| `authSlice` | состояние интерфейса после входа: `isAuthenticated`, `user` |
| `solarPanelsSlice` | список для плитки, панель в ленте, черновик, лайки сессии, источник данных (`api` / `mock`), ошибка |
| `uiSlice` | число выполняющихся запросов — по нему показывается анимация загрузки |

### Thunk-и (`src/store/thunks/solarPanelsThunks.ts`)

Названы по теме, внутри вызывают методы сгенерированного клиента.

| Thunk | Метод веб-сервиса |
|---|---|
| `fetchSolarPanels` | `GET /api/solar_panel_services?kpd_below_than=` |
| `fetchSolarPanelFeed` | `GET /api/solar_panel_services/feed` и `/feed/{id}?next=` |
| `fetchSolarPanelDraft` | `GET /api/solar_panel_services/draft` |
| `createSolarPanel` | `POST /api/solar_panel_services` (multipart: название, изображение, видео) |
| `publishSolarPanel` | `PUT /api/solar_panel_services/{id}/publish` |
| `deleteSolarPanel` | `DELETE /api/solar_panel_services/{id}` |
| `likeSolarPanel` | `POST /api/solar_panel_services/{id}/like` |

Если бэкенд недоступен (нет ответа или ответ 5xx), thunk-и чтения для **гостя** берут данные
из mock-коллекции (`src/mocks`). Для вошедшего пользователя mock не используется,
показывается ошибка.

### Авторизация (без thunk и кодогенерации)

Вход и выход выполняются вручную через axios (`src/auth/authApi.ts`, адреса `/api/solar_panel_users/login` и `/logout`),
а результат в Redux передаётся вызовами `setUser` и `logout`: вход — в `LoginPage`,
выход — в `BottomNav`. Сессия хранится на сервере (Redis), идентификатор — в HttpOnly-cookie
`session_id`; Redux при обновлении страницы (F5) возвращается в состояние гостя, а cookie остаётся.

### Анимация загрузки

Пока выполняется любой thunk, поверх приложения показывается индикатор загрузки
(`LoadingOverlay`). Он перекрывает страницу, поэтому кнопки нажать нельзя; кнопки и поля форм
дополнительно отключаются. На страницах входа и выхода индикатор показывается на самой кнопке.

## Фото и видео

- **Фото в mock-коллекции:** `src/assets/photos/photo-<id>.jpg` — замените файлы своими под теми же
  именами. Изображение по умолчанию: `src/assets/default-panel.jpg`.
- **Видео по умолчанию для ленты:** `src/assets/default-video.mp4` — замените своим файлом.
  Видео проигрывается на заднем фоне, без звука и по кругу.
- Для услуг из веб-сервиса используются файлы из MinIO; если у услуги нет изображения или
  видео, подставляются значения по умолчанию.

## Страницы приложения

| Адрес | Страница | Кому доступна |
|---|---|---|
| `/#/feed`, `/#/feed/:id` | Лента | гость, пользователь |
| `/#/tiles` | Плитка | гость, пользователь |
| `/#/add` | Добавление услуги | пользователь (гость перенаправляется на вход) |
| `/#/login` | Вход | гость |
| любой другой | «Страница не найдена» (изображение по умолчанию) | все |

### Нижняя навигация

| Пункт | Гость | Пользователь |
|---|---|---|
| Лента | переход на `/#/feed` | то же |
| Добавление | отключён | переход на `/#/add` |
| Плитка | переход на `/#/tiles` | то же |
| Вход / Выход | **Вход** — переход на `/#/login` | **Выход** — запрос выхода, сброс состояния и фильтра, переход на ленту |

### Лента

- **Видео** на заднем фоне (из MinIO или по умолчанию), без звука, по кругу.
- **Лайк** (сердце и число): у пользователя ставит или снимает лайк; у гостя ведёт на страницу входа.
- **Кнопка «Следующая карточка»** — следующая услуга по кругу, адрес меняется на `/#/feed/{id}`.
- **КПД** и **цена** — иконки со значениями.
- **Карточка внизу** — название и описание; длинное описание раскрывается кнопкой «Ещё» / «Меньше».

### Плитка

- **Ползунок «Фильтр по КПД»** (0–40 %) и кнопка **«Отфильтровать»** — применённое значение уходит
  в запрос к бэкенду параметром `kpd_below_than`. Рядом показывается «Найдено: N».
- **Карточки** (две колонки): изображение, название, цена, КПД, число лайков. Нажатие открывает
  услугу в ленте.
- **Кнопка «×»** на карточке — удаление (мягкое), только у пользователя и только на его собственных
  услугах (признак `is_own`).
- Если ничего не найдено — сообщение «Ничего не найдено».

### Добавление услуги

Страница показывает один из двух шагов:

1. **Нет черновика** — форма: поле загрузки **Изображение**, поле загрузки **Видео**, поле
   **Тип панели**, кнопка **«Далее»** (создаёт черновик). После выбора файла под полем сразу
   показывается его превью: картинка или видео с кнопками воспроизведения.
2. **Есть черновик** — просмотр загруженных изображения и видео и форма: **Тип панели**, **Описание**,
   **КПД (%)**, **Цена (₽/м²)**, кнопка **«Опубликовать»** (после успеха — переход на плитку).

### Вход

Поля **Имя пользователя** и **Пароль**, кнопка **«Войти»**. Ошибки (неверный пароль, нет связи
с сервером) показываются над формой. Регистрации в интерфейсе нет: пользователя создают на
бэкенде методом `POST /api/solar_panel_users/register` (например, в Swagger или Insomnia).

## Структура

```
src/
  main.tsx, App.tsx          точка входа (Provider, HashRouter), маршруты
  apiConfig.ts               настройка клиента API
  api/                       клиент API, созданный кодогенерацией
  auth/authApi.ts            вход и выход (axios вручную)
  store/                     Redux Toolkit: срезы, thunk-и, хуки
  mocks/                     mock-коллекция и запасные функции для гостя
  utils/                     media (по умолчанию, прокси S3), errors, filter, format
  components/                BottomNav, BackgroundVideo, KpdFilter, ServiceCard,
                             LoadingOverlay, StatusBar, Icon
  pages/                     FeedPage, TilesPage, AddPage, LoginPage, NotFoundPage
  styles/app.css             стили из лабораторной №1
```

## Ограничения

- Бэкенд не сообщает, поставил ли текущий пользователь лайк, поэтому «лайкнуто» запоминается
  в Redux только в рамках открытой страницы; после F5 оно забывается.
- Redux и React Context: Context в коде приложения не создаётся и не читается (он есть только внутри
  библиотек react-redux, react-router и react-bootstrap).
