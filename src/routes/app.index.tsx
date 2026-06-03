import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { tips, providers } from "@/lib/mock-data";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Home — UpCare" }, { name: "description", content: "Your UpCare home: bookings, tips, vitals at a glance." }] }),
  component: Home,
});

function Home() {
  const [tipIdx, setTipIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setTipIdx((i) => (i + 1) % tips.length), 5000); return () => clearInterval(t); }, []);

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm text-muted-foreground">Habari ya leo,</p>
        <h1 className="text-2xl font-bold">Faith — caring for Mama Lucy</h1>
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-2 gap-3">
        <Link to="/app/care" className="rounded-2xl bg-trust text-trust-foreground p-5 soft-shadow">
          <div className="text-xs uppercase tracking-wide opacity-80">Book</div>
          <div className="text-lg font-bold mt-1">Find a caregiver</div>
        </Link>
        <Link to="/app/health" className="rounded-2xl bg-healing text-healing-foreground p-5 soft-shadow">
          <div className="text-xs uppercase tracking-wide opacity-80">Track</div>
          <div className="text-lg font-bold mt-1">Vitals & meds</div>
        </Link>
      </section>

      {/* Tip carousel */}
      <section className="rounded-2xl bg-card border border-border p-5">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">Daily care tip</div>
        <motion.div key={tipIdx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="font-semibold mt-1">{tips[tipIdx].title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{tips[tipIdx].body}</p>
        </motion.div>
        <div className="mt-3 flex gap-1.5">
          {tips.map((_, i) => (
            <button key={i} aria-label={`Tip ${i + 1}`} onClick={() => setTipIdx(i)}
              className={`h-1.5 rounded-full ${i === tipIdx ? "w-5 bg-trust" : "w-1.5 bg-muted"}`} />
          ))}
        </div>
      </section>

      {/* Featured carers */}
      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold">Top-rated near you</h2>
          <Link to="/app/care" className="text-sm text-trust">See all</Link>
        </div>
        <div className="mt-3 -mx-4 px-4 flex gap-3 overflow-x-auto snap-x">
          {providers.slice(0, 4).map((p) => (
            <Link key={p.id} to="/app/care" className="min-w-[220px] snap-start rounded-2xl bg-card border border-border p-4">
              <img src={p.avatar} alt={p.name} className="h-14 w-14 rounded-full bg-muted" />
              <div className="mt-3 font-semibold">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.service} · {p.tier}</div>
              <div className="mt-2 text-sm">★ {p.rating} <span className="text-muted-foreground">({p.reviews})</span></div>
              <div className="mt-1 text-sm font-semibold text-trust">KES {p.rate}/hr</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Emergency banner */}
      <Link to="/app/sos" className="block rounded-2xl bg-destructive/10 border border-destructive/30 p-5">
        <div className="text-destructive font-bold">Emergency? Tap for SOS</div>
        <p className="text-sm text-muted-foreground mt-1">Alert priority contacts & nearest hospital in seconds.</p>
      </Link>
    </div>
  );
}
