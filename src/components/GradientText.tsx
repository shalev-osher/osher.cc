import { ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
}

const GradientText = ({ children, className = "" }: GradientTextProps) => (
  <span className={`text-primary ${className}`}>{children}</span>
);

export default GradientText;
