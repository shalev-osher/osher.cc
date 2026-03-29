import { useState, useEffect } from "react";

const useActiveSection = (sectionIds: string[]) => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      // If near top of page, no section should be active
      if (window.scrollY < window.innerHeight * 0.5) {
        setActiveSection("");
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        // Don't highlight anything when near the top (hero)
        if (window.scrollY < window.innerHeight * 0.5) {
          setActiveSection("");
          return;
        }
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const best = visible.reduce((a, b) =>
            a.intersectionRatio > b.intersectionRatio ? a : b
          );
          setActiveSection(best.target.id);
        }
      },
      { threshold: 0.3, rootMargin: "-80px 0px -40% 0px" }
    );

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sectionIds]);

  return activeSection;
};

export default useActiveSection;
