import { createFileRoute } from "@tanstack/react-router";
import { trainings } from "@/lib/mock-data";

export const Route = createFileRoute("/app/promotions")({
  head: () => ({ meta: [{ title: "Promotions — UpCare" }, { name: "description", content: "Free clinics, medical talks and promotional offers for seniors." }] }),
  component: Promos,
});

function Promos() {
  const items = trainings.filter((t) => t.type !== "Training");
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Promotions & Free Clinics</h1>
      <div className="space-y-3">
        {items.map((t) => (
          <div key={t.id} className="rounded-2xl bg-hope/40 border border-hope p-4">
            <div className="text-xs uppercase font-bold text-hope-foreground/80">{t.type}</div>
            <div className="font-semibold mt-1">{t.title}</div>
            <div className="text-sm text-muted-foreground">{t.city} · {new Date(t.date).toDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
