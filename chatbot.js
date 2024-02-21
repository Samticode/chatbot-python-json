const express = require('express');
const app = express();
const fs = require('fs');
const readline = require('readline');
const path = require('path');


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/chatbot', (req, res) => {
    // Function to load responses from a JSON file
    function loadResponses(file) {
        let rawdata = fs.readFileSync(file);
        let responses = JSON.parse(rawdata);
        console.log(`Loaded '${file}' successfully!`);
        return responses;
    }

    // Load responses from the bot.json file
    let responses = loadResponses("./data.json");

    // Function to get the best response based on user input
    function getBestResponse(userInput) {
        // Split the user input into words
        let wordsInInput = userInput.toLowerCase().split(/\s+|[.,;?!-]\s*/);
        // Initialize a list to store scores for each response
        let responseScores = [];

        // Loop through each response
        for (let response of responses) {
            // Initialize score for this response
            let score = 0;
            // Get the required words for this response
            let requiredWords = response["required_words"];

            // If there are required words, increment score for each word in user input
            if (requiredWords) {
                score += wordsInInput.filter(word => requiredWords.includes(word)).length;
            }

            // If all required words are present, increment score for each word in user input
            if (score === requiredWords.length) {
                score += wordsInInput.filter(word => response["user_input"].includes(word)).length;
            }

            // Append the score for this response to the list of scores
            responseScores.push(score);
        }

        // Find the maximum score and its index
        let maxScore = Math.max(...responseScores);
        let maxScoreIndex = responseScores.indexOf(maxScore);

        // If a response with a non-zero score was found, return it
        if (maxScore !== 0) {
            return responses[maxScoreIndex]["bot_response"];
        }

        // If no suitable response was found, return a default response
        return "<p>I'm sorry, I didn't understand that.</p>";
    }

    // Get the user's message from the request body
    let userMessage = req.body.message;

    // Get the best response
    let botResponse = getBestResponse(userMessage);

    // Send the response back to the client
    res.json({ message: botResponse });
});


app.listen(3001, () => {
    console.log('server started');
})