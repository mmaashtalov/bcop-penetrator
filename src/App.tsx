import React from 'react';
import ThreePanelDashboard from './components/ThreePanelDashboard';
import { DialogSidebar } from './components/DialogSidebar';

function App() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }} className="h-screen flex">
      <DialogSidebar />
      <div className="flex-1">
        <ThreePanelDashboard />
      </div>
    </div>
  );
}

export default App;
