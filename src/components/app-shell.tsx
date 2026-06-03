import { Link, useLocation } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { type ReactNode } from "react";
import { useTheme } from "./theme-provider";
import logoAsset from "@/assets/upcare-logo.png.asset.json";

const tabs = [
  { to: "/app", label: "Home" },
  { to: "/app/care", label: "Care" },
  { to: "/app/health", label: "Health" },
  { to: "/app/learn", label: "Learn" },
  { to: "/app/sos", label: "SOS" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { theme, toggle } = useTheme();
  const loc = useLocation();
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur bg-background/80 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/app" className="flex items-center gap-2">
            <img src={logoAsset.url} alt="UpCare logo" className="h-8 w-8 rounded-lg object-cover" />
            <span className="font-bold tracking-tight text-trust">UpCare</span>
          </Link>
          <div className="flex items-center gap-2">
            <OfflineBadge />
            <button
              onClick={toggle}
              aria-label="Switch theme"
              className="px-3 py-1.5 rounded-full text-sm bg-secondary text-secondary-foreground hover:bg-accent transition"
            >
              {theme === "light" ? "Dark" : "Light"}
            </button>
          </div>
        </div>
        <nav className="max-w-3xl mx-auto px-4 pb-2 flex gap-2 overflow-x-auto text-sm">
          {[
            { to: "/app/trainings", label: "Trainings" },
            { to: "/app/promotions", label: "Promotions" },
            { to: "/app/ratings", label: "Ratings" },
          ].map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="px-3 py-1 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition whitespace-nowrap"
              activeProps={{ className: "px-3 py-1 rounded-full bg-trust text-trust-foreground whitespace-nowrap" }}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={loc.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur">
        <div className="max-w-3xl mx-auto grid grid-cols-5">
          {tabs.map((t) => {
            const active = loc.pathname === t.to || (t.to !== "/app" && loc.pathname.startsWith(t.to));
            const isSOS = t.to === "/app/sos";
            return (
              <Link
                key={t.to}
                to={t.to}
                className={
                  isSOS
                    ? "flex flex-col items-center justify-center py-3 text-xs font-semibold text-destructive"
                    : `flex flex-col items-center justify-center py-3 text-xs font-medium transition ${
                        active ? "text-trust" : "text-muted-foreground"
                      }`
                }
              >
                <span className={`h-1.5 w-1.5 rounded-full mb-1 ${active ? "bg-trust" : "bg-transparent"}`} />
                {t.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function OfflineBadge() {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return <span className="text-xs px-2 py-0.5 rounded-full bg-hope text-hope-foreground">Offline</span>;
  }
  return null;
}
