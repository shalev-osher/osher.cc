import { motion } from "framer-motion";

interface ScrollRevealTextProps {
  text: string;
  className?: string;
  highlightClassName?: string;
  delay?: number;
}

const ScrollRevealText = ({ text, className = "", highlightClassName = "", delay = 0 }: ScrollRevealTextProps) => {
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0.15, y: 8, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{
            delay: delay + i * 0.04,
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <span className={highlightClassName}>{word}</span>
          {i < words.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </span>
  );
};

export default ScrollRevealText;
