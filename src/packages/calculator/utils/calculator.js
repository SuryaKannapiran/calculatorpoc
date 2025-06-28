// Function to evaluate pricing formulas safely
export const evaluateFormula = (formula, variables, includedQuotas = {}) => {
  try {
    const scope = {
      ...variables,
      included_quotas: {},
      max: Math.max,
      min: Math.min,
      Math: Math // for other Math functions
    };

    // Populate included_quotas in the scope
    Object.keys(includedQuotas).forEach(quotaKey => {
      scope.included_quotas[quotaKey] = {
        value: parseInt(includedQuotas[quotaKey].value, 10)
      };
    });

    const varNames = Object.keys(scope);
    const varValues = Object.values(scope);

    const func = new Function(...varNames, `return ${formula};`);
    return func(...varValues);
  } catch (error) {
    console.error('Error evaluating formula:', {
      formula,
      variables,
      includedQuotas,
      error
    });
    return 0;
  }
};

// Calculate price for any pricing entity (plan or addon)
export const calculateEntityPrice = (entity, units) => {
  // If no units are selected, the price is 0.
  if (units === 0) {
    return 0;
  }

  const variables = {
    unit: units,
    unit_price: parseFloat(entity.unit_price)
  };
  
  // The formula might use a specific name for the unit, like 'seat' or 'resolution'
  variables[entity.unit] = units;
  
  return evaluateFormula(entity.formula, variables, entity.included_quotas);
};

// Calculate total price including all selected addons
export const calculateTotalPrice = (selectedPlan, addons, planUnits, addonUnits) => {
  let total = calculateEntityPrice(selectedPlan, planUnits[selectedPlan.id] || 0);
  
  addons.forEach(addon => {
    if (addonUnits[addon.id] && addonUnits[addon.id] > 0) {
      total += calculateEntityPrice(addon, addonUnits[addon.id]);
    }
  });
  
  return total;
};

// Get available addons for a specific plan
export const getAvailableAddons = (plan, allAddons) => {
  return allAddons.filter(addon => 
    plan.available_addons && plan.available_addons.includes(addon.id)
  );
};

// Validate pricing data against schema
export const validatePricingData = (data) => {
  const requiredFields = ['vendor', 'url', 'currency', 'plans', 'addons'];
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
  
  if (!Array.isArray(data.plans) || data.plans.length === 0) {
    throw new Error('At least one plan is required');
  }
  
  // Validate each plan
  data.plans.forEach((plan, index) => {
    const planRequiredFields = ['id', 'label', 'description', 'unit', 'unit_price', 'pricing_model', 'features', 'formula'];
    const missingPlanFields = planRequiredFields.filter(field => !plan[field]);
    
    if (missingPlanFields.length > 0) {
      throw new Error(`Plan ${index + 1} missing required fields: ${missingPlanFields.join(', ')}`);
    }
  });
  
  // Validate each addon
  data.addons.forEach((addon, index) => {
    const addonRequiredFields = ['id', 'label', 'description', 'unit', 'unit_price', 'pricing_model', 'features', 'formula'];
    const missingAddonFields = addonRequiredFields.filter(field => !addon[field]);
    
    if (missingAddonFields.length > 0) {
      throw new Error(`Addon ${index + 1} missing required fields: ${missingAddonFields.join(', ')}`);
    }
  });
  
  return true;
};

// Get default slider ranges based on pricing model and included quotas
export const getSliderRange = (entity) => {
  const baseRange = { min: 0, max: 100, step: 1 };
  
  // Adjust range based on included quotas
  if (entity.included_quotas) {
    const quotaKey = Object.keys(entity.included_quotas)[0];
    if (quotaKey && entity.included_quotas[quotaKey]) {
      const quotaValue = parseInt(entity.included_quotas[quotaKey].value) || 0;
      baseRange.max = Math.max(100, quotaValue + 50); // Extend range
    }
  }
  
  switch (entity.pricing_model) {
    case 'per_unit':
      return baseRange;
    case 'flat':
      return { min: 0, max: 1, step: 1 };
    case 'tiered':
      return { min: 1, max: 10, step: 1 };
    default:
      return baseRange;
  }
};

// Format currency based on the provided currency code
export const formatCurrency = (amount, currency = 'USD') => {
  const currencySymbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CAD': 'C$',
    'AUD': 'A$'
  };
  
  const symbol = currencySymbols[currency] || currency;
  return `${symbol}${amount.toFixed(2)}`;
};

// Get included quota information for display
export const getIncludedQuotaInfo = (entity) => {
  if (!entity.included_quotas) return null;
  
  const quotaKey = Object.keys(entity.included_quotas)[0];
  if (quotaKey && entity.included_quotas[quotaKey]) {
    const quota = entity.included_quotas[quotaKey];
    return {
      value: parseInt(quota.value) || 0,
      unit: quota.unit || entity.unit
    };
  }
  
  return null;
};

// Check if current value is at the included quota level
export const isAtIncludedQuota = (entity, currentValue) => {
  const quotaInfo = getIncludedQuotaInfo(entity);
  if (!quotaInfo) return false;
  
  return currentValue <= quotaInfo.value;
}; 