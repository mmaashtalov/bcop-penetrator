export function logEvent(event: string, meta: any = {}) {
  // Можно расширить до отправки на сервер или Sentry
  console.info(`[BCOP]`, event, meta);
}

export function logError(error: Error | string, meta: any = {}) {
  console.error(`[BCOP ERROR]`, error, meta);
  if (typeof window !== 'undefined' && (window as any).toast) {
    (window as any).toast.error?.(error.toString());
  }
}
