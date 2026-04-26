# Fit Yourself — лендинг фитнес-тренера

Адаптивный сайт-визитка с онлайн-записью, админ-панелью через Supabase и Telegram-уведомлениями.

## 🚀 Технологии

- **React 19** + **Vite** — быстрая сборка и разработка
- **Tailwind CSS** — утилитарные стили, кастомная тёмная тема
- **Supabase** — база данных, хранение контента, файловое хранилище (бакеты)
- **Telegram Bot API** — уведомления тренеру о новых заявках
- **Vercel** — хостинг, автодеплой из GitHub

## 📁 Структура проекта

```
src/
├── components/
│   ├── Layout/          # Header, Footer
│   ├── Sections/        # Hero, Services, Benefits, AboutTrainer, BookingForm
│   └── UI/              # Modal
├── pages/               # MainPage, ServiceDetailPage, TrainerPage, PrivacyPage, OfferPage, NotFoundPage
├── services/            # supabase.js
├── utils/               # scrollToSection.js
└── assets/              # изображения (логотип, иконки)
```

## 🗄️ Таблицы Supabase

| Таблица | Назначение |
|---------|------------|
| `services` | Услуги (название, цена, описание, длительность, фото `image_url`, массив `images`) |
| `trainer` | Информация о тренере (имя, фото `avatar_url`, био, сертификаты, стаж, клиенты) |
| `appointments` | Заявки (имя, телефон, услуга, статус) |
| `about_us` | Тексты для Hero, преимущества (JSON), политика, оферта, контакты, логотип `logo_url` |

> Все фото хранятся в **Supabase Storage** (бакет `uploads`). Ссылки на фото подставляются в поля `image_url`, `avatar_url`, `logo_url`.

## 🔐 RLS политики

- `services`, `trainer`, `about_us` — чтение всем, изменение только админу (по email)
- `appointments` — вставка всем, чтение только админу

## 📦 Установка и запуск

```bash
git clone https://github.com/glebgrachev/fit-yourself.git
cd fit-yourself
npm install
npm run dev
```

## 🌐 Переменные окружения (`.env.local`)

```
VITE_SUPABASE_URL=https://zhkobpiswiboglrzujqh.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

## 📱 Форма записи

- Маска телефона `+7 (XXX) XXX-XX-XX`
- Валидация имени (минимум 2 символа)
- Отправка в Telegram и Supabase
- Модальное окно для быстрой записи

## 🧩 Основные страницы

| Страница | Маршрут |
|----------|---------|
| Главная | `/` |
| Детальная услуги | `/service/:id` |
| О тренере | `/trainer` |
| Политика | `/privacy` |
| Оферта | `/offer` |

## 🖼️ Управление контентом

Все тексты, цены, фото и преимущества редактируются **напрямую в Supabase**:

- Таблицы `services`, `trainer`, `about_us`
- Бакет `uploads` для фото (логотип, аватар тренера, картинки услуг)

Никакого передеплоя при смене цен или добавлении новой услуги.

## 👤 Автор

**Gleb Grachev** — [priorcom24@gmail.com](mailto:priorcom24@gmail.com)

## 📄 Лицензия

MIT