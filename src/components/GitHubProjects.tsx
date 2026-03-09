import { useState, useEffect } from "react";
import { ExternalLink, GitBranch, Star, Code2 } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import GradientText from "@/components/GradientText";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTypewriter } from "@/hooks/useTypewriter";

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
  topics: string[];
  owner: { login: string };
}

const GITHUB_USERNAME = "shalev-osher";

const languageColors: Record<string, string> = {
  TypeScript: "hsl(210 80% 60%)", JavaScript: "hsl(50 90% 55%)", Python: "hsl(210 60% 50%)",
  Java: "hsl(20 80% 55%)", HTML: "hsl(15 85% 55%)", CSS: "hsl(200 80% 55%)",
  Shell: "hsl(120 40% 50%)", Go: "hsl(195 70% 55%)", Rust: "hsl(25 70% 50%)",
  C: "hsl(210 30% 50%)", "C++": "hsl(340 60% 55%)", "C#": "hsl(270 60% 55%)",
};

const GitHubProjects = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { t } = useLanguage();
  const titleTypewriter = useTypewriter({ text: t("github.title"), speed: 80, loop: true, pauseDuration: 5000 });
  const subtitleTypewriter = useTypewriter({ text: t("github.subtitle"), speed: 25, delay: 1000, loop: true, pauseDuration: 5000 });

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6&type=owner`)
      .then((res) => { if (!res.ok) throw new Error("Failed"); return res.json(); })
      .then((data: GitHubRepo[]) => { setRepos(data.filter((r) => !r.fork).slice(0, 6)); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  if (error || (!loading && repos.length === 0)) return null;

  return (
    <section id="projects" className="py-24 relative overflow-hidden section-glow">
      <div className="absolute inset-0" style={{ background: "var(--gradient-radial)" }} />
      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection animation="blur">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <GradientText>{titleTypewriter.displayedText}</GradientText>
              <span className={`inline-block w-[3px] h-[0.8em] bg-primary ms-2 align-middle transition-opacity duration-100 ${titleTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto min-h-[1.75rem]">
              {subtitleTypewriter.displayedText}
              <span className={`inline-block w-[2px] h-[1em] bg-muted-foreground ms-1 align-middle transition-opacity duration-100 ${subtitleTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
            </p>
          </div>
        </AnimatedSection>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-premium p-6 h-48 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-4" />
                <div className="h-3 bg-muted rounded w-full mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo, index) => (
              <AnimatedSection key={repo.id} delay={index * 0.1} animation="scaleUp">
                <motion.a
                  href={repo.html_url} target="_blank" rel="noopener noreferrer"
                  className="group card-premium h-full flex flex-col cursor-pointer block overflow-hidden"
                  whileHover={{ scale: 1.02, rotateY: 3, rotateX: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ transformPerspective: 1000 }}
                >
                  {/* GitHub OG preview image */}
                  <div className="relative w-full h-32 overflow-hidden bg-secondary/50">
                    <img
                      src={`https://opengraph.githubassets.com/1/${repo.owner.login}/${repo.name}`}
                      alt={`${repo.name} preview`}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Code2 className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground text-sm">
                        {repo.stargazers_count > 0 && (
                          <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" />{repo.stargazers_count}</span>
                        )}
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                      </div>
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{repo.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-grow mb-4">{repo.description || t("github.noDesc")}</p>
                    <div className="flex items-center justify-between mt-auto">
                      {repo.language && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: languageColors[repo.language] || "hsl(var(--muted-foreground))" }} />
                          {repo.language}
                        </div>
                      )}
                      <GitBranch className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  </div>
                </motion.a>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default GitHubProjects;
