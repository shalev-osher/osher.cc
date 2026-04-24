import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, Download, Eye, Lock, LogOut, Mail, RefreshCw, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import type { Session } from "@supabase/supabase-js";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import GradientText from "@/components/GradientText";

const ADMIN_EMAIL = "shalev@osher.cc";

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
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authMessage, setAuthMessage] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase.functions.invoke("admin-stats");

    if (error || data?.error) {
      setError(data?.error || error?.message || "Unable to load analytics");
      setStats(null);
    } else {
      setStats(data as AdminStats);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (session) loadStats();
  }, [session]);

  const handleEmailAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthLoading(true);
    setAuthMessage("");

    const result = authMode === "signin"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });

    if (result.error) {
      setAuthMessage(result.error.message);
    } else if (authMode === "signup") {
      setAuthMessage("Check your email to confirm the account, then sign in.");
    }

    setAuthLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthMessage("");

    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/admin",
      extraParams: { prompt: "select_account" },
    });

    if (result.error) setAuthMessage(result.error.message);
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setStats(null);
    setError("");
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
                Protected admin cockpit with Google sign-in, email/password access, and live analytics.
              </p>
            </div>

            {session && (
              <div className="card-premium flex flex-col gap-3 p-4 md:min-w-80">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{session.user.email}</p>
                    <p className="text-xs text-muted-foreground">Authenticated admin session</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" className="flex-1" onClick={loadStats} disabled={loading}>
                    {loading ? <RefreshCw className="animate-spin" /> : <RefreshCw />}
                    Refresh
                  </Button>
                  <Button type="button" variant="outline" onClick={handleLogout} aria-label="Sign out">
                    <LogOut />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {!authReady ? (
            <div className="card-premium flex min-h-[420px] items-center justify-center p-8 text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !session ? (
            <div className="card-premium mx-auto flex min-h-[520px] max-w-xl items-center justify-center p-6 sm:p-8">
              <div className="w-full">
                <div className="mb-7 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary glow-effect">
                    <Lock className="h-7 w-7" />
                  </div>
                  <h2 className="font-display text-3xl font-bold">Admin Sign In</h2>
                  <p className="mt-2 text-muted-foreground">Use Google or email/password to access the private dashboard.</p>
                </div>

                <Button type="button" className="mb-4 w-full" onClick={handleGoogleSignIn} disabled={authLoading}>
                  <ShieldCheck />
                  Continue with Google
                </Button>

                <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  Basic auth
                  <span className="h-px flex-1 bg-border" />
                </div>

                <form className="space-y-3" onSubmit={handleEmailAuth}>
                  <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email" autoComplete="email" required />
                  <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" autoComplete="current-password" required />
                  <Button type="submit" className="w-full" disabled={authLoading || !email || !password}>
                    {authLoading ? <RefreshCw className="animate-spin" /> : <Lock />}
                    {authMode === "signin" ? "Sign in" : "Create account"}
                  </Button>
                </form>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                  <button type="button" className="text-primary hover:text-primary/80" onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}>
                    {authMode === "signin" ? "Create account" : "Back to sign in"}
                  </button>
                  <a className="text-muted-foreground hover:text-primary" href="/reset-password">Forgot password?</a>
                </div>
                {authMessage && <p className="mt-4 rounded-lg border border-border bg-secondary/30 p-3 text-sm text-muted-foreground">{authMessage}</p>}
              </div>
            </div>
          ) : error ? (
            <div className="card-premium flex min-h-[420px] items-center justify-center p-8 text-center">
              <div className="max-w-md">
                <Lock className="mx-auto mb-5 h-10 w-10 text-destructive" />
                <h2 className="font-display text-2xl font-bold">Access blocked</h2>
                <p className="mt-3 text-muted-foreground">{error}</p>
              </div>
            </div>
          ) : !stats ? (
            <div className="card-premium flex min-h-[420px] items-center justify-center p-8 text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card, index) => (
                  <motion.div key={card.label} className="card-premium p-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
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
                    {stats.topReferrers.map((item) => <MetricRow key={item.name} name={item.name} value={item.value} max={stats.summary.totalDownloads || 1} />)}
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
