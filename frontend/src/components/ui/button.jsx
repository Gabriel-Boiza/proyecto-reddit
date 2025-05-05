import React from "react";

export function Button({ children, className = "", variant = "default", size = "md", ...props }) {
  const base = "inline-flex items-center justify-center rounded-md transition-colors focus:outline-none";
  
  const variants = {
    default: "bg-zinc-700 text-white hover:bg-zinc-600",
    ghost: "bg-transparent hover:bg-zinc-800 text-zinc-300",
  };

  const sizes = {
    sm: "h-8 px-2 text-sm",
    md: "h-10 px-4 text-base",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
