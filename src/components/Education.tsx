import { useState, useCallback } from "react";
import { GraduationCap, Award, Calendar, ExternalLink, Clock, Languages, X, Download, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import GradientText from "@/components/GradientText";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";

const education = [
  {
    institution: "Kernelios",
    degree: "Cyber Defense Practitioner (מיישם הגנת סייבר)",
    period: "July 2021 - April 2022",
    hours: "306 Hours",
  },
];

const certificates = [
  {
    name: "Certified Hands-On Cyber Security Specialist",
    issuer: "Kernelios",
    code: "CHCSS 310",
    year: "April 2022",
    verifyUrl: null,
    image: "/certificates/kernelios-chcss.jpeg",
    pdf: "/certificates/kernelios-chcss.pdf",
    accent: "from-yellow-500/20 to-amber-600/20",
  },
  {
    name: "תעודת גמר - מיישם הגנת סייבר",
    issuer: "משרד הכלכלה והתעשייה",
    code: "תעודה מס׳ 1442431",
    year: "April 2022",
    verifyUrl: null,
    image: "/certificates/kernelios-gov.jpeg",
    pdf: "/certificates/kernelios-gov.pdf",
    accent: "from-blue-500/20 to-cyan-500/20",
  },
  {
    name: "גיליון ציונים - מיישם הגנת סייבר",
    issuer: "משרד הכלכלה והתעשייה",
    code: "קרנליוס בע״מ",
    year: "June 2022",
    verifyUrl: null,
    image: "/certificates/kernelios-grades.jpeg",
    pdf: "/certificates/kernelios-grades.pdf",
    accent: "from-blue-500/20 to-indigo-500/20",
  },
  {
    name: "MCSA: Windows Server 2016",
    issuer: "Microsoft",
    code: "Cert #1F7071-E04B87",
    year: "November 2020",
    verifyUrl: "https://learn.microsoft.com/he-il/users/shalevosher-6659/transcript/714gcwjmylnq9k7",
    image: "/certificates/mcsa.jpeg",
    pdf: "/certificates/mcsa.pdf",
    accent: "from-sky-500/20 to-blue-600/20",
  },
  {
    name: "Linux Essentials",
    issuer: "Linux Professional Institute (LPI)",
    code: "LPI000494064",
    year: "July 2021",
    verifyUrl: "https://cs.lpi.org/caf/Xamman/certification/verify/LPI000494064/rafgerhedt",
    image: "/certificates/linux-essentials.jpeg",
    pdf: "/certificates/linux-essentials.pdf",
    accent: "from-emerald-500/20 to-teal-500/20",
  },
];

const Education = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });

  const scrollTo = useCallback((index: number) => {
    emblaApi?.scrollTo(index);
    setActiveIndex(index);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    setActiveIndex((prev) => (prev - 1 + certificates.length) % certificates.length);
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    setActiveIndex((prev) => (prev + 1) % certificates.length);
  }, [emblaApi]);

  return (
    <section id="education" className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-primary/[0.03] blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection animation="scaleUp">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <GradientText>Education & Certifications</GradientText>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Professional training and certifications in cyber security and technology
            </p>
          </div>
        </AnimatedSection>

        {/* Education - Minimal elegant */}
        <AnimatedSection delay={0.1} animation="slideLeft">
          <div className="max-w-3xl mx-auto mb-24">
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

        {/* Certifications - Immersive Carousel */}
        <AnimatedSection delay={0.2} animation="scaleUp">
          <div className="text-center mb-10">
            <h3 className="font-display text-2xl font-semibold inline-flex items-center gap-3">
              <Award className="w-6 h-6 text-primary" />
              Certifications
            </h3>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Large nav arrows */}
            <button
              onClick={scrollPrev}
              className="absolute -left-2 md:-left-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center bg-card/80 backdrop-blur-md border border-border/50 hover:border-primary/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300 group"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute -right-2 md:-right-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center bg-card/80 backdrop-blur-md border border-border/50 hover:border-primary/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300 group"
            >
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>

            {/* Carousel with gradient fade edges */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-secondary/80 to-transparent z-10 pointer-events-none rounded-l-2xl" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-secondary/80 to-transparent z-10 pointer-events-none rounded-r-2xl" />

              <div ref={emblaRef} className="overflow-hidden">
                <div className="flex">
                  {certificates.map((cert, index) => (
                    <div key={cert.name} className="flex-[0_0_85%] md:flex-[0_0_55%] min-w-0 px-3 md:px-4">
                      <motion.div
                        className="relative group cursor-pointer"
                        whileHover={{ y: -8 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        {/* Glow behind card */}
                        <div className={`absolute -inset-2 rounded-3xl bg-gradient-to-br ${cert.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl`} />

                        <div className="relative rounded-2xl overflow-hidden bg-card/60 backdrop-blur-sm border border-border/40 group-hover:border-primary/20 transition-all duration-500">
                          {/* Certificate Image */}
                          <div
                            className="relative overflow-hidden"
                            onClick={() => setSelectedImage(cert.image)}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-br ${cert.accent} mix-blend-overlay z-[1]`} />
                            <img
                              src={cert.image}
                              alt={cert.name}
                              className="w-full h-56 md:h-72 object-contain bg-muted/20 transition-all duration-700 group-hover:scale-[1.03]"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 z-[2] bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                            <div className="absolute inset-0 z-[3] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                              <div className="px-5 py-2.5 rounded-full bg-primary/90 backdrop-blur-sm flex items-center gap-2 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-500">
                                <Eye className="w-4 h-4 text-primary-foreground" />
                                <span className="text-sm font-semibold text-primary-foreground">View Certificate</span>
                              </div>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="p-5 relative">
                            <h4 className="font-display text-sm md:text-base font-bold mb-1 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                              {cert.name}
                            </h4>
                            <p className="text-muted-foreground text-xs font-medium mb-3">{cert.issuer}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <Calendar className="w-3 h-3" />{cert.year}
                              </span>
                              <div className="flex items-center gap-2">
                                {cert.verifyUrl && (
                                  <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                                    title="Verify" onClick={(e) => e.stopPropagation()}>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                {cert.pdf && (
                                  <a href={cert.pdf} target="_blank" rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                                    title="Download PDF" onClick={(e) => e.stopPropagation()}>
                                    <Download className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dot indicators */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {certificates.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === activeIndex
                      ? "w-8 bg-primary"
                      : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Languages */}
        <AnimatedSection delay={0.5} animation="rotate">
          <div className="max-w-md mx-auto mt-20">
            <div className="relative group">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
              <div className="relative p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
                <h3 className="font-display text-lg font-semibold mb-6 text-center flex items-center justify-center gap-2 text-muted-foreground">
                  <Languages className="w-5 h-5 text-primary" />
                  Languages
                </h3>
                <div className="flex justify-center gap-12">
                  <div className="text-center">
                    <span className="font-display text-2xl font-bold text-gradient">English</span>
                    <p className="text-muted-foreground text-xs mt-1 uppercase tracking-wider">Fluent</p>
                  </div>
                  <div className="w-px bg-border/50" />
                  <div className="text-center">
                    <span className="font-display text-2xl font-bold text-gradient">Hebrew</span>
                    <p className="text-muted-foreground text-xs mt-1 uppercase tracking-wider">Native</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl w-[95vw] p-0 bg-transparent border-none shadow-none [&>button]:hidden">
          <div className="relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 z-10 p-2 rounded-full bg-card/80 backdrop-blur-md border border-border/50 hover:border-primary/50 transition-all"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
            {selectedImage && (
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={selectedImage}
                alt="Certificate"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Education;
