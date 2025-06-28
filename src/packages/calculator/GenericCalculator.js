import React, { useState, useEffect } from 'react';
import './GenericCalculator.css';
import { 
  calculateEntityPrice, 
  calculateTotalPrice, 
  getAvailableAddons, 
  validatePricingData,
  getSliderRange,
  formatCurrency
} from './utils/calculator';
import Slider from './Slider';
import FeatureList from './FeatureList';
import PlanSelector from './PlanSelector';

const GenericCalculator = ({ pricingData, onError }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planUnits, setPlanUnits] = useState({});
  const [addonUnits, setAddonUnits] = useState({});
  const [error, setError] = useState(null);

  // Validate and initialize pricing data
  useEffect(() => {
    try {
      validatePricingData(pricingData);
      setSelectedPlan(pricingData.plans[0]);
      setError(null);
    } catch (err) {
      setError(err.message);
      if (onError) onError(err.message);
    }
  }, [pricingData, onError]);

  // Initialize units when plan changes
  useEffect(() => {
    if (!selectedPlan) return;

    // Initialize plan units - start with 1 unit for all plans
    const initialPlanUnits = {};
    pricingData.plans.forEach(plan => {
      initialPlanUnits[plan.id] = 1; // Always start with 1 unit
    });
    setPlanUnits(initialPlanUnits);

    // Initialize addon units - start with 0 for addons
    const initialAddonUnits = {};
    pricingData.addons.forEach(addon => {
      if (selectedPlan.available_addons && selectedPlan.available_addons.includes(addon.id)) {
        initialAddonUnits[addon.id] = 0;
      }
    });
    setAddonUnits(initialAddonUnits);
  }, [selectedPlan, pricingData]);

  if (error) {
    return (
      <div className="calculator-error">
        <h3>Configuration Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!selectedPlan) {
    return <div className="calculator-loading">Loading calculator...</div>;
  }

  // Get available addons for selected plan
  const availableAddons = getAvailableAddons(selectedPlan, pricingData.addons);

  // Calculate prices
  const planPrice = calculateEntityPrice(selectedPlan, planUnits[selectedPlan.id] || 0);
  const addonPrices = {};
  let totalAddonPrice = 0;

  availableAddons.forEach(addon => {
    if (addonUnits[addon.id] && addonUnits[addon.id] > 0) {
      addonPrices[addon.id] = calculateEntityPrice(addon, addonUnits[addon.id]);
      totalAddonPrice += addonPrices[addon.id];
    }
  });

  const totalPrice = planPrice + totalAddonPrice;

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
  };

  const handlePlanUnitChange = (planId, value) => {
    setPlanUnits(prev => ({
      ...prev,
      [planId]: value
    }));
  };

  const handleAddonUnitChange = (addonId, value) => {
    setAddonUnits(prev => ({
      ...prev,
      [addonId]: value
    }));
  };

  return (
    <div className="generic-calculator">
      <div className="calculator-container">
        <header className="calculator-header">
          <div className="header-content">
            <h1 className="calculator-title">
              <span className="vendor-name">{pricingData.vendor}</span>
              <span className="title-separator">•</span>
              <span className="title-subtitle">Pricing Calculator</span>
            </h1>
            <p className="calculator-description">
              Calculate your costs with our dynamic pricing calculator
            </p>
            {pricingData.url && (
              <a href={pricingData.url} target="_blank" rel="noopener noreferrer" className="vendor-link">
                Visit {pricingData.vendor} Pricing
              </a>
            )}
          </div>
        </header>

        <main className="calculator-main">
          {/* Plan Selector */}
          <PlanSelector
            plans={pricingData.plans}
            selectedPlan={selectedPlan}
            onPlanChange={handlePlanChange}
          />

          <div className="calculator-grid">
            {/* Left Column - Calculator Controls */}
            <div className="calculator-controls">
              <div className="plan-section">
                <h2 className="section-title">Plan Configuration</h2>
                
                <div className="plan-info">
                  <h3 className="plan-name">{selectedPlan.label}</h3>
                  <p className="plan-description">{selectedPlan.description}</p>
                </div>

                {pricingData.plans.map(plan => (
                  <Slider
                    key={plan.id}
                    label={`${plan.label} ${plan.unit}s`}
                    value={planUnits[plan.id] || 0}
                    onChange={(value) => handlePlanUnitChange(plan.id, value)}
                    {...getSliderRange(plan)}
                    unit={plan.unit}
                    price={plan.id === selectedPlan.id ? planPrice : 0}
                    description={`${formatCurrency(parseFloat(plan.unit_price), pricingData.currency)} per ${plan.unit}`}
                    disabled={plan.id !== selectedPlan.id}
                    entity={plan}
                  />
                ))}
              </div>

              {availableAddons.length > 0 && (
                <div className="addons-section">
                  <h2 className="section-title">Add-ons</h2>
                  {availableAddons.map(addon => (
                    <Slider
                      key={addon.id}
                      label={addon.label}
                      value={addonUnits[addon.id] || 0}
                      onChange={(value) => handleAddonUnitChange(addon.id, value)}
                      {...getSliderRange(addon)}
                      unit={addon.unit}
                      price={addonPrices[addon.id] || 0}
                      description={addon.description}
                      entity={addon}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Results and Features */}
            <div className="calculator-results">
              <div className="pricing-summary">
                <h2 className="section-title">Pricing Summary</h2>
                
                <div className="price-breakdown">
                  <div className="price-item">
                    <span className="price-label">
                      {selectedPlan.label} ({planUnits[selectedPlan.id] || 0} {selectedPlan.unit}s)
                    </span>
                    <span className="price-value">
                      {formatCurrency(planPrice, pricingData.currency)}
                    </span>
                  </div>
                  
                  {availableAddons.map(addon => {
                    if (addonUnits[addon.id] && addonUnits[addon.id] > 0) {
                      return (
                        <div key={addon.id} className="price-item">
                          <span className="price-label">
                            {addon.label} ({addonUnits[addon.id]} {addon.unit}s)
                          </span>
                          <span className="price-value">
                            {formatCurrency(addonPrices[addon.id], pricingData.currency)}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })}
                  
                  <div className="price-total">
                    <span className="total-label">Total</span>
                    <span className="total-value">
                      {formatCurrency(totalPrice, pricingData.currency)}
                    </span>
                  </div>
                </div>

                <div className="cta-section">
                  <button className="cta-button">
                    Get Started
                  </button>
                  <p className="cta-note">No credit card required • Cancel anytime</p>
                </div>
              </div>

              <FeatureList 
                features={selectedPlan.features} 
                title={`${selectedPlan.label} Features`}
              />

              {availableAddons.map(addon => (
                <FeatureList 
                  key={addon.id}
                  features={addon.features} 
                  title={`${addon.label} Features`}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GenericCalculator; 