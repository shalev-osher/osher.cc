import { GraduationCap, Award, Calendar, ExternalLink, Clock, Languages } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import GradientText from "@/components/GradientText";

const education = [
  {
    institution: "Kernelios",
    degree: "Cyber Defense Practitioner (מיישם הגנת סייבר)",
    period: "July 2021 - April 2022",
    hours: "306 Hours",
    icon: GraduationCap,
  },
];

const certifications = [
  {
    name: "Certified Hands-On Cyber Security Specialist",
    issuer: "Kernelios",
    code: "CHCSS 310",
    year: "April 2022",
    verifyUrl: null,
  },
  {
    name: "MCSA: Windows Server 2016",
    issuer: "Microsoft",
    code: "Cert #1F7071-E04B87",
    year: "November 2020",
    verifyUrl: "https://learn.microsoft.com/he-il/users/shalevosher-6659/transcript/714gcwjmylnq9k7",
  },
  {
    name: "Linux Essentials",
    issuer: "Linux Professional Institute (LPI)",
    code: "LPI000494064",
    year: "July 2021",
    verifyUrl: "https://cs.lpi.org/caf/Xamman/certification/verify/LPI000494064/rafgerhedt",
  },
  {
    name: "Pre Security",
    issuer: "TryHackMe",
    code: "THM-LUXTRZ1DQ0",
    year: "December 2025",
    verifyUrl: "https://tryhackme.com/certificate/THM-LUXTRZ1DQ0",
  },
];

const Education = () => {
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

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Education */}
          <AnimatedSection delay={0.1} animation="slideLeft">
            <div className="space-y-6">
              <h3 className="font-display text-2xl font-semibold flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-primary" />
                Education
              </h3>
              {education.map((edu) => (
                <div key={edu.institution} className="card-elevated p-6 hover:border-primary/50 border border-transparent transition-all duration-300">
                  <h4 className="font-display text-lg font-semibold mb-2">{edu.degree}</h4>
                  <p className="text-primary font-medium mb-3">{edu.institution}</p>
                  <div className="flex flex-col gap-2 text-muted-foreground text-sm">
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

          {/* Certifications */}
          <AnimatedSection delay={0.2} animation="slideRight">
            <div className="space-y-6">
              <h3 className="font-display text-2xl font-semibold flex items-center gap-3">
                <Award className="w-6 h-6 text-primary" />
                Certifications
              </h3>
              {certifications.map((cert, index) => (
                <AnimatedSection key={cert.name} delay={0.2 + index * 0.1} animation="scaleUp">
                  <div className="card-elevated p-5 hover:border-primary/50 border border-transparent transition-all duration-300 group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-display text-base font-semibold mb-1 group-hover:text-primary transition-colors">
                          {cert.name}
                        </h4>
                        <p className="text-primary/80 text-sm font-medium mb-1">{cert.issuer}</p>
                        <p className="text-muted-foreground text-xs mb-2 font-mono">{cert.code}</p>
                        <div className="flex items-center gap-2 text-muted-foreground text-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{cert.year}</span>
                        </div>
                      </div>
                      {cert.verifyUrl && (
                        <a
                          href={cert.verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary/60 hover:text-primary transition-colors shrink-0 mt-1"
                          title="Verify Certificate"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* Languages */}
        <AnimatedSection delay={0.5} animation="rotate">
          <div className="max-w-4xl mx-auto mt-12">
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
    </section>
  );
};

export default Education;
