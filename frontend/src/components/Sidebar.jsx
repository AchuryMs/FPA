import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/menu' },
    { id: 'analytics', label: 'Analytics', icon: '📈', path: '/analytics' },
    { id: 'transactions', label: 'Transactions', icon: '💳', path: '/transactions' },
    { id: 'investments', label: 'Investments', icon: '💼', path: '/portfolio' },
    { id: 'buy', label: 'Buy Stocks', icon: '🛒', path: '/buy' },
    { id: 'sell', label: 'Sell Stocks', icon: '💰', path: '/sell' },
  ];

  const otherItems = [
    { id: 'security', label: 'Security', icon: '🔒', path: '/security' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
    { id: 'support', label: 'Support', icon: '💬', path: '/support' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🏦</span>
          <span className="logo-text">Bankio</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-title">MAIN MENU</h3>
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="nav-section">
          <h3 className="nav-title">OTHERS</h3>
          {otherItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
}