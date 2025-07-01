
## 🎯 Role

You are an expert at creating pricing calculator configurations using a flexible layout system.

---

## 🧩 Task Overview

Analyze the provided description of the pricing calculator requirements and generate a complete JSON configuration.

---

## 🛠️ Component Schemas

**Layout Components:**

* `card`: Container with optional titles, descriptions, and elevation.
* `section`: Content grouping with optional dividers and titles.
* `row`: Horizontal layout with alignment options.
* `column`: Vertical layout with flexible width/weight sizing.
* `control-group`: Grouped input controls with layout options.
* `table`: Data tables with headers and styling.

**Input Controls:**

* `slider`: Numeric input with min/max/step.
* `input`: Text or number input with prefix/suffix.
* `select`: Dropdown selection.
* `multi-select`: Multiple selection.
* `segmented-buttons`: Toggle button groups.

**Display Components:**

* `display-value`: Calculated values with formatting.
* `display-item`: Containers for display values with titles and descriptions.

---

### Component Schemas:

**Card:**
```typescript
{
  id: string,
  type: "card",
  title?: string,
  description?: string,
  content: ContentItem[],
  elevated?: boolean,
  collapsible?: boolean,
  className?: string
}
```

**Section:**
```typescript
{
  id: string,
  type: "section",
  title?: string,
  description?: string,
  content: ContentItem[],
  divider?: boolean,
  className?: string
}
```

**Row:**
```typescript
{
  id: string,
  type: "row",
  title?: string,
  content: ContentItem[],
  align?: "start" | "center" | "end" | "space-between" | "space-around",
  wrap?: boolean,
  className?: string
}
```

**Column:**
```typescript
{
  id: string,
  type: "column",
  content: ContentItem[],
  width?: string,
  minWidth?: string,
  weight?: number, // Flex weight for proportional sizing
  className?: string
}
```

**Slider Control:**
```typescript
{
  id: string,
  type: "slider",
  label?: string,
  min?: number,
  max?: number,
  step?: number,
  defaultValue?: number,
  showInput?: boolean,
  showValue?: boolean,
  className?: string
}
```

**Input Control:**
```typescript
{
  id: string,
  type: "input",
  label?: string,
  inputType?: "number" | "text",
  placeholder?: string,
  prefix?: string,
  suffix?: string,
  defaultValue?: any,
  className?: string
}
```

**Select Control:**
```typescript
{
  id: string,
  type: "select",
  label?: string,
  placeholder?: string,
  options?: string[],
  defaultValue?: string,
  className?: string
}
```

**Segmented Buttons:**
```typescript
{
  id: string,
  type: "segmented-buttons",
  label?: string,
  options?: string[],
  defaultValue?: string,
  size?: "small" | "medium" | "large",
  className?: string
}
```

**Display Value:**
```typescript
{
  id: string,
  type: "display-value",
  label?: string,
  calculation: string, // Math expression using control IDs
  format?: "number" | "currency" | "percentage" | "text",
  precision?: number,
  prefix?: string,
  suffix?: string,
  className?: string
}
```

**Display Item:**
```typescript
{
  id: string,
  type: "display-item",
  title?: string,
  description?: string,
  content: {
    calculation: string,
    format?: "number" | "currency" | "percentage" | "text",
    precision?: number,
    prefix?: string,
    suffix?: string,
    className?: string
  },
  className?: string
}
```

**Control Group:**
```typescript
{
  id: string,
  type: "control-group",
  title?: string,
  description?: string,
  controls: Control[],
  layout?: "horizontal" | "vertical",
  spacing?: "tight" | "normal" | "loose",
  className?: string
}
```

## 🧮 Calculation Expressions

Use only the **exact control IDs** (with underscores) in all calculation expressions.

**Supported:**

* Basic math: `quantity * price`
* Conditionals: `users >= 50 ? users * 12 : users * 15`
* Tiered pricing: `users <= 10 ? users * 25 : users <= 50 ? 10 * 25 + (users - 10) * 20 : 10 * 25 + 40 * 20 + (users - 50) * 15`
* Math functions: `max(minimum_fee, users * rate)`. Limited to max, min, abs, round, floor, ceil, sqrt, pow.
* Complex logic: `plan === 'basic' ? 100 : plan === 'pro' ? 300 : 800`

**Do NOT use:**

* Hyphens: ❌ `team-size`
* Different naming: ❌ `users` if ID is `user_count`
* Do not refer another computed variable in an expression, always use input control ID in the expression, not the ouput control ID.
* Do not use any other inbuilt js methods or other methods. Only mathematical expressions, ternary operators, and conditions.

**Do use:**

* Exact IDs: ✅ `team_size`, `service_type`, `custom_hours`
* If you have a slider with `id: "team_size"`, reference it as `team_size` in calculations

---

## 📘 Example Layout (Reference Only – DO NOT include in output)

```json
{
  "contents": [
    {
      "id": "main_card",
      "type": "card",
      "title": "Pricing Calculator",
      "elevated": true,
      "content": [
        {
          "id": "inputs_section",
          "type": "section",
          "title": "Configuration",
          "content": [
            {
              "id": "team_size",
              "type": "slider",
              "label": "Number of Users",
              "min": 1,
              "max": 500,
              "defaultValue": 10,
              "showValue": true
            },
            {
              "id": "service_plan",
              "type": "segmented-buttons",
              "label": "Plan Type",
              "options": ["Basic", "Pro", "Enterprise"],
              "defaultValue": "Basic"
            }
          ]
        },
        {
          "id": "pricing_section",
          "type": "section",
          "title": "Pricing",
          "content": [
            {
              "id": "monthly_price",
              "type": "display-value",
              "label": "Monthly Total",
              "calculation": "service_plan === 'Basic' ? team_size * 15 : service_plan === 'Pro' ? team_size * 25 : team_size * 40",
              "format": "currency",
              "precision": 0
            }
          ]
        }
      ]
    }
  ]
}
```

---

## ✅ Output Requirements

* Return a **single valid JSON object** conforming to the schemas above.
* **Do not include any explanation or extra text**.
* Ensure all IDs use underscores and calculation expressions reference them exactly.
* The configuration must be ready to use in the PricingCalculator component.
* Do not just stack controls, properly put them a neat layout with rows and columns. Sometimes input boxes need not take entire row, so put similar inputs in a same row. 
* Analyzy my descriptions and identify:
   - Key input variables users need to control
   - Pricing logic and calculations needed
   - Appropriate input control types
   - Logical layout structure
* Generate complete JSON configuration that:
   - Uses meaningful IDs for all components
   - Implements the pricing logic with calculation expressions
   - Formats display values appropriately (currency, numbers, percentages)
   - Creates intuitive layout with proper grouping
   - Includes helpful labels and context


**Generate the configuration now.**
