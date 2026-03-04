import { useState } from "react";
import { GraduationCap, Award, Calendar, ExternalLink, Clock, Languages, X, Download, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import GradientText from "@/components/GradientText";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";

const education = [
  {
    institution: "Kernelios",
    degree: "Cyber Defense Practitioner (מיישם הגנת סייבר)",
    period: "July 2021 - April 2022",
    hours: "306 Hours",
    icon: GraduationCap,
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
  },
  {
    name: "תעודת גמר - מיישם הגנת סייבר",
    issuer: "משרד הכלכלה והתעשייה",
    code: "תעודה מס׳ 1442431",
    year: "April 2022",
    verifyUrl: null,
    image: "/certificates/kernelios-gov.jpeg",
    pdf: "/certificates/kernelios-gov.pdf",
  },
  {
    name: "גיליון ציונים - מיישם הגנת סייבר",
    issuer: "משרד הכלכלה והתעשייה",
    code: "קרנליוס בע״מ",
    year: "June 2022",
    verifyUrl: null,
    image: "/certificates/kernelios-grades.jpeg",
    pdf: "/certificates/kernelios-grades.pdf",
  },
  {
    name: "MCSA: Windows Server 2016",
    issuer: "Microsoft",
    code: "Cert #1F7071-E04B87",
    year: "November 2020",
    verifyUrl: "https://learn.microsoft.com/he-il/users/shalevosher-6659/transcript/714gcwjmylnq9k7",
    image: "/certificates/mcsa.jpeg",
    pdf: "/certificates/mcsa.pdf",
  },
  {
    name: "Linux Essentials",
    issuer: "Linux Professional Institute (LPI)",
    code: "LPI000494064",
    year: "July 2021",
    verifyUrl: "https://cs.lpi.org/caf/Xamman/certification/verify/LPI000494064/rafgerhedt",
    image: "/certificates/linux-essentials.jpeg",
    pdf: "/certificates/linux-essentials.pdf",
  },
];

const Education = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section id="education" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <AnimatedSection animation="scaleUp">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <GradientText>Education & Certifications</GradientText>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Professional training and certifications in cyber security and technology
            </p>
          </div>
        </AnimatedSection>

        {/* Education Card */}
        <AnimatedSection delay={0.1} animation="slideLeft">
          <div className="max-w-2xl mx-auto mb-16">
            <h3 className="font-display text-2xl font-semibold flex items-center gap-3 mb-6">
              <GraduationCap className="w-6 h-6 text-primary" />
              Education
            </h3>
            {education.map((edu) => (
              <div key={edu.institution} className="card-elevated p-6 hover:border-primary/50 border border-transparent transition-all duration-300">
                <h4 className="font-display text-lg font-semibold mb-2">{edu.degree}</h4>
                <p className="text-primary font-medium mb-3">{edu.institution}</p>
                <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{edu.period}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{edu.hours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Certificates Carousel */}
        <AnimatedSection delay={0.2} animation="scaleUp">
          <div className="max-w-5xl mx-auto">
            <h3 className="font-display text-2xl font-semibold flex items-center gap-3 mb-8 justify-center">
              <Award className="w-6 h-6 text-primary" />
              Certifications
            </h3>

            <div className="relative">
              {/* Navigation Buttons */}
              <button
                onClick={scrollPrev}
                className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:bg-background transition-all shadow-lg"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={scrollNext}
                className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:bg-background transition-all shadow-lg"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>

              {/* Carousel */}
              <div ref={emblaRef} className="overflow-hidden rounded-xl">
                <div className="flex">
                  {certificates.map((cert) => (
                    <div key={cert.name} className="flex-[0_0_100%] min-w-0 md:flex-[0_0_60%] px-3">
                      <div className="card-elevated border border-transparent hover:border-primary/30 transition-all duration-500 overflow-hidden rounded-xl">
                        {/* Certificate Image */}
                        <div
                          className="relative cursor-pointer group overflow-hidden"
                          onClick={() => setSelectedImage(cert.image)}
                        >
                          <img
                            src={cert.image}
                            alt={cert.name}
                            className="w-full h-64 md:h-80 object-contain bg-muted/30 transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
                              <Eye className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium text-foreground">View Full Size</span>
                            </div>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-5">
                          <h4 className="font-display text-base font-semibold mb-1">{cert.name}</h4>
                          <p className="text-primary/80 text-sm font-medium mb-1">{cert.issuer}</p>
                          <p className="text-muted-foreground text-xs font-mono mb-3">{cert.code}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground text-xs">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{cert.year}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              {cert.verifyUrl && (
                                <a
                                  href={cert.verifyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary/60 hover:text-primary transition-colors"
                                  title="Verify"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                              {cert.pdf && (
                                <a
                                  href={cert.pdf}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary/60 hover:text-primary transition-colors"
                                  title="Download PDF"
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              )}
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

        {/* Languages */}
        <AnimatedSection delay={0.5} animation="rotate">
          <div className="max-w-4xl mx-auto mt-16">
            <div className="card-elevated p-6">
              <h3 className="font-display text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
                <Languages className="w-5 h-5 text-primary" />
                Languages
              </h3>
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <span className="font-display text-2xl font-bold text-gradient">English</span>
                  <p className="text-muted-foreground text-sm mt-1">Fluent</p>
                </div>
                <div className="text-center">
                  <span className="font-display text-2xl font-bold text-gradient">Hebrew</span>
                  <p className="text-muted-foreground text-sm mt-1">Native Speaker</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-[95vw] p-2 bg-background/95 backdrop-blur-xl border-border/50">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-background/80 hover:bg-background border border-border/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Certificate"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Education;
