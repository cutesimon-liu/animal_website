const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Function to recursively read and aggregate data from the data directory
function loadData() {
    const dataDir = path.resolve(__dirname, '../../src/data'); // Adjust path based on where function runs
    let consolidatedData = "";

    try {
        const files = fs.readdirSync(dataDir);

        files.forEach(file => {
            // Basic check for js/json files
            if (file.endsWith('.js') || file.endsWith('.json')) {
                try {
                    const filePath = path.join(dataDir, file);
                    let content = fs.readFileSync(filePath, 'utf8');

                    // Simple cleanup to make it prompt-friendly (removing JS syntax if possible, or just dumping it)
                    // Since these are likely "export const x = [...]" files, we can just strip imports/exports
                    // for a clearer context, or just dump the raw text. Raw text usually works fine for LLMs.
                    // We'll append the filename for context.
                    consolidatedData += `\n\n--- Source: ${file} ---\n${content}`;
                } catch (err) {
                    console.error(`Error reading file ${file}:`, err);
                }
            }
        });
    } catch (error) {
        console.error("Error reading data directory:", error);
        return "Error loading internal knowledge base.";
    }

    return consolidatedData;
}


exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Initialize variables outside try/catch for scope access
    let apiKey, genAI, model, systemPrompt, message, history;
    const knowledgeBase = loadData();

    try {
        const body = JSON.parse(event.body);
        message = body.message;
        history = body.history;
        apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "API Key not configured." }),
            };
        }

        genAI = new GoogleGenerativeAI(apiKey);
        // Updated to verified available model
        model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const systemPrompt = `
      You are a helpful and witty AI guide for an Animal & Science education website.
      
      Instructions:
      1. **Priority**: Always use the "Context Data" below to answer questions about animals, stars, or the website.
      2. **Chit-Chat**: If the user asks personal questions (e.g., "Am I handsome?", "Who are you?"), be humorous, friendly, and engaging. You DON'T need to mention the database for these types of questions.
      3. **General Knowledge**: For science questions not in the database, answer correctly using your general knowledge.
      4. **Tone**: Educational but fun. Use emojis sparingly.
      
      === Context Data ===
      ${knowledgeBase}
      ====================
    `;

        // Initialize chat
        const chat = model.startChat({
            history: history ? history.map(h => ({
                role: h.role === 'user' ? 'user' : 'model',
                parts: [{ text: h.image ? "[Image Uploaded]" : h.message }] // Simple text handling
            })) : [],
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        // Send message
        const result = await chat.sendMessage(`${systemPrompt}\n\nUser Question: ${message}`);
        const response = await result.response;
        const text = response.text();

        return {
            statusCode: 200,
            body: JSON.stringify({ reply: text }),
        };

    } catch (error) {
        console.error("Error with primary model:", error);

        // Fallback if primary fails (404 Not Found OR 429 Rate Limit)
        if (error.message.includes("404") || error.message.includes("not found") || error.message.includes("429") || error.message.includes("Too Many Requests")) {
            try {
                console.log("Attempting fallback to gemini-pro...");

                // Ensure genAI is available, if not (e.g. error before init), try to init again
                if (!genAI && process.env.GEMINI_API_KEY) {
                    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                }

                if (!genAI) throw new Error("GenAI client not initialized for fallback.");

                const fallbackModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

                // Reconstruct simple prompt for fallback since systemPrompt might be out of scope or we want simpler one
                const simplerSystemPrompt = `
                  You are an AI assistant for an Animal website.
                  Context Data:
                  ${knowledgeBase}
                `;

                const result = await fallbackModel.generateContent(`${simplerSystemPrompt}\n\nUser Question: ${message}`);
                const response = await result.response;
                const text = response.text();

                return {
                    statusCode: 200,
                    body: JSON.stringify({ reply: text }),
                };
            } catch (fallbackError) {
                console.error("Fallback failed:", fallbackError);
                return {
                    statusCode: 500,
                    body: JSON.stringify({
                        error: `Both models failed. Primary Error: ${error.message}. Fallback Error: ${fallbackError.message}`
                    }),
                };
            }
        }

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: `Failed to connect to AI Model. Details: ${error.message}`
            }),
        };
    }
};
