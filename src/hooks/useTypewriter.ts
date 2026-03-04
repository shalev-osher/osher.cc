import { useState, useEffect, useRef } from "react";

interface UseTypewriterOptions {
  texts: string[];
  speed?: number;
  delay?: number;
  pauseDuration?: number;
}

export const useTypewriter = ({
  texts,
  speed = 80,
  delay = 0,
  pauseDuration = 2000,
}: UseTypewriterOptions) => {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const indexRef = useRef(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const typeText = (text: string, charIndex: number) => {
      if (charIndex <= text.length) {
        setDisplayedText(text.slice(0, charIndex));
        timeout = setTimeout(() => typeText(text, charIndex + 1), speed);
      } else {
        timeout = setTimeout(() => eraseText(text, text.length), pauseDuration);
      }
    };

    const eraseText = (text: string, charIndex: number) => {
      if (charIndex >= 0) {
        setDisplayedText(text.slice(0, charIndex));
        timeout = setTimeout(() => eraseText(text, charIndex - 1), speed / 2);
      } else {
        indexRef.current = (indexRef.current + 1) % texts.length;
        timeout = setTimeout(() => typeText(texts[indexRef.current], 0), 400);
      }
    };

    timeout = setTimeout(() => typeText(texts[0], 0), delay);

    return () => clearTimeout(timeout);
  }, [texts, speed, delay, pauseDuration]);

  useEffect(() => {
    const interval = setInterval(() => setShowCursor((p) => !p), 530);
    return () => clearInterval(interval);
  }, []);

  return { displayedText, showCursor };
};
