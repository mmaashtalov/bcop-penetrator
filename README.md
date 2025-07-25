# BCOP-Penetrator

**Bank Collection Operations Penetrator** — платформа для тактического анализа переписок с коллекторами/банками и генерации ответов на базе AI.

## Quick Start

```bash
# 1. Клонируем проект
git clone https://github.com/your-org/bcop-penetrator.git
cd bcop-penetrator

# 2. Устанавливаем зависимости
pnpm install

# 3. Настраиваем ключ OpenAI
cp .env.example .env
# В .env укажите:
VITE_OPENAI_KEY=sk-ВАШ-КЛЮЧ

# 4. Запуск в режиме разработки
pnpm dev
```

Открываем http://localhost:5175

1. Вводим текст оператора в поле слева
2. Получаем развернутый 10-слойный анализ и 3 готовых ответа
3. Используем кнопку **Use** для мгновенной вставки ответа

## Ресурсы

- [Документация пользователя](docs/usage.md)
- [GitHub Issues](https://github.com/your-org/bcop-penetrator/issues)
- [Examples & Demo](https://your-org.github.io/bcop-penetrator)

## Технологии

- **Frontend:** React 18 + TypeScript
- **Сборка:** Vite 7.0.5
- **Стилизация:** Tailwind CSS 4.1.11
- **Состояние:** Zustand 5.0.6
- **AI:** OpenAI API 5.9.0
- **Пакетный менеджер:** pnpm 10.13.1

## Лицензия

ISC 