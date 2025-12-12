const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
require('dotenv').config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API KEY found in .env");
        return;
    }

    // Use raw fetch to avoid SDK abstraction hiding the error details or model list
    try {
        console.log("Fetching available models via REST API...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.models) {
            console.log(`Found ${data.models.length} models.`);
            fs.writeFileSync('models.json', JSON.stringify(data.models, null, 2));
            console.log("Saved to models.json");
        } else {
            console.log("No models found in response:", data);
            fs.writeFileSync('models.json', JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error("Error listing models:", error);
        fs.writeFileSync('models_error.txt', error.toString());
    }
}

listModels();
