import { Mail, Phone, MapPin, Linkedin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "I'll get back to you as soon as possible.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: "shalev@osher.cc", href: "mailto:shalev@osher.cc" },
    { icon: Phone, label: "Phone", value: "+972-50-722-3763", href: "tel:+972507223763" },
    { icon: MapPin, label: "Location", value: "Ashkelon, Israel", href: null },
    { icon: Linkedin, label: "LinkedIn", value: "shalev-osher", href: "https://linkedin.com/in/shalev-osher/" },
  ];

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Let's Connect
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Looking for a Technical Support Specialist? I'd love to hear from you
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="space-y-8">
            <div className="space-y-6">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">{item.label}</p>
                    {item.href ? (
                      <a 
                        href={item.href} 
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 card-elevated">
              <p className="text-muted-foreground text-sm leading-relaxed">
                I'm open to new opportunities in Technical Support, DevOps, and Cyber Security.
                If you have a suitable role or project that requires my skills, fill out the form 
                and I'll get back to you promptly.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-card border-border focus:border-primary h-12"
                required
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-card border-border focus:border-primary h-12"
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="How can I help you?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-card border-border focus:border-primary min-h-[150px] resize-none"
                required
              />
            </div>
            <Button variant="hero" size="xl" className="w-full gap-2">
              <Send className="w-5 h-5" />
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
