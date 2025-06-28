export const pricingData = {
  "vendor": "Intercom",
  "url": "https://www.intercom.com/pricing",
  "currency": "USD",
  "plans": [
    {
      "id": "essential",
      "label": "Essential",
      "description": "The customer support plan for individuals, startups, and small businesses.",
      "unit": "seat",
      "unit_price": "39.00",
      "pricing_model": "per_unit",
      "billing_frequency": "monthly",
      "included_quotas": {
        "seat": {
          "value": "1",
          "unit": "seat"
        }
      },
      "features": [
        "Fin AI Agent", 
        "Messenger", 
        "Shared Inbox and Ticketing system", 
        "Pre-built reports", 
        "Public Help Center"
      ],
      "available_addons": ["fin_resolution"],
      "formula":  "max(0, seat - included_quotas.seat.value) * unit_price"
    }
  ],
  "addons": [
    {
      "id": "fin_resolution",
      "label": "Fin AI Resolution",
      "description": "$0.99 per Fin resolution",
      "unit": "resolution",
      "unit_price": "0.99",
      "pricing_model": "per_unit",
      "features": [
        "Set up in under an hour on your current helpdesk", 
        "Answers email, live chat, phone and more", 
        "Customizable tone & answer length"
      ],
      "available_addons": [],
      "formula": "max(0, resolution - included_quotas.resolution.value) * unit_price"
    }
  ]
}; 