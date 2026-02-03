import { useState, useEffect } from "react";

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  delay?: number;
  loop?: boolean;
  pauseDuration?: number;
}

export const useTypewriter = ({
  text,
  speed = 100,
  delay = 0,
  loop = false,
  pauseDuration = 2000,
}: UseTypewriterOptions) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    let typingInterval: NodeJS.Timeout;
    let delayTimeout: NodeJS.Timeout;
    let pauseTimeout: NodeJS.Timeout;

    const startTyping = () => {
      setIsTyping(true);
      currentIndex = 0;
      setDisplayedText("");

      typingInterval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);

          if (loop) {
            pauseTimeout = setTimeout(() => {
              // Erase effect
              let eraseIndex = text.length;
              const eraseInterval = setInterval(() => {
                if (eraseIndex >= 0) {
                  setDisplayedText(text.slice(0, eraseIndex));
                  eraseIndex--;
                } else {
                  clearInterval(eraseInterval);
                  setTimeout(startTyping, 500);
                }
              }, speed / 2);
            }, pauseDuration);
          }
        }
      }, speed);
    };

    delayTimeout = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(delayTimeout);
      clearTimeout(pauseTimeout);
      clearInterval(typingInterval);
    };
  }, [text, speed, delay, loop, pauseDuration]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  return { displayedText, isTyping, showCursor };
};
