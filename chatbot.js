const express = require('express');
const app = express();
const fs = require('fs');
const readline = require('readline');
const path = require('path');


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/chatbot', (req, res) => {
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

        // If user input is empty, return a prompt for input
        if (userInput === "") {
            return "Tell me your problems, I'm here to help!";
        }

        // If a response with a non-zero score was found, return it
        if (maxScore !== 0) {
            return responses[maxScoreIndex]["bot_response"];
        }

        // If no suitable response was found, return a random response
        return randomString();
    }

    // Function to generate a random string
    function randomString() {
        let randomList = [
            "<p>I didn't quite understand that</p>",
            '<p>Can you say it in another way.</p>',
            '<p>Get in contact with us on <a href="https://www.nordicneurolab.com/support">NordicNeuroLab.con</a></p>'
        ];

        let listCount = randomList.length;
        let randomItem = Math.floor(Math.random() * listCount);

        return randomList[randomItem];
    }

    // Main loop to get user input and print the bot's response
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('line', (input) => {
        console.log(`NNL Chatbot: ${getBestResponse(input)}`);
    });
});


app.listen(3001, () => {
    console.log('server started');
})