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
    const fetch = require('node-fetch');

    const geminiApiKey = process.env.GEMINI_API_KEY; // Set this in your .env
    const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + geminiApiKey;
    
    const geminiBody = {
      contents: [
        { role: "user", parts: [{ text: prompt.systemPrompt + "\n" + prompt.userPrompt }] }
      ]
    };
    
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody)
    });
    const geminiData = await geminiResponse.json();
    console.log('Gemini response:', geminiData);
    const updatedLayout = JSON.parse(geminiData.candidates[0].content.parts[0].text);

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