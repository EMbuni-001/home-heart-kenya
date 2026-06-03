import { createFileRoute } from "@tanstack/react-router";
import { tips } from "@/lib/mock-data";

export const Route = createFileRoute("/app/learn")({
  head: () => ({ meta: [{ title: "Learn — UpCare" }, { name: "description", content: "Tips, briefs and short courses on age-related illness." }] }),
  component: Learn,
});

function Learn() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Learn</h1>
      <p className="text-muted-foreground text-sm">Short, doctor-reviewed reads on common conditions.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {tips.map((t) => (
          <article key={t.id} className="rounded-2xl bg-card border border-border p-4">
            <div className="text-xs uppercase text-healing font-semibold">{t.condition}</div>
            <h3 className="font-semibold mt-1">{t.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t.body}</p>
            <button className="mt-3 text-sm text-trust font-medium">Read more →</button>
          </article>
        ))}
      </div>
    </div>
  );
}
