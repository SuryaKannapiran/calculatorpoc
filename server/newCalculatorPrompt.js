const fs = require('fs');
const newCalculatorPrompt = (userMessage) => {
    const systemPrompt = fs.readFileSync('./server/prompts/newCalculatorPromptTemplate.md', 'utf8');

    const userPrompt = `
User Request: "${userMessage}"
Please return the updated layout JSON that incorporates the requested changes. Only return the JSON, no explanations
, comments, or additional text. Just the raw JSON that can be directly copied and pasted.`;

    return {
        systemPrompt,
        userPrompt
    }


};


module.exports = {
    newCalculatorPrompt
};