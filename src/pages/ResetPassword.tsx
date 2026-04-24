import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, KeyRound, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GradientText from "@/components/GradientText";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const hasRecoveryToken = useMemo(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    return hash.get("type") === "recovery" || hash.has("access_token");
  }, []);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setMessage("Choose a new password to finish recovery.");
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const updatePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password updated successfully. You can return to the admin page.");
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground noise-texture">
      <section className="relative flex min-h-screen items-center justify-center px-6 py-16">
        <div className="absolute inset-0" style={{ background: "var(--gradient-radial)" }} />
        <form className="card-premium relative z-10 w-full max-w-lg p-8 sm:p-10" onSubmit={updatePassword}>
          <div className="mb-7 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary glow-effect">
              {message ? <CheckCircle2 className="h-7 w-7" /> : <KeyRound className="h-7 w-7" />}
            </div>
            <h1 className="font-display text-4xl font-bold">
              <GradientText>Reset Password</GradientText>
            </h1>
            <p className="mt-3 text-muted-foreground">
              {hasRecoveryToken ? "Set a new password for your admin account." : "Open this page from the recovery email link."}
            </p>
          </div>

          <div className="space-y-3">
            <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="New password" autoComplete="new-password" required />
            <Input value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} type="password" placeholder="Confirm password" autoComplete="new-password" required />
            <Button type="submit" className="w-full" disabled={loading || !hasRecoveryToken}>
              {loading ? <RefreshCw className="animate-spin" /> : <KeyRound />}
              Update password
            </Button>
          </div>

          {error && <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          {message && <p className="mt-4 rounded-lg border border-border bg-secondary/30 p-3 text-sm text-muted-foreground">{message}</p>}
          <a href="/admin" className="mt-5 inline-flex text-sm font-semibold text-primary hover:text-primary/80">Return to admin</a>
        </form>
      </section>
    </main>
  );
};

export default ResetPassword;
