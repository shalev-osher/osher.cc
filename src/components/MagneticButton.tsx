import { ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}

const MagneticButton = ({ children, className = "inline-block" }: MagneticButtonProps) => (
  <div className={className}>{children}</div>
);

export default MagneticButton;
