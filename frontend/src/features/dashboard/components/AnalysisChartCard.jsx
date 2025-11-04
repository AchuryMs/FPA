import React from 'react';
import './DashboardCards.css';

export default function AnalysisChartCard({ data = [] }) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  
  const chartData = data.length > 0 ? data : months.map((m, i) => ({
    month: m,
    value1: 50 + Math.random() * 50,
    value2: 30 + Math.random() * 60,
    value3: 20 + Math.random() * 40
  }));

  const allValues = chartData.flatMap(d => [d.value1 || 0, d.value2 || 0, d.value3 || 0]).filter(v => v > 0);
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 100;
  const minValue = allValues.length > 0 ? Math.min(...allValues) : 0;
  const valueRange = maxValue - minValue || 1;
  
  const chartHeight = 2400;
  const chartWidth = 800;
  const padding = 20;

  const getPath = (values) => {
    const points = values.map((val, i) => {
      const x = (i / (values.length - 1)) * chartWidth;
      const y = chartHeight - (val / maxValue) * chartHeight;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="dashboard-card chart-card">
      <div className="card-header">
        <h3 className="card-title">Analysis Investment Performance</h3>
      </div>

      <div className="chart-container">
        <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.1"/>
              <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
            </linearGradient>
          </defs>

          {/* Línea 3 (fondo) */}
          <path
            d={`${getPath(chartData.map(d => d.value3))} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`}
            fill="url(#grad3)"
          />
          <path
            d={getPath(chartData.map(d => d.value3))}
            fill="none"
            stroke="#d1d5db"
            strokeWidth="2"
          />

          {/* Línea 2 (intermedia) */}
          <path
            d={`${getPath(chartData.map(d => d.value2))} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`}
            fill="url(#grad2)"
          />
          <path
            d={getPath(chartData.map(d => d.value2))}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
          />

          {/* Línea 1 (principal) */}
          <path
            d={`${getPath(chartData.map(d => d.value1))} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`}
            fill="url(#grad1)"
          />
          <path
            d={getPath(chartData.map(d => d.value1))}
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
          />

          {/* Puntos y badges */}
          {chartData.map((d, i) => {
            const x = (i / (chartData.length - 1)) * chartWidth;
            const y1 = chartHeight - (d.value1 / maxValue) * chartHeight;
            return (
              <g key={i}>
                <circle cx={x} cy={y1} r="4" fill="#10b981"/>
                {d.value1 > 70 && (
                  <g>
                    <rect x={x - 30} y={y1 - 35} width="60" height="25" rx="4" fill="#10b981"/>
                    <text x={x} y={y1 - 18} textAnchor="middle" fontSize="11" fontWeight="600" fill="#fff">
                      +{d.value1.toFixed(1)}%
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        <div className="chart-labels">
          {months.map((month, i) => (
            <span key={i} className="chart-label">{month}</span>
          ))}
        </div>
      </div>
    </div>
  );
}