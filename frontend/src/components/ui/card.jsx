import React from "react";

export function Card({ children, className = "" }) {
  return (
    <>
    <div className={`bg-zinc-850 border-zinc-700 rounded-xl shadow ${className}`}>
      {children}
    </div>
    </>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
