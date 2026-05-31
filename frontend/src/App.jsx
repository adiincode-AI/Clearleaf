import { useState, useEffect } from "react";
import AuthPage from "./AuthPage";
import MultiTimerPdfViewerApp from "./MultiTimerPdfViewerApp";

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [checking, setChecking] = useState(true);

  // ── Restore session from localStorage on mount ──
  useEffect(() => {
    const savedToken = localStorage.getItem("cl_token");
    const savedUser = localStorage.getItem("cl_user");

    if (savedToken && savedUser) {
      // Verify token is still valid
      fetch("http://localhost:8000/auth/me", {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => {
          if (res.ok) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
          } else {
            // Token expired — clear storage
            localStorage.removeItem("cl_token");
            localStorage.removeItem("cl_user");
          }
        })
        .catch(() => {
          // Backend offline — still restore session optimistically
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        })
        .finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, []);

  const handleAuth = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("cl_token");
    localStorage.removeItem("cl_user");
    setUser(null);
    setToken(null);
  };

  // ── Loading screen while checking saved session ──
  if (checking) {
    return (
      <div style={{
        minHeight: "100vh", background: "#E4D6A9",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: "14px",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <svg width="36" height="36" viewBox="140 140 400 400" xmlns="http://www.w3.org/2000/svg">
          <rect x="140" y="140" width="400" height="400" rx="90" fill="#622B14"/>
          <path d="M340 480 C340 480 210 438 204 318 C198 216 270 176 310 172 C350 168 422 206 426 308 C430 410 356 454 340 480Z" fill="#E4D6A9"/>
          <path d="M406 444 C406 444 442 410 452 370 C462 330 446 306 428 306 C410 306 394 330 390 370 C384 406 400 436 406 444Z" fill="#995F2F" opacity="0.7"/>
        </svg>
        <span style={{ fontSize: "13px", color: "#978F66", fontWeight: "500" }}>Loading…</span>
      </div>
    );
  }

  // ── Render auth or main app ──
  if (!user || !token) {
    return <AuthPage onAuth={handleAuth} />;
  }

  return <MultiTimerPdfViewerApp user={user} token={token} onLogout={handleLogout} />;
}
