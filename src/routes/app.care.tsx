import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { providers, type Service, type Tier, type Provider } from "@/lib/mock-data";
import { OffCanvas } from "@/components/off-canvas";

export const Route = createFileRoute("/app/care")({
  head: () => ({ meta: [{ title: "Find care — UpCare" }, { name: "description", content: "Browse vetted caregivers, physiotherapists and counselors." }] }),
  component: Care,
});

const services: (Service | "All")[] = ["All", "Caregiving", "Physiotherapy", "Counseling"];
const tiers: (Tier | "All")[] = ["All", "Assistant", "Intermediate", "Professional"];

function Care() {
  const [svc, setSvc] = useState<Service | "All">("All");
  const [tier, setTier] = useState<Tier | "All">("All");
  const [selected, setSelected] = useState<Provider | null>(null);

  const filtered = providers.filter((p) =>
    (svc === "All" || p.service === svc) && (tier === "All" || p.tier === tier),
  );

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Find care</h1>

      <div className="space-y-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {services.map((s) => (
            <button key={s} onClick={() => setSvc(s)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${svc === s ? "bg-trust text-trust-foreground" : "bg-muted text-muted-foreground"}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tiers.map((t) => (
            <button key={t} onClick={() => setTier(t)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${tier === t ? "bg-healing text-healing-foreground" : "bg-muted text-muted-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((p) => (
          <button key={p.id} onClick={() => setSelected(p)}
            className="w-full text-left rounded-2xl bg-card border border-border p-4 flex gap-4 hover:border-trust/40 transition">
            <img src={p.avatar} alt={p.name} className="h-14 w-14 rounded-full bg-muted" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold truncate">{p.name}</div>
                <div className="text-sm font-semibold text-trust whitespace-nowrap">KES {p.rate}/hr</div>
              </div>
              <div className="text-xs text-muted-foreground">{p.service} · {p.tier} · {p.location}</div>
              <div className="mt-1 text-sm">★ {p.rating} <span className="text-muted-foreground">({p.reviews} reviews)</span> · {p.shift}</div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-10">No providers match these filters.</p>}
      </div>

      <OffCanvas open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ""}>
        {selected && (
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <img src={selected.avatar} alt="" className="h-16 w-16 rounded-full bg-muted" />
              <div>
                <div className="font-semibold">{selected.name}</div>
                <div className="text-sm text-muted-foreground">{selected.service} · {selected.tier}</div>
                <div className="text-sm">★ {selected.rating} ({selected.reviews})</div>
              </div>
            </div>
            <p className="text-sm">{selected.bio}</p>
            <div>
              <div className="text-xs uppercase text-muted-foreground mb-2">Specialties</div>
              <div className="flex flex-wrap gap-1.5">
                {selected.specialties.map((s) => (
                  <span key={s} className="text-xs px-2 py-1 rounded-full bg-accent text-accent-foreground">{s}</span>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-secondary p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Shift</span><span className="font-medium">{selected.shift}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span className="font-medium">{selected.location}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Rate</span><span className="font-semibold text-trust">KES {selected.rate}/hr</span></div>
            </div>
            <button
              onClick={() => { toast.success(`Request sent to ${selected.name}. They typically respond in under 30 min.`); setSelected(null); }}
              className="w-full py-3 rounded-full bg-trust text-trust-foreground font-semibold">
              Request booking
            </button>
            <button className="w-full py-3 rounded-full bg-card border border-border font-medium">Message</button>
          </div>
        )}
      </OffCanvas>
    </div>
  );
}
