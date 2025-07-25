import React, { useEffect } from 'react';
import { ShieldCheckIcon, CpuChipIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import DarkModeToggle from './Header/DarkModeToggle';
import { useSystem } from '../store/systemStore';

export default function HeaderBar() {
  const { online, lastUpdate, ping, setOnline } = useSystem();
  useEffect(() => {
    const i = window.setInterval(ping, 30000);
    window.addEventListener('online', () => setOnline(true));
    window.addEventListener('offline', () => setOnline(false));
    return () => window.clearInterval(i);
  }, [ping, setOnline]);
  return (
    <header className="flex items-center justify-between h-14 px-4 shadow bg-blue-600 dark:bg-neutral-900 text-white dark:text-neutral-100">
      <div className="flex items-center gap-4">
        <ShieldCheckIcon className="h-8 w-8" />
        <CpuChipIcon className="h-8 w-8" />
        <div>
          <h1 className="text-xl font-bold">Bank Chat Operator Penetrator</h1>
          <p className="text-xs">Tactical Analysis & Response Generation Platform</p>
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm">
        <span className="text-xs">
          {online ? '🟢 Online' : '🔴 Offline'} • Live   Updated {lastUpdate}
        </span>
        <DarkModeToggle />
        <button className="flex items-center text-xs ml-2">
          System <ChevronDownIcon className="h-3 w-3 ml-1" />
        </button>
      </div>
    </header>
  );
}