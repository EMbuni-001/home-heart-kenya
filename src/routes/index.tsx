import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import logoAsset from "@/assets/upcare-logo.png.asset.json";
import heroImg from "@/assets/hero-care.jpg";
import physioImg from "@/assets/physio.jpg";
import counselImg from "@/assets/counsel.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UpCare — Trusted home care for seniors in Kenya" },
      { name: "description", content: "Vetted caregivers, physiotherapists and counselors for seniors across Kenya. Book in minutes. Track health. Stay safe — even offline." },
      { property: "og:title", content: "UpCare — Trusted home care for seniors in Kenya" },
      { property: "og:description", content: "Vetted caregivers, physiotherapists and counselors for seniors. Book in minutes." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Landing,
});

const slides = [
  { img: heroImg, title: "Care that comes home", sub: "Match with vetted caregivers near you in minutes." },
  { img: physioImg, title: "Physiotherapy at your doorstep", sub: "Licensed therapists for recovery, mobility & strength." },
  { img: counselImg, title: "Listening ears, healing hearts", sub: "Counselors for seniors and the families who love them." },
];

function Landing() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % slides.length), 4500); return () => clearInterval(t); }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 backdrop-blur bg-background/80 border-b border-border">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoAsset.url} alt="UpCare" className="h-9 w-9 rounded-xl object-cover" />
            <span className="font-extrabold text-trust text-lg tracking-tight">UpCare</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#how">How it works</a>
            <a href="#services">Services</a>
            <a href="#trust">Why UpCare</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/auth/login" className="px-4 py-2 rounded-full text-sm text-foreground hover:bg-muted">Sign in</Link>
            <Link to="/onboarding" className="px-4 py-2 rounded-full text-sm bg-trust text-trust-foreground hover:opacity-90">Get started</Link>
          </div>
        </div>
      </header>

      {/* Hero carousel */}
      <section className="max-w-6xl mx-auto px-5 pt-10 md:pt-16 pb-10 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
            🇰🇪 Built for Kenyan families
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight">
            Home care for the people who <span className="text-trust">raised us</span>.
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-4 text-lg text-muted-foreground">
            Book vetted caregivers, physiotherapists and counselors across Kenya — by the hour, day or shift. Track vitals, store prescriptions and respond to emergencies in one calm app.
          </motion.p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/onboarding" className="px-6 py-3 rounded-full bg-trust text-trust-foreground font-semibold soft-shadow">Find a caregiver</Link>
            <Link to="/onboarding" search={{ role: "provider" }} className="px-6 py-3 rounded-full bg-card border border-border font-semibold">Offer care services</Link>
          </div>
          <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
            <div><span className="font-bold text-foreground">1,200+</span> vetted carers</div>
            <div><span className="font-bold text-foreground">47</span> counties</div>
            <div><span className="font-bold text-foreground">4.8★</span> avg rating</div>
          </div>
        </div>

        <motion.div className="relative h-[420px] rounded-3xl overflow-hidden soft-shadow" initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          {slides.map((s, idx) => (
            <motion.div key={idx} className="absolute inset-0" animate={{ opacity: i === idx ? 1 : 0 }} transition={{ duration: 0.8 }}>
              <img src={s.img} alt={s.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-trust/70 via-trust/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-trust-foreground">
                <h3 className="text-2xl font-bold">{s.title}</h3>
                <p className="text-sm opacity-90 mt-1">{s.sub}</p>
              </div>
            </motion.div>
          ))}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {slides.map((_, idx) => (
              <button key={idx} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}`} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-white" : "w-1.5 bg-white/50"}`} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Services */}
      <section id="services" className="max-w-6xl mx-auto px-5 py-16">
        <h2 className="text-3xl font-bold text-center">Three ways we show up</h2>
        <p className="text-center text-muted-foreground mt-2">Choose by tier: Assistant, Intermediate or Professional.</p>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {[
            { t: "Caregiving", d: "Feeding, bathing, medication, companionship — day or night shifts.", c: "bg-trust text-trust-foreground" },
            { t: "Physiotherapy", d: "Stroke recovery, mobility, post-op rehab — at home.", c: "bg-healing text-healing-foreground" },
            { t: "Counseling", d: "Grief, dementia families, anxiety — for elders and loved ones.", c: "bg-hope text-hope-foreground" },
          ].map((s, idx) => (
            <motion.div key={s.t} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }}
              className="rounded-2xl bg-card border border-border p-6 soft-shadow">
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${s.c}`}>{s.t}</div>
              <p className="mt-4 text-muted-foreground">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How */}
      <section id="how" className="bg-secondary/40">
        <div className="max-w-6xl mx-auto px-5 py-16">
          <h2 className="text-3xl font-bold text-center">How UpCare works</h2>
          <ol className="mt-10 grid md:grid-cols-4 gap-4">
            {[
              { t: "Tell us", d: "About your loved one's needs", bg: "bg-pastel-blush" },
              { t: "Match", d: "We surface vetted carers near you", bg: "bg-pastel-mint" },
              { t: "Book", d: "Pick the shift, scope and tier", bg: "bg-pastel-sky" },
              { t: "Care on", d: "Track vitals & rate the visit", bg: "bg-pastel-butter" },
            ].map(({ t, d, bg }, idx) => (
              <li key={t} className={`rounded-2xl ${bg} text-pastel-ink border border-border/40 p-5 soft-shadow`}>
                <div className="font-bold opacity-70">0{idx + 1}</div>
                <div className="font-semibold mt-1">{t}</div>
                <div className="text-sm opacity-80 mt-1">{d}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Trust */}
      <section id="trust" className="max-w-6xl mx-auto px-5 py-16 grid md:grid-cols-3 gap-5">
        {[
          ["KDPA-compliant", "Your data is sovereign. Aligned with Kenya's Data Protection Act, 2019."],
          ["Vetted carers", "ID, KMPDC / KCPB checks, references & police clearance."],
          ["Works offline", "Critical records and emergency contacts available without internet."],
        ].map(([t, d]) => (
          <div key={t} className="rounded-2xl bg-card border border-border p-6">
            <div className="font-semibold">{t}</div>
            <p className="text-sm text-muted-foreground mt-2">{d}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logoAsset.url} alt="" className="h-7 w-7 rounded-lg object-cover" />
            <span className="font-bold text-trust">UpCare</span>
            <span className="text-xs text-muted-foreground ml-2">© 2026 · Nairobi, Kenya</span>
          </div>
          <div className="flex gap-5 text-sm text-muted-foreground">
            <Link to="/onboarding">Get started</Link>
            <Link to="/auth/login">Sign in</Link>
            <Link to="/app">Open app</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
