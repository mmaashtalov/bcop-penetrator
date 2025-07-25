import React from 'react';
import { Button, SectionTitle } from '@/components/ui';
// Импортируйте Select, Input, clsx, если есть
// import { Select } from '@/components/ui/Select';
// import { Input } from '@/components/ui/Input';
// import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function DialogSidebar() {
  // TODO: получить currentGoal, setGoal, vulnerabilities из стора
  const vulnerabilities = ['Phishing', 'Social Engineering']; // пример
  return (
    <aside className="bg-white dark:bg-gray-100 p-4 space-y-6 rounded-lg shadow-lg">
      {/* Dialog Control */}
      <SectionTitle>Dialog Control</SectionTitle>
      <div className="space-y-4">
        {/* Current Goal */}
        {/* <Select className="w-full border rounded" /> */}
        {/* Session Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded shadow text-center">
            <p className="text-2xl font-bold">4</p>
            <p className="text-xs text-gray-500">Messages</p>
          </div>
          <div className="bg-white p-3 rounded shadow text-center">
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-gray-500">Sessions</p>
          </div>
        </div>
      </div>
      {/* Vulnerabilities */}
      <SectionTitle>Vulnerabilities</SectionTitle>
      <ul className="space-y-2">
        {vulnerabilities.map(v => (
          <li key={v} className="flex items-center bg-red-50 text-red-700 p-2 rounded">
            {/* <ExclamationTriangleIcon className="h-5 w-5 mr-2" /> */}
            {v}
          </li>
        ))}
      </ul>
      {/* Quick Actions */}
      <SectionTitle>Quick Actions</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="danger">Report Fraud</Button>
        <Button variant="ghost">Contact Bank</Button>
        <Button variant="ghost">End Session</Button>
        <Button variant="ghost">Safe Mode</Button>
      </div>
    </aside>
  );
}