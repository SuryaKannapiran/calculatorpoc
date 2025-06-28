const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
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

// Layout update endpoint
app.post('/layout/update', async (req, res) => {
  try {
    const { currentLayout, userPrompt } = req.body;
    console.log('currentLayout', JSON.stringify(req.body, null, 2));
    console.log('currentLayout', JSON.stringify(currentLayout, null, 2));
    console.log('userPrompt', userPrompt);
    if (!currentLayout || !userPrompt) {
      return res.status(400).json({
        error: 'Missing required fields: currentLayout and userPrompt'
      });
    }

    const layoutSchema = getLayoutSchema();
    if (!layoutSchema) {
      return res.status(500).json({
        error: 'Failed to load layout schema'
      });
    }

    // Create the prompt for OpenAI
    const systemPrompt = `You are a UI layout configuration expert. You will receive a current JSON layout configuration and a user's natural language request to modify it. 

Your task is to:
1. Understand the current layout structure
2. Interpret the user's request
3. Return an updated JSON layout that follows the schema exactly
4. Make incremental changes - don't replace the entire layout unless specifically requested
5. Ensure all IDs are unique and descriptive
6. Maintain the existing structure while adding/modifying elements as requested

The layout schema supports these content types:
- card: Container with elevated styling and optional collapsible behavior
- section: Content section with optional divider
- row: Horizontal layout with alignment options
- control-group: Group of related controls
- display-item: Display-only content
- slider: Range input control
- input: Text or number input
- select: Dropdown selection
- display-value: Formatted value display

JSON Schema:
${JSON.stringify(layoutSchema, null, 2)}

Always return valid JSON that strictly follows the schema above.`;

    const userMessage = `Current Layout JSON:
${JSON.stringify(currentLayout, null, 2)}

User Request: "${userPrompt}"

Please return the updated layout JSON that incorporates the requested changes. Only return the JSON, no explanations.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
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