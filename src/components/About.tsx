const About = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-secondary overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-display text-6xl text-gradient">א</span>
                </div>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 border-2 border-primary/30 rounded-2xl -z-10" />
          </div>

          <div className="space-y-6">
            <h2 className="font-display text-4xl md:text-5xl font-bold line-decoration">
              אודות
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mt-8">
              אני מפתח תוכנה עם ניסיון רב בפיתוח אפליקציות ווב מתקדמות. 
              מאז שהתחלתי את דרכי בעולם התכנות, אני שואף ליצור מוצרים שמשלבים 
              טכנולוגיה חדשנית עם עיצוב מרהיב.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              אני מאמין שקוד טוב הוא אמנות - הוא צריך להיות נקי, יעיל ויפה. 
              בכל פרויקט אני שואף לספק את הפתרון הטוב ביותר תוך שמירה על 
              סטנדרטים גבוהים של איכות וביצועים.
            </p>
            
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center p-4 card-elevated">
                <span className="font-display text-3xl font-bold text-gradient">5+</span>
                <p className="text-muted-foreground text-sm mt-2">שנות ניסיון</p>
              </div>
              <div className="text-center p-4 card-elevated">
                <span className="font-display text-3xl font-bold text-gradient">50+</span>
                <p className="text-muted-foreground text-sm mt-2">פרויקטים</p>
              </div>
              <div className="text-center p-4 card-elevated">
                <span className="font-display text-3xl font-bold text-gradient">30+</span>
                <p className="text-muted-foreground text-sm mt-2">לקוחות מרוצים</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
