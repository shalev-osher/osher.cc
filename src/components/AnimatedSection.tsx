import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: string;
}

const AnimatedSection = ({ children, className = "" }: AnimatedSectionProps) => (
  <div className={className}>{children}</div>
);

export default AnimatedSection;
