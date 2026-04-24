import { useLocation } from "react-router-dom";
import { ArrowLeft, Compass, Home } from "lucide-react";
import { motion } from "framer-motion";
import GradientText from "@/components/GradientText";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallaxBackground from "@/components/ParallaxBackground";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import SkipToContent from "@/components/SkipToContent";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const description = t("notFound.description").split("{path}");

  return (
    <div className="min-h-screen bg-background relative noise-texture">
      <SkipToContent />
      <ParallaxBackground />
      <ScrollProgressBar />
      <Navbar />
      <main id="main-content" role="main">
        <section className="relative flex min-h-screen items-center justify-center px-6 py-20">
          <div className="absolute inset-0" style={{ background: "var(--gradient-radial)" }} />
          <motion.div
            className="card-premium relative z-10 w-full max-w-3xl p-8 text-center sm:p-12"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary glow-effect">
              <Compass className="h-8 w-8" />
            </div>
            <p className="mb-3 font-mono text-sm font-semibold uppercase tracking-[0.25em] text-primary">{t("notFound.badge")}</p>
            <h1 className="mb-5 font-display text-5xl font-bold sm:text-7xl">
              <GradientText>{t("notFound.title")}</GradientText>
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
              {description[0]}
              <span className="font-mono text-foreground">{location.pathname}</span>
              {description[1]}
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="/"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                <Home className="h-4 w-4" />
                {t("notFound.home")}
              </a>
              <button
                type="button"
                onClick={() => history.back()}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-background px-6 text-sm font-semibold transition-all hover:bg-accent hover:text-accent-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("notFound.back")}
              </button>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
