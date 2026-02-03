import { Briefcase, Calendar } from "lucide-react";
import { useTypewriter } from "@/hooks/useTypewriter";

const experiences = [
  {
    company: "Voicenter",
    role: "Technical Support Specialist Tier 2",
    period: "2023 - Present",
    description: [
      "Collaborating closely with Development and DevOps teams using Jira to address issues and enhance workflows",
      "Delivering comprehensive support to VIP and standard clients across the company's suite of products",
      "Working with API integrations (leveraging Kibana), networking, and Amazon Web Services (AWS)",
      "Conducting rigorous QA testing on features and servers as per requests from Development and DevOps teams",
      "Co-developing a troubleshooting tool in collaboration with the Development team",
      "Proactively diagnosing and resolving live issues across a multitude of servers using PRTG",
    ],
  },
  {
    company: "Voicenter",
    role: "Technical Support Specialist - Strategic Customers",
    period: "2021 - 2023",
    description: [
      "Provided technical support for telephone systems on the cloud",
      "Wrote guides and presentations, conducted apprenticeships, and administered exercises",
      "Managed the accounts of the largest clients on-site",
      "Worked with ASTERISK, SQL, alongside IT, engineering, and development departments",
    ],
  },
  {
    company: "Voicenter",
    role: "Technical Support Engineer Tier 1",
    period: "2021",
    description: [
      "Conducted analysis of current VoIP networks and computer systems",
      "Resolved VoIP network complications through troubleshooting",
      "Evaluated and enhanced network security measures and protocols",
      "Offered initial technical support to clients via calls, emails, or tickets",
    ],
  },
  {
    company: "ILDC",
    role: "Quality Assurance Tester",
    period: "2018 - 2021",
    description: [
      "Executed QA tests within Sagemcom LAB for Altice (HOT) company's products",
      "Performed daily quality assurance testing of set-top boxes to ensure adherence to standards",
    ],
  },
  {
    company: "IDF",
    role: "Military Service",
    period: "2015 - 2018",
    description: [
      "Performed vehicle treatments and utilized test equipment to ensure optimal functionality",
      "Removed and installed vehicle assemblies in accordance with established procedures",
    ],
  },
];

const Experience = () => {
  const titleTypewriter = useTypewriter({
    text: "Work Experience",
    speed: 80,
    loop: true,
    pauseDuration: 5000,
  });

  const subtitleTypewriter = useTypewriter({
    text: "My professional journey in technology and technical support",
    speed: 25,
    delay: 1200,
    loop: true,
    pauseDuration: 5000,
  });

  return (
    <section id="experience" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {titleTypewriter.displayedText}
            <span className={`inline-block w-[3px] h-[0.8em] bg-primary ml-2 align-middle transition-opacity duration-100 ${titleTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} />
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto min-h-[1.75rem]">
            {subtitleTypewriter.displayedText}
            <span className={`inline-block w-[2px] h-[1em] bg-muted-foreground ml-1 align-middle transition-opacity duration-100 ${subtitleTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} />
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <div
                  key={`${exp.company}-${exp.role}`}
                  className="relative md:pl-16"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 top-6 w-5 h-5 rounded-full bg-primary border-4 border-background hidden md:block" />

                  <div className="card-elevated p-6 hover:border-primary/50 border border-transparent transition-all duration-300">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-display text-xl font-semibold text-foreground">
                          {exp.role}
                        </h3>
                        <div className="flex items-center gap-2 text-primary mt-1">
                          <Briefcase className="w-4 h-4" />
                          <span className="font-medium">{exp.company}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{exp.period}</span>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {exp.description.map((item, i) => (
                        <li key={i} className="text-muted-foreground text-sm flex gap-2">
                          <span className="text-primary">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
