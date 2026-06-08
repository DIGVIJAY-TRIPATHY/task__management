import React from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { taskService } from "../services/api";
import { useAuthStore, useTaskStore } from "../store/index";

/* ─────────────────────────────────────────────────────────────
   GOD-TIER RESPONSIVE STYLES
   Breakpoints:
     xs  : < 480px   (small phones)
     sm  : < 640px   (phones)
     md  : < 768px   (large phones / small tablets)
     lg  : < 1024px  (tablets)
     xl  : < 1280px  (small desktops)
     2xl : ≥ 1280px  (large desktops)
───────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --void:    #04050d;
    --surface: rgba(255,255,255,0.032);
    --surface2:rgba(255,255,255,0.06);
    --border:  rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.14);
    --accent:  #9b6dff;
    --accent2: #5b9fff;
    --green:   #2ddb96;
    --amber:   #f5a623;
    --red:     #ff5e6c;
    --text:    #ede9ff;
    --muted:   rgba(237,233,255,0.42);
    --faint:   rgba(237,233,255,0.16);
    --font-d:  'Syne', sans-serif;
    --font-b:  'DM Sans', sans-serif;
    --ease:    cubic-bezier(0.22,1,0.36,1);
    --header-h: 64px;
    --bottom-nav-h: 60px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── ROOT ── */
  .gd-root {
    min-height: 100vh;
    background: var(--void);
    font-family: var(--font-b);
    color: var(--text);
    overflow-x: hidden;
    position: relative;
  }

  /* ── AURORA ── */
  .gd-aurora { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
  .gd-aurora-orb { position: absolute; border-radius: 50%; filter: blur(80px); animation: orb-drift 18s ease-in-out infinite alternate; }
  .gd-aurora-orb:nth-child(1) { width: 700px; height: 500px; top: -200px; left: -150px; background: radial-gradient(ellipse, rgba(100,60,220,0.18) 0%, transparent 70%); animation-duration: 20s; }
  .gd-aurora-orb:nth-child(2) { width: 600px; height: 500px; top: -100px; right: -200px; background: radial-gradient(ellipse, rgba(45,120,255,0.12) 0%, transparent 70%); animation-duration: 26s; animation-delay: -8s; }
  .gd-aurora-orb:nth-child(3) { width: 500px; height: 400px; bottom: 10%; left: 30%; background: radial-gradient(ellipse, rgba(45,219,150,0.07) 0%, transparent 70%); animation-duration: 30s; animation-delay: -14s; }
  @keyframes orb-drift { from { transform: translate(0,0) scale(1); } to { transform: translate(40px,30px) scale(1.06); } }
  @media (max-width: 640px) {
    .gd-aurora-orb:nth-child(1) { width: 320px; height: 280px; }
    .gd-aurora-orb:nth-child(2) { width: 280px; height: 240px; }
    .gd-aurora-orb:nth-child(3) { display: none; }
  }

  /* ── GRAIN + SCANLINE ── */
  .gd-grain { position: fixed; inset: 0; z-index: 1; pointer-events: none; opacity: 0.025; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 200px 200px; }
  .gd-scanline { position: fixed; inset: 0; z-index: 2; pointer-events: none; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px); }
  .gd-layer { position: relative; z-index: 10; }

  /* ════════════════════════════
     HEADER
  ════════════════════════════ */
  .gd-header {
    position: sticky; top: 0; z-index: 200;
    backdrop-filter: blur(32px) saturate(200%);
    -webkit-backdrop-filter: blur(32px) saturate(200%);
    background: rgba(4,5,13,0.8);
    border-bottom: 1px solid var(--border);
    height: var(--header-h);
  }
  .gd-header-inner {
    max-width: 1360px; margin: 0 auto;
    padding: 0 2rem;
    height: 100%;
    display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  }
  @media (max-width: 640px) {
    .gd-header-inner { padding: 0 1rem; }
  }

  /* Logo */
  .gd-logo { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  .gd-logo-mark {
    position: relative; width: 34px; height: 34px; border-radius: 10px;
    background: linear-gradient(135deg, #5b33cc, #9b6dff);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-d); font-weight: 800; font-size: 15px; color: #fff;
    box-shadow: 0 0 20px rgba(155,109,255,0.45), inset 0 1px 0 rgba(255,255,255,0.2);
  }
  .gd-logo-mark::after { content: ''; position: absolute; inset: -1px; border-radius: 11px; background: linear-gradient(135deg, rgba(155,109,255,0.6), rgba(91,159,255,0.3)); z-index: -1; filter: blur(6px); }
  .gd-logo-name { font-family: var(--font-d); font-weight: 800; font-size: 18px; letter-spacing: -0.4px; }

  /* Greeting — hide text on mobile, keep avatar */
  .gd-greeting { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--muted); }
  .gd-greeting-text { display: none; }
  @media (min-width: 768px) { .gd-greeting-text { display: block; } }
  .gd-greeting-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(135deg, #5b33cc, #9b6dff);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #fff;
    box-shadow: 0 0 12px rgba(155,109,255,0.4);
    flex-shrink: 0;
  }
  .gd-greeting strong { color: var(--text); font-weight: 600; }

  /* Header right */
  .gd-header-right { display: flex; align-items: center; gap: 8px; }
  .gd-status-pill { display: flex; align-items: center; gap: 6px; padding: 5px 12px 5px 8px; border-radius: 999px; border: 1px solid rgba(45,219,150,0.25); background: rgba(45,219,150,0.06); font-size: 12px; font-weight: 500; color: var(--green); white-space: nowrap; }
  .gd-status-pill-text { display: none; }
  @media (min-width: 480px) { .gd-status-pill-text { display: inline; } }
  .gd-status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); box-shadow: 0 0 6px var(--green); animation: pulse-dot 2.4s ease-in-out infinite; }
  @keyframes pulse-dot { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.85); } }

  /* Logout — icon-only on mobile */
  .gd-logout-btn {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 7px; border-radius: 9px;
    border: 1px solid var(--border2); background: var(--surface);
    color: var(--muted); font-family: var(--font-b); font-size: 13px; font-weight: 500;
    cursor: pointer; min-width: 36px; min-height: 36px;
    transition: background 0.2s var(--ease), color 0.2s var(--ease), box-shadow 0.2s var(--ease);
  }
  .gd-logout-btn:hover { background: var(--surface2); color: var(--text); box-shadow: 0 0 16px rgba(155,109,255,0.1); }
  .gd-logout-text { display: none; }
  @media (min-width: 640px) {
    .gd-logout-btn { padding: 7px 16px; }
    .gd-logout-text { display: inline; }
  }

  /* ════════════════════════════
     MAIN LAYOUT
  ════════════════════════════ */
  .gd-main {
    max-width: 1360px; margin: 0 auto;
    padding: 2rem 2rem 5rem;
  }
  @media (max-width: 768px) { .gd-main { padding: 1.5rem 1rem calc(var(--bottom-nav-h) + 2rem); } }
  @media (max-width: 480px) { .gd-main { padding: 1.25rem 0.75rem calc(var(--bottom-nav-h) + 2rem); } }

  /* ── HERO ── */
  .gd-hero { margin-bottom: 2rem; }
  @media (max-width: 640px) { .gd-hero { margin-bottom: 1.5rem; } }
  .gd-hero-label {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 4px 12px 4px 8px; border-radius: 999px;
    border: 1px solid rgba(155,109,255,0.25); background: rgba(155,109,255,0.08);
    font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--accent); margin-bottom: 0.75rem;
  }
  .gd-hero-label span { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 6px var(--accent); }
  .gd-hero-title {
    font-family: var(--font-d); font-weight: 800;
    font-size: clamp(22px, 5vw, 44px);
    letter-spacing: -1.5px; line-height: 1.08; color: var(--text); margin-bottom: 0.4rem;
  }
  .gd-hero-title em {
    font-style: normal;
    background: linear-gradient(135deg, #9b6dff 0%, #5b9fff 50%, #2ddb96 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .gd-hero-sub { font-size: 14px; color: var(--muted); }

  /* ════════════════════════════
     STAT CARDS
  ════════════════════════════ */
  .gd-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 1.5rem;
  }
  @media (max-width: 1024px) { .gd-stats { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 480px)  {
    .gd-stats {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      gap: 10px;
      padding-bottom: 8px;
      margin-left: -0.75rem;
      margin-right: -0.75rem;
      padding-left: 0.75rem;
      padding-right: 0.75rem;
      scrollbar-width: none;
    }
    .gd-stats::-webkit-scrollbar { display: none; }
  }

  .gd-stat {
    position: relative; overflow: hidden;
    padding: 1.5rem 1.5rem 1.25rem;
    border-radius: 18px;
    border: 1px solid var(--border);
    background: var(--surface);
    backdrop-filter: blur(16px);
    cursor: default;
    transition: transform 0.35s var(--ease), border-color 0.35s var(--ease), box-shadow 0.35s var(--ease);
    animation: stat-in 0.6s var(--ease) both;
  }
  @media (max-width: 480px) {
    .gd-stat { min-width: 180px; flex-shrink: 0; scroll-snap-align: start; padding: 1.25rem; }
  }
  .gd-stat:nth-child(1) { animation-delay: 0.05s; }
  .gd-stat:nth-child(2) { animation-delay: 0.12s; }
  .gd-stat:nth-child(3) { animation-delay: 0.19s; }
  .gd-stat:nth-child(4) { animation-delay: 0.26s; }
  @keyframes stat-in { from { opacity: 0; transform: translateY(24px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }

  @media (hover: hover) {
    .gd-stat:hover { transform: translateY(-4px); border-color: var(--border2); box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 40px var(--stat-glow, rgba(155,109,255,0.12)); }
    .gd-stat::before { content: ''; position: absolute; inset: 0; background: var(--stat-gradient, none); opacity: 0; transition: opacity 0.4s; border-radius: inherit; pointer-events: none; }
    .gd-stat:hover::before { opacity: 1; }
    .gd-stat::after { content: ''; position: absolute; top: 0; left: 10%; right: 10%; height: 1px; background: var(--stat-line, linear-gradient(90deg, transparent, rgba(155,109,255,0.5), transparent)); opacity: 0; transition: opacity 0.4s; }
    .gd-stat:hover::after { opacity: 1; }
  }

  .gd-stat[data-c="purple"] { --stat-glow: rgba(155,109,255,0.14); --stat-gradient: radial-gradient(ellipse at 80% 0%, rgba(155,109,255,0.12) 0%, transparent 65%); --stat-line: linear-gradient(90deg, transparent, rgba(155,109,255,0.6), transparent); }
  .gd-stat[data-c="green"]  { --stat-glow: rgba(45,219,150,0.12);  --stat-gradient: radial-gradient(ellipse at 80% 0%, rgba(45,219,150,0.1) 0%, transparent 65%);  --stat-line: linear-gradient(90deg, transparent, rgba(45,219,150,0.6), transparent); }
  .gd-stat[data-c="amber"]  { --stat-glow: rgba(245,166,35,0.12);  --stat-gradient: radial-gradient(ellipse at 80% 0%, rgba(245,166,35,0.1) 0%, transparent 65%);  --stat-line: linear-gradient(90deg, transparent, rgba(245,166,35,0.6), transparent); }
  .gd-stat[data-c="red"]    { --stat-glow: rgba(255,94,108,0.12);  --stat-gradient: radial-gradient(ellipse at 80% 0%, rgba(255,94,108,0.1) 0%, transparent 65%);  --stat-line: linear-gradient(90deg, transparent, rgba(255,94,108,0.6), transparent); }

  .gd-stat-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
  .gd-stat-icon { width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 17px; }
  .gd-stat-icon[data-c="purple"] { background: rgba(155,109,255,0.14); box-shadow: 0 0 16px rgba(155,109,255,0.2); }
  .gd-stat-icon[data-c="green"]  { background: rgba(45,219,150,0.12);  box-shadow: 0 0 16px rgba(45,219,150,0.18); }
  .gd-stat-icon[data-c="amber"]  { background: rgba(245,166,35,0.12);  box-shadow: 0 0 16px rgba(245,166,35,0.18); }
  .gd-stat-icon[data-c="red"]    { background: rgba(255,94,108,0.12);  box-shadow: 0 0 16px rgba(255,94,108,0.18); }
  .gd-stat-trend { font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 999px; }
  .gd-stat-trend.up   { background: rgba(45,219,150,0.1);  color: var(--green); }
  .gd-stat-trend.warn { background: rgba(245,166,35,0.1);  color: var(--amber); }

  .gd-stat-value {
    font-family: var(--font-d); font-weight: 800;
    font-size: clamp(36px, 4vw, 52px);
    line-height: 1; letter-spacing: -2px; margin-bottom: 5px;
  }
  .gd-stat-value[data-c="purple"] { color: var(--accent); }
  .gd-stat-value[data-c="green"]  { color: var(--green); }
  .gd-stat-value[data-c="amber"]  { color: var(--amber); }
  .gd-stat-value[data-c="red"]    { color: var(--red); }
  .gd-stat-label { font-size: 11px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); margin-bottom: 1rem; }
  .gd-stat-bar { height: 3px; border-radius: 3px; background: rgba(255,255,255,0.07); overflow: hidden; }
  .gd-stat-fill { height: 100%; border-radius: 3px; transition: width 1.2s cubic-bezier(0.4,0,0.2,1); }
  .gd-stat-fill[data-c="purple"] { background: linear-gradient(90deg, #5b33cc, #9b6dff); box-shadow: 0 0 8px rgba(155,109,255,0.6); }
  .gd-stat-fill[data-c="green"]  { background: linear-gradient(90deg, #0db36e, #2ddb96); box-shadow: 0 0 8px rgba(45,219,150,0.6); }
  .gd-stat-fill[data-c="amber"]  { background: linear-gradient(90deg, #c47d10, #f5a623); box-shadow: 0 0 8px rgba(245,166,35,0.6); }
  .gd-stat-fill[data-c="red"]    { background: linear-gradient(90deg, #cc2d3e, #ff5e6c); box-shadow: 0 0 8px rgba(255,94,108,0.6); }

  /* ── Scroll hint dots for xs ── */
  .gd-scroll-hint { display: none; justify-content: center; gap: 5px; margin-bottom: 1.25rem; }
  @media (max-width: 480px) { .gd-scroll-hint { display: flex; } }
  .gd-scroll-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--border2); transition: background 0.2s; }
  .gd-scroll-dot.active { background: var(--accent); box-shadow: 0 0 6px var(--accent); }

  /* ════════════════════════════
     BODY GRID
  ════════════════════════════ */
  .gd-body {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 16px;
    align-items: start;
  }
  @media (max-width: 1024px) { .gd-body { grid-template-columns: 1fr; } }

  /* ════════════════════════════
     CONTROLS
  ════════════════════════════ */
  @keyframes panel-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .gd-controls {
    padding: 1.25rem;
    border-radius: 18px;
    border: 1px solid var(--border);
    background: var(--surface);
    backdrop-filter: blur(16px);
    margin-bottom: 1rem;
    animation: panel-in 0.5s var(--ease) 0.3s both;
  }
  .gd-controls-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 10px; }
  @media (max-width: 768px) { .gd-controls-row { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 480px) { .gd-controls-row { grid-template-columns: 1fr; } }

  /* Search always full width on tablet */
  @media (max-width: 768px) and (min-width: 481px) {
    .gd-controls-row .gd-input:first-child { grid-column: 1 / -1; }
  }

  .gd-input {
    width: 100%; padding: 10px 13px;
    border-radius: 10px; border: 1px solid var(--border);
    background: rgba(255,255,255,0.03);
    color: var(--text); font-family: var(--font-b); font-size: 13px;
    outline: none; -webkit-appearance: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    min-height: 44px;
  }
  .gd-input::placeholder { color: var(--faint); }
  .gd-input:focus { border-color: rgba(155,109,255,0.5); background: rgba(155,109,255,0.05); box-shadow: 0 0 0 3px rgba(155,109,255,0.08); }
  .gd-input option { background: #0e0f1e; color: var(--text); }

  .gd-controls-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

  .gd-cta {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 20px; border-radius: 10px; border: none;
    background: linear-gradient(135deg, #5b33cc, #9b6dff);
    color: #fff; font-family: var(--font-d); font-weight: 700; font-size: 14px;
    cursor: pointer; letter-spacing: 0.01em; min-height: 44px;
    box-shadow: 0 4px 24px rgba(91,51,204,0.45), inset 0 1px 0 rgba(255,255,255,0.15);
    transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease);
    position: relative; overflow: hidden; touch-action: manipulation;
  }
  .gd-cta::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent); opacity: 0; transition: opacity 0.2s; }
  @media (hover: hover) {
    .gd-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 36px rgba(91,51,204,0.6), inset 0 1px 0 rgba(255,255,255,0.15); }
    .gd-cta:hover::before { opacity: 1; }
  }
  .gd-cta:active { transform: scale(0.97); }

  .gd-cta-cancel {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 20px; border-radius: 10px;
    border: 1px solid var(--border2); background: var(--surface2);
    color: var(--muted); font-family: var(--font-d); font-weight: 600; font-size: 14px;
    cursor: pointer; min-height: 44px; touch-action: manipulation;
    transition: color 0.2s, background 0.2s;
  }
  .gd-cta-cancel:hover { color: var(--text); background: rgba(255,255,255,0.08); }

  /* ── TASK FORM WRAPPER ── */
  .gd-form-wrap {
    padding: 1.75rem;
    border-radius: 18px;
    border: 1px solid rgba(155,109,255,0.25);
    background: rgba(91,51,204,0.07);
    backdrop-filter: blur(16px);
    margin-bottom: 1rem;
    box-shadow: 0 0 40px rgba(91,51,204,0.1);
    animation: form-slide 0.3s var(--ease) both;
  }
  @media (max-width: 480px) { .gd-form-wrap { padding: 1.25rem; } }
  @keyframes form-slide { from { opacity: 0; transform: translateY(-10px) scale(0.99); } to { opacity: 1; transform: translateY(0) scale(1); } }

  /* ── EMPTY / LOADER ── */
  .gd-empty {
    text-align: center; padding: 4rem 2rem;
    border-radius: 20px; border: 1px dashed var(--border2); background: var(--surface);
    animation: panel-in 0.4s var(--ease) both;
  }
  @media (max-width: 480px) { .gd-empty { padding: 3rem 1.25rem; } }
  .gd-empty-icon { font-size: 56px; display: block; margin-bottom: 1.25rem; }
  .gd-empty h2 { font-family: var(--font-d); font-weight: 700; font-size: 22px; margin-bottom: 0.5rem; }
  .gd-empty p { color: var(--muted); font-size: 14px; margin-bottom: 1.75rem; }

  .gd-loader { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 5rem 0; gap: 1rem; }
  .gd-spinner { width: 36px; height: 36px; border-radius: 50%; border: 2px solid var(--border); border-top-color: var(--accent); animation: spin 0.7s linear infinite; box-shadow: 0 0 16px rgba(155,109,255,0.3); }
  @keyframes spin { to { transform: rotate(360deg); } }
  .gd-loader p { font-size: 14px; color: var(--muted); }

  .gd-section-label {
    font-family: var(--font-d); font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--faint); margin-bottom: 0.75rem;
    display: flex; align-items: center; gap: 10px;
  }
  .gd-section-label::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, var(--border2), transparent); }

  /* ════════════════════════════
     SIDEBAR
  ════════════════════════════ */
  .gd-sidebar { display: flex; flex-direction: column; gap: 14px; }

  /* On tablet: sidebar becomes a horizontal row of cards */
  @media (max-width: 1024px) and (min-width: 641px) {
    .gd-sidebar { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  }
  /* On mobile: sidebar is hidden — content accessible via bottom nav tabs */
  @media (max-width: 640px) { .gd-sidebar { display: none; } }
  .gd-sidebar.mobile-visible { display: flex !important; flex-direction: column; gap: 14px; }

  .gd-card { border-radius: 18px; border: 1px solid var(--border); background: var(--surface); backdrop-filter: blur(16px); overflow: hidden; animation: panel-in 0.5s var(--ease) 0.35s both; }
  .gd-card-head { padding: 1rem 1.25rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .gd-card-title { font-family: var(--font-d); font-weight: 700; font-size: 13px; letter-spacing: -0.2px; }
  .gd-card-badge { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 999px; background: rgba(155,109,255,0.12); color: var(--accent); }
  .gd-card-body { padding: 1rem 1.25rem; }

  /* Activity feed */
  .gd-activity { display: flex; flex-direction: column; }
  .gd-activity-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--border); }
  .gd-activity-item:last-child { border-bottom: none; }
  .gd-activity-dot { width: 7px; height: 7px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
  .gd-activity-dot.green  { background: var(--green);  box-shadow: 0 0 6px var(--green); }
  .gd-activity-dot.purple { background: var(--accent);  box-shadow: 0 0 6px var(--accent); }
  .gd-activity-dot.amber  { background: var(--amber);   box-shadow: 0 0 6px var(--amber); }
  .gd-activity-dot.red    { background: var(--red);     box-shadow: 0 0 6px var(--red); }
  .gd-activity-text { font-size: 12.5px; color: var(--muted); line-height: 1.45; }
  .gd-activity-text strong { color: var(--text); font-weight: 500; }
  .gd-activity-time { font-size: 10.5px; color: var(--faint); margin-top: 2px; }

  /* Ring */
  .gd-ring-wrap { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 1.25rem; }
  .gd-ring-svg { overflow: visible; }
  .gd-ring-track { fill: none; stroke: var(--border); stroke-width: 8; }
  .gd-ring-fill { fill: none; stroke-width: 8; stroke-linecap: round; stroke: url(#ring-grad); transition: stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1); transform-origin: center; transform: rotate(-90deg); filter: drop-shadow(0 0 6px rgba(155,109,255,0.6)); }
  .gd-ring-label { font-family: var(--font-d); font-weight: 800; font-size: 28px; letter-spacing: -1px; fill: var(--text); }
  .gd-ring-sub { font-size: 11px; fill: var(--muted); }
  .gd-ring-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; width: 100%; }
  .gd-ring-stat { text-align: center; padding: 8px; border-radius: 9px; border: 1px solid var(--border); background: rgba(255,255,255,0.02); }
  .gd-ring-stat-val { font-family: var(--font-d); font-weight: 700; font-size: 18px; }
  .gd-ring-stat-val.green  { color: var(--green); }
  .gd-ring-stat-val.purple { color: var(--accent); }
  .gd-ring-stat-lbl { font-size: 10px; color: var(--muted); margin-top: 2px; }

  /* Priority */
  .gd-priority { display: flex; flex-direction: column; gap: 10px; padding: 1rem 1.25rem; }
  .gd-priority-row { display: flex; align-items: center; gap: 10px; }
  .gd-priority-label { font-size: 11.5px; font-weight: 500; width: 48px; color: var(--muted); }
  .gd-priority-track { flex: 1; height: 5px; border-radius: 3px; background: rgba(255,255,255,0.05); overflow: hidden; }
  .gd-priority-fill { height: 100%; border-radius: 3px; transition: width 1.2s cubic-bezier(0.4,0,0.2,1); }
  .gd-priority-fill.high   { background: linear-gradient(90deg, #cc2d3e, #ff5e6c); box-shadow: 0 0 6px rgba(255,94,108,0.5); }
  .gd-priority-fill.medium { background: linear-gradient(90deg, #c47d10, #f5a623); box-shadow: 0 0 6px rgba(245,166,35,0.5); }
  .gd-priority-fill.low    { background: linear-gradient(90deg, #0db36e, #2ddb96); box-shadow: 0 0 6px rgba(45,219,150,0.5); }
  .gd-priority-count { font-size: 11px; color: var(--faint); width: 18px; text-align: right; }

  /* ════════════════════════════
     BOTTOM NAVIGATION (mobile)
  ════════════════════════════ */
  .gd-bottom-nav {
    display: none;
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 300;
    height: var(--bottom-nav-h);
    backdrop-filter: blur(32px) saturate(200%);
    -webkit-backdrop-filter: blur(32px) saturate(200%);
    background: rgba(4,5,13,0.88);
    border-top: 1px solid var(--border);
    align-items: stretch;
  }
  @media (max-width: 640px) { .gd-bottom-nav { display: flex; } }

  .gd-nav-tab {
    flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 3px; cursor: pointer; background: none; border: none; color: var(--faint);
    font-family: var(--font-b); font-size: 10px; font-weight: 500; letter-spacing: 0.04em;
    transition: color 0.2s; padding: 0; touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
  .gd-nav-tab svg { width: 20px; height: 20px; transition: filter 0.2s; }
  .gd-nav-tab.active { color: var(--accent); }
  .gd-nav-tab.active svg { filter: drop-shadow(0 0 6px rgba(155,109,255,0.7)); }

  /* ── FAB ── */
  .gd-fab {
    display: none;
    position: fixed; bottom: calc(var(--bottom-nav-h) + 16px); right: 16px; z-index: 290;
    width: 52px; height: 52px; border-radius: 50%;
    background: linear-gradient(135deg, #5b33cc, #9b6dff);
    border: none; cursor: pointer;
    display: none; align-items: center; justify-content: center;
    box-shadow: 0 4px 24px rgba(91,51,204,0.55), inset 0 1px 0 rgba(255,255,255,0.15);
    transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease);
    touch-action: manipulation; -webkit-tap-highlight-color: transparent;
  }
  @media (max-width: 640px) { .gd-fab { display: flex; } }
  .gd-fab:active { transform: scale(0.93); }
  .gd-fab svg { width: 22px; height: 22px; color: #fff; }
  .gd-fab.cancel-mode { background: linear-gradient(135deg, #2a1a5e, #4a2d9e); }

  /* Alert */
  .gd-alert-wrap { margin-bottom: 1.25rem; }
`;

/* ── Completion Ring ── */
function CompletionRing({ pct = 0, completed = 0, total = 0 }) {
  const R = 52, C = 2 * Math.PI * R;
  const offset = C - (pct / 100) * C;
  return (
    <div className="gd-ring-wrap">
      <svg className="gd-ring-svg" width="148" height="148" viewBox="0 0 148 148">
        <defs>
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5b33cc" />
            <stop offset="50%" stopColor="#9b6dff" />
            <stop offset="100%" stopColor="#5b9fff" />
          </linearGradient>
        </defs>
        <circle className="gd-ring-track" cx="74" cy="74" r={R} />
        <circle className="gd-ring-fill" cx="74" cy="74" r={R} strokeDasharray={C} strokeDashoffset={offset} />
        <text className="gd-ring-label" x="74" y="70" textAnchor="middle" dominantBaseline="middle">{pct}%</text>
        <text className="gd-ring-sub"   x="74" y="90" textAnchor="middle">complete</text>
      </svg>
      <div className="gd-ring-stats">
        <div className="gd-ring-stat"><div className="gd-ring-stat-val green">{completed}</div><div className="gd-ring-stat-lbl">Done</div></div>
        <div className="gd-ring-stat"><div className="gd-ring-stat-val purple">{total - completed}</div><div className="gd-ring-stat-lbl">Left</div></div>
      </div>
    </div>
  );
}

/* ── Activity Feed ── */
function ActivityFeed({ tasks }) {
  const items = React.useMemo(() => {
    const safe = tasks || [];
    const list = safe.slice(0, 4).map((t) => {
      if (t.status === "completed") return { color: "green",  text: <><strong>{t.title}</strong> marked complete</>,        time: "recently" };
      if (t.priority === "high")    return { color: "red",    text: <><strong>{t.title}</strong> flagged high priority</>,   time: "active" };
      return                               { color: "purple", text: <><strong>{t.title}</strong> added to queue</>,          time: "pending" };
    });
    if (!list.length) list.push({ color: "amber", text: <>No activity yet — create your first task</>, time: "now" });
    return list;
  }, [tasks]);

  return (
    <div className="gd-activity">
      {items.map((a, i) => (
        <div key={i} className="gd-activity-item">
          <div className={`gd-activity-dot ${a.color}`} />
          <div>
            <div className="gd-activity-text">{a.text}</div>
            <div className="gd-activity-time">{a.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Priority Breakdown ── */
function PriorityBreakdown({ tasks }) {
  const safe = tasks || [];
  const high   = safe.filter(t => t.priority === "high").length;
  const medium = safe.filter(t => t.priority === "medium").length;
  const low    = safe.filter(t => t.priority === "low").length;
  const total  = Math.max(safe.length, 1);
  return (
    <div className="gd-priority">
      {[
        { label: "High",   count: high,   pct: (high   / total) * 100, cls: "high" },
        { label: "Medium", count: medium, pct: (medium / total) * 100, cls: "medium" },
        { label: "Low",    count: low,    pct: (low    / total) * 100, cls: "low" },
      ].map(({ label, count, pct, cls }) => (
        <div key={label} className="gd-priority-row">
          <span className="gd-priority-label">{label}</span>
          <div className="gd-priority-track"><div className={`gd-priority-fill ${cls}`} style={{ width: `${pct}%` }} /></div>
          <span className="gd-priority-count">{count}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Sidebar panel (reused on mobile sheet) ── */
function SidebarContent({ tasks, completionPct, stats }) {
  return (
    <>
      <div className="gd-card">
        <div className="gd-card-head"><span className="gd-card-title">Completion</span><span className="gd-card-badge">{completionPct}%</span></div>
        <CompletionRing pct={completionPct} completed={stats.completed} total={stats.total} />
      </div>
      <div className="gd-card">
        <div className="gd-card-head"><span className="gd-card-title">Priority Breakdown</span></div>
        <PriorityBreakdown tasks={tasks} />
      </div>
      <div className="gd-card">
        <div className="gd-card-head"><span className="gd-card-title">Activity</span><span className="gd-card-badge">Live</span></div>
        <div className="gd-card-body"><ActivityFeed tasks={tasks} /></div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════ */
export default function Dashboard() {
  const navigate  = useNavigate();
  const { user, logout } = useAuthStore();
  const {
    tasks, setTasks, loading, setLoading, error, setError,
    filter, setFilter, searchTerm, setSearchTerm,
    getFilteredTasks, addTask, updateTask, removeTask,
  } = useTaskStore();

  const [showForm,     setShowForm]     = React.useState(false);
  const [editingTask,  setEditingTask]  = React.useState(null);
  const [sortBy,       setSortBy]       = React.useState("recent");
  const [mobileTab,    setMobileTab]    = React.useState("tasks"); // "tasks" | "stats"
  const statsRef = React.useRef(null);

  /* Inject styles once */
  React.useEffect(() => {
    const id = "gd-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id; tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  React.useEffect(() => { fetchTasks(); }, [filter, searchTerm]);

  /* Scroll-dot update for stat cards on xs */
  React.useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const onScroll = () => {
      const dots = el.parentElement?.querySelectorAll(".gd-scroll-dot");
      if (!dots) return;
      const idx = Math.round(el.scrollLeft / 190);
      dots.forEach((d, i) => d.classList.toggle("active", i === idx));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const fetchTasks = async () => {
    setLoading(true); setError(null);
    try {
      const params = {};
      if (filter !== "all") params.status = filter;
      if (searchTerm) params.search = searchTerm;
      const res = await taskService.getAllTasks(params);
      setTasks(res.data.data.tasks || []);
    } catch (err) { setError(err.response?.data?.message || "Failed to fetch tasks"); }
    finally { setLoading(false); }
  };

  const handleCreateTask = async (fd) => {
    setLoading(true);
    try { const res = await taskService.createTask(fd); addTask(res.data.data); setShowForm(false); setError(null); }
    catch (err) { setError(err.response?.data?.message || "Failed to create task"); }
    finally { setLoading(false); }
  };

  const handleUpdateTask = async (fd) => {
    setLoading(true);
    try { const res = await taskService.updateTask(editingTask._id, fd); updateTask(editingTask._id, res.data.data); setEditingTask(null); setError(null); }
    catch (err) { setError(err.response?.data?.message || "Failed to update task"); }
    finally { setLoading(false); }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Delete this task?")) {
      try { await taskService.deleteTask(id); removeTask(id); setError(null); }
      catch (err) { setError(err.response?.data?.message || "Failed to delete task"); }
    }
  };

  const handleToggleTask = async (id) => {
    try { const res = await taskService.toggleTask(id); updateTask(id, { status: res.data.data.status }); }
    catch (err) { setError(err.response?.data?.message || "Failed to toggle task"); }
  };

  const handleLogout = () => {
    logout(); localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/login");
  };

  const getSortedTasks = () => {
    let s = [...getFilteredTasks()];
    if (sortBy === "recent")   s.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === "oldest")   s.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortBy === "priority") { const o = { high: 0, medium: 1, low: 2 }; s.sort((a, b) => o[a.priority] - o[b.priority]); }
    if (sortBy === "dueDate")  s.sort((a, b) => { if (!a.dueDate) return 1; if (!b.dueDate) return -1; return new Date(a.dueDate) - new Date(b.dueDate); });
    return s;
  };

  const safe = tasks || [];
  const stats = {
    total:        safe.length,
    completed:    safe.filter(t => t.status === "completed").length,
    pending:      safe.filter(t => t.status === "pending").length,
    highPriority: safe.filter(t => t.priority === "high").length,
  };
  const completionPct  = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const filteredTasks  = getSortedTasks();
  const initials       = user?.name ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "U";
  const formActive     = showForm || !!editingTask;

  const statCards = [
    { label: "Total Tasks",   value: stats.total,        c: "purple", icon: "📋", trend: "all tasks",        trendCls: "up",   pct: Math.min(stats.total * 5, 100) },
    { label: "Completed",     value: stats.completed,    c: "green",  icon: "✅", trend: `${completionPct}% rate`, trendCls: "up", pct: completionPct },
    { label: "Pending",       value: stats.pending,      c: "amber",  icon: "⏳", trend: "in queue",         trendCls: "warn", pct: stats.total ? (stats.pending / stats.total) * 100 : 0 },
    { label: "High Priority", value: stats.highPriority, c: "red",    icon: "🔥", trend: "urgent",           trendCls: "warn", pct: stats.total ? (stats.highPriority / stats.total) * 100 : 0 },
  ];

  return (
    <div className="gd-root">
      {/* Atmosphere */}
      <div className="gd-aurora"><div className="gd-aurora-orb" /><div className="gd-aurora-orb" /><div className="gd-aurora-orb" /></div>
      <div className="gd-grain" />
      <div className="gd-scanline" />

      <div className="gd-layer">
        {/* ── HEADER ── */}
        <header className="gd-header">
          <div className="gd-header-inner">
            <div className="gd-logo">
              <div className="gd-logo-mark">T</div>
              <span className="gd-logo-name">TaskOS</span>
            </div>

            <div className="gd-greeting">
              <div className="gd-greeting-avatar">{initials}</div>
              <span className="gd-greeting-text">Welcome back, <strong>{user?.name ?? "Commander"}</strong></span>
            </div>

            <div className="gd-header-right">
              <div className="gd-status-pill">
                <div className="gd-status-dot" />
                <span className="gd-status-pill-text">Operational</span>
              </div>
              <button className="gd-logout-btn" onClick={handleLogout} aria-label="Sign out">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                <span className="gd-logout-text">Sign out</span>
              </button>
            </div>
          </div>
        </header>

        {/* ── MAIN ── */}
        <main className="gd-main">
          {error && <div className="gd-alert-wrap"><Alert type="error" message={error} onClose={() => setError(null)} /></div>}

          {/* Hero */}
          <div className="gd-hero">
            <div className="gd-hero-label"><span />Command Center</div>
            <h1 className="gd-hero-title">Your task <em>universe.</em></h1>
            <p className="gd-hero-sub">
              {stats.total === 0 ? "Blank slate. Everything begins here." : `${stats.pending} in orbit · ${stats.completed} missions complete`}
            </p>
          </div>

          {/* Stats — scrollable on xs */}
          <div className="gd-stats" ref={statsRef}>
            {statCards.map(({ label, value, c, icon, trend, trendCls, pct }) => (
              <div key={label} className="gd-stat" data-c={c}>
                <div className="gd-stat-head">
                  <div className="gd-stat-icon" data-c={c}>{icon}</div>
                  <span className={`gd-stat-trend ${trendCls}`}>{trend}</span>
                </div>
                <div className="gd-stat-value" data-c={c}>{value}</div>
                <div className="gd-stat-label">{label}</div>
                <div className="gd-stat-bar"><div className="gd-stat-fill" data-c={c} style={{ width: `${pct}%` }} /></div>
              </div>
            ))}
          </div>

          {/* Scroll hint dots (xs only) */}
          <div className="gd-scroll-hint">
            {statCards.map((_, i) => <div key={i} className={`gd-scroll-dot${i === 0 ? " active" : ""}`} />)}
          </div>

          {/* Body grid */}
          <div className="gd-body">
            {/* Left / main column */}
            <div style={{ display: mobileTab === "tasks" ? "block" : "none" }} className="gd-main-col">
              {/* Controls */}
              <div className="gd-controls">
                <div className="gd-controls-row">
                  <input type="text" placeholder="🔍  Search tasks…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="gd-input" />
                  <select value={filter} onChange={e => setFilter(e.target.value)} className="gd-input">
                    <option value="all">All Tasks</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="gd-input">
                    <option value="recent">Most Recent</option>
                    <option value="oldest">Oldest First</option>
                    <option value="priority">By Priority</option>
                    <option value="dueDate">Due Date</option>
                  </select>
                </div>
                <div className="gd-controls-actions">
                  {formActive ? (
                    <button className="gd-cta-cancel" onClick={() => { setEditingTask(null); setShowForm(false); }}>
                      ✕ &nbsp;{editingTask ? "Cancel Edit" : "Close"}
                    </button>
                  ) : (
                    <button className="gd-cta" onClick={() => setShowForm(true)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      New Task
                    </button>
                  )}
                </div>
              </div>

              {/* Task form */}
              {formActive && (
                <div className="gd-form-wrap">
                  <TaskForm
                    task={editingTask || undefined}
                    onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                    onCancel={() => { setShowForm(false); setEditingTask(null); }}
                    loading={loading}
                  />
                </div>
              )}

              {/* Task list / states */}
              {loading && !safe.length ? (
                <div className="gd-loader"><div className="gd-spinner" /><p>Pulling tasks from the void…</p></div>
              ) : safe.length === 0 ? (
                <div className="gd-empty">
                  <span className="gd-empty-icon">🌌</span>
                  <h2>Empty universe</h2>
                  <p>No tasks yet. Create your first mission.</p>
                  <button className="gd-cta" onClick={() => setShowForm(true)}>+ Create Task</button>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="gd-empty">
                  <span className="gd-empty-icon">🔭</span>
                  <h2>Nothing found</h2>
                  <p>No tasks match your current filters.</p>
                </div>
              ) : (
                <>
                  <p className="gd-section-label">{filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}</p>
                  <TaskList tasks={filteredTasks} onToggle={handleToggleTask} onEdit={setEditingTask} onDelete={handleDeleteTask} />
                </>
              )}
            </div>

            {/* Right sidebar — desktop always shown, tablet: grid, mobile: tab-driven */}
            <div className={`gd-sidebar${mobileTab === "stats" ? " mobile-visible" : ""}`}>
              <SidebarContent tasks={safe} completionPct={completionPct} stats={stats} />
            </div>
          </div>
        </main>

        {/* ── FAB (mobile new task) ── */}
        <button
          className={`gd-fab${formActive ? " cancel-mode" : ""}`}
          onClick={() => {
            if (formActive) { setShowForm(false); setEditingTask(null); }
            else { setMobileTab("tasks"); setShowForm(true); }
          }}
          aria-label={formActive ? "Cancel" : "New task"}
        >
          {formActive ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          )}
        </button>

        {/* ── BOTTOM NAV (mobile) ── */}
        <nav className="gd-bottom-nav" role="navigation" aria-label="Mobile navigation">
          <button className={`gd-nav-tab${mobileTab === "tasks" ? " active" : ""}`} onClick={() => setMobileTab("tasks")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            Tasks
          </button>
          <button className={`gd-nav-tab${mobileTab === "stats" ? " active" : ""}`} onClick={() => setMobileTab("stats")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6"  y1="20" x2="6"  y2="14"/>
            </svg>
            Stats
          </button>
        </nav>
      </div>
    </div>
  );
}