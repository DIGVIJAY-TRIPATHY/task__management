import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { authService } from "../services/api";
import { useAuthStore } from "../store/index";

/*
  AUTH_STYLES is shared with Login.jsx — if both are loaded,
  the second injection is skipped via the id guard.
  Copy the same AUTH_STYLES string from Login.jsx here,
  or import it from a shared auth-styles.js constant.
*/
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
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%);
  }
  .auth-left-brand { display: flex; align-items: center; gap: 10px; position: relative; z-index: 1; }
  .auth-left-mark {
    width: 36px; height: 36px; border-radius: 11px;
    background: linear-gradient(135deg, #7c3aed, #a78bfa);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-weight: 800; font-size: 16px; color: #fff;
  }
  .auth-left-name { font-family: var(--font-display); font-weight: 700; font-size: 19px; letter-spacing: -0.3px; }
  .auth-left-copy { position: relative; z-index: 1; }
  .auth-left-headline {
    font-family: var(--font-display); font-weight: 800;
    font-size: clamp(32px, 3vw, 44px); line-height: 1.12;
    letter-spacing: -1.5px; margin-bottom: 1rem;
  }
  .auth-left-headline em {
    font-style: normal;
    background: linear-gradient(135deg, #a78bfa, #60a5fa);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .auth-left-sub { font-size: 15px; color: var(--auth-muted); line-height: 1.6; max-width: 340px; }
  .auth-features { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 12px; }
  .auth-feature {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 14px; border-radius: 12px;
    border: 1px solid var(--auth-border); background: var(--auth-panel);
  }
  .auth-feature-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: var(--auth-accent-dim);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; flex-shrink: 0;
  }
  .auth-feature-text { font-size: 13px; color: var(--auth-muted); line-height: 1.4; }
  .auth-feature-text strong { color: var(--auth-text); font-weight: 500; display: block; margin-bottom: 1px; }

  .auth-right {
    width: 100%; max-width: 480px;
    display: flex; align-items: center; justify-content: center;
    padding: 2.5rem 2rem; margin: 0 auto;
  }
  @media (min-width: 900px) { .auth-right { width: 480px; max-width: none; margin: 0; } }

  .auth-card { width: 100%; animation: auth-rise 0.5s var(--ease) both; }
  @keyframes auth-rise {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .auth-card-header { margin-bottom: 2rem; }
  .auth-card-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 1.5rem; }
  .auth-card-mark {
    width: 34px; height: 34px; border-radius: 10px;
    background: linear-gradient(135deg, #7c3aed, #a78bfa);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-weight: 800; font-size: 15px; color: #fff;
  }
  .auth-card-mark-name { font-family: var(--font-display); font-weight: 700; font-size: 17px; letter-spacing: -.2px; }
  .auth-card-title {
    font-family: var(--font-display); font-weight: 800; font-size: 28px;
    letter-spacing: -0.8px; line-height: 1.1; margin-bottom: 6px;
  }
  .auth-card-sub { font-size: 14px; color: var(--auth-muted); }

  .auth-form { display: flex; flex-direction: column; gap: 16px; }
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
    width: 100%; padding: 11px 14px 11px 38px; border-radius: 10px;
    border: 1px solid var(--auth-border); background: rgba(255,255,255,0.04);
    color: var(--auth-text); font-family: var(--font-body); font-size: 14px;
    outline: none; transition: border-color 0.2s var(--ease), background 0.2s var(--ease);
    box-sizing: border-box;
  }
  .auth-input::placeholder { color: var(--auth-faint); }
  .auth-input:focus { border-color: var(--auth-accent); background: rgba(167,139,250,0.07); }
  .auth-input.has-error { border-color: var(--auth-error); }
  .auth-input-wrap:focus-within .auth-input-icon { color: var(--auth-accent); }

  .auth-field-error {
    font-size: 12px; color: var(--auth-error);
    display: flex; align-items: center; gap: 5px; padding-top: 2px;
  }

  /* Password strength */
  .auth-strength { display: flex; flex-direction: column; gap: 5px; margin-top: 4px; }
  .auth-strength-bars { display: flex; gap: 4px; }
  .auth-strength-bar {
    flex: 1; height: 3px; border-radius: 2px;
    background: rgba(255,255,255,0.08);
    transition: background 0.3s var(--ease);
  }
  .auth-strength-bar.active-weak   { background: #f87171; }
  .auth-strength-bar.active-medium { background: #fbbf24; }
  .auth-strength-bar.active-strong { background: #34d399; }
  .auth-strength-label { font-size: 11px; color: var(--auth-faint); }

  /* two-col grid for name+email */
  .auth-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  @media (max-width: 520px) { .auth-form-grid { grid-template-columns: 1fr; } }

  .auth-submit {
    width: 100%; padding: 12px; border-radius: 10px; border: none;
    background: linear-gradient(135deg, #7c3aed, #a78bfa);
    color: #fff; font-family: var(--font-display); font-weight: 700; font-size: 15px;
    letter-spacing: 0.01em; cursor: pointer;
    box-shadow: 0 4px 24px rgba(124,58,237,0.38);
    transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease), opacity 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    margin-top: 4px;
  }
  .auth-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 7px 32px rgba(124,58,237,0.52); }
  .auth-submit:active:not(:disabled) { transform: translateY(0); }
  .auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  .auth-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
    border-radius: 50%; animation: auth-spin 0.65s linear infinite;
  }
  @keyframes auth-spin { to { transform: rotate(360deg); } }

  .auth-divider { display: flex; align-items: center; gap: 12px; margin: 4px 0; }
  .auth-divider-line { flex: 1; height: 1px; background: var(--auth-border); }
  .auth-divider-text { font-size: 12px; color: var(--auth-faint); }
  .auth-footer { text-align: center; font-size: 13px; color: var(--auth-muted); }
  .auth-link { color: var(--auth-accent); font-weight: 500; text-decoration: none; transition: opacity 0.2s; }
  .auth-link:hover { opacity: 0.75; }
  .auth-alert-wrap { margin-bottom: 4px; }
  .auth-terms { font-size: 11px; color: var(--auth-faint); text-align: center; line-height: 1.5; }
  .auth-terms a { color: var(--auth-accent); text-decoration: none; }
`;

function getStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw) || /[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 3);
}

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = React.useState({
    name: "", email: "", password: "", confirmPassword: "",
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");
  const pwStrength = getStrength(formData.password);
  const strengthLabel = ["", "Weak", "Fair", "Strong"][pwStrength];
  const strengthClass = ["", "active-weak", "active-medium", "active-strong"][pwStrength];

  React.useEffect(() => {
    const id = "auth-injected-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = AUTH_STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  const validateForm = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Name is required";
    else if (formData.name.length > 50) e.name = "Max 50 characters";
    const emailRe = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRe.test(formData.email)) e.email = "Enter a valid email address";
    if (formData.password.length < 6) e.password = "At least 6 characters";
    if (formData.password !== formData.confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setSubmitError("");
    try {
      const response = await authService.register({
        name: formData.name, email: formData.email,
        password: formData.password, confirmPassword: formData.confirmPassword,
      });
      const { token, user } = response.data;
      login(user, token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (error) {
      setSubmitError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const field = (name, label, type, placeholder, icon, autocomplete) => (
    <div className="auth-field" key={name}>
      <label className="auth-label">{label}</label>
      <div className="auth-input-wrap">
        <span className="auth-input-icon">{icon}</span>
        <input
          className={`auth-input${errors[name] ? " has-error" : ""}`}
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete={autocomplete}
          required
        />
      </div>
      {errors[name] && <div className="auth-field-error">⚠ {errors[name]}</div>}
    </div>
  );

  return (
    <div className="auth-root">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-left-grid" />
        <div className="auth-left-brand">
          <div className="auth-left-mark">T</div>
          <span className="auth-left-name">TaskOS</span>
        </div>
        <div className="auth-left-copy">
          <h1 className="auth-left-headline">
            Get started<br /><em>for free.</em>
          </h1>
          <p className="auth-left-sub">
            Join thousands of people who use TaskOS to stay organized and ship more every day.
          </p>
        </div>
        <div className="auth-features">
          {[
            { icon: "🚀", title: "Up in seconds", desc: "Create an account and start managing tasks instantly" },
            { icon: "📊", title: "Live dashboard", desc: "Visual stats on completion rate and priority breakdown" },
            { icon: "🌐", title: "Works everywhere", desc: "Responsive across desktop, tablet, and mobile" },
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
            <h2 className="auth-card-title">Create account</h2>
            <p className="auth-card-sub">Free forever. No credit card needed.</p>
          </div>

          {submitError && (
            <div className="auth-alert-wrap">
              <Alert type="error" message={submitError} onClose={() => setSubmitError("")} />
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form-grid">
              {field("name", "Full Name", "text", "Jane Smith", "👤", "name")}
              {field("email", "Email", "email", "you@example.com", "✉", "email")}
            </div>

            {/* Password with strength meter */}
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  className={`auth-input${errors.password ? " has-error" : ""}`}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  required
                />
              </div>
              {formData.password && (
                <div className="auth-strength">
                  <div className="auth-strength-bars">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`auth-strength-bar${pwStrength >= i ? ` ${strengthClass}` : ""}`}
                      />
                    ))}
                  </div>
                  <span className="auth-strength-label">{strengthLabel}</span>
                </div>
              )}
              {errors.password && <div className="auth-field-error">⚠ {errors.password}</div>}
            </div>

            {field("confirmPassword", "Confirm Password", "password", "Repeat your password", "🔑", "new-password")}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? (
                <><div className="auth-spinner" /> Creating account…</>
              ) : (
                "Create Account →"
              )}
            </button>

            <p className="auth-terms">
              By signing up you agree to our{" "}
              <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </p>
          </form>

          <div style={{ marginTop: "1.25rem" }}>
            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">have an account?</span>
              <div className="auth-divider-line" />
            </div>
            <div className="auth-footer" style={{ marginTop: "1rem" }}>
              <Link to="/login" className="auth-link">Sign in instead →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}