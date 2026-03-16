import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  Activity,
  ChevronRight,
  Cpu,
  Database,
  FileText,
  Loader2,
  Target,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const capabilitiesItems = [
  { icon: Activity, label: "Skeletal Tracking" },
  { icon: Users, label: "Generative Coaching" },
  { icon: Target, label: "Posture Corrections" },
  { icon: FileText, label: "PDF Results" },
];

const techSpecItems = [
  { icon: Database, label: "UCF101 Trained Datasets" },
  { icon: Activity, label: "MediaPipe Skeletal Tracking" },
  { icon: Cpu, label: "OpenAI Analysis" },
];

export default function LandingPage() {
  const { login, isLoggingIn } = useInternetIdentity();
  const { actor } = useActor();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }
    if (mode === "register" && !email.trim()) {
      toast.error("Email is required for registration");
      return;
    }
    if (mode === "register" && actor) {
      try {
        await actor.saveCallerUserProfile({
          username: username.trim(),
          email: email.trim(),
        });
      } catch {
        // Profile will be saved after login success
      }
    }
    login();
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "#0a0f1e" }}
    >
      {/* Stadium background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/generated/cricket-stadium-bg.dim_1920x1080.jpg')",
          opacity: 0.35,
        }}
      />
      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,15,30,0.7) 0%, rgba(10,15,30,0.85) 50%, rgba(10,15,30,0.97) 100%)",
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="pt-12 pb-6 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Logo badge */}
            <div
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
              style={{
                background: "rgba(59,130,246,0.15)",
                border: "1px solid rgba(59,130,246,0.3)",
              }}
            >
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-blue-400 text-xs font-display uppercase tracking-widest font-semibold">
                AI-Powered Cricket Analytics
              </span>
            </div>

            <h1
              className="font-display font-extrabold uppercase tracking-tight text-white mb-3"
              style={{
                fontSize: "clamp(2rem, 6vw, 4.5rem)",
                letterSpacing: "0.04em",
                lineHeight: 1.05,
              }}
            >
              POSTURE{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                DETECTION
              </span>{" "}
              SYSTEM
            </h1>

            <div
              className="w-24 h-1 mx-auto mb-4 rounded-full"
              style={{ background: "linear-gradient(90deg, #3b82f6, #10b981)" }}
            />

            <p
              className="font-body text-white/50 uppercase tracking-widest text-sm max-w-lg mx-auto"
              style={{ letterSpacing: "0.12em" }}
            >
              Posture Based Technique Feedback System for Cricket Batting
            </p>
          </motion.div>
        </header>

        <main className="flex-1 px-4 pb-12">
          <div className="max-w-5xl mx-auto">
            {/* Info Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {/* Capabilities Card */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(59,130,246,0.2)" }}
                  >
                    <Activity
                      className="w-4 h-4"
                      style={{ color: "#3b82f6" }}
                    />
                  </div>
                  <h2 className="font-display font-bold uppercase tracking-widest text-white text-sm">
                    Capabilities
                  </h2>
                </div>
                <ul className="space-y-3">
                  {capabilitiesItems.map((item) => (
                    <li key={item.label} className="flex items-center gap-3">
                      <ChevronRight
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: "#3b82f6" }}
                      />
                      <span className="font-body text-white/80 text-sm">
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technical Specs Card */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(16,185,129,0.2)" }}
                  >
                    <Cpu className="w-4 h-4" style={{ color: "#10b981" }} />
                  </div>
                  <h2 className="font-display font-bold uppercase tracking-widest text-white text-sm">
                    Technical Specs
                  </h2>
                </div>
                <ul className="space-y-3">
                  {techSpecItems.map((item) => (
                    <li key={item.label} className="flex items-center gap-3">
                      <ChevronRight
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: "#10b981" }}
                      />
                      <span className="font-body text-white/80 text-sm">
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Auth Card */}
            <motion.div
              className="max-w-md mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <div className="glass-card-strong p-8">
                {/* Tab Toggle */}
                <div
                  className="flex rounded-lg mb-6 overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <button
                    type="button"
                    data-ocid="landing.login_tab"
                    onClick={() => setMode("login")}
                    className={`flex-1 py-3 text-xs font-display font-bold uppercase tracking-widest transition-all ${
                      mode === "login"
                        ? "text-white"
                        : "text-white/40 hover:text-white/70"
                    }`}
                    style={
                      mode === "login"
                        ? { background: "rgba(59,130,246,0.3)" }
                        : {}
                    }
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    data-ocid="landing.register_tab"
                    onClick={() => setMode("register")}
                    className={`flex-1 py-3 text-xs font-display font-bold uppercase tracking-widest transition-all ${
                      mode === "register"
                        ? "text-white"
                        : "text-white/40 hover:text-white/70"
                    }`}
                    style={
                      mode === "register"
                        ? { background: "rgba(59,130,246,0.3)" }
                        : {}
                    }
                  >
                    Register
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="auth-username"
                      className="block text-xs font-display font-bold uppercase tracking-widest text-white/60 mb-2"
                    >
                      Username
                    </label>
                    <input
                      id="auth-username"
                      data-ocid="auth.username_input"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      autoComplete="username"
                      className="w-full px-4 py-3 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                    />
                  </div>

                  {mode === "register" && (
                    <div>
                      <label
                        htmlFor="auth-email"
                        className="block text-xs font-display font-bold uppercase tracking-widest text-white/60 mb-2"
                      >
                        Email
                      </label>
                      <input
                        id="auth-email"
                        data-ocid="auth.email_input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address"
                        autoComplete="email"
                        className="w-full px-4 py-3 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 transition-all"
                        style={{
                          background: "rgba(255,255,255,0.07)",
                          border: "1px solid rgba(255,255,255,0.12)",
                        }}
                      />
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="auth-password"
                      className="block text-xs font-display font-bold uppercase tracking-widest text-white/60 mb-2"
                    >
                      Password
                    </label>
                    <input
                      id="auth-password"
                      data-ocid="auth.password_input"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      autoComplete={
                        mode === "login" ? "current-password" : "new-password"
                      }
                      className="w-full px-4 py-3 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                    />
                  </div>

                  <button
                    data-ocid="auth.submit_button"
                    type="submit"
                    disabled={isLoggingIn}
                    className="btn-primary w-full py-3 rounded-lg flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <span>
                        {mode === "login" ? "Login" : "Create Account"}
                      </span>
                    )}
                  </button>
                </form>

                <p className="text-center text-white/30 text-xs mt-4">
                  Secured by Internet Identity
                </p>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 py-4 text-center">
          <p className="text-white/25 text-xs font-body">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/50 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
