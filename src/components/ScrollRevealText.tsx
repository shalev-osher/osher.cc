interface ScrollRevealTextProps {
  text: string;
  className?: string;
  highlightClassName?: string;
  delay?: number;
}

const ScrollRevealText = ({ text, className = "", highlightClassName = "" }: ScrollRevealTextProps) => (
  <span className={className}>
    <span className={highlightClassName}>{text}</span>
  </span>
);

export default ScrollRevealText;
