# Layout Editor Setup Guide

## Prerequisites

1. **OpenAI API Key**: You'll need an OpenAI API key to use the layout editor feature.
2. **Node.js**: Version 14 or higher

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory with your OpenAI API key:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=3001
```

### 3. Running the Application

#### Development Mode (Recommended)
This will start both the React frontend and Express backend:

```bash
npm run dev
```

#### Separate Mode
If you prefer to run them separately:

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm start
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## Features

### Calculator Screen
- Dynamic pricing calculator with sliders
- Real-time price calculations
- Support for multiple plans and add-ons

### Layout Editor Screen
- Natural language layout updates
- AI-powered layout generation
- Real-time JSON preview
- Example prompts for guidance

## Usage

### Layout Editor

1. Navigate to the "Layout Editor" tab
2. Enter a natural language description of the changes you want
3. Click "Update Layout" or press Ctrl+Enter
4. View the updated JSON configuration

### Example Prompts

- "Add a slider with name as No of Users"
- "Create a new card section for user preferences"
- "Add a row with two input fields for name and email"
- "Change the theme to dark mode"

## API Endpoints

### POST /layout/update
Updates the layout based on natural language input.

**Request Body:**
```json
{
  "currentLayout": {...},
  "userPrompt": "Add a slider with name as No of Users"
}
```

**Response:**
```json
{
  "success": true,
  "updatedLayout": {...},
  "message": "Layout updated successfully"
}
```

### GET /health
Health check endpoint.

## Troubleshooting

### Common Issues

1. **OpenAI API Error**: Ensure your API key is valid and has sufficient credits
2. **Port Already in Use**: Change the PORT in .env file
3. **CORS Issues**: The backend is configured to allow requests from localhost:3000

### Getting Help

If you encounter issues:
1. Check the browser console for frontend errors
2. Check the terminal for backend errors
3. Verify your OpenAI API key is correct
4. Ensure all dependencies are installed 