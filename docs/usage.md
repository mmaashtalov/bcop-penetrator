# BCOP-Penetrator — Руководство пользователя

`BCOP-Penetrator` (Bank Chat Operator Penetrator) — веб-приложение для многослойного анализа переписок с коллекторами и генерации тактических ответов.

---

## 1. Требования

- **Node.js** ≥ 20  
- **pnpm** (или yarn/npm)  
- **OpenAI API key** (VITE_OPENAI_KEY)  

---

## 2. Установка

```bash
# Клонируем репозиторий
git clone https://github.com/your-org/bcop-penetrator.git
cd bcop-penetrator

# Устанавливаем зависимости
pnpm install

# Настраиваем .env
cp .env.example .env
# В .env впишите:
VITE_OPENAI_KEY=sk-ВашКлючОтOpenAI
```

---

## 3. Запуск в режиме разработки

```bash
pnpm dev
```

Откройте в браузере: http://localhost:5175

Приложение запустится с "тремя панелями":

- **Dialog Control** (левая) — сессии, цели, статистика
- **Chat Dialog** (центральная) — переписка + ввод  
- **Tactical Analysis & Response** (правая) — анализ и варианты ответов

---

## 4. Основные сценарии использования

### 4.1 Анализ сообщения

1. Введите или вставьте текст от оператора в поле **MessageInput**
2. Нажмите **Send**
3. В панели **Tactical Analysis** появится JSON-анализ (10 слоёв)
4. В **Response Generation** отобразятся три варианта ответа

### 4.2 Подбор ответа

- Кликните **Use** под любым ответом — текст автоматически попадёт в поле ввода
- Нажмите **Copy**, чтобы скопировать ответ в буфер обмена
- Клик ⟳ **Regenerate** — сгенерировать новый вариант того же стиля

### 4.3 Управление сессиями

- В **Dialog Control** нажмите **New Session**, чтобы начать новую переписку
- Список предыдущих сессий отображается в нижней части **Dialog Control**
- Используйте **Search** для фильтрации по ключевым словам

### 4.4 Экспорт переписки

- После завершения диалога нажмите **Export → PDF** или **Export → CSV** в **Dialog Control**
- Файл автоматически загрузится в браузере

---

## 5. Структура проекта

```
src/
├─ analysis/           # Логика анализа и генерации (GPT)
├─ lib/                # API-адаптеры, OpenAI-клиент, anonymizer
├─ components/         # React-компоненты UI
│  ├─ Header/
│  ├─ Sidebar/
│  ├─ Chat/
│  ├─ Analysis/
│  ├─ Response/
│  └─ ui/              # UI-kit: Button, Card, Badge, Input, Skeleton…
├─ pages/              # Страницы (HistoryPage и др.)
├─ store/              # Zustand-хранилища
├─ prompts/            # Системные и пользовательские промпты
├─ utils/              # Утилиты (export-utils, date-utils)
└─ types/              # TypeScript-типы
```

---

## 6. Тестирование

```bash
# Запуск модульных и интеграционных тестов
pnpm test
```

- **Покрытие TypeScript:** ✅
- **ESLint:** ⚠️ может быть несколько предупреждений по `any`, но сборка "зелёная"

---

## 7. Деплой

Соберите продакшен-версию:

```bash
pnpm build
```

Разверните папку `dist/` на любом статическом хостинге (Netlify, Vercel, GitHub Pages).

---

## 8. Поддержка и фидбек

- Создавайте **Issues** в репозитории
- Пишите в чат Slack/Discord вашего проекта
- Для срочных вопросов — email team@your-org.com 