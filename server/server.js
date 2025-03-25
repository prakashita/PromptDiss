const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
//const fetch = require('node-fetch'); // For making API calls

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files (HTML, JS, JSON)
app.use(express.static('public'));

// Endpoint to generate AI word
app.post('/api/generate-word', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    try {
        const response = await fetch('http://192.168.0.182:9000/v1/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "gemma-3-27b-it", // Match your loaded model
                prompt: `Return ONLY a single lowercase English noun related to or close to: ${prompt}. No sentences, punctuation, or explanations.`,
                temperature: 0.7,
                max_tokens: 10
            })
        });

        if (!response.ok) throw new Error("LM Studio error");
        const data = await response.json();
        const word = data.choices[0].text.trim().toLowerCase().replace(/[^a-z]/g, '');
        res.json({ word });
    } catch (error) {
        res.status(500).json({ error: "Failed to get AI response", details: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));