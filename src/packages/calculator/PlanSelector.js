import React from 'react';
import './PlanSelector.css';

const PlanSelector = ({ plans, selectedPlan, onPlanChange }) => {
  if (plans.length <= 1) {
    return null; // Don't show selector if there's only one plan
  }

  return (
    <div className="plan-selector-container">
      <h3 className="plan-selector-title">Choose Your Plan</h3>
      <div className="plan-cards">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`plan-card ${selectedPlan.id === plan.id ? 'selected' : ''}`}
            onClick={() => onPlanChange(plan)}
          >
            <div className="plan-card-header">
              <h4 className="plan-card-title">{plan.label}</h4>
              <div className="plan-card-price">
                {plan.unit_price} {plan.currency || 'USD'} per {plan.unit}
              </div>
            </div>
            <p className="plan-card-description">{plan.description}</p>
            <div className="plan-card-features">
              {plan.features.slice(0, 3).map((feature, index) => (
                <span key={index} className="plan-card-feature">
                  {feature}
                </span>
              ))}
              {plan.features.length > 3 && (
                <span className="plan-card-feature-more">
                  +{plan.features.length - 3} more
                </span>
              )}
            </div>
            <div className="plan-card-selection">
              {selectedPlan.id === plan.id && (
                <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanSelector; 