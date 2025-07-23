import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ThreePanelDashboard from './components/ThreePanelDashboard';
import { DialogSidebar } from './components/DialogSidebar';

// Lazy load для Lighthouse оптимизации
const HistoryPage = lazy(() => import('./pages/HistoryPage'));

function HomePage() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }} className="h-screen flex">
      <DialogSidebar />
      <div className="flex-1">
        <ThreePanelDashboard />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ padding: '24px' }}>Загрузка...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
