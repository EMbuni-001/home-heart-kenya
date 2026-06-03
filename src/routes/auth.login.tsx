import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import logoAsset from "@/assets/upcare-logo.png.asset.json";

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Sign in — UpCare" }, { name: "description", content: "Sign in to your UpCare account." }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { toast.success("Welcome back!"); nav({ to: "/app" }); }, 700);
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-background">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <img src={logoAsset.url} alt="" className="h-10 w-10 rounded-xl object-cover" />
        <span className="font-extrabold text-trust text-xl">UpCare</span>
      </Link>
      <form onSubmit={submit} className="w-full max-w-sm bg-card border border-border rounded-2xl p-6 soft-shadow">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground text-sm mt-1">Sign in to manage care.</p>
        <label className="block mt-5 text-sm font-medium">Phone or Email</label>
        <input required defaultValue="+254 712 000 000" className="mt-1 w-full rounded-xl bg-input/40 border border-border px-3 py-2.5" />
        <label className="block mt-4 text-sm font-medium">Password</label>
        <input required type="password" defaultValue="••••••••" className="mt-1 w-full rounded-xl bg-input/40 border border-border px-3 py-2.5" />
        <button disabled={loading} className="mt-5 w-full py-3 rounded-full bg-trust text-trust-foreground font-semibold disabled:opacity-60">
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          New here? <Link to="/auth/register" className="text-trust font-medium">Create an account</Link>
        </div>
        <div className="mt-3 text-center text-xs text-muted-foreground">
          <Link to="/onboarding" className="underline">Skip — explore as guest</Link>
        </div>
      </form>
    </div>
  );
}
