import { Mail, Phone, MapPin, Linkedin, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTypewriter } from "@/hooks/useTypewriter";
import AnimatedSection from "@/components/AnimatedSection";
import GradientText from "@/components/GradientText";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import ConstellationBackground from "@/components/ConstellationBackground";

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLanguage();

  const titleTypewriter = useTypewriter({ text: t("contact.title"), speed: 80, loop: true, pauseDuration: 5000 });
  const subtitleTypewriter = useTypewriter({ text: t("contact.subtitle"), speed: 25, delay: 1200, loop: true, pauseDuration: 5000 });

  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case "name":
        if (!value.trim()) return t("contact.errorName") || "Name is required";
        if (value.length > 100) return "Max 100 characters";
        return undefined;
      case "email":
        if (!value.trim()) return t("contact.errorEmail") || "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return t("contact.errorEmailFormat") || "Invalid email format";
        return undefined;
      case "message":
        if (!value.trim()) return t("contact.errorMessage") || "Message is required";
        if (value.length > 2000) return "Max 2000 characters";
        return undefined;
      default: return undefined;
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field as keyof typeof formData]);
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const error = validateField(field, value);
      setFieldErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: FieldErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      message: validateField("message", formData.message),
    };
    setFieldErrors(errors);
    setTouched({ name: true, email: true, message: true });

    if (Object.values(errors).some(Boolean)) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: { name: formData.name.trim(), email: formData.email.trim(), message: formData.message.trim() },
      });
      if (error) throw error;

      setSubmitted(true);
      toast({ title: t("contact.successTitle") || "Message sent!", description: t("contact.successDesc") || "Your message has been sent successfully." });
      setFormData({ name: "", email: "", message: "" });
      setTouched({});
      setFieldErrors({});
      setTimeout(() => setSubmitted(false), 4000);
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

  const fieldClass = (field: string) => {
    const hasError = touched[field] && fieldErrors[field as keyof FieldErrors];
    const isValid = touched[field] && !fieldErrors[field as keyof FieldErrors] && formData[field as keyof typeof formData].trim();
    return `bg-background/50 border-border/50 focus:border-primary h-12 transition-all duration-300 ${
      hasError ? "border-destructive focus:border-destructive ring-1 ring-destructive/20" : ""
    } ${isValid ? "border-green-500/50 focus:border-green-500" : ""}`;
  };

  return (
    <section id="contact" className="py-24 relative section-glow overflow-hidden" aria-labelledby="contact-heading">
      <div className="absolute inset-0" style={{ background: 'var(--gradient-radial)' }} />
      <ConstellationBackground starCount={60} linkDistance={120} mouseInfluence={160} />

      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection animation="blur">
          <div className="text-center mb-16">
            <h2 id="contact-heading" className="font-display text-4xl md:text-5xl font-bold mb-4">
              <GradientText>{titleTypewriter.displayedText}</GradientText>
              <span className={`inline-block w-[3px] h-[0.8em] bg-primary ms-2 align-middle transition-opacity duration-100 ${titleTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto min-h-[1.75rem]">
              {subtitleTypewriter.displayedText}
              <span className={`inline-block w-[2px] h-[1em] bg-muted-foreground ms-1 align-middle transition-opacity duration-100 ${subtitleTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
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
            <form onSubmit={handleSubmit} className="space-y-5 card-premium p-8 relative" aria-label="Contact form">
              {/* Success overlay */}
              <AnimatePresence>
                {submitted && (
                  <motion.div
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-card/95 backdrop-blur-sm rounded-xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                    >
                      <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                    </motion.div>
                    <p className="font-display text-xl font-semibold">{t("contact.successTitle") || "Message Sent!"}</p>
                    <p className="text-muted-foreground text-sm mt-1">{t("contact.successDesc") || "Thank you for reaching out."}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label htmlFor="contact-name" className="sr-only">{t("contact.fullName")}</label>
                <Input
                  id="contact-name"
                  placeholder={t("contact.fullName")}
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  className={fieldClass("name")}
                  required maxLength={100} autoComplete="name"
                />
                <AnimatePresence>
                  {touched.name && fieldErrors.name && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-destructive text-xs mt-1.5 ms-1">{fieldErrors.name}</motion.p>
                  )}
                </AnimatePresence>
              </div>
              <div>
                <label htmlFor="contact-email" className="sr-only">{t("contact.emailPlaceholder")}</label>
                <Input
                  id="contact-email" type="email"
                  placeholder={t("contact.emailPlaceholder")}
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={fieldClass("email")}
                  required maxLength={255} autoComplete="email"
                />
                <AnimatePresence>
                  {touched.email && fieldErrors.email && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-destructive text-xs mt-1.5 ms-1">{fieldErrors.email}</motion.p>
                  )}
                </AnimatePresence>
              </div>
              <div>
                <label htmlFor="contact-message" className="sr-only">{t("contact.messagePlaceholder")}</label>
                <Textarea
                  id="contact-message"
                  placeholder={t("contact.messagePlaceholder")}
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  onBlur={() => handleBlur("message")}
                  className={`bg-background/50 border-border/50 focus:border-primary min-h-[150px] resize-none transition-all duration-300 ${
                    touched.message && fieldErrors.message ? "border-destructive focus:border-destructive ring-1 ring-destructive/20" : ""
                  } ${touched.message && !fieldErrors.message && formData.message.trim() ? "border-green-500/50 focus:border-green-500" : ""}`}
                  required maxLength={2000}
                />
                <div className="flex justify-between items-center mt-1.5">
                  <AnimatePresence>
                    {touched.message && fieldErrors.message && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-destructive text-xs ms-1">{fieldErrors.message}</motion.p>
                    )}
                  </AnimatePresence>
                  <p className="text-muted-foreground text-xs ms-auto">{formData.message.length}/2000</p>
                </div>
              </div>
              <Button variant="hero" size="xl" className="w-full gap-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <motion.div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                ) : (
                  <Send className="w-5 h-5" aria-hidden="true" />
                )}
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
