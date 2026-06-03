import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { providers } from "@/lib/mock-data";

export const Route = createFileRoute("/app/ratings")({
  head: () => ({ meta: [{ title: "Ratings — UpCare" }, { name: "description", content: "Rate caregivers, physiotherapists and counselors after each engagement." }] }),
  component: Ratings,
});

function Ratings() {
  const [stars, setStars] = useState(5);
  const [reason, setReason] = useState("Punctual");
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Rate your provider</h1>
      <div className="rounded-2xl bg-card border border-border p-5">
        <div className="flex items-center gap-3">
          <img src={providers[0].avatar} alt="" className="h-12 w-12 rounded-full bg-muted" />
          <div>
            <div className="font-semibold">{providers[0].name}</div>
            <div className="text-xs text-muted-foreground">Last visit · Yesterday</div>
          </div>
        </div>
        <div className="flex gap-2 mt-5 text-3xl">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setStars(n)} className={n <= stars ? "text-hope" : "text-muted"}>★</button>
          ))}
        </div>
        <div className="mt-4 text-sm font-medium">Reason</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {["Punctual", "Kind", "Skilled", "Late", "Communication"].map((r) => (
            <button key={r} onClick={() => setReason(r)}
              className={`px-3 py-1.5 rounded-full text-sm ${reason === r ? "bg-trust text-trust-foreground" : "bg-muted text-muted-foreground"}`}>
              {r}
            </button>
          ))}
        </div>
        <textarea placeholder="Anything else to share?" className="mt-4 w-full rounded-xl bg-input/40 border border-border p-3 text-sm min-h-[80px]" />
        <button onClick={() => toast.success("Thank you — your rating helps families choose well.")}
          className="mt-4 w-full py-3 rounded-full bg-trust text-trust-foreground font-semibold">Submit rating</button>
      </div>

      <h2 className="text-lg font-bold pt-3">Community ratings</h2>
      <div className="space-y-3">
        {providers.slice(0, 4).map((p) => (
          <div key={p.id} className="rounded-2xl bg-card border border-border p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={p.avatar} alt="" className="h-10 w-10 rounded-full bg-muted" />
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.service}</div>
              </div>
            </div>
            <div className="text-sm">★ {p.rating} <span className="text-muted-foreground">({p.reviews})</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
