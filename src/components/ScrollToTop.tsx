import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;

      setIsVisible(currentY > 400);
      setCanScrollDown(currentY < maxScrollY - 120);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToNextSection = () => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    const currentPosition = window.scrollY + window.innerHeight * 0.25;
    const nextSection = sections.find((section) => section.offsetTop > currentPosition + 1);

    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  return (
    <>
      {/* Scroll to top - above the down arrow */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-24 end-8 w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 z-50 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>

      {/* Scroll to next section */}
      <button
        onClick={scrollToNextSection}
        className={`fixed bottom-8 end-8 w-14 h-14 rounded-full border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 z-50 glass-effect ${
          canScrollDown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Scroll to next section"
      >
        <ArrowDown size={24} />
      </button>
    </>
  );
};

export default ScrollToTop;
