import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HeaderDash.css';

export default function Header({ user, onLogout }) {
  const navigate = useNavigate();
  
  const userName = user?.email?.split('@')[0] || 'User';
  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('authToken');
      navigate('/login');
    }
  };

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">Welcome, {userName}!</h1>
          <p className="header-subtitle">Effortlessly manage your finances with real-time insights</p>
        </div>

        <div className="header-right">
          <button className="icon-btn" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2"/>
              <path d="M14 14L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <button className="icon-btn" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2C7.5 2 5.5 4 5.5 6.5V10L3 13H17L14.5 10V6.5C14.5 4 12.5 2 10 2Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 13V14C8 15.1 8.9 16 10 16C11.1 16 12 15.1 12 14V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="notification-badge">3</span>
          </button>

          <button className="icon-btn" aria-label="Settings">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M10 1V3M10 17V19M19 10H17M3 10H1M16.5 3.5L15 5M5 15L3.5 16.5M16.5 16.5L15 15M5 5L3.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <div className="user-menu">
            <button className="user-avatar-btn" onClick={handleLogout} title="Logout">
              <img 
                src={`https://ui-avatars.com/api/?name=${userInitial}&background=0f5c4c&color=fff&size=40`}
                alt="User avatar" 
                className="user-avatar"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}