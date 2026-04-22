import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Star, GitFork, Eye, ExternalLink, Github, Calendar, Code2, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "@/contexts/LanguageContext";

interface RepoSummary {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  owner: { login: string };
}

interface FullRepoData {
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  updated_at: string;
  created_at: string;
  default_branch: string;
  size: number;
  license?: { name: string } | null;
}

interface Props {
  repo: RepoSummary | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

const ProjectCaseStudyModal = ({ repo, open, onOpenChange }: Props) => {
  const { lang } = useLanguage();
  const isHe = lang === "he";

  const [readme, setReadme] = useState<string>("");
  const [languages, setLanguages] = useState<Record<string, number>>({});
  const [details, setDetails] = useState<FullRepoData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !repo) return;
    setLoading(true);
    setReadme("");
    setLanguages({});
    setDetails(null);

    const base = `https://api.github.com/repos/${repo.owner.login}/${repo.name}`;

    Promise.allSettled([
      fetch(`${base}/readme`, { headers: { Accept: "application/vnd.github.raw" } }).then((r) =>
        r.ok ? r.text() : ""
      ),
      fetch(`${base}/languages`).then((r) => (r.ok ? r.json() : {})),
      fetch(base).then((r) => (r.ok ? r.json() : null)),
    ]).then(([readmeRes, langsRes, detailsRes]) => {
      if (readmeRes.status === "fulfilled") setReadme(String(readmeRes.value || "").slice(0, 12000));
      if (langsRes.status === "fulfilled") setLanguages(langsRes.value || {});
      if (detailsRes.status === "fulfilled") setDetails(detailsRes.value);
      setLoading(false);
    });
  }, [open, repo]);

  if (!repo) return null;

  const totalBytes = Object.values(languages).reduce((sum, v) => sum + v, 0);
  const langEntries = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const formatDate = (s?: string) => {
    if (!s) return "";
    return new Date(s).toLocaleDateString(isHe ? "he-IL" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto card-premium border-primary/20">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="font-display text-2xl md:text-3xl font-bold flex items-center gap-2 flex-wrap">
                <Code2 className="w-6 h-6 text-primary flex-shrink-0" />
                <span className="text-gradient">{repo.name}</span>
              </DialogTitle>
              {repo.description && (
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {repo.description}
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Hero preview image */}
        <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden border border-border/50 bg-secondary/30">
          <img
            src={`https://opengraph.githubassets.com/1/${repo.owner.login}/${repo.name}`}
            alt={`${repo.name} preview`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={Star} label={isHe ? "כוכבים" : "Stars"} value={repo.stargazers_count} />
          <StatCard icon={GitFork} label={isHe ? "פורקים" : "Forks"} value={details?.forks_count ?? 0} />
          <StatCard icon={Eye} label={isHe ? "צופים" : "Watchers"} value={details?.watchers_count ?? 0} />
          <StatCard icon={Calendar} label={isHe ? "עודכן" : "Updated"} value={formatDate(details?.updated_at)} small />
        </div>

        {/* Language breakdown */}
        {langEntries.length > 0 && (
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-3 text-muted-foreground">
              {isHe ? "שפות" : "Languages"}
            </h4>
            <div className="flex h-2 rounded-full overflow-hidden bg-secondary/40 mb-3">
              {langEntries.map(([lang, bytes]) => (
                <div
                  key={lang}
                  className="h-full transition-all duration-700"
                  style={{
                    width: `${(bytes / totalBytes) * 100}%`,
                    backgroundColor: getLangColor(lang),
                  }}
                  title={`${lang}: ${((bytes / totalBytes) * 100).toFixed(1)}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {langEntries.map(([lang, bytes]) => (
                <Badge key={lang} variant="outline" className="text-xs gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getLangColor(lang) }}
                  />
                  {lang} <span className="text-muted-foreground">{((bytes / totalBytes) * 100).toFixed(1)}%</span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-2 text-muted-foreground">
              {isHe ? "תגיות" : "Topics"}
            </h4>
            <div className="flex flex-wrap gap-2">
              {repo.topics.map((topic) => (
                <Badge key={topic} variant="secondary" className="text-xs">
                  #{topic}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* README */}
        <div>
          <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-3 text-muted-foreground flex items-center gap-2">
            <FileText className="w-4 h-4" />
            README
          </h4>
          {loading ? (
            <div className="space-y-2">
              <div className="h-4 bg-muted/50 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-muted/50 rounded w-full animate-pulse" />
              <div className="h-4 bg-muted/50 rounded w-5/6 animate-pulse" />
            </div>
          ) : readme ? (
            <div className="prose prose-sm dark:prose-invert max-w-none p-4 rounded-lg bg-secondary/30 border border-border/40 max-h-72 overflow-y-auto">
              <ReactMarkdown
                components={{
                  a: ({ node, ...p }) => (
                    <a {...p} target="_blank" rel="noopener noreferrer" className="text-primary underline" />
                  ),
                  img: ({ node, ...p }) => <img {...p} className="rounded-md max-w-full" loading="lazy" />,
                }}
              >
                {readme}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              {isHe ? "אין README זמין" : "No README available"}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <motion.a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:shadow-lg hover:shadow-primary/30 transition-shadow"
          >
            <Github className="w-4 h-4" />
            {isHe ? "צפה ב-GitHub" : "View on GitHub"}
          </motion.a>
          {repo.homepage && (
            <motion.a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-primary/40 text-primary font-medium text-sm hover:bg-primary/10 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              {isHe ? "אתר חי" : "Live Site"}
            </motion.a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  small,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  small?: boolean;
}) => (
  <div className="rounded-lg border border-border/40 bg-secondary/30 p-3 flex flex-col items-center text-center">
    <Icon className="w-4 h-4 text-primary mb-1.5" />
    <div className={`font-display font-bold ${small ? "text-xs" : "text-xl"}`}>{value || 0}</div>
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{label}</div>
  </div>
);

const langColorMap: Record<string, string> = {
  TypeScript: "hsl(210 80% 60%)",
  JavaScript: "hsl(50 90% 55%)",
  Python: "hsl(210 60% 50%)",
  Java: "hsl(20 80% 55%)",
  HTML: "hsl(15 85% 55%)",
  CSS: "hsl(200 80% 55%)",
  Shell: "hsl(120 40% 50%)",
  Go: "hsl(195 70% 55%)",
  Rust: "hsl(25 70% 50%)",
  C: "hsl(210 30% 50%)",
  "C++": "hsl(340 60% 55%)",
  "C#": "hsl(270 60% 55%)",
  PHP: "hsl(240 30% 60%)",
  Ruby: "hsl(0 70% 55%)",
  Vue: "hsl(150 60% 50%)",
  Dockerfile: "hsl(200 70% 55%)",
};

function getLangColor(lang: string) {
  return langColorMap[lang] || "hsl(45 80% 55%)";
}

export default ProjectCaseStudyModal;
