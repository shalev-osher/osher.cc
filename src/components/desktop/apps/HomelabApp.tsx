import { motion } from "framer-motion";
import {
  Container, Shield, Globe, Cloud, Database, Lock, Server, Network,
  CheckCircle2, ExternalLink,
} from "lucide-react";

interface Svc {
  name: string;
  role: string;
  desc: string;
  status: "Running" | "Healthy" | "Active";
  url?: string;
  Icon: React.ComponentType<{ className?: string }>;
  accent: string;
}

const SERVICES: Svc[] = [
  {
    name: "Docker",
    role: "Container runtime",
    desc: "All self-hosted apps run as containers, managed via Compose with persistent volumes and an internal proxy network.",
    status: "Running",
    Icon: Container,
    accent: "from-sky-500/30 to-sky-500/5",
  },
  {
    name: "Authentik",
    role: "SSO / Identity Provider",
    desc: "OIDC + forward-auth in front of every internal service. MFA enforced, group-based access policies.",
    status: "Healthy",
    Icon: Shield,
    accent: "from-amber-500/30 to-amber-500/5",
  },
  {
    name: "Nginx Proxy Manager",
    role: "Reverse proxy + TLS",
    desc: "Automatic Let's Encrypt certificates, per-host ACLs, websocket support, custom locations for streaming apps.",
    status: "Active",
    Icon: Globe,
    accent: "from-emerald-500/30 to-emerald-500/5",
  },
  {
    name: "Cloudflare Tunnel",
    role: "Zero-trust exposure",
    desc: "Public services reach the homelab without opening a single inbound port. CF Access policies layer on top of Authentik.",
    status: "Running",
    Icon: Cloud,
    accent: "from-orange-500/30 to-orange-500/5",
  },
];

const StatusDot = ({ status }: { status: Svc["status"] }) => (
  <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
    <span className="relative inline-flex w-1.5 h-1.5">
      <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
      <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-400" />
    </span>
    {status}
  </span>
);

const ServiceCard = ({ s, i }: { s: Svc; i: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.05 * i, duration: 0.4 }}
    className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${s.accent} p-5 backdrop-blur-xl hover:border-white/20 transition`}
  >
    <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/5 blur-3xl pointer-events-none" />
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
          <s.Icon className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">{s.name}</div>
          <div className="text-[11px] text-muted-foreground uppercase tracking-wider">{s.role}</div>
        </div>
      </div>
      <StatusDot status={s.status} />
    </div>
    <p className="text-[13px] leading-relaxed text-muted-foreground">{s.desc}</p>
  </motion.div>
);

const InfraDiagram = () => (
  <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
    <div className="flex items-center justify-between mb-4">
      <div>
        <div className="text-sm font-semibold">Traffic flow</div>
        <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Internet → Homelab</div>
      </div>
      <span className="text-[11px] font-mono text-emerald-400">● Zero open ports</span>
    </div>
    <svg viewBox="0 0 700 220" className="w-full h-auto">
      <defs>
        <linearGradient id="wire" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f5a623" stopOpacity="0.1" />
          <stop offset="0.5" stopColor="#f5a623" stopOpacity="0.9" />
          <stop offset="1" stopColor="#f5a623" stopOpacity="0.1" />
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="2" /></filter>
      </defs>

      {/* Nodes */}
      {[
        { x: 40,  y: 100, label: "User",            sub: "browser" },
        { x: 190, y: 100, label: "Cloudflare",      sub: "Tunnel + Access" },
        { x: 350, y: 100, label: "NPM",             sub: "TLS terminate" },
        { x: 510, y: 60,  label: "Authentik",       sub: "SSO + MFA" },
        { x: 510, y: 160, label: "Docker host",     sub: "App containers" },
      ].map((n, i) => (
        <g key={i}>
          <rect x={n.x - 55} y={n.y - 24} width="110" height="48" rx="10"
            fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" />
          <text x={n.x} y={n.y - 4} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600">{n.label}</text>
          <text x={n.x} y={n.y + 12} textAnchor="middle" fill="#9ca3af" fontSize="10">{n.sub}</text>
        </g>
      ))}

      {/* Connections */}
      {[
        "M95 100 L135 100",
        "M245 100 L295 100",
        "M405 100 C 450 100 460 60 455 60",
        "M405 100 C 450 100 460 160 455 160",
      ].map((d, i) => (
        <path key={i} d={d} stroke="url(#wire)" strokeWidth="2" fill="none" filter="url(#glow)">
          <animate attributeName="stroke-dashoffset" from="40" to="0" dur="2s" repeatCount="indefinite" />
        </path>
      ))}

      {/* Arrows */}
      {[135, 295, 455, 455].map((x, i) => (
        <circle key={i} cx={x} cy={i < 2 ? 100 : i === 2 ? 60 : 160} r="3" fill="#f5a623" />
      ))}
    </svg>
  </div>
);

const Stat = ({ label, value, Icon }: { label: string; value: string; Icon: React.ComponentType<{ className?: string }> }) => (
  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
    <Icon className="w-4 h-4 text-amber-400" />
    <div>
      <div className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="text-sm font-semibold font-mono">{value}</div>
    </div>
  </div>
);

const HomelabApp = () => {
  return (
    <div className="min-h-full bg-gradient-to-b from-[#0c1018] to-[#05080d] text-foreground p-6 md:p-8 space-y-6" dir="ltr">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-amber-400/80 font-mono mb-1">
            homelab.osher.cc
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Personal Infrastructure</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Production-grade self-hosted stack running 24/7 on a private network. Designed for zero-trust
            access, automatic TLS, and isolated container workloads.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-[12px] font-mono text-emerald-400">All systems operational</span>
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Uptime"     value="99.9%"   Icon={Server} />
        <Stat label="Services"   value="14 live" Icon={Container} />
        <Stat label="Auth"       value="OIDC+MFA" Icon={Lock} />
        <Stat label="Backups"    value="Nightly" Icon={Database} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SERVICES.map((s, i) => <ServiceCard key={s.name} s={s} i={i} />)}
      </section>

      <InfraDiagram />

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-center gap-2 mb-3">
          <Network className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold">Also running</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[12px] font-mono text-muted-foreground">
          {[
            "Portainer", "Uptime Kuma", "Vaultwarden", "Pi-hole",
            "Gitea", "Jellyfin", "Home Assistant", "Grafana",
            "Prometheus", "PostgreSQL", "Redis", "WireGuard",
          ].map((n) => (
            <div key={n} className="rounded-md border border-white/10 bg-black/30 px-3 py-2">{n}</div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomelabApp;