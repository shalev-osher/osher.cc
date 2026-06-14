import { useState, useCallback, useEffect, useMemo, type TransitionEvent } from "react";
import { GraduationCap, Award, Calendar, ExternalLink, Clock, Languages, X, Download, Eye } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import GradientText from "@/components/GradientText";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTypewriter } from "@/hooks/useTypewriter";

const education = [
  {
    institution: "Kernelios",
    degree: "Cyber Defense Practitioner (מיישם הגנת סייבר)",
    period: "July 2021 - April 2022",
    hours: "306 Hours",
  },
];

const certificates = [
  { name: "Certified Hands-On Cyber Security Specialist", issuer: "Kernelios", code: "CHCSS 310", year: "April 2022", verifyUrl: null, image: "/certificates/kernelios-chcss.jpeg", pdf: "/certificates/kernelios-chcss.pdf", accent: "from-yellow-500/20 to-amber-600/20" },
  { name: "תעודת גמר - מיישם הגנת סייבר", issuer: "משרד הכלכלה והתעשייה", code: "תעודה מס׳ 1442431", year: "April 2022", verifyUrl: null, image: "/certificates/kernelios-gov.jpeg", pdf: "/certificates/kernelios-gov.pdf", accent: "from-blue-500/20 to-cyan-500/20" },
  { name: "גיליון ציונים - מיישם הגנת סייבר", issuer: "משרד הכלכלה והתעשייה", code: "קרנליוס בע״מ", year: "June 2022", verifyUrl: null, image: "/certificates/kernelios-grades.jpeg", pdf: "/certificates/kernelios-grades.pdf", accent: "from-blue-500/20 to-indigo-500/20" },
  { name: "MCSA: Windows Server 2016", issuer: "Microsoft", code: "Cert #1F7071-E04B87", year: "November 2020", verifyUrl: "https://learn.microsoft.com/he-il/users/shalevosher-6659/transcript/714gcwjmylnq9k7", image: "/certificates/mcsa.jpeg", pdf: "/certificates/mcsa.pdf", accent: "from-sky-500/20 to-blue-600/20" },
  { name: "Linux Essentials", issuer: "Linux Professional Institute (LPI)", code: "LPI000494064", year: "July 2021", verifyUrl: "https://cs.lpi.org/caf/Xamman/certification/verify/LPI000494064/rafgerhedt", image: "/certificates/linux-essentials.jpeg", pdf: "/certificates/linux-essentials.pdf", accent: "from-emerald-500/20 to-teal-500/20" },
];

const VISIBLE_CERTIFICATES = 3;
const CERTIFICATE_AUTOPLAY_DELAY = 3500;

const Education = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [trackIndex, setTrackIndex] = useState(VISIBLE_CERTIFICATES);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { t, lang } = useLanguage();
  const isRtl = lang === "he";

  const carouselItems = useMemo(
    () => [
      ...certificates.slice(-VISIBLE_CERTIFICATES),
      ...certificates,
      ...certificates.slice(0, VISIBLE_CERTIFICATES),
    ],
    []
  );

  const titleTypewriter = useTypewriter({ text: t("edu.title"), speed: 80, loop: true, pauseDuration: 5000 });
  const subtitleTypewriter = useTypewriter({ text: t("edu.subtitle"), speed: 25, delay: 1000, loop: true, pauseDuration: 5000 });

  const scrollNext = useCallback(() => {
    setIsTransitioning(true);
    setTrackIndex((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);

    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  useEffect(() => {
    if (isMobile || isPaused || selectedImage) return;

    const interval = window.setInterval(scrollNext, CERTIFICATE_AUTOPLAY_DELAY);
    return () => window.clearInterval(interval);
  }, [isMobile, isPaused, scrollNext, selectedImage]);

  const handleTrackTransitionEnd = useCallback((event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== "transform") return;

    const firstRealSlideIndex = VISIBLE_CERTIFICATES;
    const firstCloneAfterRealSlidesIndex = VISIBLE_CERTIFICATES + certificates.length;

    if (trackIndex >= firstCloneAfterRealSlidesIndex) {
      setIsTransitioning(false);
      setTrackIndex(firstRealSlideIndex);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setIsTransitioning(true));
      });
    }
  }, [trackIndex]);

  const visibleCertificateItems = isMobile ? certificates : carouselItems;
  const trackOffset = isMobile ? 0 : -(trackIndex * (100 / VISIBLE_CERTIFICATES));

  return (
    <section id="education" className="py-14 bg-secondary/30 relative overflow-hidden" aria-labelledby="education-heading">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-primary/[0.03] blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection animation="scaleUp">
          <div className="text-center mb-10">
            <h2 id="education-heading" className="font-display text-4xl md:text-5xl font-bold mb-4">
              <GradientText>{titleTypewriter.displayedText}</GradientText>
              <span className={`inline-block w-[3px] h-[0.8em] bg-primary ms-2 align-middle transition-opacity duration-100 ${titleTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto min-h-[1.75rem]">
              {subtitleTypewriter.displayedText}
              <span className={`inline-block w-[2px] h-[1em] bg-muted-foreground ms-1 align-middle transition-opacity duration-100 ${subtitleTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1} animation="slideLeft">
          <div className="max-w-3xl mx-auto mb-12">
            {education.map((edu) => (
              <div key={edu.institution} className="relative group">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary/30 via-primary/10 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
                <div className="relative p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-500">
                  <div className="flex items-start gap-5">
                    <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                      <GraduationCap className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold mb-1">{edu.degree}</h3>
                      <p className="text-primary font-medium mb-3">{edu.institution}</p>
                      <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{edu.period}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{edu.hours}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2} animation="scaleUp">
          <div className="text-center mb-10">
            <h3 className="font-display text-2xl font-semibold inline-flex items-center gap-3">
              <Award className="w-6 h-6 text-primary" />
              {t("edu.certifications")}
            </h3>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div
              className="relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
            >
              <div className="overflow-hidden" dir="ltr">
                <div
                  className={`flex items-stretch ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""}`}
                  style={{ transform: `translate3d(${trackOffset}%, 0, 0)` }}
                  onTransitionEnd={handleTrackTransitionEnd}
                >
                  {visibleCertificateItems.map((cert, index) => (
                    <div
                      key={`${cert.name}-${index}`}
                      className="flex-[0_0_100%] min-w-0 px-2 h-auto md:flex-[0_0_33.333%] md:px-3"
                    >
                      <div className="relative group cursor-pointer h-full transition-transform duration-300 hover:-translate-y-2" dir={isRtl ? "rtl" : "ltr"}>
                        <div className={`absolute -inset-2 rounded-3xl bg-gradient-to-br ${cert.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl`} />
                        <div className="relative h-full flex flex-col rounded-2xl overflow-hidden bg-card/60 backdrop-blur-sm border border-border/40 group-hover:border-primary/20 transition-all duration-500">
                          <div className="relative overflow-hidden" onClick={() => setSelectedImage(cert.image)}>
                            <div className={`absolute inset-0 bg-gradient-to-br ${cert.accent} mix-blend-overlay z-[1]`} />
                            <img src={cert.image} alt={cert.name} className="w-full h-40 md:h-52 object-contain bg-muted/20 transition-all duration-700 group-hover:scale-[1.03]" loading="lazy" />
                            <div className="absolute inset-0 z-[2] bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                            <div className="absolute inset-0 z-[3] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                              <div className="px-5 py-2.5 rounded-full bg-primary/90 backdrop-blur-sm flex items-center gap-2 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-500">
                                <Eye className="w-4 h-4 text-primary-foreground" />
                                <span className="text-sm font-semibold text-primary-foreground">{t("edu.viewCert")}</span>
                              </div>
                            </div>
                          </div>
                          <div className="p-3 md:p-4 relative flex-1 flex flex-col">
                            <h4 className="font-display text-xs md:text-sm font-bold mb-1 group-hover:text-primary transition-colors duration-300 line-clamp-2">{cert.name}</h4>
                            <p className="text-muted-foreground text-[11px] font-medium mb-2">{cert.issuer}</p>
                            <div className="flex items-center justify-between mt-auto">
                              <span className="text-xs text-muted-foreground flex items-center gap-1.5"><Calendar className="w-3 h-3" />{cert.year}</span>
                              <div className="flex items-center gap-2">
                                {cert.verifyUrl && (
                                  <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all" title="Verify" onClick={(e) => e.stopPropagation()}>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                {cert.pdf && (
                                  <a href={cert.pdf} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all" title="Download PDF" onClick={(e) => e.stopPropagation()}>
                                    <Download className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.5} animation="rotate">
          <div className="max-w-md mx-auto mt-20">
            <div className="relative group">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
              <div className="relative p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
                <h3 className="font-display text-lg font-semibold mb-6 text-center flex items-center justify-center gap-2 text-muted-foreground">
                  <Languages className="w-5 h-5 text-primary" />
                  {t("edu.languages")}
                </h3>
                <div className="flex justify-center gap-12">
                  <div className="text-center">
                    <span className="font-display text-2xl font-bold text-gradient">English</span>
                    <p className="text-muted-foreground text-xs mt-1 uppercase tracking-wider">{t("edu.fluent")}</p>
                  </div>
                  <div className="w-px bg-border/50" />
                  <div className="text-center">
                    <span className="font-display text-2xl font-bold text-gradient">Hebrew</span>
                    <p className="text-muted-foreground text-xs mt-1 uppercase tracking-wider">{t("edu.native")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-3 md:p-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-[88svh] w-full max-w-2xl" onClick={(event) => event.stopPropagation()}>
            <button onClick={() => setSelectedImage(null)} className="absolute -top-11 end-0 z-10 p-2 rounded-full bg-card border border-border/50 hover:border-primary/50 transition-colors" aria-label="Close certificate">
              <X className="w-5 h-5 text-foreground" />
            </button>
            <img src={selectedImage} alt="Certificate" className="w-full max-h-[88svh] object-contain rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}
    </section>
  );
};

export default Education;
