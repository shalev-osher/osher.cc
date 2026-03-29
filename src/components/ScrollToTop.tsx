import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;

      setIsVisible(currentY > 400);
      setCanScrollDown(currentY < maxScrollY - 200);
      // Hide entire pill when near the footer to avoid overlapping social icons
      setIsNearBottom(currentY > maxScrollY - 300);
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
    <div className={`fixed bottom-8 end-8 z-50 flex flex-col rounded-full border border-primary/30 overflow-hidden glass-effect transition-all duration-300 ${isNearBottom ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100'}`}>
      {/* Scroll to top - always rendered for consistent shape, hidden when not scrolled */}
      <button
        onClick={scrollToTop}
        className="w-14 h-14 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>
      <div className="h-px bg-primary/20" />

      {/* Scroll to next section */}
      <button
        onClick={scrollToNextSection}
        className={`w-14 h-14 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 ${
          canScrollDown ? "opacity-100" : "opacity-30 pointer-events-none"
        }`}
        aria-label="Scroll to next section"
      >
        <ArrowDown size={20} />
      </button>
    </div>
  );
};

export default ScrollToTop;
