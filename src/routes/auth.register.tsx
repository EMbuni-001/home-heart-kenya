import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import logoAsset from "@/assets/upcare-logo.png.asset.json";

export const Route = createFileRoute("/auth/register")({
  head: () => ({ meta: [{ title: "Create account — UpCare" }, { name: "description", content: "Create your UpCare account in under a minute." }] }),
  component: Register,
});

function Register() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { toast.success("Account created. Let's set you up."); nav({ to: "/onboarding" }); }, 700);
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-background">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <img src={logoAsset.url} alt="" className="h-10 w-10 rounded-xl object-cover" />
        <span className="font-extrabold text-trust text-xl">UpCare</span>
      </Link>
      <form onSubmit={submit} className="w-full max-w-sm bg-card border border-border rounded-2xl p-6 soft-shadow">
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="text-muted-foreground text-sm mt-1">Free to join. Pay only when you book.</p>
        <label className="block mt-5 text-sm font-medium">Full name</label>
        <input required placeholder="e.g. Faith Wambui" className="mt-1 w-full rounded-xl bg-input/40 border border-border px-3 py-2.5" />
        <label className="block mt-4 text-sm font-medium">Phone (Kenya)</label>
        <input required placeholder="+254…" className="mt-1 w-full rounded-xl bg-input/40 border border-border px-3 py-2.5" />
        <label className="block mt-4 text-sm font-medium">Password</label>
        <input required type="password" placeholder="At least 8 characters" className="mt-1 w-full rounded-xl bg-input/40 border border-border px-3 py-2.5" />
        <button disabled={loading} className="mt-5 w-full py-3 rounded-full bg-trust text-trust-foreground font-semibold disabled:opacity-60">
          {loading ? "Creating…" : "Create account"}
        </button>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Already have one? <Link to="/auth/login" className="text-trust font-medium">Sign in</Link>
        </div>
      </form>
    </div>
  );
}
