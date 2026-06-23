"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Input from "@/components/common/Input";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { useHoneypot } from "@/hooks/useHoneypot";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const { HoneypotField, getHoneypotData } = useHoneypot();

  const [tab, setTab] = useState<"login" | "register">("login");

  // Login state
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password state
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState({ type: "", text: "" });
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Register state
  const [registerData, setRegisterData] = useState({ email: "", username: "", password: "", confirmPassword: "", firstName: "", lastName: "" });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [showRegisterPass, setShowRegisterPass] = useState(false);
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const honeypot = getHoneypotData();
    if (honeypot.website) { setIsLoading(false); return; }
    try {
      const { error: authError } = await authClient.signIn.email({ email: formData.email, password: formData.password });
      if (authError) { setError(authError.message || "Login failed"); return; }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMessage({ type: "", text: "" });
    try {
      const res = await fetch("/api/auth/verify-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: forgotEmail }) });
      const data = await res.json();
      if (!res.ok || !data.exists) { setForgotMessage({ type: "error", text: "No account found with that email" }); return; }
      setIsEmailVerified(true);
    } catch {
      setForgotMessage({ type: "error", text: "Failed to verify email" });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    if (newPassword.length < 8) { setPasswordError("Password must be at least 8 characters"); return; }
    if (newPassword !== confirmPassword) { setPasswordError("Passwords do not match"); return; }
    setForgotLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: forgotEmail, password: newPassword }) });
      const data = await res.json();
      if (!res.ok) { setForgotMessage({ type: "error", text: data.error || "Failed to reset password" }); return; }
      setForgotMessage({ type: "success", text: "Password reset! You can now log in." });
      setTimeout(() => {
        setIsForgotOpen(false);
        setForgotEmail(""); setForgotMessage({ type: "", text: "" }); setIsEmailVerified(false);
        setNewPassword(""); setConfirmPassword("");
      }, 2000);
    } catch {
      setForgotMessage({ type: "error", text: "Failed to reset password" });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    const honeypot = getHoneypotData();
    if (honeypot.website) { return; }
    if (registerData.password !== registerData.confirmPassword) { setRegisterError("Passwords do not match"); return; }
    if (registerData.password.length < 8) { setRegisterError("Password must be at least 8 characters"); return; }
    setRegisterLoading(true);
    try {
      const name = [registerData.firstName, registerData.lastName].filter(Boolean).join(" ") || registerData.username;
      const { error: authError } = await authClient.signUp.email({
        email: registerData.email,
        password: registerData.password,
        name,
        username: registerData.username,
        firstName: registerData.firstName || undefined,
        lastName: registerData.lastName || undefined,
      });
      if (authError) { setRegisterError(authError.message || "Registration failed"); return; }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setRegisterError("Registration failed. Please try again.");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#1c1917] banig-xs font-display text-white overflow-x-hidden">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/6 blur-[120px]" />

        <div className="relative w-full max-w-[460px] flex flex-col gap-6">
          {/* Card */}
          <div className="rounded-3xl border border-white/8 bg-[#292524] banig-xs shadow-2xl shadow-black/40 overflow-hidden">
            {/* Tab switcher */}
            <div className="flex border-b border-white/8">
              {(["login", "register"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(""); setRegisterError(""); }}
                  className={`flex-1 py-4 text-sm font-black uppercase tracking-widest transition-all ${
                    tab === t
                      ? "text-primary border-b-2 border-primary bg-primary/5"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {t === "login" ? "Log In" : "Sign Up"}
                </button>
              ))}
            </div>

            <div className="p-5 sm:p-8">
              {tab === "login" ? (
                <div className="flex flex-col gap-6">
                  <div>
                    <h1 className="text-xl font-black text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-2xl text-primary">waving_hand</span>
                      Maligayang pagbabalik!
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">Log in to your IponPinoy account.</p>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 rounded-xl bg-secondary/10 border border-secondary/20 px-4 py-3 text-sm text-secondary">
                      <span className="material-symbols-outlined text-base">error</span>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <HoneypotField />
                    <Input
                      label="Email"
                      type="email"
                      autoComplete="email"
                      placeholder="juandelacruz@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      inputClassName="bg-[#1c1917] border-white/10 focus:border-primary/50 h-12"
                      required
                    />
                    <div>
                      <Input
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        inputClassName="bg-[#1c1917] border-white/10 focus:border-primary/50 h-12 pr-12"
                        required
                        suffix={
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-500 hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-xl">{showPassword ? "visibility_off" : "visibility"}</span>
                          </button>
                        }
                      />
                      <div className="mt-1.5 text-right">
                        <button type="button" onClick={() => setIsForgotOpen(true)} className="text-xs font-bold text-primary/70 hover:text-primary transition-colors">
                          Forgot password?
                        </button>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="mt-1 flex h-12 items-center justify-center rounded-xl bg-primary font-black text-stone-900 shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover disabled:opacity-60"
                    >
                      {isLoading ? "Logging in..." : "Log In"}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div>
                    <h1 className="text-xl font-black text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-2xl text-primary">celebration</span>
                      Sumali na!
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">Create your free IponPinoy account.</p>
                  </div>

                  {registerError && (
                    <div className="flex items-center gap-2 rounded-xl bg-secondary/10 border border-secondary/20 px-4 py-3 text-sm text-secondary">
                      <span className="material-symbols-outlined text-base">error</span>
                      {registerError}
                    </div>
                  )}

                  <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <HoneypotField />
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="First Name" placeholder="Juan" value={registerData.firstName} onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })} inputClassName="bg-[#1c1917] border-white/10 focus:border-primary/50 h-12" />
                      <Input label="Last Name" placeholder="Dela Cruz" value={registerData.lastName} onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })} inputClassName="bg-[#1c1917] border-white/10 focus:border-primary/50 h-12" />
                    </div>
                    <Input label="Username" placeholder="juandelacruz" value={registerData.username} onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })} inputClassName="bg-[#1c1917] border-white/10 focus:border-primary/50 h-12" required />
                    <Input label="Email" type="email" autoComplete="email" placeholder="juandelacruz@example.com" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} inputClassName="bg-[#1c1917] border-white/10 focus:border-primary/50 h-12" required />
                    <Input
                      label="Password"
                      type={showRegisterPass ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Min. 8 characters"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      inputClassName="bg-[#1c1917] border-white/10 focus:border-primary/50 h-12 pr-12"
                      required
                      suffix={<button type="button" onClick={() => setShowRegisterPass(!showRegisterPass)} className="text-slate-500 hover:text-white transition-colors"><span className="material-symbols-outlined text-xl">{showRegisterPass ? "visibility_off" : "visibility"}</span></button>}
                    />
                    <Input
                      label="Confirm Password"
                      type={showRegisterConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Repeat your password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      inputClassName="bg-[#1c1917] border-white/10 focus:border-primary/50 h-12 pr-12"
                      required
                      suffix={<button type="button" onClick={() => setShowRegisterConfirm(!showRegisterConfirm)} className="text-slate-500 hover:text-white transition-colors"><span className="material-symbols-outlined text-xl">{showRegisterConfirm ? "visibility_off" : "visibility"}</span></button>}
                    />
                    <button
                      type="submit"
                      disabled={registerLoading}
                      className="mt-1 flex h-12 items-center justify-center rounded-xl bg-primary font-black text-stone-900 shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover disabled:opacity-60"
                    >
                      {registerLoading ? "Creating account..." : "Create Account, Libre!"}
                    </button>
                    <p className="text-center text-xs text-slate-600">By signing up, you agree to our Terms of Service.</p>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Bottom trust note */}
          <div className="flex items-center justify-center gap-6 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-quaternary">check_circle</span>
              100% libre
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-quaternary">check_circle</span>
              No credit card
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-quaternary">check_circle</span>
              Your data stays yours
            </span>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotOpen}
        onClose={() => { setIsForgotOpen(false); setForgotEmail(""); setForgotMessage({ type: "", text: "" }); setIsEmailVerified(false); setNewPassword(""); setConfirmPassword(""); }}
        title={isEmailVerified ? "Set New Password" : "Reset Password"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsForgotOpen(false)} disabled={forgotLoading}>Cancel</Button>
            {isEmailVerified
              ? <Button onClick={handleResetPassword as unknown as () => void} disabled={forgotLoading}>{forgotLoading ? "Resetting..." : "Reset Password"}</Button>
              : <Button onClick={handleVerifyEmail as unknown as () => void} disabled={forgotLoading}>{forgotLoading ? "Verifying..." : "Verify Email"}</Button>
            }
          </>
        }
      >
        {!isEmailVerified ? (
          <form onSubmit={handleVerifyEmail} className="flex flex-col gap-4">
            <HoneypotField />
            <p className="text-slate-400 text-sm">Enter your registered email to verify your account.</p>
            {forgotMessage.text && (
              <div className={`rounded-lg p-3 text-sm ${forgotMessage.type === "success" ? "bg-green-500/10 border border-green-500/20 text-green-500" : "bg-red-500/10 border border-red-500/20 text-red-500"}`}>{forgotMessage.text}</div>
            )}
            <Input label="Email Address" type="email" placeholder="juandelacruz@example.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required />
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-sm text-green-500"><span className="font-bold">Email verified!</span> Set your new password below.</div>
            {passwordError && <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-500">{passwordError}</div>}
            {forgotMessage.type === "success" && <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-sm text-green-500">{forgotMessage.text}</div>}
            <Input label="New Password" type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <Input label="Confirm Password" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </form>
        )}
      </Modal>
    </div>
  );
}
