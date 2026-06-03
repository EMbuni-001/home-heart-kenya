import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { emergencyHotlines } from "@/lib/mock-data";

export const Route = createFileRoute("/app/sos")({
  head: () => ({ meta: [{ title: "Emergency SOS — UpCare" }, { name: "description", content: "Alert priority contacts and nearby hospitals in seconds." }] }),
  component: SOS,
});

const kinds = ["Medical", "Assault", "Invasion", "Disaster"] as const;

function SOS() {
  const [kind, setKind] = useState<(typeof kinds)[number]>("Medical");
  const [sent, setSent] = useState(false);
  const send = () => {
    setSent(true);
    toast.success(`SOS sent — ${kind}. Priority contacts notified.`);
    setTimeout(() => setSent(false), 3500);
  };
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-destructive">Emergency</h1>
      <p className="text-sm text-muted-foreground">Alerts go to your 3 priority contacts and the nearest registered hospital. A copy is kept for 2 years, then auto-deleted.</p>

      <section>
        <div className="text-xs uppercase text-muted-foreground mb-2">Nature of emergency</div>
        <div className="grid grid-cols-2 gap-2">
          {kinds.map((k) => (
            <button key={k} onClick={() => setKind(k)}
              className={`py-3 rounded-2xl border-2 font-medium ${kind === k ? "border-destructive bg-destructive/10 text-destructive" : "border-border bg-card"}`}>
              {k}
            </button>
          ))}
        </div>
      </section>

      <button onClick={send}
        className={`w-full py-6 rounded-3xl font-extrabold text-xl text-trust-foreground transition ${sent ? "bg-healing" : "bg-destructive animate-pulse"}`}>
        {sent ? "✓ Alert delivered" : "Send SOS"}
      </button>

      <section className="rounded-2xl bg-card border border-border p-4">
        <div className="font-semibold mb-3">Priority contacts</div>
        {["Sarah (Daughter) · +254 712 345 678", "Dr. Mutua · +254 733 998 200", "Aga Khan Hospital · +254 20 366 2000"].map((c) => (
          <div key={c} className="flex justify-between py-2 border-t border-border first:border-t-0 text-sm">
            <span>{c}</span>
            <button className="text-trust font-medium">Call</button>
          </div>
        ))}
      </section>

      <section className="rounded-2xl bg-card border border-border p-4">
        <div className="font-semibold mb-3">National hotlines</div>
        {emergencyHotlines.map((h) => (
          <a key={h.number} href={`tel:${h.number}`} className="flex justify-between py-2 border-t border-border first:border-t-0 text-sm">
            <span>{h.name}</span>
            <span className="text-trust font-semibold">{h.number}</span>
          </a>
        ))}
      </section>
    </div>
  );
}
