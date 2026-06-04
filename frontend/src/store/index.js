import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  login: (user, token) => set({ user, token, error: null }),
  logout: () => set({ user: null, token: null, error: null }),

  loadFromStorage: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user && user !== 'undefined') {
      try {
        set({
          token,
          user: JSON.parse(user),
        });
        return true;
      } catch (error) {
        console.error('Failed to parse user data:', error);
        return false;
      }
    }
    return false;
  },

  saveToStorage: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  clearStorage: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
}));

export const useTaskStore = create((set) => ({
  tasks: [],
  loading: false,
  error: null,
  filter: 'all',
  searchTerm: '',

  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (id, updated) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === id ? { ...t, ...updated } : t)),
    })),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t._id !== id),
    })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  setFilter: (filter) => set({ filter }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),

  getFilteredTasks: () => {
    const state = useTaskStore.getState();
    let filtered = state.tasks;

    if (state.filter !== 'all') {
      filtered = filtered.filter((t) => t.status === state.filter);
    }

    if (state.searchTerm) {
      const term = state.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(term) ||
          (t.description && t.description.toLowerCase().includes(term))
      );
    }

    return filtered;
  },
}));
