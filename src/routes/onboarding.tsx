import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import logoAsset from "@/assets/upcare-logo.png.asset.json";

type Role = "senior" | "family" | "provider";

export const Route = createFileRoute("/onboarding")({
  validateSearch: (s: Record<string, unknown>) => ({ role: (s.role as Role) ?? undefined }),
  head: () => ({
    meta: [
      { title: "Get started — UpCare" },
      { name: "description", content: "Tell UpCare who you are: a senior, a family member, or a care professional in Kenya." },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  const nav = useNavigate();
  const { role: initial } = useSearch({ from: "/onboarding" });
  const [step, setStep] = useState(initial ? 1 : 0);
  const [role, setRole] = useState<Role | null>(initial ?? null);
  const [tier, setTier] = useState<string>("Intermediate");
  const [service, setService] = useState<string>("Caregiving");
  const [services, setServices] = useState<string[]>([]);

  const toggleService = (s: string) =>
    setServices((arr) => (arr.includes(s) ? arr.filter((x) => x !== s) : [...arr, s]));

  const next = () => setStep((s) => s + 1);
  const finish = () => {
    const payload = role === "provider"
      ? { role, tier, services, name: "Guest" }
      : { role, tier, service, name: "Guest" };
    localStorage.setItem("upcare-user", JSON.stringify(payload));
    toast.success("You're all set! Welcome to UpCare.");
    nav({ to: "/app" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoAsset.url} alt="" className="h-8 w-8 rounded-lg object-cover" />
          <span className="font-bold text-trust">UpCare</span>
        </Link>
        <Link to="/auth/login" className="text-sm text-muted-foreground">Sign in</Link>
      </header>

      <div className="max-w-md mx-auto w-full px-5 flex-1 flex flex-col">
        <div className="flex gap-1.5 mt-4">
          {[0, 1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition ${step >= s ? "bg-trust" : "bg-muted"}`} />
          ))}
        </div>

        <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="flex-1 py-8">
          {step === 0 && (
            <div>
              <h1 className="text-3xl font-bold">Who is this for?</h1>
              <p className="text-muted-foreground mt-2">We tailor UpCare around your role.</p>
              <div className="mt-6 space-y-3">
                {[
                  { v: "senior" as const, t: "I'm a senior", d: "Find help for yourself" },
                  { v: "family" as const, t: "Family / Guardian", d: "Manage care for a loved one" },
                  { v: "provider" as const, t: "Care Professional", d: "Offer caregiving, physio or counseling" },
                ].map((o) => (
                  <button key={o.v} onClick={() => { setRole(o.v); next(); }}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition ${role === o.v ? "border-trust bg-accent" : "border-border bg-card hover:border-trust/40"}`}>
                    <div className="font-semibold">{o.t}</div>
                    <div className="text-sm text-muted-foreground">{o.d}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="text-3xl font-bold">{role === "provider" ? "What service do you offer?" : "What care do you need?"}</h1>
              <div className="mt-6 grid grid-cols-1 gap-3">
                {["Caregiving", "Physiotherapy", "Counseling"].map((s) => (
                  <button key={s} onClick={() => setService(s)}
                    className={`p-4 rounded-2xl text-left border-2 ${service === s ? "border-trust bg-accent" : "border-border bg-card"}`}>
                    <div className="font-semibold">{s}</div>
                  </button>
                ))}
              </div>
              <button onClick={next} className="mt-6 w-full py-3 rounded-full bg-trust text-trust-foreground font-semibold">Continue</button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-3xl font-bold">{role === "provider" ? "Your level of expertise" : "Caregiver tier preference"}</h1>
              <p className="text-muted-foreground mt-2">You can change this anytime.</p>
              <div className="mt-6 space-y-3">
                {[
                  ["Assistant", "Entry-level, supervised tasks"],
                  ["Intermediate", "Certified, 2+ years experience"],
                  ["Professional", "Licensed, 5+ years, complex cases"],
                ].map(([t, d]) => (
                  <button key={t} onClick={() => setTier(t)}
                    className={`w-full text-left p-4 rounded-2xl border-2 ${tier === t ? "border-trust bg-accent" : "border-border bg-card"}`}>
                    <div className="font-semibold">{t}</div>
                    <div className="text-sm text-muted-foreground">{d}</div>
                  </button>
                ))}
              </div>
              <button onClick={next} className="mt-6 w-full py-3 rounded-full bg-trust text-trust-foreground font-semibold">Continue</button>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="text-3xl font-bold">Consent & privacy</h1>
              <p className="text-muted-foreground mt-2">UpCare follows Kenya's Data Protection Act, 2019.</p>
              <ul className="mt-5 space-y-3 text-sm">
                {[
                  "Your health data stays encrypted and yours to delete.",
                  "Emergency alerts are retained for 2 years then auto-deleted.",
                  "Location sharing for caregivers is optional and revocable.",
                ].map((x) => (
                  <li key={x} className="p-3 rounded-xl bg-secondary text-secondary-foreground">{x}</li>
                ))}
              </ul>
              <button onClick={finish} className="mt-6 w-full py-3 rounded-full bg-trust text-trust-foreground font-semibold">I agree — enter UpCare</button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
