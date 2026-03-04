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
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  const titleTypewriter = useTypewriter({ text: t("contact.title"), speed: 80, loop: true, pauseDuration: 5000 });
  const subtitleTypewriter = useTypewriter({ text: t("contact.subtitle"), speed: 25, delay: 1200, loop: true, pauseDuration: 5000 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    try {
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: { name, email, message },
      });

      if (error) throw error;

      toast({ title: t("contact.successTitle") || "Message sent!", description: t("contact.successDesc") || "Your message has been sent successfully." });
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Contact form error:", err);
      toast({ title: t("contact.errorTitle") || "Error", description: t("contact.errorDesc") || "Failed to send message. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Mail, label: t("contact.email"), value: "shalev@osher.cc", href: "mailto:shalev@osher.cc" },
    { icon: Phone, label: t("contact.phone"), value: "+972-50-722-3763", href: "tel:+972507223763" },
    { icon: MapPin, label: t("contact.location"), value: t("contact.locationVal"), href: null },
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
                <p className="text-muted-foreground text-sm leading-relaxed">{t("contact.openTo")}</p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2} animation="slideRight">
            <form onSubmit={handleSubmit} className="space-y-5 card-premium p-8" aria-label="Contact form">
              <div>
                <label htmlFor="contact-name" className="sr-only">{t("contact.fullName")}</label>
                <Input id="contact-name" placeholder={t("contact.fullName")} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-background/50 border-border/50 focus:border-primary h-12" required maxLength={100} autoComplete="name" />
              </div>
              <div>
                <label htmlFor="contact-email" className="sr-only">{t("contact.emailPlaceholder")}</label>
                <Input id="contact-email" type="email" placeholder={t("contact.emailPlaceholder")} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="bg-background/50 border-border/50 focus:border-primary h-12" required maxLength={255} autoComplete="email" />
              </div>
              <div>
                <label htmlFor="contact-message" className="sr-only">{t("contact.messagePlaceholder")}</label>
                <Textarea id="contact-message" placeholder={t("contact.messagePlaceholder")} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="bg-background/50 border-border/50 focus:border-primary min-h-[150px] resize-none" required maxLength={2000} />
              </div>
              <Button variant="hero" size="xl" className="w-full gap-2" disabled={isSubmitting}>
                <Send className="w-5 h-5" aria-hidden="true" />
                {isSubmitting ? t("contact.sending") : t("contact.send")}
              </Button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default Contact;
