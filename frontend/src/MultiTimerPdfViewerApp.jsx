import { useState, useRef, useEffect } from "react";
import AIResponse from "./components/AIResponse";
import { API_URL } from "./config";

// ─── Icons (inline SVG components) ───────────────────────────────────────────
const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);
const PauseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
  </svg>
);
const ResetIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 .49-4.97"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);
const TimerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="13" r="8"/>
    <polyline points="12 9 12 13 14.5 15.5"/>
    <path d="M9 2h6"/>
    <path d="M12 2v3"/>
  </svg>
);
const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
  </svg>
);
const SendIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const XIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const FileIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

// ─── Utility ──────────────────────────────────────────────────────────────────
const formatTime = (sec) => {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
};

const getProgress = (remaining, total) =>
  total > 0 ? ((total - remaining) / total) * 100 : 0;

// ─── Sub-components ───────────────────────────────────────────────────────────

function TimerCard({ timer, onStart, onPause, onReset, onDelete }) {
  const progress = getProgress(timer.remainingSeconds, timer.totalSeconds);
  const isFinished = timer.remainingSeconds === 0;
  const circumference = 2 * Math.PI * 18;
  const strokeDash = circumference - (progress / 100) * circumference;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.55)",
        border: "1px solid rgba(151,143,102,0.25)",
        borderRadius: "16px",
        padding: "16px",
        backdropFilter: "blur(8px)",
        boxShadow: "0 2px 12px rgba(98,43,20,0.06)",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = "0 6px 24px rgba(98,43,20,0.12)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(98,43,20,0.06)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {/* Circular progress */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(151,143,102,0.2)" strokeWidth="3"/>
            <circle
              cx="24" cy="24" r="18"
              fill="none"
              stroke={isFinished ? "#978F66" : timer.running ? "#622B14" : "#995F2F"}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDash}
              transform="rotate(-90 24 24)"
              style={{ transition: "stroke-dashoffset 0.5s ease, stroke 0.3s ease" }}
            />
          </svg>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "10px", fontWeight: "700", color: "#622B14", letterSpacing: "-0.3px",
            fontFamily: "'Courier New', monospace"
          }}>
            {formatTime(timer.remainingSeconds)}
          </div>
        </div>

        {/* Name + status */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: "13px", fontWeight: "600", color: "#2C1A0F",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            marginBottom: "4px"
          }}>
            {timer.name}
          </div>
          <div style={{
            fontSize: "11px",
            color: isFinished ? "#978F66" : timer.running ? "#622B14" : "#995F2F",
            fontWeight: "500", letterSpacing: "0.3px", textTransform: "uppercase"
          }}>
            {isFinished ? "Finished" : timer.running ? "● Running" : "Paused"}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
          {!timer.running ? (
            <IconButton onClick={() => onStart(timer.id)} title="Start" primary disabled={isFinished}>
              <PlayIcon />
            </IconButton>
          ) : (
            <IconButton onClick={() => onPause(timer.id)} title="Pause">
              <PauseIcon />
            </IconButton>
          )}
          <IconButton onClick={() => onReset(timer.id)} title="Reset">
            <ResetIcon />
          </IconButton>
          <IconButton onClick={() => onDelete(timer.id)} title="Delete" danger>
            <TrashIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

function IconButton({ onClick, children, title, primary, danger, disabled }) {
  const [hovered, setHovered] = useState(false);
  const base = {
    width: "30px", height: "30px",
    borderRadius: "8px", border: "none", cursor: disabled ? "not-allowed" : "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.15s ease, transform 0.15s ease",
    outline: "none",
    opacity: disabled ? 0.4 : 1,
    transform: hovered && !disabled ? "scale(1.08)" : "scale(1)",
  };
  const bg = danger
    ? (hovered ? "#fde8e8" : "rgba(220,50,50,0.08)")
    : primary
    ? (hovered ? "#7a3318" : "#622B14")
    : (hovered ? "rgba(153,95,47,0.15)" : "rgba(151,143,102,0.12)");
  const color = danger ? "#c0392b" : primary ? "#fff" : "#622B14";

  return (
    <button
      onClick={disabled ? undefined : onClick}
      title={title}
      style={{ ...base, background: bg, color }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
}

function AddTimerForm({ newTimerName, setNewTimerName, newMinutes, setNewMinutes, onAdd }) {
  const [focused, setFocused] = useState(null);
  const inputStyle = (field) => ({
    width: "100%",
    padding: "10px 13px",
    borderRadius: "10px",
    border: `1.5px solid ${focused === field ? "#622B14" : "rgba(151,143,102,0.4)"}`,
    background: "rgba(255,255,255,0.7)",
    fontSize: "13px",
    color: "#2C1A0F",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    boxShadow: focused === field ? "0 0 0 3px rgba(98,43,20,0.1)" : "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <input
        value={newTimerName}
        onChange={(e) => setNewTimerName(e.target.value)}
        onFocus={() => setFocused("name")}
        onBlur={() => setFocused(null)}
        onKeyDown={(e) => e.key === "Enter" && onAdd()}
        placeholder="Timer name…"
        style={inputStyle("name")}
      />
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="number"
          value={newMinutes}
          min={1}
          onChange={(e) => setNewMinutes(Number(e.target.value))}
          onFocus={() => setFocused("min")}
          onBlur={() => setFocused(null)}
          style={{ ...inputStyle("min"), width: "80px" }}
        />
        <span style={{ display: "flex", alignItems: "center", fontSize: "12px", color: "#978F66", whiteSpace: "nowrap" }}>
          minutes
        </span>
        <PrimaryButton onClick={onAdd} style={{ flex: 1 }}>
          <PlusIcon /> Add
        </PrimaryButton>
      </div>
    </div>
  );
}

function PrimaryButton({ onClick, children, style = {}, disabled, loading }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: "6px",
        padding: "10px 16px",
        borderRadius: "10px",
        border: "none",
        background: hovered ? "#7a3318" : "#622B14",
        color: "#fff",
        fontWeight: "600",
        fontSize: "13px",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        transition: "background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease",
        transform: hovered && !disabled ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hovered && !disabled ? "0 4px 16px rgba(98,43,20,0.3)" : "0 2px 8px rgba(98,43,20,0.15)",
        opacity: disabled || loading ? 0.6 : 1,
        fontFamily: "inherit",
        whiteSpace: "nowrap",
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}

function Spinner() {
  return (
    <span style={{
      width: "14px", height: "14px",
      border: "2px solid rgba(255,255,255,0.3)",
      borderTopColor: "#fff",
      borderRadius: "50%",
      display: "inline-block",
      animation: "spin 0.7s linear infinite",
    }} />
  );
}

function SectionLabel({ icon, label }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "7px",
      fontSize: "11px", fontWeight: "700", letterSpacing: "0.8px",
      textTransform: "uppercase", color: "#978F66",
      marginBottom: "10px",
    }}>
      {icon}
      {label}
    </div>
  );
}

function EmptyTimers() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "28px 16px", gap: "8px",
      borderRadius: "12px",
      border: "1.5px dashed rgba(151,143,102,0.35)",
      background: "rgba(228,214,169,0.2)",
    }}>
      <div style={{ color: "#978F66", opacity: 0.6 }}><TimerIcon /></div>
      <div style={{ fontSize: "12px", color: "#978F66", textAlign: "center", lineHeight: 1.5 }}>
        No timers yet.<br/>Add one above to get started.
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function MultiTimerPdfViewerApp({ user, token, onLogout }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [timers, setTimers] = useState([]);
  const [newTimerName, setNewTimerName] = useState("");
  const [newMinutes, setNewMinutes] = useState(5);

  const intervalRefs = useRef({});

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiError, setAiError] = useState(false);

  // sidebar collapse on mobile
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ── Auth header helper ──
  const authHeaders = { Authorization: `Bearer ${token}` };

  // ── PDF UPLOAD ──
  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") return;

    const fileUrl = URL.createObjectURL(file);
    setPdfUrl(fileUrl);
    setUploadLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/upload-pdf`, {
        method: "POST",
        headers: authHeaders,
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setPdfUploaded(true);
      } else {
        alert(data.detail || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handlePdfUpload({ target: { files: [file] } });
  };

  // ── AI ASK ──
  const askAI = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAiError(false);
    try {
      const res = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAnswer(data.detail || "Error getting response");
        setAiError(true);
      } else {
        setAnswer(data.answer);
      }
    } catch (err) {
      setAnswer("Error getting response");
      setAiError(true);
    }
    setLoading(false);
  };

  // ── TIMERS — backend-synced ──

  // Load timers from backend on mount
  useEffect(() => {
    fetch(`${API_URL}/timers/`, {
      headers: authHeaders,
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Normalise backend snake_case → camelCase
          setTimers(
            data.map((t) => ({
              id: t.id,
              name: t.name,
              totalSeconds: t.total_seconds,
              remainingSeconds: t.remaining_seconds,
              running: false, // never restore a running state; user must press Start
            }))
          );
        }
      })
      .catch(() => {}); // silently ignore if backend is offline
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const addTimer = async () => {
    if (!newTimerName.trim()) return;
    const totalSeconds = newMinutes * 60;
    try {
      const res = await fetch(`${API_URL}/timers/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({ name: newTimerName, total_seconds: totalSeconds }),
      });
      const data = await res.json();
      if (res.ok) {
        setTimers((prev) => [
          ...prev,
          {
            id: data.id,
            name: data.name,
            totalSeconds: data.total_seconds,
            remainingSeconds: data.remaining_seconds,
            running: false,
          },
        ]);
        setNewTimerName("");
        setNewMinutes(5);
      }
    } catch (err) {
      // Fallback: add locally with a temp id so the UI stays responsive
      const id = `local-${Date.now()}`;
      setTimers((prev) => [
        ...prev,
        { id, name: newTimerName, totalSeconds, remainingSeconds: totalSeconds, running: false },
      ]);
      setNewTimerName("");
      setNewMinutes(5);
    }
  };

  const startTimer = (id) => {
    if (intervalRefs.current[id]) return;
    setTimers((prev) => prev.map((t) => (t.id === id ? { ...t, running: true } : t)));
    intervalRefs.current[id] = setInterval(() => {
      setTimers((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          if (t.remainingSeconds <= 1) {
            clearInterval(intervalRefs.current[id]);
            delete intervalRefs.current[id];
            // Persist finished state to backend
            fetch(`${API_URL}/timers/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json", ...authHeaders },
              body: JSON.stringify({ remaining_seconds: 0, running: false }),
            }).catch(() => {});
            alert(`${t.name} finished!`);
            return { ...t, remainingSeconds: 0, running: false };
          }
          return { ...t, remainingSeconds: t.remainingSeconds - 1 };
        })
      );
    }, 1000);
  };

  const pauseTimer = (id) => {
    clearInterval(intervalRefs.current[id]);
    delete intervalRefs.current[id];
    setTimers((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, running: false } : t));
      const timer = updated.find((t) => t.id === id);
      if (timer) {
        fetch(`http://localhost:8000/timers/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...authHeaders },
          body: JSON.stringify({ remaining_seconds: timer.remainingSeconds, running: false }),
        }).catch(() => {});
      }
      return updated;
    });
  };

  const resetTimer = (id) => {
    clearInterval(intervalRefs.current[id]);
    delete intervalRefs.current[id];
    setTimers((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, remainingSeconds: t.totalSeconds, running: false } : t
      );
      const timer = updated.find((t) => t.id === id);
      if (timer) {
        fetch(`http://localhost:8000/timers/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...authHeaders },
          body: JSON.stringify({ remaining_seconds: timer.totalSeconds, running: false }),
        }).catch(() => {});
      }
      return updated;
    });
  };

  const deleteTimer = (id) => {
    clearInterval(intervalRefs.current[id]);
    delete intervalRefs.current[id];
    setTimers((prev) => prev.filter((t) => t.id !== id));
    fetch(`http://localhost:8000/timers/${id}`, {
      method: "DELETE",
      headers: authHeaders,
    }).catch(() => {});
  };

  // Clean up all intervals on unmount
  useEffect(() => {
    return () => { Object.values(intervalRefs.current).forEach(clearInterval); };
  }, []);

  // ── RESPONSIVE: sidebar toggle ──
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── RENDER ──
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #E4D6A9; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }
        .timer-card-enter { animation: fadeIn 0.25s ease forwards; }
        .answer-appear { animation: fadeIn 0.3s ease forwards; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(151,143,102,0.4); border-radius: 99px; }
        textarea:focus, input:focus { outline: none; }
        .markdown-content {
    line-height: 1.7;
    word-break: break-word;
  }

  .markdown-content p {
    margin: 8px 0;
  }

  .markdown-content h1,
  .markdown-content h2,
  .markdown-content h3 {
    margin: 10px 0;
  }

  .markdown-content ul,
  .markdown-content ol {
    padding-left: 20px;
  }

  .markdown-content code {
    background: rgba(98,43,20,0.08);
    padding: 2px 4px;
    border-radius: 4px;
  }

  .markdown-content pre {
    overflow-x: auto;
    padding: 10px;
    border-radius: 8px;
    background: rgba(98,43,20,0.05);
  }

      `}</style>

      <div style={{
        display: "flex", height: "100vh", width: "100vw",
        fontFamily: "'DM Sans', sans-serif",
        background: "#E4D6A9",
        overflow: "hidden",
      }}>

        {/* ── LEFT: PDF VIEWER ── */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#DDD0A0",
          position: "relative",
          minWidth: 0,
          transition: "all 0.3s ease",
        }}>

          {/* Topbar */}
          <div style={{
            height: "52px",
            display: "flex", alignItems: "center",
            padding: "0 20px",
            borderBottom: "1px solid rgba(151,143,102,0.25)",
            background: "rgba(228,214,169,0.8)",
            backdropFilter: "blur(10px)",
            gap: "12px",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
              {/* Inline leaf mark */}
              <svg width="28" height="28" viewBox="140 140 400 400" xmlns="http://www.w3.org/2000/svg">
                <rect x="140" y="140" width="400" height="400" rx="90" fill="#622B14"/>
                <path d="M400 490 C400 490 270 450 264 330 C258 230 330 190 370 186 C410 182 480 218 484 318 C488 418 412 462 400 490Z" fill="#995F2F" opacity="0.35"/>
                <path d="M340 480 C340 480 210 438 204 318 C198 216 270 176 310 172 C350 168 422 206 426 308 C430 410 356 454 340 480Z" fill="#E4D6A9"/>
                <path d="M334 466 C334 466 230 418 226 318 C222 236 274 200 308 198 C324 197 344 206 358 222 C340 216 310 224 292 252 C270 284 278 370 334 466Z" fill="#c9bfa0"/>
                <path d="M334 466 C326 420 308 356 314 298 C320 248 340 210 310 172" fill="none" stroke="#622B14" strokeWidth="5" strokeLinecap="round" opacity="0.4"/>
                <path d="M322 370 C346 350 374 346 398 350" fill="none" stroke="#622B14" strokeWidth="3.5" strokeLinecap="round" opacity="0.3"/>
                <path d="M316 320 C338 296 366 292 388 294" fill="none" stroke="#622B14" strokeWidth="3.5" strokeLinecap="round" opacity="0.28"/>
                <path d="M406 444 C406 444 442 410 452 370 C462 330 446 306 428 306 C410 306 394 330 390 370 C384 406 400 436 406 444Z" fill="#995F2F" opacity="0.6"/>
              </svg>
              <span style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "16px", color: "#2C1A0F", fontWeight: "400", letterSpacing: "-0.3px"
              }}>
                clearleaf
              </span>
            </div>

            <div style={{ flex: 1 }} />

            {pdfUrl && (
              <label style={{ cursor: "pointer" }}>
                <input type="file" accept="application/pdf" onChange={handlePdfUpload} style={{ display: "none" }} />
                <span style={{
                  fontSize: "12px", color: "#622B14", fontWeight: "600",
                  padding: "5px 12px", borderRadius: "8px",
                  border: "1.5px solid rgba(98,43,20,0.25)",
                  background: "rgba(98,43,20,0.06)",
                  cursor: "pointer", transition: "background 0.15s",
                  display: "inline-flex", alignItems: "center", gap: "5px",
                }}>
                  <UploadIcon /> Replace PDF
                </span>
              </label>
            )}

            {/* User avatar + logout */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "30px", height: "30px", borderRadius: "50%",
                background: "#622B14", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: "700", color: "#E4D6A9", flexShrink: 0,
              }}>
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <span style={{ fontSize: "12px", color: "#2C1A0F", fontWeight: "500", maxWidth: "90px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.name}
              </span>
              <button
                onClick={onLogout}
                style={{
                  padding: "5px 10px", borderRadius: "8px", border: "1.5px solid rgba(151,143,102,0.4)",
                  background: "transparent", color: "#978F66", fontSize: "11px",
                  fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { e.target.style.borderColor = "#622B14"; e.target.style.color = "#622B14"; }}
                onMouseLeave={e => { e.target.style.borderColor = "rgba(151,143,102,0.4)"; e.target.style.color = "#978F66"; }}
              >
                Log out
              </button>
            </div>

            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                  padding: "6px 12px", borderRadius: "8px", border: "none",
                  background: "#622B14", color: "#fff", fontSize: "12px",
                  fontWeight: "600", cursor: "pointer",
                }}
              >
                {sidebarOpen ? "Hide Panel" : "Show Panel"}
              </button>
            )}
          </div>

          {/* PDF Content */}
          <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            {pdfUrl ? (
              <>
                {uploadLoading && (
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "rgba(228,214,169,0.7)", backdropFilter: "blur(4px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 10, gap: "10px",
                  }}>
                    <Spinner />
                    <span style={{ fontSize: "13px", color: "#622B14", fontWeight: "500" }}>
                      Processing PDF…
                    </span>
                  </div>
                )}
                <iframe
                  src={pdfUrl}
                  style={{ width: "100%", height: "100%", border: "none" }}
                  title="PDF Viewer"
                />
              </>
            ) : (
              /* Upload Drop Zone */
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                style={{
                  height: "100%",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: "20px", padding: "40px",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{
                  width: "100%", maxWidth: "380px",
                  padding: "48px 40px",
                  borderRadius: "20px",
                  border: `2px dashed ${isDragging ? "#622B14" : "rgba(151,143,102,0.5)"}`,
                  background: isDragging ? "rgba(98,43,20,0.06)" : "rgba(255,255,255,0.4)",
                  backdropFilter: "blur(8px)",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "16px",
                  transition: "all 0.2s ease",
                  textAlign: "center",
                }}>
                  <div style={{
                    width: "72px", height: "72px", borderRadius: "18px",
                    background: "rgba(98,43,20,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#622B14",
                  }}>
                    <FileIcon />
                  </div>
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: "700", color: "#2C1A0F", marginBottom: "6px", fontFamily: "'DM Serif Display', serif" }}>
                      Drop your PDF here
                    </div>
                    <div style={{ fontSize: "13px", color: "#978F66", lineHeight: 1.6 }}>
                      Drag & drop or click to upload<br />PDF files up to 50MB
                    </div>
                  </div>
                  <label style={{ cursor: "pointer" }}>
                    <input type="file" accept="application/pdf" onChange={handlePdfUpload} style={{ display: "none" }} />
                    <PrimaryButton onClick={undefined} style={{ pointerEvents: "none" }}>
                      <UploadIcon /> Choose File
                    </PrimaryButton>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: SIDEBAR ── */}
        {(!isMobile || sidebarOpen) && (
          <div style={{
            width: isMobile ? "100vw" : "320px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            background: "rgba(228,214,169,0.85)",
            backdropFilter: "blur(16px)",
            borderLeft: "1px solid rgba(151,143,102,0.3)",
            height: "100vh",
            position: isMobile ? "absolute" : "relative",
            right: 0, top: 0, zIndex: isMobile ? 50 : 1,
            animation: "slideIn 0.25s ease",
            boxShadow: isMobile ? "-8px 0 32px rgba(98,43,20,0.12)" : "none",
          }}>

            {/* Sidebar Header */}
            <div style={{
              height: "52px",
              display: "flex", alignItems: "center",
              padding: "0 18px",
              borderBottom: "1px solid rgba(151,143,102,0.2)",
              flexShrink: 0,
            }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#2C1A0F", letterSpacing: "-0.1px" }}>
                Tools
              </span>
              {isMobile && (
                <button onClick={() => setSidebarOpen(false)} style={{
                  marginLeft: "auto", background: "none", border: "none",
                  cursor: "pointer", color: "#978F66", display: "flex",
                }}>
                  <XIcon />
                </button>
              )}
            </div>

            {/* Sidebar Scrollable Body */}
            <div style={{ flex: 1, overflow: "auto", padding: "16px" }}>

              {/* ─ TIMERS SECTION ─ */}
              <div style={{ marginBottom: "24px" }}>
                <SectionLabel icon={<TimerIcon />} label="Timers" />

                <AddTimerForm
                  newTimerName={newTimerName}
                  setNewTimerName={setNewTimerName}
                  newMinutes={newMinutes}
                  setNewMinutes={setNewMinutes}
                  onAdd={addTimer}
                />

                <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {timers.length === 0 ? (
                    <EmptyTimers />
                  ) : (
                    timers.map((t) => (
                      <div key={t.id} className="timer-card-enter">
                        <TimerCard
                          timer={t}
                          onStart={startTimer}
                          onPause={pauseTimer}
                          onReset={resetTimer}
                          onDelete={deleteTimer}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: "rgba(151,143,102,0.25)", margin: "0 0 20px" }} />

              {/* ─ AI ASK SECTION ─ */}
              <div>
                <SectionLabel icon={<SparkleIcon />} label="Ask AI" />

                {!pdfUploaded && (
                  <div style={{
                    padding: "10px 13px", borderRadius: "10px",
                    background: "rgba(153,95,47,0.1)",
                    border: "1px solid rgba(153,95,47,0.25)",
                    fontSize: "12px", color: "#995F2F",
                    marginBottom: "10px", lineHeight: 1.5,
                  }}>
                    Upload a PDF first to ask questions about it.
                  </div>
                )}

                <AiTextarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onSubmit={askAI}
                  placeholder="Ask a question about your document…"
                  disabled={!pdfUploaded}
                />

                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <PrimaryButton
                    onClick={askAI}
                    loading={loading}
                    disabled={!question.trim() || !pdfUploaded}
                    style={{ flex: 1 }}
                  >
                    <SendIcon /> Ask AI
                  </PrimaryButton>
                  {answer && (
                    <IconButton onClick={() => { setAnswer(""); setAiError(false); }} title="Clear answer" danger>
                      <XIcon />
                    </IconButton>
                  )}
                </div>

                {answer && (
                  <div
                    className="answer-appear"
                    style={{
                      marginTop: "12px",
                      padding: "14px",
                      borderRadius: "12px",
                      background: aiError ? "rgba(200,50,50,0.06)" : "rgba(255,255,255,0.65)",
                      border: `1px solid ${aiError ? "rgba(200,50,50,0.2)" : "rgba(151,143,102,0.25)"}`,
                      fontSize: "13px",
                      color: aiError ? "#c0392b" : "#2C1A0F",
                      lineHeight: "1.65",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.7px", textTransform: "uppercase", color: "#978F66", marginBottom: "8px" }}>
                      Response
                    </div>
                    <AIResponse content={answer} />
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Footer */}
            <div style={{
              padding: "12px 18px",
              borderTop: "1px solid rgba(151,143,102,0.2)",
              display: "flex", alignItems: "center", gap: "8px",
              flexShrink: 0,
            }}>
              <div style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: pdfUploaded ? "#4CAF50" : "#978F66",
                transition: "background 0.3s",
              }} />
              <span style={{ fontSize: "11px", color: "#978F66", fontWeight: "500" }}>
                {pdfUploaded ? "PDF ready · AI enabled" : "No document loaded"}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── AI Textarea ──────────────────────────────────────────────────────────────
function AiTextarea({ value, onChange, onSubmit, placeholder, disabled }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onSubmit(); }}
      placeholder={placeholder}
      disabled={disabled}
      rows={4}
      style={{
        width: "100%",
        padding: "11px 13px",
        borderRadius: "10px",
        border: `1.5px solid ${focused ? "#622B14" : "rgba(151,143,102,0.4)"}`,
        background: disabled ? "rgba(151,143,102,0.08)" : "rgba(255,255,255,0.65)",
        fontSize: "13px",
        color: "#2C1A0F",
        resize: "none",
        outline: "none",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        boxShadow: focused ? "0 0 0 3px rgba(98,43,20,0.1)" : "none",
        fontFamily: "'DM Sans', sans-serif",
        lineHeight: "1.6",
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "auto",
        boxSizing: "border-box",
      }}
    />
  );
}
