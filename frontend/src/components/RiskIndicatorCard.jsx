import React from 'react';
import './DashboardCards.css';

export default function RiskIndicatorCard({ risks = [] }) {
  const defaultRisks = [
    { name: 'Stock Volatility', value: 7.2, max: 10, color: '#ef4444' },
    { name: 'Bond Stability', value: 4.3, max: 10, color: '#10b981' },
    { name: 'Market Sensitivity', value: 5.5, max: 10, color: '#f59e0b' }
  ];

  const riskData = risks.length > 0 ? risks : defaultRisks;
  const overallScore = (riskData.reduce((sum, r) => sum + r.value, 0) / riskData.length).toFixed(1);

  return (
    <div className="dashboard-card risk-card">
      <div className="card-header">
        <h3 className="card-title">Risk Indicator</h3>
      </div>

      <div className="risk-content">
        <div className="risk-gauge-visual">
          <svg width="160" height="100" viewBox="0 0 160 100">
            {/* Arco de fondo */}
            <path
              d="M 20 80 Q 80 20, 140 80"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Arco de progreso */}
            <path
              d="M 20 80 Q 80 20, 140 80"
              fill="none"
              stroke="#ef4444"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(overallScore / 10) * 190} 190`}
            />
            {/* Centro del indicador */}
            <circle cx="80" cy="80" r="6" fill="#1f2937"/>
            {/* Aguja del indicador */}
            <line 
              x1="80" 
              y1="80" 
              x2={80 + Math.cos((Math.PI * (1 - overallScore / 10))) * 40} 
              y2={80 + Math.sin((Math.PI * (1 - overallScore / 10))) * 40}
              stroke="#1f2937" 
              strokeWidth="3" 
              strokeLinecap="round"
            />
          </svg>
          <div className="risk-score-badge">
            <span className="badge-label">Risk score:</span>
            <span className="badge-value">{overallScore}/10</span>
          </div>
        </div>

        <div className="risk-metrics">
          {riskData.map((risk, idx) => (
            <div key={idx} className="risk-metric">
              <span className="risk-name">{risk.name}</span>
              <span className="risk-value" style={{ color: risk.color }}>
                {risk.value}/{risk.max}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}