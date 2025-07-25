import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ThreePanelDashboard from './components/ThreePanelDashboard';

// Lazy load для Lighthouse оптимизации
const HistoryPage = lazy(() => import('./pages/HistoryPage'));

function HomePage() {
  // Убираем лишние обертки, так как ThreePanelDashboard уже управляет своей высотой (h-screen)
  return <ThreePanelDashboard />;
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