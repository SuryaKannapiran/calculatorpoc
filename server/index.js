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
    console.log('OpenAI response:', completion.choices[0].message);
    const content = completion.choices[0].message.content;
    const updatedLayout = parseLayoutFromCompletion(content)

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

function parseLayoutFromCompletion(content) {
  try {
    // First attempt: parse the whole string
    return JSON.parse(content);
  } catch (e) {
    // If parsing fails, look for ```json blocks
    const jsonBlockMatch = content.match(/```json\s*([\s\S]*?)```/i);
    if (jsonBlockMatch) {
      const jsonText = jsonBlockMatch[1];
      try {
        return JSON.parse(jsonText);
      } catch (innerError) {
        throw new Error(
          `Failed to parse JSON inside \`\`\`json block:\n${innerError.message}`
        );
      }
    }
    throw new Error(`Failed to parse JSON from completion content:\n${e.message}`);
  }
}


// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 