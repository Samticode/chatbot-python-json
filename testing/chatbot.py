# Import necessary libraries
import json
import re
import random_responses

# Function to load responses from a JSON file
def load_responses(file):
    with open(file) as file:
        print(f"Loaded '{file}' successfully!")
        return json.load(file)

# Load responses from the bot.json file
responses = load_responses("./data/testing.json")

# Function to get the best response based on user input
def get_best_response(user_input):
    # Split the user input into words
    words_in_input = re.split(r'\s+|[,;?!.-]\s*', user_input.lower())
    # Initialize a list to store scores for each response
    response_scores = []

    # Loop through each response
    for response in responses:
        # Initialize score for this response
        score = 0
        # Get the required words for this response
        required_words = response["required_words"]

        # If there are required words, increment score for each word in user input
        if required_words:
            score += sum(word in required_words for word in words_in_input)

        # If all required words are present, increment score for each word in user input
        if score == len(required_words):
            score += sum(word in response["user_input"] for word in words_in_input)

        # Append the score for this response to the list of scores
        response_scores.append(score)

    # Find the maximum score and its index
    max_score = max(response_scores)
    max_score_index = response_scores.index(max_score)

    # If user input is empty, return a prompt for input
    if user_input == "":
        return "Tell me your problems, I'm here to help!"

    # If a response with a non-zero score was found, return it
    if max_score != 0:
        return responses[max_score_index]["bot_response"]

    # If no suitable response was found, return a random response
    return random_responses.random_string()

# Main loop to get user input and print the bot's response
while True:
    user_input = input("You: ")
    print("NNL Chatbot:", get_best_response(user_input))