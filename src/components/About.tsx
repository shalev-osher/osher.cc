import profilePhoto from "@/assets/profile-photo.jpeg";
import { useTypewriter } from "@/hooks/useTypewriter";

const About = () => {
  const titleTypewriter = useTypewriter({
    text: "About Me",
    speed: 80,
    loop: true,
    pauseDuration: 5000,
  });

  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-secondary overflow-hidden relative">
              <img 
                src={profilePhoto} 
                alt="Shalev Osher"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-48 h-48 border-2 border-primary/30 rounded-2xl -z-10" />
          </div>

          <div className="space-y-6">
            <h2 className="font-display text-4xl md:text-5xl font-bold line-decoration">
              {titleTypewriter.displayedText}
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
            
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center p-4 card-elevated">
                <span className="font-display text-3xl font-bold text-gradient">7+</span>
                <p className="text-muted-foreground text-sm mt-2">Years Experience</p>
              </div>
              <div className="text-center p-4 card-elevated">
                <span className="font-display text-3xl font-bold text-gradient">4</span>
                <p className="text-muted-foreground text-sm mt-2">Companies</p>
              </div>
              <div className="text-center p-4 card-elevated">
                <span className="font-display text-3xl font-bold text-gradient">450+</span>
                <p className="text-muted-foreground text-sm mt-2">Cert. Hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
