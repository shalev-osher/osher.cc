import AnimatedSection from "@/components/AnimatedSection";
import GradientText from "@/components/GradientText";
import profilePhoto from "@/assets/profile-photo.jpeg";
import { useTypewriter } from "@/hooks/useTypewriter";
import { motion } from "framer-motion";

const stats = [
  { value: "7+", label: "Years Experience" },
  { value: "4", label: "Companies" },
  { value: "450+", label: "Cert. Hours" },
];

const About = () => {
  const titleTypewriter = useTypewriter({
    text: "About Me",
    speed: 80,
    loop: true,
    pauseDuration: 5000,
  });

  return (
    <section id="about" className="py-24 relative section-glow">
      <div className="absolute inset-0" style={{ background: 'var(--gradient-radial)' }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection animation="slideLeft">
            <div className="relative">
              <motion.div
                className="aspect-square rounded-2xl overflow-hidden relative"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <img 
                  src={profilePhoto} 
                  alt="Shalev Osher"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
              </motion.div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 border border-primary/20 rounded-2xl -z-10" />
              <div className="absolute -top-4 -right-4 w-32 h-32 border border-primary/10 rounded-2xl -z-10" />
              <div className="absolute -bottom-3 -right-3 w-24 h-24 rounded-full -z-10 animate-pulse-glow" style={{ background: 'hsl(var(--primary) / 0.05)' }} />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2} animation="slideRight">
            <div className="space-y-6">
              <h2 className="font-display text-4xl md:text-5xl font-bold line-decoration">
                <GradientText>{titleTypewriter.displayedText}</GradientText>
                <span className={`inline-block w-[3px] h-[0.8em] bg-primary ml-2 align-middle transition-opacity duration-100 ${titleTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} />
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mt-8">
                Experienced Technical Support Specialist with a proven track record of ensuring 
                smooth operation of servers and microservices. Skilled in troubleshooting and 
                resolving technical issues promptly, with extensive networking and system 
                administration expertise.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Adept at utilizing SQL databases, Kibana, and AWS for log analysis and service 
                recording. Successfully manages a technical department, fostering efficient 
                workflow and effective issue resolution. Demonstrates proficiency in working 
                with internal ticketing systems and adhering to SLA workflows.
              </p>
              
              <div className="grid grid-cols-3 gap-4 pt-8">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="text-center p-5 card-premium"
                    whileHover={{ y: -4 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                  >
                    <span className="font-display text-3xl font-bold text-gradient-warm">{stat.value}</span>
                    <p className="text-muted-foreground text-sm mt-2">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default About;
