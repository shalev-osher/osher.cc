import { Mail, Phone, MapPin, Send } from "lucide-react";
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
      title: "ההודעה נשלחה!",
      description: "אחזור אליך בהקדם האפשרי.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  const contactInfo = [
    { icon: Mail, label: "אימייל", value: "hello@example.com" },
    { icon: Phone, label: "טלפון", value: "050-123-4567" },
    { icon: MapPin, label: "מיקום", value: "תל אביב, ישראל" },
  ];

  return (
    <section id="contact" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            בואו נדבר
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            יש לכם פרויקט בראש? אשמח לשמוע על הרעיון שלכם ולראות איך אני יכול לעזור
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
                    <p className="font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 card-elevated">
              <p className="text-muted-foreground text-sm leading-relaxed">
                אני זמין לפרויקטים חדשים ושיתופי פעולה. אם יש לכם רעיון או צורך בפתרון טכנולוגי, 
                מלאו את הטופס ואחזור אליכם תוך 24 שעות.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                placeholder="שם מלא"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-card border-border focus:border-primary h-12"
                required
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="אימייל"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-card border-border focus:border-primary h-12"
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="ספרו לי על הפרויקט שלכם..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-card border-border focus:border-primary min-h-[150px] resize-none"
                required
              />
            </div>
            <Button variant="hero" size="xl" className="w-full gap-2">
              <Send className="w-5 h-5" />
              שליחת הודעה
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
