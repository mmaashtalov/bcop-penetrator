import React, { useEffect } from 'react';
import { ShieldCheckIcon, CpuChipIcon, WifiIcon, ComputerDesktopIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
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
    <header className="flex items-center justify-between h-14 px-3 shadow bg-[#3178C6] text-white">
      <div className="flex items-center space-x-3">
        <ShieldCheckIcon className="h-8 w-8" />
        <CpuChipIcon className="h-8 w-8" />
        <div className="ml-2">
          <h1 className="text-xl font-bold">Bank Chat Operator Penetrator</h1>
          <h2 className="text-xs opacity-80">Tactical Analysis & Response Generation Platform</h2>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <WifiIcon className="h-5 w-5 text-green-400" />
        <span className="text-sm font-medium">{online ? 'Online' : 'Offline'}</span>
        <span className="text-xs opacity-70">• Live Updated {lastUpdate}</span>
        <div className="h-6 border-l border-white/40 ml-2" />
        <button className="flex items-center space-x-1 text-sm">
          <ComputerDesktopIcon className="h-5 w-5" />
          <span>System</span>
          <ChevronDownIcon className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}