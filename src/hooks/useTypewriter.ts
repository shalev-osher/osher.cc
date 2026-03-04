import { useState, useEffect, useRef } from "react";

interface UseTypewriterOptions {
  text?: string;
  texts?: string[];
  speed?: number;
  delay?: number;
  pauseDuration?: number;
  loop?: boolean;
}

export const useTypewriter = ({
  text,
  texts: textsProp,
  speed = 80,
  delay = 0,
  pauseDuration = 2000,
  loop = false,
}: UseTypewriterOptions) => {
  const texts = textsProp || (text ? [text] : [""]);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const indexRef = useRef(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    indexRef.current = 0;

    const typeText = (t: string, charIndex: number) => {
      setIsTyping(true);
      if (charIndex <= t.length) {
        setDisplayedText(t.slice(0, charIndex));
        timeout = setTimeout(() => typeText(t, charIndex + 1), speed);
      } else {
        setIsTyping(false);
        if (loop || texts.length > 1) {
          timeout = setTimeout(() => eraseText(t, t.length), pauseDuration);
        }
      }
    };

    const eraseText = (t: string, charIndex: number) => {
      if (charIndex >= 0) {
        setDisplayedText(t.slice(0, charIndex));
        timeout = setTimeout(() => eraseText(t, charIndex - 1), speed / 2);
      } else {
        indexRef.current = (indexRef.current + 1) % texts.length;
        timeout = setTimeout(() => typeText(texts[indexRef.current], 0), 400);
      }
    };

    timeout = setTimeout(() => typeText(texts[0], 0), delay);

    return () => clearTimeout(timeout);
  }, [texts.join(","), speed, delay, pauseDuration, loop]);

  useEffect(() => {
    const interval = setInterval(() => setShowCursor((p) => !p), 530);
    return () => clearInterval(interval);
  }, []);

  return { displayedText, isTyping, showCursor };
};
