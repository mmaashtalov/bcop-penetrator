import jsPDF from 'jspdf';
import { DialogSession, DialogMessage } from '../store/useDialogHistory';

// Экспорт диалога в PDF
export function exportDialogToPDF(session: DialogSession) {
  if (!session || !session.messages) {
    console.warn('No session data to export');
    return;
  }
  
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  let yPosition = 20;
  const lineHeight = 7;
  const maxLineWidth = 180;

  // Заголовок
  doc.setFontSize(16);
  doc.text(`Диалог с коллектором`, 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(12);
  doc.text(`Дата: ${new Date(session.startTime).toLocaleString('ru-RU')}`, 20, yPosition);
  yPosition += 7;
  doc.text(`Цель: ${getGoalLabel(session.goal)}`, 20, yPosition);
  yPosition += 10;

  // Сообщения
  session.messages.forEach((message, index) => {
    // Проверка на новую страницу
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(10);
    const timestamp = new Date(message.timestamp).toLocaleTimeString('ru-RU');
    const author = getAuthorLabel(message.author);
    
    // Заголовок сообщения
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. [${timestamp}] ${author}:`, 20, yPosition);
    yPosition += lineHeight;
    
    // Текст сообщения
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(message.text, maxLineWidth);
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += lineHeight;
    });
    
    // Анализ (если есть)
    if (message.analysis && message.author === 'collector') {
      yPosition += 3;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.text('📊 Анализ:', 25, yPosition);
      yPosition += 5;
      
      const analysisText = `Агрессия: ${message.analysis.aggression || 'N/A'}, Угрозы: ${message.analysis.threats || 'N/A'}`;
      doc.text(analysisText, 25, yPosition);
      yPosition += 5;
    }
    
    // Ответы ассистента (если есть)
    if (message.responses) {
      yPosition += 3;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.text('🤖 Предложенные ответы:', 25, yPosition);
      yPosition += 5;
      
      Object.entries(message.responses).forEach(([style, response]) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(`${getStyleLabel(style)}: ${response.substring(0, 100)}...`, 25, yPosition);
        yPosition += 5;
      });
    }
    
    yPosition += 5; // Отступ между сообщениями
  });

  // Сохранение файла
  const filename = `dialog_${session.startTime}_${Date.now()}.pdf`;
  doc.save(filename);
}

// Экспорт в CSV
export function exportDialogToCSV(session: DialogSession) {
  const headers = ['Время', 'Автор', 'Сообщение', 'Цель', 'Анализ_Агрессия', 'Анализ_Угрозы', 'Ответ_Правовой', 'Ответ_Профессиональный', 'Ответ_Саркастичный'];
  
  const rows = session.messages.map(message => [
    new Date(message.timestamp).toLocaleString('ru-RU'),
    getAuthorLabel(message.author),
    `"${message.text.replace(/"/g, '""')}"`, // Экранируем кавычки
    getGoalLabel(session.goal),
    message.analysis?.aggression || '',
    message.analysis?.threats || '',
    message.responses?.legal ? `"${message.responses.legal.replace(/"/g, '""')}"` : '',
    message.responses?.professional ? `"${message.responses.professional.replace(/"/g, '""')}"` : '',
    message.responses?.sarcastic ? `"${message.responses.sarcastic.replace(/"/g, '""')}"` : ''
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');

  // Создание и скачивание файла
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' }); // BOM для Excel
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `dialog_${session.startTime}_${Date.now()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Экспорт всей истории в JSON
export function exportAllHistoryToJSON(sessions: DialogSession[]) {
  const exportData = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    totalSessions: sessions.length,
    sessions: sessions
  };

  const jsonContent = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `bcop_history_${Date.now()}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Вспомогательные функции
function getAuthorLabel(author: string): string {
  switch (author) {
    case 'user': return 'Вы';
    case 'collector': return 'Коллектор';
    case 'assistant': return 'Ассистент';
    default: return author;
  }
}

function getGoalLabel(goal: string): string {
  switch (goal) {
    case 'defensive': return 'Защитная';
    case 'aggressive': return 'Агрессивная';
    case 'informational': return 'Информационная';
    default: return goal;
  }
}

function getStyleLabel(style: string): string {
  switch (style) {
    case 'legal': return 'Правовой';
    case 'professional': return 'Профессиональный';
    case 'sarcastic': return 'Саркастичный';
    default: return style;
  }
}