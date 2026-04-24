import { useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, Download, Eye, Lock, Mail, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import GradientText from "@/components/GradientText";

type AdminStats = {
  summary: {
    totalDownloads: number;
    totalContacts: number;
    last7DaysDownloads: number;
    last7DaysContacts: number;
  };
  dailyDownloads: Array<{ date: string; count: number }>;
  byLanguage: Array<{ name: string; value: number }>;
  byDevice: Array<{ name: string; value: number }>;
  topReferrers: Array<{ name: string; value: number }>;
  recentContacts: Array<{ id: string; name: string; email: string; message: string; created_at: string }>;
};

const Admin = () => {
  const [password, setPassword] = useState("");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadStats = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase.functions.invoke("admin-stats", {
      headers: { "x-admin-password": password },
    });

    if (error || data?.error) {
      setError(data?.error || error?.message || "Unable to load analytics");
      setStats(null);
    } else {
      setStats(data as AdminStats);
    }

    setLoading(false);
  };

  const cards = useMemo(
    () => [
      { label: "Total CV Downloads", value: stats?.summary.totalDownloads ?? 0, icon: Download },
      { label: "Contact Leads", value: stats?.summary.totalContacts ?? 0, icon: Mail },
      { label: "7-Day Downloads", value: stats?.summary.last7DaysDownloads ?? 0, icon: Activity },
      { label: "7-Day Leads", value: stats?.summary.last7DaysContacts ?? 0, icon: Eye },
    ],
    [stats],
  );

  return (
    <main className="min-h-screen bg-background text-foreground noise-texture">
      <section className="relative overflow-hidden px-6 py-10 sm:py-14">
        <div className="absolute inset-0" style={{ background: "var(--gradient-radial)" }} />
        <div className="container relative z-10 mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <a href="/" className="mb-5 inline-flex text-sm font-semibold text-primary hover:text-primary/80">
                ← Back home
              </a>
              <h1 className="font-display text-4xl font-bold md:text-6xl">
                <GradientText>Private Analytics</GradientText>
              </h1>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                CV download signals, contact leads, device split, and referrer quality in one protected cockpit.
              </p>
            </div>

            <form
              className="card-premium flex w-full flex-col gap-3 p-4 md:max-w-md"
              onSubmit={(event) => {
                event.preventDefault();
                loadStats();
              }}
            >
              <label className="text-sm font-semibold text-muted-foreground" htmlFor="admin-password">
                Admin password
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Lock className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="ps-9"
                    placeholder="Enter password"
                    autoComplete="current-password"
                  />
                </div>
                <Button type="submit" disabled={loading || !password} aria-label="Load analytics">
                  {loading ? <RefreshCw className="animate-spin" /> : <Eye />}
                </Button>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </form>
          </div>

          {!stats ? (
            <div className="card-premium flex min-h-[420px] items-center justify-center p-8 text-center">
              <div className="max-w-md">
                <Lock className="mx-auto mb-5 h-10 w-10 text-primary" />
                <h2 className="font-display text-2xl font-bold">Protected dashboard</h2>
                <p className="mt-3 text-muted-foreground">Authenticate to reveal live portfolio analytics.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card, index) => (
                  <motion.div
                    key={card.label}
                    className="card-premium p-5"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <card.icon className="h-5 w-5 text-primary" />
                      <Badge variant="secondary">Live</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                    <p className="mt-2 font-display text-3xl font-bold">{card.value.toLocaleString()}</p>
                  </motion.div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                <Panel title="Downloads over 30 days">
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={stats.dailyDownloads}>
                      <defs>
                        <linearGradient id="downloadsFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                      <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="url(#downloadsFill)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Panel>

                <Panel title="Device split">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={stats.byDevice}>
                      <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Panel>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Panel title="Top referrers">
                  <div className="space-y-3">
                    {stats.topReferrers.map((item) => (
                      <MetricRow key={item.name} name={item.name} value={item.value} max={stats.summary.totalDownloads || 1} />
                    ))}
                  </div>
                </Panel>

                <Panel title="Recent contacts">
                  <div className="max-h-[360px] space-y-3 overflow-y-auto pe-2">
                    {stats.recentContacts.map((contact) => (
                      <article key={contact.id} className="rounded-lg border border-border/50 bg-secondary/30 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-display font-semibold">{contact.name}</h3>
                          <span className="text-xs text-muted-foreground">{new Date(contact.created_at).toLocaleDateString()}</span>
                        </div>
                        <a className="mt-1 block text-sm text-primary" href={`mailto:${contact.email}`}>{contact.email}</a>
                        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{contact.message}</p>
                      </article>
                    ))}
                  </div>
                </Panel>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

const Panel = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="card-premium p-5">
    <h2 className="mb-5 font-display text-xl font-bold">{title}</h2>
    {children}
  </section>
);

const MetricRow = ({ name, value, max }: { name: string; value: number; max: number }) => (
  <div>
    <div className="mb-1 flex items-center justify-between gap-4 text-sm">
      <span className="truncate text-muted-foreground">{name}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-secondary">
      <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(6, (value / max) * 100)}%` }} />
    </div>
  </div>
);

export default Admin;