import React from 'react';
import './Navigation.css';

const Navigation = ({ currentScreen, onScreenChange }) => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="nav-icon">🚀</span>
          <span className="nav-title">Dynamic UI Builder</span>
        </div>
        
        <div className="nav-tabs">
          <button
            className={`nav-tab ${currentScreen === 'calculator' ? 'active' : ''}`}
            onClick={() => onScreenChange('calculator')}
          >
            <span className="tab-icon">🧮</span>
            Calculator
          </button>
          
          <button
            className={`nav-tab ${currentScreen === 'layout-editor' ? 'active' : ''}`}
            onClick={() => onScreenChange('layout-editor')}
          >
            <span className="tab-icon">🎨</span>
            Layout Editor
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 