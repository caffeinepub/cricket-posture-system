import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { generatePDF } from "@/utils/pdfGenerator";
import {
  Activity,
  ChevronDown,
  ChevronUp,
  FileText,
  LogOut,
  RotateCcw,
  Upload,
  Video,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

const MOCK_FEEDBACK = [
  "Detected Shot: Cover Drive",
  "Average Elbow Extension: 162\u00b0",
  "Total Frames Analyzed: 240",
  "Knee Bend Angle: 145\u00b0",
  "Head Position: Stable",
  "Weight Transfer: Forward \u2014 Optimal",
  "Follow Through: Complete",
  "Coaching Tip: Keep elbow higher during backswing for better control",
  "Coaching Tip: Maintain shoulder alignment through contact",
];

export default function Dashboard() {
  const { clear } = useInternetIdentity();
  const { actor } = useActor();
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (f: File) => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      setFile(f);
      setVideoUrl(URL.createObjectURL(f));
      setResults(false);
      setShowFeedback(false);
    },
    [videoUrl],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped?.type.startsWith("video/")) {
        handleFile(dropped);
      } else {
        toast.error("Please drop a valid video file.");
      }
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleRunAnalysis = async () => {
    if (!file) return;
    setAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setAnalyzing(false);
    setResults(true);

    if (actor && videoUrl) {
      try {
        await actor.submitAnalysis(
          videoUrl,
          "mock-report-url",
          "Cover Drive",
          MOCK_FEEDBACK,
        );
      } catch {
        // Non-blocking
      }
    }
  };

  const handleReset = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setFile(null);
    setVideoUrl(null);
    setResults(false);
    setShowFeedback(false);
    setAnalyzing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownloadPDF = () => {
    generatePDF(MOCK_FEEDBACK);
    toast.success("PDF Report downloaded!");
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#0a0f1e" }}
    >
      {/* Subtle gradient overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(16,185,129,0.06) 0%, transparent 50%)",
        }}
      />

      {/* Header */}
      <header
        className="relative z-10 flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(59,130,246,0.2)" }}
          >
            <Activity className="w-4 h-4" style={{ color: "#3b82f6" }} />
          </div>
          <div>
            <h1
              className="font-display font-extrabold uppercase tracking-wider text-white text-sm"
              style={{ letterSpacing: "0.15em" }}
            >
              Training Dashboard
            </h1>
            <p className="text-white/30 text-xs font-body">
              Cricket Posture Analysis System
            </p>
          </div>
        </div>
        <button
          type="button"
          data-ocid="dashboard.logout_button"
          onClick={clear}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/60 hover:text-white transition-all text-xs font-display font-bold uppercase tracking-widest"
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)",
          }}
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </header>

      <main className="relative z-10 flex-1 px-4 py-8 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {!results && !analyzing && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-6">
                <h2
                  className="font-display font-bold uppercase tracking-widest text-white text-lg mb-1"
                  style={{ letterSpacing: "0.12em" }}
                >
                  Upload Video
                </h2>
                <p className="text-white/40 text-sm font-body">
                  Upload a batting video to receive AI-powered posture analysis
                </p>
              </div>

              {/* Dropzone */}
              <label
                htmlFor="video-file-input"
                data-ocid="dashboard.dropzone"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className="relative cursor-pointer rounded-xl flex flex-col items-center justify-center py-16 px-8 transition-all"
                style={{
                  border: `2px dashed ${dragOver ? "#3b82f6" : "rgba(255,255,255,0.15)"}`,
                  background: dragOver
                    ? "rgba(59,130,246,0.07)"
                    : "rgba(255,255,255,0.03)",
                  minHeight: "280px",
                  display: "flex",
                }}
              >
                <input
                  ref={fileInputRef}
                  id="video-file-input"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleInputChange}
                  data-ocid="dashboard.upload_button"
                />

                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                  style={{
                    background: "rgba(59,130,246,0.15)",
                    border: "1px solid rgba(59,130,246,0.3)",
                  }}
                >
                  <Video className="w-8 h-8" style={{ color: "#3b82f6" }} />
                </div>

                {file ? (
                  <>
                    <p className="font-display font-bold uppercase tracking-wider text-white text-base mb-1">
                      {file.name}
                    </p>
                    <p className="text-white/40 text-sm font-body">
                      {(file.size / 1024 / 1024).toFixed(1)} MB — Ready to
                      analyze
                    </p>
                  </>
                ) : (
                  <>
                    <p
                      className="font-display font-bold uppercase tracking-widest text-white text-base mb-2"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      Drag &amp; Drop Video File
                    </p>
                    <p className="text-white/40 text-sm font-body mb-4">
                      or click to browse
                    </p>
                    <div
                      className="px-4 py-2 rounded-lg text-xs font-display font-bold uppercase tracking-widest"
                      style={{
                        background: "rgba(59,130,246,0.15)",
                        color: "#3b82f6",
                        border: "1px solid rgba(59,130,246,0.3)",
                      }}
                    >
                      Browse Files
                    </div>
                  </>
                )}
              </label>

              {/* Run Analysis Button */}
              <button
                type="button"
                data-ocid="dashboard.run_analysis_button"
                onClick={handleRunAnalysis}
                disabled={!file}
                className="btn-primary w-full mt-5 py-4 rounded-xl flex items-center justify-center gap-3 text-sm"
              >
                <Upload className="w-4 h-4" />
                <span>Run Video Analysis</span>
              </button>
            </motion.div>
          )}

          {analyzing && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-24"
              data-ocid="dashboard.loading_state"
            >
              <div className="relative mb-8">
                <div
                  className="w-24 h-24 rounded-full"
                  style={{
                    border: "3px solid rgba(59,130,246,0.15)",
                    borderTop: "3px solid #3b82f6",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity className="w-8 h-8" style={{ color: "#3b82f6" }} />
                </div>
              </div>
              <h2
                className="font-display font-extrabold uppercase tracking-widest text-white text-xl mb-3"
                style={{ letterSpacing: "0.15em" }}
              >
                Analyzing Posture...
              </h2>
              <p className="text-white/40 text-sm font-body text-center max-w-xs">
                MediaPipe skeletal tracking in progress. Calculating
                biomechanics and posture metrics.
              </p>
              <div className="mt-8 flex gap-2" aria-hidden="true">
                {([0, 1, 2] as const).map((i) => (
                  <div
                    key={`dot-${i}`}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "#3b82f6",
                      animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {results && !analyzing && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "#10b981" }}
                />
                <h2
                  className="font-display font-bold uppercase tracking-widest text-white text-lg"
                  style={{ letterSpacing: "0.12em" }}
                >
                  Analysis Complete
                </h2>
              </div>

              {/* Video Player */}
              {videoUrl && (
                <div className="glass-card overflow-hidden">
                  <div
                    className="p-4"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <p className="font-display font-bold uppercase tracking-widest text-white/70 text-xs">
                      Processed Video
                    </p>
                  </div>
                  <video
                    src={videoUrl}
                    controls
                    className="w-full"
                    style={{ maxHeight: "360px", background: "#000" }}
                  >
                    <track kind="captions" label="No captions available" />
                  </video>
                </div>
              )}

              {/* View Results Toggle */}
              <button
                type="button"
                data-ocid="dashboard.view_results_toggle"
                onClick={() => setShowFeedback((p) => !p)}
                className="btn-emerald w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
              >
                {showFeedback ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                <span>{showFeedback ? "Hide Results" : "View Results"}</span>
              </button>

              {/* Biometric Feedback List */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="glass-card p-5">
                      <h3
                        className="font-display font-bold uppercase tracking-widest text-white text-xs mb-4"
                        style={{ letterSpacing: "0.15em" }}
                      >
                        Biometric Analysis Report
                      </h3>
                      <div className="space-y-2">
                        {MOCK_FEEDBACK.map((item, i) => (
                          <div
                            key={item}
                            data-ocid={`results.item.${i + 1}`}
                            className="feedback-item"
                          >
                            <p className="text-white/85 text-sm font-body">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  data-ocid="dashboard.download_pdf_button"
                  onClick={handleDownloadPDF}
                  className="btn-primary flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download PDF Report</span>
                </button>
                <button
                  type="button"
                  data-ocid="dashboard.analyze_another_button"
                  onClick={handleReset}
                  className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-display font-bold uppercase tracking-widest text-white/70 hover:text-white transition-all"
                  style={{
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Analyze Another Video</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 py-4 text-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p className="text-white/20 text-xs font-body">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white/40 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
