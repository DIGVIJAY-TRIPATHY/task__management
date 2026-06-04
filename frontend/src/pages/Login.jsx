import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { authService } from "../services/api";
import { useAuthStore } from "../store/index";

/* ─── Shared auth page styles ─────────────────────────────── */
const AUTH_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --auth-bg: #080b14;
    --auth-panel: rgba(255,255,255,0.035);
    --auth-border: rgba(255,255,255,0.09);
    --auth-border-hi: rgba(255,255,255,0.18);
    --auth-accent: #a78bfa;
    --auth-accent-dim: rgba(167,139,250,0.18);
    --auth-text: #f0edff;
    --auth-muted: rgba(240,237,255,0.45);
    --auth-faint: rgba(240,237,255,0.18);
    --auth-error: #f87171;
    --auth-error-bg: rgba(248,113,113,0.1);
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --ease: cubic-bezier(0.4,0,0.2,1);
  }

  .auth-root {
    min-height: 100vh;
    background: var(--auth-bg);
    background-image:
      radial-gradient(ellipse 80% 60% at 20% 50%, rgba(124,58,237,0.14) 0%, transparent 65%),
      radial-gradient(ellipse 60% 50% at 80% 50%, rgba(59,130,246,0.07) 0%, transparent 60%);
    display: flex;
    align-items: stretch;
    font-family: var(--font-body);
    color: var(--auth-text);
  }

  /* ── Left decorative panel ── */
  .auth-left {
    display: none;
    flex: 1;
    padding: 3rem;
    flex-direction: column;
    justify-content: space-between;
    border-right: 1px solid var(--auth-border);
    position: relative;
    overflow: hidden;
  }
  @media (min-width: 900px) { .auth-left { display: flex; } }

  .auth-left-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%);
  }
  .auth-left-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 1;
  }
  .auth-left-mark {
    width: 36px; height: 36px; border-radius: 11px;
    background: linear-gradient(135deg, #7c3aed, #a78bfa);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-weight: 800; font-size: 16px; color: #fff;
  }
  .auth-left-name {
    font-family: var(--font-display); font-weight: 700; font-size: 19px;
    letter-spacing: -0.3px;
  }
  .auth-left-copy {
    position: relative; z-index: 1;
  }
  .auth-left-headline {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: clamp(32px, 3vw, 44px);
    line-height: 1.12;
    letter-spacing: -1.5px;
    margin-bottom: 1rem;
  }
  .auth-left-headline em {
    font-style: normal;
    background: linear-gradient(135deg, #a78bfa, #60a5fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .auth-left-sub {
    font-size: 15px;
    color: var(--auth-muted);
    line-height: 1.6;
    max-width: 340px;
  }
  .auth-features {
    position: relative; z-index: 1;
    display: flex; flex-direction: column; gap: 12px;
  }
  .auth-feature {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid var(--auth-border);
    background: var(--auth-panel);
  }
  .auth-feature-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: var(--auth-accent-dim);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; flex-shrink: 0;
  }
  .auth-feature-text { font-size: 13px; color: var(--auth-muted); line-height: 1.4; }
  .auth-feature-text strong { color: var(--auth-text); font-weight: 500; display: block; margin-bottom: 1px; }

  /* ── Right form panel ── */
  .auth-right {
    width: 100%;
    max-width: 480px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 2rem;
    margin: 0 auto;
  }
  @media (min-width: 900px) {
    .auth-right { width: 480px; max-width: none; margin: 0; }
  }

  .auth-card {
    width: 100%;
    animation: auth-rise 0.5s var(--ease) both;
  }
  @keyframes auth-rise {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Card header ── */
  .auth-card-header { margin-bottom: 2rem; }
  .auth-card-logo {
    display: flex; align-items: center; gap: 10px; margin-bottom: 1.5rem;
  }
  .auth-card-mark {
    width: 34px; height: 34px; border-radius: 10px;
    background: linear-gradient(135deg, #7c3aed, #a78bfa);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-weight: 800; font-size: 15px; color: #fff;
  }
  .auth-card-mark-name {
    font-family: var(--font-display); font-weight: 700; font-size: 17px; letter-spacing: -.2px;
  }
  .auth-card-title {
    font-family: var(--font-display);
    font-weight: 800; font-size: 28px;
    letter-spacing: -0.8px; line-height: 1.1;
    margin-bottom: 6px;
  }
  .auth-card-sub { font-size: 14px; color: var(--auth-muted); }

  /* ── Form ── */
  .auth-form { display: flex; flex-direction: column; gap: 18px; }

  .auth-field { display: flex; flex-direction: column; gap: 6px; }
  .auth-label {
    font-size: 12px; font-weight: 500; letter-spacing: 0.07em;
    text-transform: uppercase; color: var(--auth-muted);
  }
  .auth-input-wrap { position: relative; }
  .auth-input-icon {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    color: var(--auth-faint); font-size: 15px; pointer-events: none;
    transition: color 0.2s var(--ease);
  }
  .auth-input {
    width: 100%; padding: 11px 14px 11px 38px;
    border-radius: 10px;
    border: 1px solid var(--auth-border);
    background: rgba(255,255,255,0.04);
    color: var(--auth-text);
    font-family: var(--font-body); font-size: 14px;
    outline: none;
    transition: border-color 0.2s var(--ease), background 0.2s var(--ease);
    box-sizing: border-box;
  }
  .auth-input::placeholder { color: var(--auth-faint); }
  .auth-input:focus {
    border-color: var(--auth-accent);
    background: rgba(167,139,250,0.07);
  }
  .auth-input:focus ~ .auth-focus-line { transform: scaleX(1); }
  .auth-input-wrap:focus-within .auth-input-icon { color: var(--auth-accent); }

  .auth-field-error {
    font-size: 12px; color: var(--auth-error);
    display: flex; align-items: center; gap: 5px;
  }

  /* ── Submit button ── */
  .auth-submit {
    width: 100%; padding: 12px;
    border-radius: 10px; border: none;
    background: linear-gradient(135deg, #7c3aed, #a78bfa);
    color: #fff;
    font-family: var(--font-display); font-weight: 700; font-size: 15px;
    letter-spacing: 0.01em; cursor: pointer;
    box-shadow: 0 4px 24px rgba(124,58,237,0.38);
    transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease), opacity 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    margin-top: 4px;
  }
  .auth-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 7px 32px rgba(124,58,237,0.52);
  }
  .auth-submit:active:not(:disabled) { transform: translateY(0); }
  .auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  /* ── Spinner ── */
  .auth-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: auth-spin 0.65s linear infinite;
  }
  @keyframes auth-spin { to { transform: rotate(360deg); } }

  /* ── Divider / footer ── */
  .auth-divider {
    display: flex; align-items: center; gap: 12px; margin: 4px 0;
  }
  .auth-divider-line { flex: 1; height: 1px; background: var(--auth-border); }
  .auth-divider-text { font-size: 12px; color: var(--auth-faint); }

  .auth-footer {
    text-align: center; font-size: 13px; color: var(--auth-muted);
  }
  .auth-link {
    color: var(--auth-accent); font-weight: 500; text-decoration: none;
    transition: opacity 0.2s;
  }
  .auth-link:hover { opacity: 0.75; }

  /* ── Alert override ── */
  .auth-alert-wrap { margin-bottom: 4px; }
`;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = React.useState({ email: "", password: "" });
  const [loading, setLoading] = React.useState(false);
  const [localError, setLocalError] = React.useState("");

  React.useEffect(() => {
    const id = "auth-injected-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = AUTH_STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError("");
    try {
      const response = await authService.login(formData);
      const { user, accessToken } = response.data.data;
      login(user, accessToken);
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (error) {
      setLocalError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      {/* Left decorative panel */}
      <div className="auth-left">
        <div className="auth-left-grid" />
        <div className="auth-left-brand">
          <div className="auth-left-mark">T</div>
          <span className="auth-left-name">TaskOS</span>
        </div>
        <div className="auth-left-copy">
          <h1 className="auth-left-headline">
            Your tasks.<br /><em>Organized.</em>
          </h1>
          <p className="auth-left-sub">
            A focused workspace to track, prioritize, and complete everything that matters.
          </p>
        </div>
        <div className="auth-features">
          {[
            { icon: "⚡", title: "Instant sync", desc: "Tasks update in real-time across all devices" },
            { icon: "🎯", title: "Priority system", desc: "High, medium, and low priority with smart sorting" },
            { icon: "🔒", title: "Secure by default", desc: "JWT-protected sessions with encrypted storage" },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="auth-feature">
              <div className="auth-feature-icon">{icon}</div>
              <div className="auth-feature-text">
                <strong>{title}</strong>{desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-card-logo">
              <div className="auth-card-mark">T</div>
              <span className="auth-card-mark-name">TaskOS</span>
            </div>
            <h2 className="auth-card-title">Welcome back</h2>
            <p className="auth-card-sub">Sign in to continue to your workspace</p>
          </div>

          {localError && (
            <div className="auth-alert-wrap">
              <Alert type="error" message={localError} onClose={() => setLocalError("")} />
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">✉</span>
                <input
                  className="auth-input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  className="auth-input"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? (
                <><div className="auth-spinner" /> Signing in…</>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <div style={{ marginTop: "1.5rem" }}>
            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">no account?</span>
              <div className="auth-divider-line" />
            </div>
            <div className="auth-footer" style={{ marginTop: "1rem" }}>
              <Link to="/register" className="auth-link">
                Create a free account →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}