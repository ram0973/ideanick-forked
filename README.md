# Учебный сервис идей
# https://svag.group/ru/guide/dev-web-iserdmi

## Использует архитектуру монорепо - и сервер (Express) и клиент (React) - на одном языке Typescript.

Использованы технологии:

- Typescript
- ESLint
- Express JS
- Vite + React + React Router
- Zod 
- Formik
- MJML (шаблоны писем)
- Handlebars
- Lodash
- SCSS
- Git
- NodeJS + pnpm
- Prisma ORM
- Trpc
- PostgreSQL
- Docker
- Github Actions
- Сервисы: Brevo, Sentry, Cloudinary, AWS S3, Mixpanel, Heroku, Datadog

### Установка и проверка

```bash
git clone https://github.com/ram0973/ideanick-forked

cd ideanick-forked

cp backend/env.example backend/.env
cp backend/env.test.example backend/.env.test
# (В этих файлах включаем и настраиваем всё что закомментировано)

cp webapp/env.example webapp/.env
# (В этом файле включаем и настраиваем всё что закомментировано)
```

```bash
pnpm types
pnpm lint
pnpm b build
pnpm b prepare
docker compose up
pnpm b pmt
pnpm b pmd
```

### Тестирование
pnpm test

### Запуск в dev среде

```bash
pnpm dev
```


### Запуск в prod среде на dev хосте

```bash
pnpm start
```