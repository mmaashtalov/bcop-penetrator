import jsPDF from 'jspdf';
import { DialogSession } from '../store/useDialogHistory';
import toast from "react-hot-toast";

// ... (весь остальной код файла)

export function exportDialogToPDF(session: DialogSession) {
  if (!session || !session.messages) {
    toast.error('Нет данных для экспорта');
    return;
  }
  
  const doc = new jsPDF();
  // ... (вся остальная логика PDF)
  
  const filename = `dialog_${session.startTime}_${Date.now()}.pdf`;
  doc.save(filename);
  toast.success("PDF успешно экспортирован!");
}

// ... (остальные функции экспорта)