import clsx from "clsx";
export const Button = ({ children, variant="primary", ...rest }:
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary"|"ghost"|"danger" }
) => (
  <button
    {...rest}
    className={clsx(
      "px-4 py-1.5 rounded text-sm font-medium focus:outline-none focus-visible:ring",
      variant==="primary" && "bg-primary text-white hover:bg-primary-dark",
      variant==="ghost"   && "bg-transparent text-primary hover:bg-primary/10",
      variant==="danger"  && "bg-danger text-white hover:bg-danger/90",
      rest.className
    )}
  >
    {children}
  </button>
); 