import { Toaster } from "@/components/ui/sonner";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import Dashboard from "@/pages/Dashboard";
import LandingPage from "@/pages/LandingPage";

export default function App() {
  const { isLoginSuccess, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0a0f1e" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-full border-2 animate-spin"
            style={{
              borderColor: "rgba(59,130,246,0.3)",
              borderTopColor: "#3b82f6",
            }}
          />
          <p className="text-white/60 uppercase tracking-widest text-sm font-display">
            Initializing...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoginSuccess ? <Dashboard /> : <LandingPage />}
      <Toaster />
    </>
  );
}
