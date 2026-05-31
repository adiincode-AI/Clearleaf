import { useState } from "react";

// ─── Leaf Logo (inline) ───────────────────────────────────────────────────────
const LeafLogo = () => (
  <svg width="40" height="40" viewBox="140 140 400 400" xmlns="http://www.w3.org/2000/svg">
    <rect x="140" y="140" width="400" height="400" rx="90" fill="#622B14"/>
    <path d="M400 490 C400 490 270 450 264 330 C258 230 330 190 370 186 C410 182 480 218 484 318 C488 418 412 462 400 490Z" fill="#995F2F" opacity="0.35"/>
    <path d="M340 480 C340 480 210 438 204 318 C198 216 270 176 310 172 C350 168 422 206 426 308 C430 410 356 454 340 480Z" fill="#E4D6A9"/>
    <path d="M334 466 C334 466 230 418 226 318 C222 236 274 200 308 198 C324 197 344 206 358 222 C340 216 310 224 292 252 C270 284 278 370 334 466Z" fill="#c9bfa0"/>
    <path d="M334 466 C326 420 308 356 314 298 C320 248 340 210 310 172" fill="none" stroke="#622B14" strokeWidth="5" strokeLinecap="round" opacity="0.4"/>
    <path d="M322 370 C346 350 374 346 398 350" fill="none" stroke="#622B14" strokeWidth="3.5" strokeLinecap="round" opacity="0.3"/>
    <path d="M316 320 C338 296 366 292 388 294" fill="none" stroke="#622B14" strokeWidth="3.5" strokeLinecap="round" opacity="0.28"/>
    <path d="M406 444 C406 444 442 410 452 370 C462 330 446 306 428 306 C410 306 394 330 390 370 C384 406 400 436 406 444Z" fill="#995F2F" opacity="0.6"/>
  </svg>
);

// ─── Auth Page ────────────────────────────────────────────────────────────────
export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  const isLogin = mode === "login";

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!isLogin && !form.name) {
      setError("Please enter your name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/signup";
      const body = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Something went wrong.");
        return;
      }

      localStorage.setItem("cl_token", data.access_token);
      localStorage.setItem("cl_user", JSON.stringify(data.user));
      onAuth(data.user, data.access_token);
    } catch (err) {
      setError("Cannot connect to server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: `1.5px solid ${focused === field ? "#622B14" : "rgba(151,143,102,0.45)"}`,
    background: "rgba(255,255,255,0.7)",
    fontSize: "14px",
    color: "#2C1A0F",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxShadow: focused === field ? "0 0 0 3px rgba(98,43,20,0.1)" : "none",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #E4D6A9; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .auth-card { animation: fadeUp 0.35s ease forwards; }
      `}</style>

      <div style={{
        minHeight: "100vh", width: "100vw",
        background: "#E4D6A9",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* Decorative background circles */}
        <div style={{
          position: "fixed", top: "-120px", right: "-120px",
          width: "400px", height: "400px", borderRadius: "50%",
          background: "rgba(98,43,20,0.06)", pointerEvents: "none",
        }} />
        <div style={{
          position: "fixed", bottom: "-80px", left: "-80px",
          width: "300px", height: "300px", borderRadius: "50%",
          background: "rgba(153,95,47,0.07)", pointerEvents: "none",
        }} />

        <div
          className="auth-card"
          style={{
            width: "100%", maxWidth: "420px",
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(16px)",
            borderRadius: "24px",
            border: "1px solid rgba(151,143,102,0.25)",
            boxShadow: "0 8px 48px rgba(98,43,20,0.1)",
            padding: "40px 36px",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "28px", gap: "10px" }}>
            <LeafLogo />
            <span style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "22px", color: "#2C1A0F", letterSpacing: "-0.5px",
            }}>
              clearleaf
            </span>
            <span style={{ fontSize: "13px", color: "#978F66" }}>
              {isLogin ? "Welcome back" : "Create your account"}
            </span>
          </div>

          {/* Tab switcher */}
          <div style={{
            display: "flex", background: "rgba(151,143,102,0.12)",
            borderRadius: "12px", padding: "4px", marginBottom: "24px",
          }}>
            {["login", "signup"].map((tab) => (
              <button
                key={tab}
                onClick={() => { setMode(tab); setError(""); setForm({ name: "", email: "", password: "" }); }}
                style={{
                  flex: 1, padding: "9px",
                  borderRadius: "9px", border: "none",
                  background: mode === tab ? "#622B14" : "transparent",
                  color: mode === tab ? "#fff" : "#978F66",
                  fontWeight: "600", fontSize: "13px",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.2s ease",
                }}
              >
                {tab === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          {/* Form fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {!isLogin && (
              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#622B14", display: "block", marginBottom: "5px", letterSpacing: "0.2px" }}>
                  Full name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Jane Smith"
                  style={inputStyle("name")}
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "#622B14", display: "block", marginBottom: "5px", letterSpacing: "0.2px" }}>
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="you@example.com"
                style={inputStyle("email")}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "#622B14", display: "block", marginBottom: "5px", letterSpacing: "0.2px" }}>
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder={isLogin ? "Your password" : "At least 8 characters"}
                style={inputStyle("password")}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginTop: "12px", padding: "10px 13px",
              borderRadius: "10px",
              background: "rgba(200,50,50,0.07)",
              border: "1px solid rgba(200,50,50,0.2)",
              fontSize: "13px", color: "#c0392b", lineHeight: 1.5,
            }}>
              {error}
            </div>
          )}

          {/* Submit button */}
          <SubmitButton loading={loading} onClick={handleSubmit} label={isLogin ? "Log in" : "Create account"} />

          {/* Switch mode hint */}
          <p style={{ textAlign: "center", fontSize: "13px", color: "#978F66", marginTop: "20px" }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span
              onClick={() => { setMode(isLogin ? "signup" : "login"); setError(""); }}
              style={{ color: "#622B14", fontWeight: "600", cursor: "pointer", textDecoration: "underline" }}
            >
              {isLogin ? "Sign up" : "Log in"}
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

function SubmitButton({ onClick, loading, label }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%", marginTop: "20px",
        padding: "13px",
        borderRadius: "12px", border: "none",
        background: hovered ? "#7a3318" : "#622B14",
        color: "#fff", fontWeight: "700", fontSize: "14px",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1,
        fontFamily: "'DM Sans', sans-serif",
        transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
        transform: hovered && !loading ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hovered && !loading ? "0 6px 20px rgba(98,43,20,0.28)" : "0 2px 8px rgba(98,43,20,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
      }}
    >
      {loading ? (
        <>
          <span style={{
            width: "14px", height: "14px",
            border: "2px solid rgba(255,255,255,0.3)",
            borderTopColor: "#fff", borderRadius: "50%",
            display: "inline-block",
            animation: "spin 0.7s linear infinite",
          }} />
          Please wait…
        </>
      ) : label}
    </button>
  );
}
