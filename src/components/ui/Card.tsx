import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  [key: string]: any; // For any additional props
}

function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-xl p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
