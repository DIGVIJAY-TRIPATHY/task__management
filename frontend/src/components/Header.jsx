import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { useAuthStore } from '../store/index';

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Task Manager</h1>
            {user && <p className="text-purple-200 mt-1">Welcome, {user.name}! 👋</p>}
          </div>
          {user && (
            <Button variant="secondary" onClick={handleLogout} size="md">
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
