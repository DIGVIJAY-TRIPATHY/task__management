import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Alert from "../components/Alert";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { taskService } from "../services/api";
import { useAuthStore, useTaskStore } from "../store/index";

/* ─────────────────────────────────────────
   Injected styles — drop-in, zero config
───────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --dash-bg: #080b14;
    --dash-surface: rgba(255,255,255,0.035);
    --dash-surface-hover: rgba(255,255,255,0.06);
    --dash-border: rgba(255,255,255,0.08);
    --dash-border-bright: rgba(255,255,255,0.18);
    --dash-accent: #a78bfa;
    --dash-accent-glow: rgba(167,139,250,0.25);
    --dash-text: #f0edff;
    --dash-muted: rgba(240,237,255,0.45);
    --dash-faint: rgba(240,237,255,0.2);
    --dash-green: #34d399;
    --dash-yellow: #fbbf24;
    --dash-red: #f87171;
    --dash-blue: #60a5fa;
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --radius-sm: 8px;
    --radius-md: 14px;
    --radius-lg: 20px;
    --radius-xl: 28px;
    --transition: 0.2s cubic-bezier(0.4,0,0.2,1);
  }

  .dash-root {
    min-height: 100vh;
    background: var(--dash-bg);
    background-image:
      radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,58,237,0.18) 0%, transparent 70%),
      radial-gradient(ellipse 50% 40% at 90% 80%, rgba(59,130,246,0.08) 0%, transparent 60%);
    font-family: var(--font-body);
    color: var(--dash-text);
  }

  /* ── Header ── */
  .dash-header {
    position: sticky;
    top: 0;
    z-index: 50;
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    background: rgba(8,11,20,0.75);
    border-bottom: 1px solid var(--dash-border);
  }
  .dash-header-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 2rem;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
  }
  .dash-logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .dash-logo-mark {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: linear-gradient(135deg, #7c3aed, #a78bfa);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 16px;
    color: #fff;
    letter-spacing: -0.5px;
  }
  .dash-logo-text {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 18px;
    letter-spacing: -0.3px;
    color: var(--dash-text);
  }
  .dash-greeting {
    font-size: 13px;
    color: var(--dash-muted);
  }
  .dash-greeting strong {
    color: var(--dash-text);
    font-weight: 500;
  }
  .dash-logout-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--dash-border-bright);
    background: var(--dash-surface);
    color: var(--dash-muted);
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition);
    letter-spacing: 0.01em;
  }
  .dash-logout-btn:hover {
    background: var(--dash-surface-hover);
    color: var(--dash-text);
    border-color: var(--dash-border-bright);
  }

  /* ── Main ── */
  .dash-main {
    max-width: 1280px;
    margin: 0 auto;
    padding: 3rem 2rem 4rem;
  }

  /* ── Stats ── */
  .dash-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    margin-bottom: 2.5rem;
  }
  .dash-stat-card {
    position: relative;
    overflow: hidden;
    padding: 1.5rem 1.75rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--dash-border);
    background: var(--dash-surface);
    backdrop-filter: blur(12px);
    transition: transform var(--transition), border-color var(--transition);
  }
  .dash-stat-card:hover {
    transform: translateY(-2px);
    border-color: var(--dash-border-bright);
  }
  .dash-stat-card::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity var(--transition);
    border-radius: inherit;
  }
  .dash-stat-card:hover::before { opacity: 1; }
  .dash-stat-card[data-color="purple"]::before { background: radial-gradient(ellipse at 80% 20%, rgba(167,139,250,0.1), transparent 70%); }
  .dash-stat-card[data-color="green"]::before  { background: radial-gradient(ellipse at 80% 20%, rgba(52,211,153,0.1), transparent 70%); }
  .dash-stat-card[data-color="yellow"]::before { background: radial-gradient(ellipse at 80% 20%, rgba(251,191,36,0.1), transparent 70%); }
  .dash-stat-card[data-color="red"]::before    { background: radial-gradient(ellipse at 80% 20%, rgba(248,113,113,0.1), transparent 70%); }

  .dash-stat-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  .dash-stat-icon {
    width: 38px;
    height: 38px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }
  .dash-stat-icon[data-color="purple"] { background: rgba(167,139,250,0.12); color: var(--dash-accent); }
  .dash-stat-icon[data-color="green"]  { background: rgba(52,211,153,0.12); color: var(--dash-green); }
  .dash-stat-icon[data-color="yellow"] { background: rgba(251,191,36,0.12); color: var(--dash-yellow); }
  .dash-stat-icon[data-color="red"]    { background: rgba(248,113,113,0.12); color: var(--dash-red); }

  .dash-stat-value {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 42px;
    line-height: 1;
    letter-spacing: -1.5px;
    margin-bottom: 4px;
  }
  .dash-stat-value[data-color="purple"] { color: var(--dash-accent); }
  .dash-stat-value[data-color="green"]  { color: var(--dash-green); }
  .dash-stat-value[data-color="yellow"] { color: var(--dash-yellow); }
  .dash-stat-value[data-color="red"]    { color: var(--dash-red); }

  .dash-stat-label {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--dash-muted);
  }

  /* ── Progress bar ── */
  .dash-progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--dash-border);
  }
  .dash-progress-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
  }
  .dash-progress-fill[data-color="purple"] { background: var(--dash-accent); }
  .dash-progress-fill[data-color="green"]  { background: var(--dash-green); }
  .dash-progress-fill[data-color="yellow"] { background: var(--dash-yellow); }
  .dash-progress-fill[data-color="red"]    { background: var(--dash-red); }

  /* ── Controls panel ── */
  .dash-controls {
    padding: 1.5rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--dash-border);
    background: var(--dash-surface);
    backdrop-filter: blur(12px);
    margin-bottom: 2rem;
  }
  .dash-controls-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
    margin-bottom: 14px;
  }
  @media (max-width: 768px) {
    .dash-controls-row { grid-template-columns: 1fr; }
    .dash-stats { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 480px) {
    .dash-stats { grid-template-columns: 1fr; }
    .dash-header-inner { padding: 0 1rem; }
    .dash-main { padding: 1.5rem 1rem 3rem; }
  }

  .dash-input {
    width: 100%;
    padding: 10px 14px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--dash-border);
    background: rgba(255,255,255,0.04);
    color: var(--dash-text);
    font-family: var(--font-body);
    font-size: 14px;
    outline: none;
    transition: border-color var(--transition), background var(--transition);
    box-sizing: border-box;
  }
  .dash-input::placeholder { color: var(--dash-faint); }
  .dash-input:focus {
    border-color: var(--dash-accent);
    background: rgba(167,139,250,0.06);
  }
  .dash-input option {
    background: #151828;
    color: var(--dash-text);
  }

  /* ── New Task CTA button ── */
  .dash-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 22px;
    border-radius: var(--radius-sm);
    border: none;
    background: linear-gradient(135deg, #7c3aed, #a78bfa);
    color: #fff;
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 0.01em;
    cursor: pointer;
    transition: all var(--transition);
    box-shadow: 0 4px 24px rgba(124,58,237,0.35);
  }
  .dash-cta-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 32px rgba(124,58,237,0.5);
  }
  .dash-cta-btn:active { transform: translateY(0); }
  .dash-cta-btn.cancel {
    background: var(--dash-surface-hover);
    box-shadow: none;
    border: 1px solid var(--dash-border-bright);
    color: var(--dash-muted);
  }
  .dash-cta-btn.cancel:hover {
    color: var(--dash-text);
    box-shadow: none;
    transform: none;
  }

  /* ── Task form wrapper ── */
  .dash-form-wrapper {
    margin-bottom: 2rem;
    padding: 1.75rem;
    border-radius: var(--radius-lg);
    border: 1px solid rgba(167,139,250,0.3);
    background: rgba(124,58,237,0.06);
    backdrop-filter: blur(12px);
  }

  /* ── Empty states ── */
  .dash-empty {
    text-align: center;
    padding: 5rem 2rem;
    border-radius: var(--radius-xl);
    border: 1px dashed var(--dash-border-bright);
    background: var(--dash-surface);
  }
  .dash-empty-icon {
    font-size: 56px;
    display: block;
    margin-bottom: 1.25rem;
    filter: grayscale(0.3);
  }
  .dash-empty h2 {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 24px;
    margin: 0 0 0.5rem;
    color: var(--dash-text);
  }
  .dash-empty p {
    color: var(--dash-muted);
    font-size: 15px;
    margin: 0 0 1.75rem;
  }

  /* ── Loading spinner ── */
  .dash-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 5rem 0;
    gap: 1rem;
  }
  .dash-spinner {
    width: 36px;
    height: 36px;
    border: 2px solid var(--dash-border);
    border-top-color: var(--dash-accent);
    border-radius: 50%;
    animation: dash-spin 0.75s linear infinite;
  }
  @keyframes dash-spin {
    to { transform: rotate(360deg); }
  }
  .dash-loader p {
    font-size: 14px;
    color: var(--dash-muted);
  }

  /* ── Alert override ── */
  .dash-alert-wrap { margin-bottom: 1.5rem; }

  /* ── Section heading ── */
  .dash-section-label {
    font-family: var(--font-display);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--dash-muted);
    margin: 0 0 1rem;
  }
`;

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const {
    tasks,
    setTasks,
    loading,
    setLoading,
    error,
    setError,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    getFilteredTasks,
    addTask,
    updateTask,
    removeTask,
  } = useTaskStore();

  const [showForm, setShowForm] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState(null);
  const [sortBy, setSortBy] = React.useState("recent");

  React.useEffect(() => {
    const styleId = "dash-injected-styles";
    if (!document.getElementById(styleId)) {
      const tag = document.createElement("style");
      tag.id = styleId;
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  React.useEffect(() => {
    fetchTasks();
  }, [filter, searchTerm]);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filter !== "all") params.status = filter;
      if (searchTerm) params.search = searchTerm;
      const response = await taskService.getAllTasks(params);
      setTasks(response.data.data.tasks || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (formData) => {
    setLoading(true);
    try {
      const response = await taskService.createTask(formData);
      addTask(response.data.data);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (formData) => {
    setLoading(true);
    try {
      const response = await taskService.updateTask(editingTask._id, formData);
      updateTask(editingTask._id, response.data.data);
      setEditingTask(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.deleteTask(taskId);
        removeTask(taskId);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete task");
      }
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const response = await taskService.toggleTask(taskId);
      updateTask(taskId, { status: response.data.data.status });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to toggle task");
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getSortedTasks = () => {
    let sorted = [...getFilteredTasks()];
    if (sortBy === "recent") sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === "oldest") sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortBy === "priority") {
      const o = { high: 0, medium: 1, low: 2 };
      sorted.sort((a, b) => o[a.priority] - o[b.priority]);
    } else if (sortBy === "dueDate") {
      sorted.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    }
    return sorted;
  };

  const safeTasks = tasks || [];
  const stats = {
    total: safeTasks.length,
    completed: safeTasks.filter((t) => t.status === "completed").length,
    pending: safeTasks.filter((t) => t.status === "pending").length,
    highPriority: safeTasks.filter((t) => t.priority === "high").length,
  };
  const completionPct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const filteredTasks = getSortedTasks();

  const statCards = [
    { label: "Total Tasks",   value: stats.total,       color: "purple", icon: "📋" },
    { label: "Completed",     value: stats.completed,   color: "green",  icon: "✅", pct: completionPct },
    { label: "Pending",       value: stats.pending,     color: "yellow", icon: "⏳" },
    { label: "High Priority", value: stats.highPriority,color: "red",    icon: "🔥" },
  ];

  return (
    <div className="dash-root">
      {/* Header */}
      <header className="dash-header">
        <div className="dash-header-inner">
          <div className="dash-logo">
            <div className="dash-logo-mark">T</div>
            <span className="dash-logo-text">TaskOS</span>
          </div>

          <span className="dash-greeting">
            Welcome back, <strong>{user?.name ?? "User"}</strong>
          </span>

          <button className="dash-logout-btn" onClick={handleLogout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="dash-main">
        {error && (
          <div className="dash-alert-wrap">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        {/* Stats Grid */}
        <div className="dash-stats">
          {statCards.map(({ label, value, color, icon, pct }) => (
            <div key={label} className="dash-stat-card" data-color={color}>
              <div className="dash-stat-top">
                <div className="dash-stat-icon" data-color={color}>{icon}</div>
              </div>
              <div className="dash-stat-value" data-color={color}>{value}</div>
              <div className="dash-stat-label">{label}</div>
              <div className="dash-progress-bar">
                <div
                  className="dash-progress-fill"
                  data-color={color}
                  style={{ width: pct != null ? `${pct}%` : `${Math.min(value * 8, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="dash-controls">
          <div className="dash-controls-row">
            <input
              type="text"
              placeholder="Search tasks…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="dash-input"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="dash-input"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="dash-input"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">By Priority</option>
              <option value="dueDate">Due Date</option>
            </select>
          </div>

          <button
            className={`dash-cta-btn${editingTask || showForm ? " cancel" : ""}`}
            onClick={() => editingTask ? setEditingTask(null) : setShowForm(!showForm)}
          >
            {editingTask ? "✕  Cancel Edit" : showForm ? "✕  Close" : "+ New Task"}
          </button>
        </div>

        {/* Task Form */}
        {(showForm || editingTask) && (
          <div className="dash-form-wrapper">
            <TaskForm
              task={editingTask || undefined}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={() => { setShowForm(false); setEditingTask(null); }}
              loading={loading}
            />
          </div>
        )}

        {/* Task List / States */}
        {loading && !tasks.length ? (
          <div className="dash-loader">
            <div className="dash-spinner" />
            <p>Loading tasks…</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="dash-empty">
            <span className="dash-empty-icon">📋</span>
            <h2>No tasks yet</h2>
            <p>Create your first task to get started</p>
            <button className="dash-cta-btn" onClick={() => setShowForm(true)}>
              + Create Task
            </button>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="dash-empty">
            <span className="dash-empty-icon">🔍</span>
            <h2>No matches</h2>
            <p>No tasks match your current search or filter</p>
          </div>
        ) : (
          <>
            <p className="dash-section-label">{filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}</p>
            <TaskList
              tasks={filteredTasks}
              onToggle={handleToggleTask}
              onEdit={setEditingTask}
              onDelete={handleDeleteTask}
            />
          </>
        )}
      </main>
    </div>
  );
}