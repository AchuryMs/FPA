import React from 'react';
import './DashboardCards.css';

export default function AllocationTableCard({ title, data = [], accentColor = '#0f5c4c' }) {
  const defaultData = [
    { name: 'Stocks & ETFs', percentage: '43', amount: 67500 },
    { name: 'Bonds', percentage: '22', amount: 37500 },
    { name: 'Commodities', percentage: '10', amount: 15000 },
    { name: 'Cash & Others', percentage: '3', amount: 7500 }
  ];

  const displayData = data.length > 0 ? data : defaultData;

  return (
    <div className="dashboard-card allocation-card" style={{ '--accent-color': accentColor }}>
      <div className="card-header">
        <h3 className="card-title">{title || 'Asset Allocation'}</h3>
        <button className="icon-btn-small">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 8L7 11L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="allocation-list">
        {displayData.map((item, idx) => (
          <div key={idx} className="allocation-item">
            <div className="allocation-info">
              <span className="allocation-name">{item.name}</span>
              <span className="allocation-label">Amount</span>
            </div>
            <div className="allocation-values">
              <span className="allocation-percentage" style={{ color: accentColor }}>
                {item.percentage}%
              </span>
              <span className="allocation-amount">${item.amount.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}