import React from 'react';
import { Database, Copy, CheckCircle } from 'lucide-react';

const StatsDashboard = ({ stats }) => {
  return (
    <div className="stats-container">
      <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', paddingLeft: '0.5rem' }}>Processing Summary</h2>
      <div className="stats-grid">
        
        <div className="glass-panel stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
             <Database className="stat-icon" />
          </div>
          <div className="stat-info">
            <h3>Total Rows</h3>
            <p>{stats.total.toLocaleString()}</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #ec4899, #be185d)' }}>
             <Copy className="stat-icon" />
          </div>
          <div className="stat-info">
            <h3>Duplicates</h3>
            <p>{stats.duplicates.toLocaleString()}</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
             <CheckCircle className="stat-icon" />
          </div>
          <div className="stat-info">
            <h3>Unique</h3>
            <p>{stats.unique.toLocaleString()}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StatsDashboard;
