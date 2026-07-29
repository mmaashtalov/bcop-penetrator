import React, { useEffect } from 'react';
import { ShieldCheckIcon, WifiIcon } from '@heroicons/react/24/outline';
import { useSystem } from '../store/systemStore';

export default function HeaderBar() {
  const { online, lastUpdate, ping, setOnline } = useSystem();

  useEffect(() => {
    const interval = window.setInterval(ping, 30_000);
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [ping, setOnline]);

  return (
    <header className="flex min-h-14 items-center justify-between gap-3 bg-slate-900 px-3 py-2 text-white shadow-lg sm:px-4">
      <div className="flex min-w-0 items-center gap-2">
        <ShieldCheckIcon className="h-7 w-7 shrink-0 text-blue-300" />
        <div className="min-w-0">
          <h1 className="truncate text-base font-bold sm:text-lg">BCOP Dialogue Core</h1>
          <p className="hidden text-xs text-slate-300 sm:block">Помощник для последовательного диалога с банком или коллектором</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 text-xs text-slate-300 sm:gap-2">
        <WifiIcon className={online ? 'h-4 w-4 text-emerald-400' : 'h-4 w-4 text-red-400'} />
        <span>{online ? 'Онлайн' : 'Офлайн'}</span>
        <span className="hidden text-slate-500 sm:inline">· {lastUpdate}</span>
      </div>
    </header>
  );
}
