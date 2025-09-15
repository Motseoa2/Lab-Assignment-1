// src/components/StatCard.js
import React from 'react';

function StatCard({ icon, number, label, warning }) {
  return (
    <div className={`card stat-card ${warning ? 'warning' : ''}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <h3>{number}</h3>
        <p>{label}</p>
      </div>
    </div>
  );
}

export default StatCard;
