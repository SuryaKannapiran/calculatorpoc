# Intercom Pricing Calculator

A dynamic, interactive pricing calculator for Intercom services built with React. This calculator allows users to configure their plan requirements and add-ons using intuitive sliders, with real-time price calculations based on the provided JSON pricing data.

## Features

- **Dynamic Slider Controls**: Interactive sliders for configuring plan units and add-ons
- **Real-time Price Calculation**: Instant price updates as you adjust sliders
- **Formula-based Pricing**: Supports complex pricing formulas from JSON data
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful, modern interface with glassmorphism effects
- **Feature Lists**: Displays included features for plans and add-ons
- **Price Breakdown**: Clear breakdown of costs including plan and add-on pricing

## Pricing Structure

The calculator supports the following pricing model:

### Plans
- **Essential Plan**: $39.00 per seat
- Formula: `unit * unit_price`
- Features: Fin AI Agent, Messenger, Shared Inbox and Ticketing system, Pre-built reports, Public Help Center

### Add-ons
- **Fin AI Resolution**: $0.99 per resolution
- Formula: `unit * unit_price`
- Features: Set up in under an hour on your current helpdesk, Answers email, live chat, phone and more, Customizable tone & answer length

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd calculatorpoc
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/
│   ├── Slider.js          # Reusable slider component
│   ├── Slider.css         # Slider styles
│   ├── FeatureList.js     # Feature display component
│   └── FeatureList.css    # Feature list styles
├── data/
│   └── pricingData.js     # Pricing configuration
├── utils/
│   └── calculator.js      # Price calculation utilities
├── App.js                 # Main application component
├── App.css                # Main application styles
├── index.js               # React entry point
└── index.css              # Global styles
```

## How It Works

### Price Calculation
The calculator uses a formula evaluation system that:
1. Takes the formula string from the JSON data (e.g., "unit * unit_price")
2. Replaces variables with actual values
3. Safely evaluates the mathematical expression
4. Returns the calculated price

### Dynamic Sliders
- **Plan Slider**: Controls the number of seats (1-50 range)
- **Add-on Sliders**: Control the number of resolutions (0-1000 range)
- Real-time price updates as sliders are adjusted

### Responsive Layout
- Desktop: Two-column layout with controls on the left and results on the right
- Mobile: Single-column layout optimized for touch interaction

## Customization

### Adding New Plans
To add new plans, modify the `pricingData.js` file:

```javascript
{
  "id": "new_plan",
  "label": "New Plan",
  "description": "Plan description",
  "unit": "seat",
  "unit_price": "49.00",
  "pricing_model": "per_unit",
  "billing_frequency": "monthly",
  "features": ["Feature 1", "Feature 2"],
  "available_addons": ["addon_id"],
  "formula": "unit * unit_price"
}
```

### Adding New Add-ons
```javascript
{
  "id": "new_addon",
  "label": "New Add-on",
  "description": "Add-on description",
  "unit": "unit_type",
  "unit_price": "1.99",
  "pricing_model": "per_unit",
  "features": ["Feature 1", "Feature 2"],
  "formula": "unit * unit_price"
}
```

### Modifying Formulas
The calculator supports any mathematical formula using the variables:
- `unit`: The number of units selected
- `unit_price`: The price per unit

Examples:
- `unit * unit_price` (linear pricing)
- `unit * unit_price * 0.9` (10% discount)
- `Math.max(unit * unit_price, 100)` (minimum price of $100)

## Technologies Used

- **React 18**: Modern React with hooks
- **CSS3**: Custom styling with modern features like CSS Grid and Flexbox
- **JavaScript ES6+**: Modern JavaScript features
- **Glassmorphism Design**: Modern UI design trend with backdrop blur effects

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For support or questions, please open an issue in the repository. 