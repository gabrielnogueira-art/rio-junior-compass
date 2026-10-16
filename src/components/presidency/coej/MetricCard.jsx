// src/components/MetricCard.jsx
import React from 'react';

export default function MetricCard({
  label,
  value,
  subtext,
  icon: Icon,
  badgeText,
  badgeType = 'neutral', // 'positive', 'neutral', 'warning'
  theme = 'blue', // 'blue', 'gold', 'emerald', 'cyan'
  tooltip
}) {
  return (
    <div className={`glass-card metric-card ${theme}`} title={tooltip}>
      <div className="metric-header">
        <span className="metric-label">{label}</span>
        {Icon && (
          <div className="metric-icon-wrap">
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="metric-value-row">
        <span className="metric-number">{value}</span>
        {badgeText && (
          <span className={`metric-badge ${badgeType}`}>
            {badgeText}
          </span>
        )}
      </div>

      {subtext && <div className="metric-sub">{subtext}</div>}
    </div>
  );
}
