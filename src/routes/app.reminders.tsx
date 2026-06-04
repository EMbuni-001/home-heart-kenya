import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/reminders")({
  head: () => ({ meta: [
    { title: "Reminders — UpCare" },
    { name: "description", content: "Opt-in medication, water and walk reminders shared with your caregiver or family — works offline via SMS." },
  ]}),
  component: Reminders,
});

type Kind = "Medication" | "Water" | "Walk";
interface Reminder {
  id: string;
  kind: Kind;
  label: string;
  time: string; // HH:MM
  enabled: boolean;
  shareWith: string[]; // contact ids
  lastFiredKey?: string;
}
interface Contact { id: string; name: string; phone: string; relation: "Caregiver" | "Family" | "Guardian"; }

const REM_KEY = "upcare-reminders";
const CONT_KEY = "upcare-care-contacts";

const seedReminders: Reminder[] = [
  { id: "r1", kind: "Medication", label: "Amlodipine 5mg", time: "08:00", enabled: true, shareWith: [] },
  { id: "r2", kind: "Water", label: "Glass of water", time: "11:00", enabled: true, shareWith: [] },
  { id: "r3", kind: "Walk", label: "10-min gentle walk", time: "17:00", enabled: false, shareWith: [] },
];
const seedContacts: Contact[] = [
  { id: "c1", name: "Wanjiru (Caregiver)", phone: "+254712000111", relation: "Caregiver" },
  { id: "c2", name: "Faith (Daughter)", phone: "+254712000222", relation: "Family" },
];

function load<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function save<T>(k: string, v: T) { localStorage.setItem(k, JSON.stringify(v)); }

const kindEmoji: Record<Kind, string> = { Medication: "💊", Water: "💧", Walk: "🚶" };
const kindBg: Record<Kind, string> = { Medication: "bg-pastel-blush", Water: "bg-pastel-sky", Walk: "bg-pastel-mint" };

function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [optIn, setOptIn] = useState<boolean>(false);
  const [online, setOnline] = useState<boolean>(typeof navigator !== "undefined" ? navigator.onLine : true);

  useEffect(() => {
    setReminders(load(REM_KEY, seedReminders));
    setContacts(load(CONT_KEY, seedContacts));
    setOptIn(load("upcare-reminders-optin", false));
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener("online", on); window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  // Local in-app alert tick (runs while page open; PWA-compatible best-effort)
  useEffect(() => {
    if (!optIn) return;
    const interval = setInterval(() => {
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const dayKey = now.toISOString().slice(0, 10);
      const updated = reminders.map((r) => {
        if (r.enabled && r.time === hhmm && r.lastFiredKey !== `${dayKey}-${hhmm}`) {
          toast(`${kindEmoji[r.kind]} ${r.kind} reminder`, { description: r.label });
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(`UpCare · ${r.kind}`, { body: r.label });
          }
          return { ...r, lastFiredKey: `${dayKey}-${hhmm}` };
        }
        return r;
      });
      if (JSON.stringify(updated) !== JSON.stringify(reminders)) {
        setReminders(updated); save(REM_KEY, updated);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [optIn, reminders]);

  const persistReminders = (next: Reminder[]) => { setReminders(next); save(REM_KEY, next); };
  const persistContacts = (next: Contact[]) => { setContacts(next); save(CONT_KEY, next); };

  const toggleOptIn = async () => {
    const v = !optIn;
    setOptIn(v); save("upcare-reminders-optin", v);
    if (v && "Notification" in window && Notification.permission === "default") {
      try { await Notification.requestPermission(); } catch { /* ignore */ }
    }
    toast.success(v ? "Reminders ON — we'll nudge you gently." : "Reminders paused.");
  };

  const update = (id: string, patch: Partial<Reminder>) =>
    persistReminders(reminders.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const toggleShare = (id: string, cid: string) => {
    const r = reminders.find((x) => x.id === id); if (!r) return;
    const shareWith = r.shareWith.includes(cid) ? r.shareWith.filter((x) => x !== cid) : [...r.shareWith, cid];
    update(id, { shareWith });
  };

  const sendNow = (r: Reminder) => {
    const recipients = contacts.filter((c) => r.shareWith.includes(c.id));
    if (recipients.length === 0) { toast.error("Pick at least one contact to share with."); return; }
    const body = encodeURIComponent(`UpCare reminder: ${r.kind} — ${r.label} at ${r.time}. Please check in on Mama Lucy.`);
    const numbers = recipients.map((c) => c.phone).join(",");
    // sms: link works offline and opens the device SMS composer pre-filled
    window.location.href = `sms:${numbers}?body=${body}`;
  };

  const addContact = () => {
    const name = prompt("Contact name?"); if (!name) return;
    const phone = prompt("Phone (with country code, e.g. +254...)"); if (!phone) return;
    const relation = (prompt("Relation: Caregiver / Family / Guardian", "Family") || "Family") as Contact["relation"];
    persistContacts([...contacts, { id: `c${Date.now()}`, name, phone, relation }]);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Gentle Reminders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Opt-in nudges for medication, water and walks. Shared with your caregiver or family — and queued as SMS when offline.
        </p>
      </header>

      <section className={`rounded-2xl p-5 border ${optIn ? "bg-pastel-mint border-border/40" : "bg-card border-border"}`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-pastel-ink">{optIn ? "Reminders are ON" : "Turn on reminders"}</div>
            <div className="text-xs text-pastel-ink/80 mt-1">
              You're in control. We'll only alert for items you enable below.
              {!online && <> · <b>Offline mode</b> — SMS sharing uses your phone.</>}
            </div>
          </div>
          <button onClick={toggleOptIn}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${optIn ? "bg-trust text-trust-foreground" : "bg-foreground text-background"}`}>
            {optIn ? "Pause" : "Opt in"}
          </button>
        </div>
      </section>

      <section className="space-y-3">
        {reminders.map((r) => (
          <article key={r.id} className={`rounded-2xl ${kindBg[r.kind]} text-pastel-ink p-4 border border-border/40`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="text-2xl">{kindEmoji[r.kind]}</div>
                <div>
                  <div className="font-semibold">{r.kind}</div>
                  <input
                    value={r.label}
                    onChange={(e) => update(r.id, { label: e.target.value })}
                    className="mt-1 bg-transparent border-b border-pastel-ink/30 text-sm outline-none w-56 max-w-full"
                  />
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <label>At</label>
                    <input type="time" value={r.time}
                      onChange={(e) => update(r.id, { time: e.target.value })}
                      className="bg-card/60 rounded-md px-2 py-1 border border-border/60" />
                  </div>
                </div>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={r.enabled} onChange={(e) => update(r.id, { enabled: e.target.checked })} className="sr-only peer" />
                <span className="w-10 h-6 bg-background/60 rounded-full relative peer-checked:bg-trust transition">
                  <span className={`absolute top-0.5 left-0.5 h-5 w-5 bg-card rounded-full transition ${r.enabled ? "translate-x-4" : ""}`} />
                </span>
              </label>
            </div>

            <div className="mt-3">
              <div className="text-xs font-semibold mb-1.5">Share with</div>
              <div className="flex flex-wrap gap-1.5">
                {contacts.map((c) => {
                  const on = r.shareWith.includes(c.id);
                  return (
                    <button key={c.id} onClick={() => toggleShare(r.id, c.id)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition ${on ? "bg-trust text-trust-foreground border-trust" : "bg-card/70 border-border"}`}>
                      {c.name}
                    </button>
                  );
                })}
              </div>
              <button onClick={() => sendNow(r)}
                className="mt-3 text-xs px-3 py-1.5 rounded-full bg-foreground text-background">
                Send now via SMS {online ? "" : "(offline)"}
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl bg-card border border-border p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Care contacts</h2>
          <button onClick={addContact} className="text-sm text-trust">+ Add</button>
        </div>
        <ul className="mt-3 space-y-2 text-sm">
          {contacts.map((c) => (
            <li key={c.id} className="flex justify-between">
              <span>{c.name} <span className="text-muted-foreground">· {c.relation}</span></span>
              <a href={`sms:${c.phone}`} className="text-trust">{c.phone}</a>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground mt-3">
          Reminders, contacts and opt-in choice are cached on this device, so they work without internet. SMS sharing uses your phone's native messaging — no data plan required.
        </p>
      </section>
    </div>
  );
}
