import React from 'react';
import clsx from 'clsx';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div
    role="status"
    aria-live="polite"
    aria-busy="true"
    className={clsx(
      "bg-gray-300 dark:bg-neutral-700 rounded animate-pulse",
      className
    )}
  />
); 