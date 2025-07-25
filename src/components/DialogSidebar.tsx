import React from 'react';
import { Card } from '@/components/ui';
// Импортируйте Select, Input, Button, clsx, если они есть в UI-kit

export default function DialogSidebar() {
  // TODO: получить currentGoal, setGoal, dialogs, activeId, setActive из стора
  return (
    <Card className="h-full flex flex-col">
      {/* Goal selector */}
      {/* <Select value={currentGoal} onChange={e=>setGoal(e.target.value)} className="mb-4">…options…</Select> */}
      {/* Search */}
      {/* <Input placeholder="Search sessions…" className="mb-4"/> */}
      {/* Sessions list */}
      <ul className="flex-1 overflow-y-auto space-y-2">
        {/* dialogs.map(d => ( ... )) */}
      </ul>
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {/* <Button variant="danger">Report Fraud</Button> */}
        {/* <Button variant="ghost">Contact Bank</Button> */}
        {/* <Button variant="ghost">End Session</Button> */}
        {/* <Button variant="ghost">Safe Mode</Button> */}
      </div>
    </Card>
  );
}