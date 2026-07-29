# Развёртывание BCOP Dialogue Core v0.2

> Инструкция относится к ветке `codex/bcop-dialogue-core-v0.2` и версии пакета `0.2.0`. Пока Draft PR не объединён с `main`, для полного приложения нужно развёртывать именно эту ветку.

## 1. Выберите контур

| Контур | Что показывает | Нужен сервер | Нужен ключ OpenAI | Допустимые данные |
| --- | --- | ---: | ---: | --- |
| Публичное мобильное демо | Три готовых вымышленных сценария | Нет | Нет | Только встроенные кейсы |
| Приватный demo-режим | Полный интерфейс и API с детерминированным анализом | Да | Нет | Только тестовые/вымышленные |
| Закрытая AI-бета | Полный интерфейс и реальный AI-анализ | Да | Да | Обезличенные, после ручной проверки |

Рекомендация для текущей v0.2: публично оставлять только статическое демо. AI-режим развёртывать как закрытую бету за дополнительным контролем доступа, потому что в приложении пока нет пользовательских аккаунтов и лимитов расходов на уровне пользователя.

## 2. Требования

- Git;
- Node.js 22.x — эта версия используется в GitHub Actions;
- pnpm 10.13.1 — версия закреплена в `package.json`;
- исходящее HTTPS-соединение с `api.openai.com` только для AI-режима;
- доступный TCP-порт, по умолчанию `8787`.

Проверка окружения:

```bash
git --version
node --version
corepack --version
```

## 3. Получение исходников

До объединения Draft PR:

```bash
git clone --branch codex/bcop-dialogue-core-v0.2 --single-branch \
  https://github.com/mmaashtalov/bcop-penetrator.git
cd bcop-penetrator
```

После выпуска v0.2 в `main` команда может быть сокращена до обычного клонирования репозитория.

## 4. Установка и обязательная проверка

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm check
pnpm check:public-demo
```

Что проверяется:

- серверные тесты;
- ESLint;
- TypeScript;
- production-сборка интерфейса;
- HTTP smoke-test API в безопасном demo-режиме;
- отдельная статическая сборка без API-клиента.

Запускать сервис после неуспешной проверки не рекомендуется.

## 5. Настройка переменных окружения

Создайте `.env`:

```bash
cp .env.example .env
```

Базовый безопасный вариант:

```dotenv
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1
PORT=8787
ALLOWED_ORIGIN=http://localhost:8787
DEMO_MODE=true
RATE_LIMIT_MAX_REQUESTS=20
RATE_LIMIT_WINDOW_MS=60000
TRUST_PROXY=false
```

### Назначение параметров

| Переменная | Назначение |
| --- | --- |
| `OPENAI_API_KEY` | Серверный ключ. Не использовать префикс `VITE_` |
| `OPENAI_MODEL` | Модель Responses API; текущее значение проекта — `gpt-4o-mini` |
| `OPENAI_BASE_URL` | Базовый URL совместимого API |
| `PORT` | Порт HTTP-сервера BCOP |
| `ALLOWED_ORIGIN` | Единственный разрешённый Origin браузерного клиента |
| `DEMO_MODE` | `true` — без обращения к OpenAI; `false` — AI-режим |
| `RATE_LIMIT_MAX_REQUESTS` | Допустимое число запросов анализа в окне |
| `RATE_LIMIT_WINDOW_MS` | Размер окна rate limit в миллисекундах |
| `TRUST_PROXY` | Учитывать `X-Forwarded-For` только за доверенным proxy |

Если интерфейс и API отдаются одним сервером по одному домену, укажите в `ALLOWED_ORIGIN` точный публичный адрес, например `https://bcop.example.com`.

По состоянию на 29 июля 2026 года официальная документация OpenAI указывает поддержку `v1/responses` и Structured Outputs для `gpt-4o-mini`. Это подтверждает совместимость текущей конфигурации, но не означает, что модель является оптимальным выбором для будущего релиза. Перед закрытой бетой модель, доступность в конкретном API-проекте, качество русскоязычных ответов, задержку и стоимость нужно проверить отдельно. [Официальная карточка модели](https://developers.openai.com/api/docs/models/gpt-4o-mini), [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

## 6. Локальный или приватный demo-режим

Убедитесь, что в `.env`:

```dotenv
DEMO_MODE=true
OPENAI_API_KEY=
```

Сборка и запуск:

```bash
pnpm build
pnpm start
```

Откройте:

```text
http://localhost:8787
```

Проверка API:

```bash
curl -fsS http://localhost:8787/api/health
```

Ожидаемый ответ:

```json
{"ok":true,"service":"bcop-dialogue-core","mode":"demo"}
```

## 7. Закрытая AI-бета

Задайте серверные переменные:

```dotenv
OPENAI_API_KEY=ваш_серверный_ключ
OPENAI_MODEL=gpt-4o-mini
DEMO_MODE=false
```

Затем:

```bash
pnpm build
pnpm start
```

Проверка:

```bash
curl -fsS http://localhost:8787/api/health
```

Ожидаемый режим:

```json
{"ok":true,"service":"bcop-dialogue-core","mode":"ai"}
```

Ключ нельзя помещать в `VITE_OPENAI_KEY` или любую другую переменную `VITE_*`: такие значения попадают в клиентскую сборку.

Автоматический smoke-test проекта намеренно не обращается к OpenAI. Поэтому успешный `pnpm check` подтверждает локальный API-контур, но не подтверждает права ключа, квоту, доступность выбранной модели и качество реальных ответов. AI-режим принимается отдельным тестом с серверным ключом и только на вымышленных или вручную обезличенных данных.

## 8. Универсальные параметры для PaaS

Для платформы, которая разворачивает один Node.js web-service из GitHub:

| Параметр | Значение |
| --- | --- |
| Ветка | `codex/bcop-dialogue-core-v0.2` до merge |
| Runtime | Node.js 22 |
| Install command | `corepack enable && pnpm install --frozen-lockfile` |
| Build command | `pnpm check && pnpm check:public-demo` |
| Start command | `node server/index.mjs` |
| Health check | `/api/health` |
| Порт | переменная окружения `PORT` |

Сервер одновременно отдаёт production-интерфейс из `dist/` и API. Отдельный frontend-service для полного приложения не нужен.

Не включайте `DEMO_MODE=false`, пока доступ к сервису не ограничен и не установлен лимит расходов у AI-провайдера.

## 9. VPS: запуск через systemd

Ниже — шаблон для Linux-сервера. Сначала выполните установку, проверку и `pnpm build` из предыдущих разделов.

Узнайте фактический путь Node.js:

```bash
command -v node
```

Создайте серверный файл окружения `/etc/bcop.env` и ограничьте доступ к нему:

```bash
sudo chmod 600 /etc/bcop.env
```

Пример `/etc/systemd/system/bcop.service`:

```ini
[Unit]
Description=BCOP Dialogue Core
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=bcop
Group=bcop
WorkingDirectory=/opt/bcop-penetrator
EnvironmentFile=/etc/bcop.env
ExecStart=/usr/bin/node /opt/bcop-penetrator/server/index.mjs
Restart=on-failure
RestartSec=5
NoNewPrivileges=true
PrivateTmp=true
ProtectHome=true

[Install]
WantedBy=multi-user.target
```

Если `command -v node` вернул другой путь, замените `/usr/bin/node` в `ExecStart`.

Запуск:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now bcop
sudo systemctl status bcop --no-pager
```

Журнал:

```bash
sudo journalctl -u bcop -n 100 --no-pager
```

BCOP пишет в журнал только технические события запроса, без текста переписки и ответа модели.

## 10. Reverse proxy

Пример location-блока Nginx:

```nginx
location / {
    proxy_pass http://127.0.0.1:8787;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 60s;
    client_max_body_size 200k;
}
```

При такой схеме:

```dotenv
ALLOWED_ORIGIN=https://bcop.example.com
TRUST_PROXY=true
```

`TRUST_PROXY=true` допустим только когда proxy перезаписывает, а не принимает от клиента готовый `X-Forwarded-For`.

TLS/HTTPS должен завершаться на reverse proxy или на платформе хостинга. AI-бету без HTTPS публиковать нельзя.

## 11. Публичное мобильное демо через GitHub Pages

Демо уже развёрнуто:

[https://mmaashtalov.github.io/bcop-penetrator/](https://mmaashtalov.github.io/bcop-penetrator/)

Локальная сборка:

```bash
pnpm check:public-demo
```

Она создаёт `dist-public-demo/` и проверяет отсутствие API-клиента и серверных секретов.

Автоматическая публикация выполняется workflow `.github/workflows/deploy-public-demo.yml`. В настройках репозитория:

1. Откройте `Settings → Pages`.
2. В `Build and deployment → Source` выберите `GitHub Actions`.
3. Сделайте push в `codex/bcop-dialogue-core-v0.2` либо запустите workflow `Deploy public mobile demo` вручную.

Сейчас триггер workflow намеренно привязан к Draft-ветке. Перед выпуском из `main` его нужно переключить на релизную ветку.

## 12. Проверка после развёртывания

### Health

```bash
curl -fsS https://bcop.example.com/api/health
```

### Тестовый анализ

Используйте только вымышленный текст:

```bash
curl -fsS https://bcop.example.com/api/dialogue/analyze \
  -H 'Content-Type: application/json' \
  --data '{
    "goal":"gather_info",
    "incomingMessage":"Тестовое сообщение: направьте документы и расчёт суммы.",
    "history":[]
  }'
```

Проверьте:

- HTTP `200`;
- поле `mode` соответствует `demo` или `ai`;
- присутствует `request_id`;
- возвращены ровно три варианта ответа;
- в ответе нет исходных идентификаторов, если они были замаскированы.

### Мобильная приёмка

1. Откройте интерфейс с телефона.
2. Создайте новый диалог.
3. Выберите цель.
4. Вставьте вымышленное сообщение.
5. Проверьте обезличенную копию и подтвердите анализ.
6. Выберите один черновик.
7. Добавьте следующее сообщение и убедитесь, что история учитывается.
8. Проверьте удаление всех диалогов.

## 13. Обновление

```bash
git fetch origin
git pull --ff-only
pnpm install --frozen-lockfile
pnpm check
pnpm check:public-demo
sudo systemctl restart bcop
curl -fsS http://127.0.0.1:8787/api/health
```

Перед обновлением production рекомендуется разворачивать проверенный commit или release tag, а не произвольную вершину ветки.

## 14. Диагностика

| Симптом | Вероятная причина | Проверка/действие |
| --- | --- | --- |
| `503 Frontend не собран` | Нет каталога `dist/` | Выполнить `pnpm build` |
| `503 AI-контур не настроен` | `DEMO_MODE=false`, но нет ключа | Задать ключ или вернуть `DEMO_MODE=true` |
| Ошибка CORS | Не совпадает Origin | Указать точный адрес в `ALLOWED_ORIGIN` |
| HTTP `429` | Сработал rate limit | Дождаться `Retry-After`, проверить лимиты |
| Интерфейс открыт, анализ не работает | Недоступен API или AI-провайдер | Проверить `/api/health` и журнал сервиса |
| GitHub Pages возвращает `404` | Не выбран GitHub Actions или workflow неуспешен | Проверить `Settings → Pages` и Actions |

## 15. Ограничения production-контура v0.2

- нет встроенной авторизации пользователей;
- rate limit хранится в памяти одного процесса и не синхронизируется между несколькими инстансами;
- нет серверной базы диалогов и резервного копирования пользовательской истории;
- постоянная история хранится только в `localStorage` конкретного браузера после явного согласия;
- нет встроенного учёта стоимости AI-запросов;
- автоматическое обезличивание требует ручной проверки.

Для публичной AI-версии доработки авторизации, централизованных лимитов, контроля расходов и политики обработки данных являются обязательным следующим этапом.

## Источники и проверяемость

- [команды и версии пакетов](../package.json);
- [пример переменных окружения](../.env.example);
- [сервер, health-check, OpenAI-вызов и журналирование](../server/index.mjs);
- [лимиты входа и структура анализа](../server/dialogue-core.mjs);
- [CI](../.github/workflows/ci.yml);
- [workflow публичного демо](../.github/workflows/deploy-public-demo.yml);
- [проверка статического артефакта](../scripts/verify-public-demo.mjs);
- [официальная карточка `gpt-4o-mini`](https://developers.openai.com/api/docs/models/gpt-4o-mini);
- [официальное руководство по Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs);
- [официальное руководство по Responses API и `store: false`](https://developers.openai.com/api/docs/guides/migrate-to-responses).
