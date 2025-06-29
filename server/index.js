const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const { updateCalculatorPrompt } = require('./updateCalculatorPrompt');
const { newCalculatorPrompt } = require('./newCalculatorPrompt');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Read the JSON schema
const getLayoutSchema = () => {
  try {
    const schemaPath = path.join(__dirname, '../src/data/json_schema_layout.json');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    return JSON.parse(schemaContent);
  } catch (error) {
    console.error('Error reading layout schema:', error);
    return null;
  }
};

function getDefaultLayout() {
  return {
    "columns": [
      {
        "id": "main-column",
        "content": [
          {
            "type": "card",
            "id": "welcome-card",
            "content": [
              {
                "type": "display-item",
                "id": "welcome-text",
                "content": []
              }
            ],
            "elevated": true,
            "collapsible": false
          }
        ],
        "width": "100%",
        "className": "main-content"
      }
    ],
    "theme": {
      "spacing": "normal",
      "borderRadius": "medium",
      "colorScheme": "light"
    },
    "className": "app-layout"
  };
}

// Layout update endpoint
app.post('/layout/update', async (req, res) => {
  try {
    let { currentLayout, userPrompt } = req.body;

    let prompt = {}
    if (currentLayout) {
      prompt = updateCalculatorPrompt(userPrompt, currentLayout);
    } else {
      prompt = newCalculatorPrompt(userPrompt);
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: prompt.systemPrompt },
        { role: "user", content: prompt.userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const updatedLayout = JSON.parse(completion.choices[0].message.content);

    res.json({
      success: true,
      updatedLayout,
      message: 'Layout updated successfully'
    });

  } catch (error) {
    console.error('Error updating layout:', error);
    res.status(500).json({
      error: 'Failed to update layout',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 