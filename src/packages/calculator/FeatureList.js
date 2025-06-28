import React from 'react';
import './FeatureList.css';

const FeatureList = ({ features, title = "Features" }) => {
  return (
    <div className="feature-list-container">
      <h3 className="feature-list-title">{title}</h3>
      <ul className="feature-list">
        {features.map((feature, index) => (
          <li key={index} className="feature-item">
            <svg className="feature-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeatureList; 