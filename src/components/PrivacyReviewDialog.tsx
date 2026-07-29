import React, { useEffect, useRef } from 'react';
import { Button } from './ui/Button';

interface PrivacyReviewDialogProps {
  preview: string;
  totalRedactions: number;
  redactionDetails: string[];
  onCancel: () => void;
  onConfirm: () => void;
}

export default function PrivacyReviewDialog({
  preview,
  totalRedactions,
  redactionDetails,
  onCancel,
  onConfirm,
}: PrivacyReviewDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/60 p-3 sm:items-center sm:justify-center" role="presentation">
      <div
        className="w-full max-w-xl rounded-2xl bg-white p-4 shadow-2xl dark:bg-slate-900 sm:p-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-review-title"
        aria-describedby="privacy-review-description"
      >
        <h2 id="privacy-review-title" className="text-lg font-bold">Проверить передачу текста</h2>
        <p id="privacy-review-description" className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          В анализ будет отправлена только обезличенная копия сообщения и текущей истории. Не передавайте пароли, коды из SMS, полные реквизиты или данные, которые не нужны для анализа.
        </p>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-100">
          {totalRedactions > 0 ? (
            <>
              <p className="font-semibold">Автоматически скрыто: {totalRedactions}.</p>
              <p className="mt-1 text-xs leading-5">{redactionDetails.join(' · ')}</p>
            </>
          ) : (
            <p className="font-semibold">Автоматическая маскировка не сработала. Проверьте текст вручную перед отправкой.</p>
          )}
        </div>

        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Обезличенная копия нового сообщения</p>
          <pre className="max-h-44 overflow-y-auto whitespace-pre-wrap break-words rounded-xl bg-slate-100 p-3 text-sm leading-6 text-slate-800 dark:bg-slate-800 dark:text-slate-100">
            {preview || '—'}
          </pre>
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-500">
          Автоматика не гарантирует удаление всех персональных данных: убедитесь, что в копии нет адресов, редких идентификаторов или других лишних сведений.
        </p>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button ref={cancelRef} type="button" variant="outline" onClick={onCancel}>Вернуться к редактированию</Button>
          <Button type="button" onClick={onConfirm}>Проверил, передать в анализ</Button>
        </div>
      </div>
    </div>
  );
}
