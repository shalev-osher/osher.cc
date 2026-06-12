import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { iosIcons } from "./ios/iconSet";

/** iOS-style Notification Center / Today View — slides from the top-end. */
const NotificationCenter = () => {
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const { lang } = useLanguage();

  useEffect(() => {
    const toggle = () => setOpen(v => !v);
    const close = () => setOpen(false);
    window.addEventListener("toggle-notification-center", toggle);
    window.addEventListener("close-notification-center", close);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => {
      window.removeEventListener("toggle-notification-center", toggle);
      window.removeEventListener("close-notification-center", close);
      window.removeEventListener("keydown", onKey);
      clearInterval(id);
    };
  }, []);

  const t = (en: string, he: string) => (lang === "he" ? he : en);
  const locale = lang === "he" ? "he-IL" : "en-US";
  const time = now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", hour12: false });
  const date = now.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" });

  const notifications = [
    { app: "mail" as const, title: "Shalev Osher", body: t("New message — let's connect about DevOps roles","הודעה חדשה — בוא נדבר על תפקידי DevOps"), time: t("now","עכשיו") },
    { app: "messages" as const, title: t("AI Assistant","עוזר AI"), body: t("Ask me anything about Shalev's experience","שאל אותי כל דבר על הניסיון של שליו"), time: "2m" },
    { app: "github" as const, title: "GitHub", body: t("New star on Shalev-osher/portfolio","כוכב חדש על Shalev-osher/portfolio"), time: "12m" },
    { app: "linkedin" as const, title: "LinkedIn", body: t("3 recruiters viewed your profile","3 מגייסים צפו בפרופיל שלך"), time: "1h" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[220]" onClick={() => setOpen(false)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside
            dir="ltr"
            initial={{ x: 360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 360, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed top-9 right-3 z-[230] w-[340px] max-h-[80vh] overflow-y-auto p-3
                       rounded-3xl bg-[hsl(220_15%_12%/0.72)] backdrop-blur-2xl border border-white/15
                       shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] text-white space-y-3"
            aria-label="Notification Center"
          >
            <div className="text-center pt-1">
              <div className="text-5xl font-light tabular-nums tracking-tight">{time}</div>
              <div className="text-[11px] text-white/70 mt-1">{date}</div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-widest text-white/50 px-1">{t("Notifications","התראות")}</div>
              {notifications.map((n, i) => {
                const Icon = iosIcons[n.app];
                return (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="flex gap-3 p-3 rounded-2xl bg-white/8 border border-white/10 hover:bg-white/12 transition-colors"
                  >
                    <Icon size={38} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[12px] font-semibold truncate">{n.title}</div>
                        <div className="text-[10px] text-white/55">{n.time}</div>
                      </div>
                      <div className="text-[11px] text-white/75 line-clamp-2">{n.body}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Widget title={t("Weather","מזג אוויר")} body="Tel Aviv · 26°" sub={t("Sunny","שמשי")} />
              <Widget title={t("Calendar","יומן")} body={t("Open to work","פתוח לעבודה")} sub="·" />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

const Widget = ({ title, body, sub }: { title: string; body: string; sub: string }) => (
  <div className="p-3 rounded-2xl bg-white/8 border border-white/10">
    <div className="text-[10px] text-white/55 uppercase tracking-widest">{title}</div>
    <div className="text-[14px] font-semibold mt-1">{body}</div>
    <div className="text-[10px] text-white/55">{sub}</div>
  </div>
);

export default NotificationCenter;