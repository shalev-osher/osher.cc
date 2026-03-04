import { Mail, Phone, MapPin, Linkedin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTypewriter } from "@/hooks/useTypewriter";
import AnimatedSection from "@/components/AnimatedSection";
import GradientText from "@/components/GradientText";
import { motion } from "framer-motion";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleTypewriter = useTypewriter({ text: "Let's Connect", speed: 80, loop: true, pauseDuration: 5000 });
  const subtitleTypewriter = useTypewriter({ text: "Looking for a Technical Support Specialist? I'd love to hear from you", speed: 25, delay: 1200, loop: true, pauseDuration: 5000 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!name || name.length > 100) {
      toast({ title: "Invalid name", description: "Please enter a valid name (max 100 characters).", variant: "destructive" });
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    if (!message || message.length > 2000) {
      toast({ title: "Invalid message", description: "Please enter a message (max 2000 characters).", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    // Build mailto link as fallback (no backend yet)
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.open(`mailto:shalev@osher.cc?subject=${subject}&body=${body}`, "_self");

    toast({ title: "Opening email client!", description: "Your message will be sent via your default email app." });
    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: "shalev@osher.cc", href: "mailto:shalev@osher.cc" },
    { icon: Phone, label: "Phone", value: "+972-50-722-3763", href: "tel:+972507223763" },
    { icon: MapPin, label: "Location", value: "Ashkelon, Israel", href: null },
    { icon: Linkedin, label: "LinkedIn", value: "shalev-osher", href: "https://linkedin.com/in/shalev-osher/" },
  ];

  return (
    <section id="contact" className="py-24 relative section-glow overflow-hidden" aria-labelledby="contact-heading">
      <div className="absolute inset-0" style={{ background: 'var(--gradient-radial)' }} />

      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection animation="blur">
          <div className="text-center mb-16">
            <h2 id="contact-heading" className="font-display text-4xl md:text-5xl font-bold mb-4">
              <GradientText>{titleTypewriter.displayedText}</GradientText>
              <span className={`inline-block w-[3px] h-[0.8em] bg-primary ml-2 align-middle transition-opacity duration-100 ${titleTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto min-h-[1.75rem]">
              {subtitleTypewriter.displayedText}
              <span className={`inline-block w-[2px] h-[1em] bg-muted-foreground ml-1 align-middle transition-opacity duration-100 ${subtitleTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
            </p>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <AnimatedSection delay={0.1} animation="slideLeft">
            <div className="space-y-8">
              <div className="space-y-4" role="list" aria-label="Contact information">
                {contactInfo.map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="flex items-center gap-4 p-4 card-premium"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    role="listitem"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined} className="font-medium hover:text-primary transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-medium">{item.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="p-6 card-premium">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  I'm open to new opportunities in Technical Support, DevOps, and Cyber Security.
                  If you have a suitable role or project that requires my skills, fill out the form 
                  and I'll get back to you promptly.
                </p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2} animation="slideRight">
            <form onSubmit={handleSubmit} className="space-y-5 card-premium p-8" aria-label="Contact form">
              <div>
                <label htmlFor="contact-name" className="sr-only">Full Name</label>
                <Input id="contact-name" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-background/50 border-border/50 focus:border-primary h-12" required maxLength={100} autoComplete="name" />
              </div>
              <div>
                <label htmlFor="contact-email" className="sr-only">Email</label>
                <Input id="contact-email" type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="bg-background/50 border-border/50 focus:border-primary h-12" required maxLength={255} autoComplete="email" />
              </div>
              <div>
                <label htmlFor="contact-message" className="sr-only">Message</label>
                <Textarea id="contact-message" placeholder="How can I help you?" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="bg-background/50 border-border/50 focus:border-primary min-h-[150px] resize-none" required maxLength={2000} />
              </div>
              <Button variant="hero" size="xl" className="w-full gap-2" disabled={isSubmitting}>
                <Send className="w-5 h-5" aria-hidden="true" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default Contact;
