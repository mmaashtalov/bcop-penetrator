import { ReactNode } from "react";
export const Card = ({ children, className = "" }: { children: ReactNode; className?: string; }) => (
  <div className={`rounded-lg bg-white dark:bg-neutral-800 shadow-sm p-4 ${className}`}>{children}</div>
); 