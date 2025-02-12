import React from "react";

interface HomeWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const HomeWrapper = ({ children, className }: HomeWrapperProps) => {
  return <div className={`container my-10 ${className}`}>{children}</div>;
};
