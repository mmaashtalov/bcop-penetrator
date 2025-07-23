 // Goal Engine - влияет на tone и стратегию ответов GPT
export type GoalType = 'defensive' | 'aggressive' | 'informational';

export interface GoalStrategy {
  name: string;
  description: string;
  systemPromptModifier: string;
  responseModifiers: {
    legal: string;
    professional: string;
    sarcastic: string;
  };
  keywords: string[];
  priorityTopics: string[];
}

// Стратегии для разных целей
export const GOAL_STRATEGIES: Record<GoalType, GoalStrategy> = {
  defensive: {
    name: 'Защитная тактика',
    description: 'Минимизация рисков, защита прав, документирование нарушений',
    systemPromptModifier: `
ЦЕЛЬ: ЗАЩИТНАЯ ТАКТИКА
- Приоритет на защите прав должника
- Минимизация рисков и предотвращение эскалации
- Документирование всех нарушений для дальнейшего использования
- Сохранение доказательной базы
- Избегание провокаций и конфликтов`,
    responseModifiers: {
      legal: 'Сфокусируйся на правовой защите, ссылках на законы, процедурах подачи жалоб. Подчеркни права должника и нарушения коллектора.',
      professional: 'Дай спокойный, деловой ответ с упором на соблюдение процедур. Предложи конструктивные варианты решения конфликта.',
      sarcastic: 'Используй мягкую иронию для снижения напряжения, но без агрессии. Переключи внимание на абсурдность требований коллектора.'
    },
    keywords: ['защита', 'права', 'закон', 'жалоба', 'документирование', 'процедура'],
    priorityTopics: ['законность действий', 'права должника', 'процедуры взыскания', 'жалобы и обращения']
  },

  aggressive: {
    name: 'Агрессивная тактика',
    description: 'Активное противодействие, вызов на конфликт, демонстрация силы',
    systemPromptModifier: `
ЦЕЛЬ: АГРЕССИВНАЯ ТАКТИКА
- Активное противодействие незаконным действиям
- Демонстрация знания законов и готовности к борьбе
- Психологическое давление на коллектора
- Переход в наступление вместо обороны
- Создание дискомфорта для коллектора`,
    responseModifiers: {
      legal: 'Дай жесткий ответ с конкретными угрозами судебного преследования. Перечисли все возможные санкции против коллектора.',
      professional: 'Используй формальный, но твердый тон. Ясно обозначь границы и последствия их нарушения.',
      sarcastic: 'Примени жесткую иронию и сарказм для демонстрации превосходства. Высмей некомпетентность коллектора.'
    },
    keywords: ['противодействие', 'угроза', 'суд', 'санкции', 'преследование', 'наступление'],
    priorityTopics: ['угрозы судом', 'санкции против коллектора', 'встречные иски', 'публичное разоблачение']
  },

  informational: {
    name: 'Сбор информации',
    description: 'Получение максимума данных о коллекторе и долге',
    systemPromptModifier: `
ЦЕЛЬ: СБОР ИНФОРМАЦИИ
- Максимальное извлечение информации о коллекторе
- Выяснение деталей долга и полномочий
- Провокация на раскрытие служебной информации
- Создание доказательной базы
- Изучение методов работы коллектора`,
    responseModifiers: {
      legal: 'Сформулируй вопросы о правовых основаниях действий коллектора, документах, полномочиях.',
      professional: 'Задай деловые вопросы о процедурах, сроках, условиях. Попроси предоставить документы.',
      sarcastic: 'Используй иронические вопросы, чтобы коллектор начал оправдываться и раскрывать информацию.'
    },
    keywords: ['информация', 'документы', 'полномочия', 'детали', 'основания', 'процедуры'],
    priorityTopics: ['документы и полномочия', 'детали долга', 'процедуры взыскания', 'контактные данные']
  }
};

// Генерация модифицированного system prompt на основе цели
export function getGoalModifiedSystemPrompt(baseSystemPrompt: string, goal: GoalType): string {
  const strategy = GOAL_STRATEGIES[goal];
  
  return `${baseSystemPrompt}

${strategy.systemPromptModifier}

КЛЮЧЕВЫЕ НАПРАВЛЕНИЯ: ${strategy.keywords.join(', ')}
ПРИОРИТЕТНЫЕ ТЕМЫ: ${strategy.priorityTopics.join(', ')}

Адаптируй анализ и рекомендации под выбранную стратегию "${strategy.name}".`;
}

// Модификация промпта для генерации ответов в определенном стиле
export function getStyleModifiedPrompt(
  basePrompt: string, 
  style: 'legal' | 'professional' | 'sarcastic',
  goal: GoalType
): string {
  const strategy = GOAL_STRATEGIES[goal];
  const styleModifier = strategy.responseModifiers[style];
  
  return `${basePrompt}

СТИЛЕВАЯ МОДИФИКАЦИЯ (${style.toUpperCase()}) для цели "${strategy.name}":
${styleModifier}

Сформулируй ответ в соответствии с этой стратегией.`;
}

// Анализ соответствия сообщения выбранной цели
export function analyzeGoalAlignment(message: string, goal: GoalType): {
  alignment: number; // 0-100%
  suggestions: string[];
  missedOpportunities: string[];
} {
  const strategy = GOAL_STRATEGIES[goal];
  const messageWords = message.toLowerCase().split(/\s+/);
  
  // Подсчет совпадений ключевых слов
  const keywordMatches = strategy.keywords.filter(keyword => 
    messageWords.some(word => word.includes(keyword.toLowerCase()))
  ).length;
  
  const alignment = Math.min(100, (keywordMatches / strategy.keywords.length) * 100);
  
  // Предложения по улучшению
  const suggestions: string[] = [];
  const missedOpportunities: string[] = [];
  
  if (alignment < 50) {
    suggestions.push(`Добавьте элементы стратегии "${strategy.name}"`);
    suggestions.push(`Используйте ключевые слова: ${strategy.keywords.slice(0, 3).join(', ')}`);
  }
  
  // Проверка упущенных возможностей
  strategy.priorityTopics.forEach(topic => {
    if (!messageWords.some(word => topic.toLowerCase().includes(word))) {
      missedOpportunities.push(`Не затронута тема: ${topic}`);
    }
  });
  
  return {
    alignment,
    suggestions,
    missedOpportunities
  };
}

// Получение рекомендаций для следующего сообщения
export function getNextMessageRecommendations(goal: GoalType, conversationHistory: string[]): string[] {
  const strategy = GOAL_STRATEGIES[goal];
  const recommendations: string[] = [];
  
  switch (goal) {
    case 'defensive':
      recommendations.push('Запросите документы, подтверждающие полномочия коллектора');
      recommendations.push('Уведомите о записи разговора для защиты своих прав');
      recommendations.push('Напомните о необходимости соблюдения закона о коллекторской деятельности');
      break;
      
    case 'aggressive':
      recommendations.push('Потребуйте предоставить лицензию на коллекторскую деятельность');
      recommendations.push('Предупредите о возможности подачи встречного иска');
      recommendations.push('Укажите на нарушения и угрозы судебного преследования');
      break;
      
    case 'informational':
      recommendations.push('Выясните полное наименование коллекторского агентства');
      recommendations.push('Запросите детали долга: сумму, основания, проценты');
      recommendations.push('Уточните процедуры и сроки взыскания');
      break;
  }
  
  return recommendations;
}

// Адаптация анализа под цель
export function adaptAnalysisForGoal(rawAnalysis: any, goal: GoalType): any {
  const strategy = GOAL_STRATEGIES[goal];
  
  // Добавляем специфичные для цели метрики
  const adaptedAnalysis = {
    ...rawAnalysis,
    goalStrategy: strategy.name,
    goalAlignment: analyzeGoalAlignment(rawAnalysis.originalMessage || '', goal),
    recommendations: getNextMessageRecommendations(goal, []),
    strategicOpportunities: []
  };
  
  // Специфичные возможности для каждой цели
  switch (goal) {
    case 'defensive':
      if (rawAnalysis.legalViolations?.length > 0) {
        adaptedAnalysis.strategicOpportunities.push('Документируйте нарушения для жалобы');
      }
      break;
      
    case 'aggressive':
      if (rawAnalysis.threats?.detected) {
        adaptedAnalysis.strategicOpportunities.push('Используйте угрозы как основание для встречного иска');
      }
      break;
      
    case 'informational':
      if (!rawAnalysis.collectorInfo?.company) {
        adaptedAnalysis.strategicOpportunities.push('Требуйте раскрытия информации о компании');
      }
      break;
  }
  
  return adaptedAnalysis;
}