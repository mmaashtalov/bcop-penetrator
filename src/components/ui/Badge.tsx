import clsx from "clsx";
export const Badge = ({ children, variant="neutral" }: { children: React.ReactNode; variant?: "risk"|"medium"|"low"|"success"; }) => (
  <span className={clsx(
    "text-xs px-2 py-0.5 rounded font-medium",
    variant==="risk"  && "bg-danger text-white",
    variant==="medium"&& "bg-warning text-white",
    variant==="success"&&"bg-success text-white",
    variant==="low"   && "bg-gray-300 text-gray-700"
  )}>{children}</span>
); 