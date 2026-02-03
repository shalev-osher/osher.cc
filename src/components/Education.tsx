import { GraduationCap, Award, Calendar } from "lucide-react";

const education = [
  {
    institution: "Kernelios",
    degree: "Cyber/Computer Forensics and Counterterrorism",
    period: "2021 - 2022",
    icon: GraduationCap,
  },
];

const certifications = [
  {
    name: "Certified Hands-On Cyber Security Specialist",
    details: "MCSA + Linux (450 Hours)",
    year: "2023",
  },
];

const Education = () => {
  return (
    <section id="education" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Education & Certifications
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Professional training and certifications in cyber security and technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Education */}
          <div className="space-y-6">
            <h3 className="font-display text-2xl font-semibold flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-primary" />
              Education
            </h3>
            {education.map((edu) => (
              <div
                key={edu.institution}
                className="card-elevated p-6 hover:border-primary/50 border border-transparent transition-all duration-300"
              >
                <h4 className="font-display text-lg font-semibold mb-2">
                  {edu.degree}
                </h4>
                <p className="text-primary font-medium mb-2">{edu.institution}</p>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{edu.period}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="space-y-6">
            <h3 className="font-display text-2xl font-semibold flex items-center gap-3">
              <Award className="w-6 h-6 text-primary" />
              Certifications
            </h3>
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="card-elevated p-6 hover:border-primary/50 border border-transparent transition-all duration-300"
              >
                <h4 className="font-display text-lg font-semibold mb-2">
                  {cert.name}
                </h4>
                <p className="text-muted-foreground mb-2">{cert.details}</p>
                <div className="flex items-center gap-2 text-primary text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{cert.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="card-elevated p-6">
            <h3 className="font-display text-xl font-semibold mb-4 text-center">Languages</h3>
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
      </div>
    </section>
  );
};

export default Education;
