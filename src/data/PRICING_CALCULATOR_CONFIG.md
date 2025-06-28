# Pricing Calculator Configuration Guide

This guide explains how to configure the Pricing Calculator using TypeScript interfaces and JSON configurations.

## Overview

The Pricing Calculator uses two main configuration types:
1. **Layout Configuration** - Defines the UI structure and components
2. **Pricing Configuration** - Defines variables, calculations, and business logic

## Layout Configuration

### TypeScript Interface

```typescript

export type ContentType =
  | "card"
  | "section" 
  | "row"
  | "table"
  | "control-group"
  | "display-item";

export type ControlType =
  | "slider"
  | "input" 
  | "select"
  | "multi-select"
  | "segmented-buttons"
  | "display-value";

// Main Layout Configuration
export interface LayoutConfig {
  columns: Column[];
  theme?: {
    spacing?: "compact" | "normal" | "spacious";
    borderRadius?: "none" | "small" | "medium" | "large";
    colorScheme?: "light" | "dark" | "auto";
  };
  className?: string;
}

// Column Configuration
export interface Column {
  id: string;
  content: ContentItem[];
  width?: string; // CSS width value (deprecated)
  minWidth?: string; // Minimum width
  weight?: number; // Flex weight for proportional sizing (default: 1)
  className?: string;
}

// Content Components
export interface Card extends BaseContent {
  type: "card";
  content: ContentItem[];
  elevated?: boolean;
  collapsible?: boolean;
}

export interface Section extends BaseContent {
  type: "section";
  content: ContentItem[];
  divider?: boolean;
}

export interface Row extends BaseContent {
  type: "row";
  content: ContentItem[];
  align?: "start" | "center" | "end" | "space-between" | "space-around";
  wrap?: boolean;
}

// Control Types
export interface SliderControl extends BaseControl {
  type: "slider";
  min?: number;
  max?: number;
  step?: number;
  showInput?: boolean;
  showValue?: boolean;
}

export interface InputControl extends BaseControl {
  type: "input";
  inputType?: "number" | "text";
  placeholder?: string;
  prefix?: string;
  suffix?: string;
}

export interface SelectControl extends BaseControl {
  type: "select";
  placeholder?: string;
}

export interface DisplayValueControl extends BaseControl {
  type: "display-value";
  format?: "number" | "currency" | "percentage" | "text";
  precision?: number;
  prefix?: string;
  suffix?: string;
}
```

### Sample Layout Configuration JSON

```json
{
  "theme": {
    "spacing": "normal",
    "borderRadius": "medium",
    "colorScheme": "auto"
  },
  "columns": [
    {
      "id": "left-column",
      "weight": 2,
      "content": [
        {
          "id": "input-card",
          "type": "card",
          "title": "Configure Your Plan",
          "elevated": true,
          "content": [
            {
              "id": "users-section",
              "type": "section",
              "title": "Team Size",
              "content": [
                {
                  "id": "users-slider",
                  "type": "slider",
                  "variable": "users",
                  "label": "Number of Users",
                  "min": 1,
                  "max": 100,
                  "step": 1,
                  "showInput": true
                }
              ]
            },
            {
              "id": "storage-section",
              "type": "section",
              "title": "Storage Requirements",
              "content": [
                {
                  "id": "storage-select",
                  "type": "select",
                  "variable": "storage_tier",
                  "label": "Storage Tier",
                  "placeholder": "Select storage tier"
                }
              ]
            },
            {
              "id": "features-section",
              "type": "section",
              "title": "Additional Features",
              "content": [
                {
                  "id": "features-row",
                  "type": "row",
                  "align": "start",
                  "wrap": true,
                  "content": [
                    {
                      "id": "backup-input",
                      "type": "input",
                      "variable": "backup_frequency",
                      "label": "Backup Frequency (days)",
                      "inputType": "number",
                      "placeholder": "7"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "right-column",
      "weight": 1,
      "content": [
        {
          "id": "pricing-card",
          "type": "card",
          "title": "Your Plan",
          "elevated": true,
          "content": [
            {
              "id": "price-section",
              "type": "section",
              "content": [
                {
                  "id": "monthly-price",
                  "type": "display-value",
                  "variable": "monthly_total",
                  "format": "currency",
                  "precision": 2,
                  "className": "text-2xl font-bold"
                },
                {
                  "id": "price-label",
                  "type": "display-value",
                  "variable": "price_period",
                  "format": "text",
                  "className": "text-gray-600"
                }
              ]
            },
            {
              "id": "breakdown-section",
              "type": "section",
              "title": "Price Breakdown",
              "divider": true,
              "content": [
                {
                  "id": "users-cost",
                  "type": "display-value",
                  "variable": "users_cost",
                  "label": "Users",
                  "format": "currency",
                  "precision": 2
                },
                {
                  "id": "storage-cost",
                  "type": "display-value",
                  "variable": "storage_cost",
                  "label": "Storage",
                  "format": "currency",
                  "precision": 2
                },
                {
                  "id": "backup-cost",
                  "type": "display-value",
                  "variable": "backup_cost",
                  "label": "Backup",
                  "format": "currency",
                  "precision": 2
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## Pricing Configuration

### TypeScript Interface

```typescript
export interface PricingConfig {
  variables: Variable[];
  calculations?: Calculation[];
  constraints?: Constraint[];
  metadata?: {
    name?: string;
    description?: string;
    version?: string;
    lastModified?: string;
  };
}

export type Variable = 
  | NumberVariable
  | EnumVariable
  | MultiSelectVariable
  | ConstantVariable
  | MapVariable
  | ExpressionVariable;

export interface NumberVariable {
  name: string;
  type: 'number';
  default: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  description?: string;
}

export interface EnumVariable {
  name: string;
  type: 'enum';
  options: string[];
  default: string;
  description?: string;
}

export interface MultiSelectVariable {
  name: string;
  type: 'multi-select';
  options: string[];
  default: string[];
  maxSelection?: number;
  description?: string;
}

export interface ConstantVariable {
  name: string;
  type: 'constant';
  value: any;
  description?: string;
}

export interface MapVariable {
  name: string;
  type: 'map';
  value: Record<string, any>;
  description?: string;
}

export interface ExpressionVariable {
  name: string;
  type: 'expression';
  expression: string;
  dependencies?: string[];
  description?: string;
}

export interface Calculation {
  name: string;
  expression: string;
  dependencies: string[];
  description?: string;
}

export interface Constraint {
  name: string;
  condition: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}
```

### Sample Pricing Configuration JSON

```json
{
  "metadata": {
    "name": "SaaS Pricing Calculator",
    "description": "Dynamic pricing for team collaboration software",
    "version": "1.0.0",
    "lastModified": "2025-06-26T18:35:00Z"
  },
  "variables": [
    {
      "name": "users",
      "type": "number",
      "default": 5,
      "min": 1,
      "max": 100,
      "step": 1,
      "unit": "users",
      "description": "Number of team members"
    },
    {
      "name": "storage_tier",
      "type": "enum",
      "options": ["basic", "standard", "premium"],
      "default": "standard",
      "description": "Storage capacity tier"
    },
    {
      "name": "backup_frequency",
      "type": "number",
      "default": 7,
      "min": 1,
      "max": 30,
      "step": 1,
      "unit": "days",
      "description": "Backup frequency in days"
    },
    {
      "name": "user_price",
      "type": "constant",
      "value": 10,
      "description": "Price per user per month"
    },
    {
      "name": "storage_prices",
      "type": "map",
      "value": {
        "basic": 5,
        "standard": 15,
        "premium": 30
      },
      "description": "Storage tier pricing"
    },
    {
      "name": "backup_price_per_day",
      "type": "constant",
      "value": 0.5,
      "description": "Additional cost per day for custom backup frequency"
    },
    {
      "name": "users_cost",
      "type": "expression",
      "expression": "users * user_price",
      "dependencies": ["users", "user_price"],
      "description": "Total cost for all users"
    },
    {
      "name": "storage_cost",
      "type": "expression",
      "expression": "storage_prices[storage_tier]",
      "dependencies": ["storage_tier", "storage_prices"],
      "description": "Storage tier cost"
    },
    {
      "name": "backup_cost",
      "type": "expression",
      "expression": "backup_frequency < 7 ? (7 - backup_frequency) * backup_price_per_day : 0",
      "dependencies": ["backup_frequency", "backup_price_per_day"],
      "description": "Additional backup cost for frequent backups"
    },
    {
      "name": "monthly_total",
      "type": "expression",
      "expression": "users_cost + storage_cost + backup_cost",
      "dependencies": ["users_cost", "storage_cost", "backup_cost"],
      "description": "Total monthly cost"
    },
    {
      "name": "price_period",
      "type": "constant",
      "value": "per month",
      "description": "Billing period label"
    }
  ],
  "constraints": [
    {
      "name": "minimum_users",
      "condition": "users >= 1",
      "message": "At least 1 user is required",
      "severity": "error"
    },
    {
      "name": "reasonable_backup_frequency",
      "condition": "backup_frequency <= 14",
      "message": "Daily backups may impact performance",
      "severity": "warning"
    }
  ]
}
```

## Complete Example: E-commerce Pricing Calculator

### Layout Configuration

```json
{
  "type": "custom",
  "theme": {
    "spacing": "normal",
    "borderRadius": "medium",
    "colorScheme": "auto"
  },
  "columns": [
    {
      "id": "configuration-column",
      "weight": 3,
      "content": [
        {
          "id": "product-config",
          "type": "card",
          "title": "Product Configuration",
          "elevated": true,
          "content": [
            {
              "id": "quantity-section",
              "type": "section",
              "title": "Quantity",
              "content": [
                {
                  "id": "quantity-slider",
                  "type": "slider",
                  "variable": "quantity",
                  "label": "Number of Items",
                  "min": 1,
                  "max": 100,
                  "step": 1,
                  "showInput": true,
                  "showValue": true
                }
              ]
            },
            {
              "id": "product-options",
              "type": "section",
              "title": "Options",
              "content": [
                {
                  "id": "size-select",
                  "type": "select",
                  "variable": "size",
                  "label": "Size",
                  "placeholder": "Select size"
                },
                {
                  "id": "color-select",
                  "type": "select",
                  "variable": "color",
                  "label": "Color",
                  "placeholder": "Select color"
                }
              ]
            },
            {
              "id": "shipping-section",
              "type": "section",
              "title": "Shipping",
              "content": [
                {
                  "id": "shipping-select",
                  "type": "select",
                  "variable": "shipping_method",
                  "label": "Shipping Method",
                  "placeholder": "Select shipping"
                },
                {
                  "id": "express-input",
                  "type": "input",
                  "variable": "is_express",
                  "label": "Express Delivery",
                  "inputType": "text",
                  "placeholder": "yes/no"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "summary-column",
      "weight": 2,
      "content": [
        {
          "id": "price-summary",
          "type": "card",
          "title": "Order Summary",
          "elevated": true,
          "content": [
            {
              "id": "item-details",
              "type": "section",
              "content": [
                {
                  "id": "item-description",
                  "type": "display-value",
                  "variable": "product_description",
                  "format": "text",
                  "className": "font-medium"
                },
                {
                  "id": "item-specs",
                  "type": "display-value",
                  "variable": "product_specs",
                  "format": "text",
                  "className": "text-sm text-gray-600"
                }
              ]
            },
            {
              "id": "pricing-breakdown",
              "type": "section",
              "title": "Pricing",
              "divider": true,
              "content": [
                {
                  "id": "base-price-row",
                  "type": "row",
                  "align": "space-between",
                  "content": [
                    {
                      "id": "base-price-label",
                      "type": "display-value",
                      "variable": "base_price_label",
                      "format": "text"
                    },
                    {
                      "id": "base-price-value",
                      "type": "display-value",
                      "variable": "base_total",
                      "format": "currency",
                      "precision": 2
                    }
                  ]
                },
                {
                  "id": "shipping-row",
                  "type": "row",
                  "align": "space-between",
                  "content": [
                    {
                      "id": "shipping-label",
                      "type": "display-value",
                      "variable": "shipping_label",
                      "format": "text"
                    },
                    {
                      "id": "shipping-value",
                      "type": "display-value",
                      "variable": "shipping_cost",
                      "format": "currency",
                      "precision": 2
                    }
                  ]
                },
                {
                  "id": "tax-row",
                  "type": "row",
                  "align": "space-between",
                  "content": [
                    {
                      "id": "tax-label",
                      "type": "display-value",
                      "variable": "tax_label",
                      "format": "text"
                    },
                    {
                      "id": "tax-value",
                      "type": "display-value",
                      "variable": "tax_amount",
                      "format": "currency",
                      "precision": 2
                    }
                  ]
                }
              ]
            },
            {
              "id": "total-section",
              "type": "section",
              "content": [
                {
                  "id": "total-row",
                  "type": "row",
                  "align": "space-between",
                  "content": [
                    {
                      "id": "total-label",
                      "type": "display-value",
                      "variable": "total_label",
                      "format": "text",
                      "className": "text-lg font-bold"
                    },
                    {
                      "id": "total-value",
                      "type": "display-value",
                      "variable": "grand_total",
                      "format": "currency",
                      "precision": 2,
                      "className": "text-lg font-bold text-green-600"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### Pricing Configuration

```json
{
  "metadata": {
    "name": "E-commerce Product Pricing",
    "description": "Dynamic pricing for customizable products",
    "version": "1.2.0",
    "lastModified": "2025-06-26T18:35:00Z"
  },
  "variables": [
    {
      "name": "quantity",
      "type": "number",
      "default": 1,
      "min": 1,
      "max": 100,
      "step": 1,
      "description": "Number of items to purchase"
    },
    {
      "name": "size",
      "type": "enum",
      "options": ["small", "medium", "large", "xl"],
      "default": "medium",
      "description": "Product size"
    },
    {
      "name": "color",
      "type": "enum",
      "options": ["red", "blue", "green", "black", "white"],
      "default": "black",
      "description": "Product color"
    },
    {
      "name": "shipping_method",
      "type": "enum",
      "options": ["standard", "expedited", "overnight"],
      "default": "standard",
      "description": "Shipping speed"
    },
    {
      "name": "is_express",
      "type": "enum",
      "options": ["yes", "no"],
      "default": "no",
      "description": "Express delivery option"
    },
    {
      "name": "base_price",
      "type": "constant",
      "value": 29.99,
      "description": "Base product price"
    },
    {
      "name": "size_multipliers",
      "type": "map",
      "value": {
        "small": 0.8,
        "medium": 1.0,
        "large": 1.2,
        "xl": 1.4
      },
      "description": "Size-based price multipliers"
    },
    {
      "name": "color_premiums",
      "type": "map",
      "value": {
        "red": 0,
        "blue": 0,
        "green": 0,
        "black": 2.99,
        "white": 1.99
      },
      "description": "Color-based price premiums"
    },
    {
      "name": "shipping_costs",
      "type": "map",
      "value": {
        "standard": 5.99,
        "expedited": 12.99,
        "overnight": 24.99
      },
      "description": "Shipping method costs"
    },
    {
      "name": "express_fee",
      "type": "constant",
      "value": 9.99,
      "description": "Express delivery surcharge"
    },
    {
      "name": "tax_rate",
      "type": "constant",
      "value": 0.08,
      "description": "Sales tax rate (8%)"
    },
    {
      "name": "item_price",
      "type": "expression",
      "expression": "(base_price * size_multipliers[size]) + color_premiums[color]",
      "dependencies": ["base_price", "size", "size_multipliers", "color", "color_premiums"],
      "description": "Price per individual item"
    },
    {
      "name": "base_total",
      "type": "expression",
      "expression": "item_price * quantity",
      "dependencies": ["item_price", "quantity"],
      "description": "Total before shipping and tax"
    },
    {
      "name": "shipping_cost",
      "type": "expression",
      "expression": "shipping_costs[shipping_method] + (is_express === 'yes' ? express_fee : 0)",
      "dependencies": ["shipping_method", "shipping_costs", "is_express", "express_fee"],
      "description": "Total shipping cost"
    },
    {
      "name": "subtotal",
      "type": "expression",
      "expression": "base_total + shipping_cost",
      "dependencies": ["base_total", "shipping_cost"],
      "description": "Subtotal before tax"
    },
    {
      "name": "tax_amount",
      "type": "expression",
      "expression": "subtotal * tax_rate",
      "dependencies": ["subtotal", "tax_rate"],
      "description": "Sales tax amount"
    },
    {
      "name": "grand_total",
      "type": "expression",
      "expression": "subtotal + tax_amount",
      "dependencies": ["subtotal", "tax_amount"],
      "description": "Final total including tax"
    },
    {
      "name": "product_description",
      "type": "expression",
      "expression": "`Custom T-Shirt (${size.toUpperCase()}, ${color})`",
      "dependencies": ["size", "color"],
      "description": "Dynamic product description"
    },
    {
      "name": "product_specs",
      "type": "expression",
      "expression": "`Quantity: ${quantity} × $${item_price.toFixed(2)} each`",
      "dependencies": ["quantity", "item_price"],
      "description": "Product specifications text"
    },
    {
      "name": "base_price_label",
      "type": "constant",
      "value": "Items",
      "description": "Base price row label"
    },
    {
      "name": "shipping_label",
      "type": "expression",
      "expression": "`Shipping (${shipping_method}${is_express === 'yes' ? ' + Express' : ''})`",
      "dependencies": ["shipping_method", "is_express"],
      "description": "Dynamic shipping label"
    },
    {
      "name": "tax_label",
      "type": "constant",
      "value": "Tax",
      "description": "Tax row label"
    },
    {
      "name": "total_label",
      "type": "constant",
      "value": "Total",
      "description": "Total row label"
    }
  ],
  "constraints": [
    {
      "name": "minimum_quantity",
      "condition": "quantity >= 1",
      "message": "Quantity must be at least 1",
      "severity": "error"
    },
    {
      "name": "bulk_discount_notice",
      "condition": "quantity >= 10",
      "message": "Contact sales for bulk pricing on 10+ items",
      "severity": "info"
    },
    {
      "name": "express_overnight_warning",
      "condition": "!(shipping_method === 'overnight' && is_express === 'yes')",
      "message": "Express surcharge not needed for overnight shipping",
      "severity": "warning"
    }
  ]
}
```

