import { createFileRoute } from "@tanstack/react-router";
import { trainings } from "@/lib/mock-data";

export const Route = createFileRoute("/app/trainings")({
  head: () => ({ meta: [{ title: "Trainings — UpCare" }, { name: "description", content: "Upcoming trainings for caregivers, physiotherapists and counselors." }] }),
  component: Trainings,
});

function Trainings() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Upcoming Trainings</h1>
      <div className="space-y-3">
        {trainings.filter((t) => t.type === "Training").map((t) => (
          <div key={t.id} className="rounded-2xl bg-card border border-border p-4 flex justify-between items-start">
            <div>
              <div className="font-semibold">{t.title}</div>
              <div className="text-sm text-muted-foreground">{t.city} · {new Date(t.date).toDateString()}</div>
            </div>
            <button className="px-3 py-1.5 rounded-full bg-trust text-trust-foreground text-sm">Enroll</button>
          </div>
        ))}
      </div>
    </div>
  );
}
