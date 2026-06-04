import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { trainings, type Training } from "@/lib/mock-data";

export const Route = createFileRoute("/app/trainings")({
  head: () => ({ meta: [{ title: "Trainings — UpCare" }, { name: "description", content: "Enroll in trainings matched to your role, services and tier." }] }),
  component: Trainings,
});

type Role = "senior" | "family" | "provider";
type Tier = "Assistant" | "Intermediate" | "Professional";
const tierRank: Record<Tier, number> = { Assistant: 1, Intermediate: 2, Professional: 3 };

interface UpCareUser {
  role?: Role;
  tier?: Tier;
  service?: string;
  services?: string[];
  name?: string;
}

function readUser(): UpCareUser {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem("upcare-user") || "{}"); } catch { return {}; }
}
function readEnrollments(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("upcare-enrollments") || "[]"); } catch { return []; }
}

function eligibility(t: Training, user: UpCareUser): { ok: boolean; reason?: string } {
  if (!user.role) return { ok: false, reason: "Complete onboarding to check eligibility." };
  if (!t.forRoles.includes(user.role)) return { ok: false, reason: `Open to ${t.forRoles.join(", ")}.` };
  if (user.role === "provider") {
    const mine = user.services?.length ? user.services : user.service ? [user.service] : [];
    const overlap = t.forServices.includes("General") || mine.some((s) => t.forServices.includes(s as "Caregiving" | "Physiotherapy" | "Counseling"));
    if (!overlap) return { ok: false, reason: `Requires service: ${t.forServices.join(" / ")}.` };
    if (user.tier && tierRank[user.tier] < tierRank[t.minTier]) return { ok: false, reason: `Requires ${t.minTier}+ tier.` };
  }
  return { ok: true };
}

function Trainings() {
  const [user, setUser] = useState<UpCareUser>({});
  const [enrolled, setEnrolled] = useState<string[]>([]);
  useEffect(() => { setUser(readUser()); setEnrolled(readEnrollments()); }, []);

  const list = useMemo(() => trainings.filter((t) => t.type === "Training"), []);

  const enroll = (t: Training) => {
    const elig = eligibility(t, user);
    if (!elig.ok) { toast.error(elig.reason || "Not eligible."); return; }
    if (enrolled.includes(t.id)) { toast.info("Already enrolled."); return; }
    const next = [...enrolled, t.id];
    setEnrolled(next);
    localStorage.setItem("upcare-enrollments", JSON.stringify(next));
    toast.success(`Enrolled in ${t.title}`);
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold">Upcoming Trainings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {user.role
            ? <>Showing eligibility for <b>{user.role}</b>{user.role === "provider" && user.tier ? <> · {user.tier}</> : null}.</>
            : "Complete onboarding to unlock enrollment."}
        </p>
      </header>
      <div className="space-y-3">
        {list.map((t) => {
          const elig = eligibility(t, user);
          const isEnrolled = enrolled.includes(t.id);
          return (
            <div key={t.id} className="rounded-2xl bg-card border border-border p-4">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <div className="font-semibold">{t.title}</div>
                  <div className="text-sm text-muted-foreground">{t.city} · {new Date(t.date).toDateString()}</div>
                  <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                    <span className="px-2 py-0.5 rounded-full bg-pastel-sky text-pastel-ink">For: {t.forRoles.join(", ")}</span>
                    <span className="px-2 py-0.5 rounded-full bg-pastel-mint text-pastel-ink">{t.forServices.join(" / ")}</span>
                    <span className="px-2 py-0.5 rounded-full bg-pastel-butter text-pastel-ink">Min: {t.minTier}</span>
                  </div>
                </div>
                <button
                  onClick={() => enroll(t)}
                  disabled={!elig.ok || isEnrolled}
                  className="px-3 py-1.5 rounded-full bg-trust text-trust-foreground text-sm disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  {isEnrolled ? "Enrolled ✓" : "Enroll"}
                </button>
              </div>
              {!elig.ok && !isEnrolled && (
                <div className="mt-2 text-xs text-destructive">{elig.reason}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
