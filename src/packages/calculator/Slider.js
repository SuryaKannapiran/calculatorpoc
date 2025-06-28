import React from 'react';
import './Slider.css';
import { getIncludedQuotaInfo, isAtIncludedQuota } from './utils/calculator';

const Slider = ({ 
  label, 
  value, 
  onChange, 
  min = 1, 
  max = 100, 
  step = 1, 
  unit = '', 
  price = null,
  description = '',
  disabled = false,
  entity = null // Pass the full entity object for quota info
}) => {
  const includedQuota = entity ? getIncludedQuotaInfo(entity) : null;
  const isAtQuota = includedQuota ? isAtIncludedQuota(entity, value) : false;

  return (
    <div className={`slider-container ${disabled ? 'disabled' : ''}`}>
      <div className="slider-header">
        <div className="slider-label-section">
          <label className="slider-label">{label}</label>
          {description && <p className="slider-description">{description}</p>}
          {includedQuota && (
            <p className="included-quota-info">
              <span className="included-badge">Base</span>
              {includedQuota.value} {includedQuota.unit}{includedQuota.value > 1 ? 's' : ''} included in base price
            </p>
          )}
        </div>
        <div className="slider-value-section">
          <span className="slider-value">
            {value} {unit}
          </span>
          {price !== null && (
            <span className="slider-price">
              ${price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
      
      <div className="slider-input-container">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="slider-input"
          disabled={disabled}
        />
        <div className="slider-range-labels">
          <span>{min}</span>
          {includedQuota && (
            <span className="included-marker">
              {includedQuota.value} (base)
            </span>
          )}
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
};

export default Slider; 