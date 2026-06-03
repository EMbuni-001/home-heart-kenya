import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { vitals, prescriptions, tips } from "@/lib/mock-data";

export const Route = createFileRoute("/app/health")({
  head: () => ({ meta: [{ title: "Health records — UpCare" }, { name: "description", content: "Track BP & blood sugar. Store prescriptions. Export to PDF, Excel or text." }] }),
  component: Health,
});

type Tab = "vitals" | "meds" | "tips";

function Health() {
  const [tab, setTab] = useState<Tab>("vitals");
  const exportData = (fmt: "PDF" | "Excel" | "Text") => toast.success(`Exporting health records as ${fmt}…`);

  const maxBp = Math.max(...vitals.map((v) => v.systolic));

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Health</h1>

      <div className="flex gap-2 border-b border-border">
        {([["vitals", "Vitals"], ["meds", "Medication"], ["tips", "Tips"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === k ? "border-trust text-trust" : "border-transparent text-muted-foreground"}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === "vitals" && (
        <section className="space-y-4">
          <div className="rounded-2xl bg-card border border-border p-5">
            <div className="flex justify-between items-baseline">
              <div>
                <div className="text-xs uppercase text-muted-foreground">Latest BP</div>
                <div className="text-3xl font-bold">{vitals.at(-1)!.systolic}/{vitals.at(-1)!.diastolic}</div>
                <div className="text-xs text-healing font-medium mt-1">Within normal range</div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase text-muted-foreground">Blood sugar</div>
                <div className="text-3xl font-bold">{vitals.at(-1)!.sugar} <span className="text-base font-medium text-muted-foreground">mmol/L</span></div>
              </div>
            </div>
            <div className="mt-5 flex items-end gap-2 h-32">
              {vitals.map((v) => (
                <div key={v.date} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-md bg-trust/80" style={{ height: `${(v.systolic / maxBp) * 100}%` }} />
                  <div className="text-[10px] text-muted-foreground">{v.date}</div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => toast.success("New reading saved.")} className="w-full py-3 rounded-full bg-trust text-trust-foreground font-semibold">+ Log new reading</button>
          <div className="grid grid-cols-3 gap-2">
            {(["PDF", "Excel", "Text"] as const).map((f) => (
              <button key={f} onClick={() => exportData(f)} className="py-2.5 rounded-full bg-card border border-border text-sm font-medium">Export {f}</button>
            ))}
          </div>
        </section>
      )}

      {tab === "meds" && (
        <section className="space-y-3">
          {prescriptions.map((rx) => (
            <div key={rx.id} className="rounded-2xl bg-card border border-border p-4">
              <div className="flex justify-between">
                <div className="font-semibold">{rx.medicine} · {rx.dose}</div>
                <span className="text-xs text-muted-foreground">{rx.until}</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">{rx.frequency}</div>
              <div className="text-xs text-muted-foreground mt-1">Prescribed by {rx.prescriber}</div>
            </div>
          ))}
          <button onClick={() => toast.success("Prescription draft started.")} className="w-full py-3 rounded-full bg-trust text-trust-foreground font-semibold">+ Add prescription</button>
        </section>
      )}

      {tab === "tips" && (
        <section className="space-y-3">
          {tips.map((t) => (
            <div key={t.id} className="rounded-2xl bg-card border border-border p-4">
              <div className="text-xs uppercase text-healing font-semibold">{t.condition}</div>
              <div className="font-semibold mt-1">{t.title}</div>
              <p className="text-sm text-muted-foreground mt-1">{t.body}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
