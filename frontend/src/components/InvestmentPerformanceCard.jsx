import React from 'react';
import './DashboardCards.css';

export default function InvestmentPerformanceCard({ totalValue = 8750, percentage = 12.5, assets = [] }) {
  const defaultAssets = [
    { name: 'Salam', color: '#1f2937', percentage: 40 },
    { name: 'Obligasi', color: '#6b7280', percentage: 25 },
    { name: 'Reksadana', color: '#9ca3af', percentage: 15 }
  ];

  const displayAssets = assets.length > 0 ? assets : defaultAssets;

  return (
    <div className="dashboard-card performance-card">
      <div className="card-header">
        <h3 className="card-title">Investment Performance</h3>
        <button className="icon-btn-small">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 4V8L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </button>
      </div>

      <div className="performance-content">
        <div className="performance-gauge">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#0f5c4c"
              strokeWidth="12"
              strokeDasharray={`${(percentage / 100) * 314} 314`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
            <text x="60" y="55" textAnchor="middle" fontSize="20" fontWeight="600" fill="#1f2937">
              +{percentage}%
            </text>
            <text x="60" y="72" textAnchor="middle" fontSize="12" fill="#6b7280">
              Growth
            </text>
          </svg>
        </div>

        <div className="performance-details">
          <div className="performance-total">
            <span className="label">Total Value</span>
            <span className="value">${totalValue.toLocaleString()}</span>
          </div>

          <div className="asset-list">
            {displayAssets.map((asset, idx) => (
              <div key={idx} className="asset-item">
                <div className="asset-info">
                  <span className="asset-dot" style={{ background: asset.color }}></span>
                  <span className="asset-name">{asset.name}</span>
                </div>
                <span className="asset-percentage">{asset.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}