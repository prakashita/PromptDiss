# Tech Word Guess Game

A fun and interactive game where players provide hints to help an AI guess a tech-related word while avoiding a set of blacklisted words.

## Features
- Display a tech-related word along with 5 blacklisted words.
- Chat section for the user to provide hints to help AI guess the word.
- Score system (+1 for each correct guess).
- Timer that pauses when AI is processing a guess.
- Option to pass and skip to the next word.
- Leaderboard with top 5 high scores.
- Entry screen where players input their name before starting.

## How to Play
1. Enter your name on the welcome screen.
2. View the displayed word and its 5 blacklisted words.
3. Provide hints in the chat to make the AI guess the word.
4. If AI guesses correctly, you earn +1 point, and a new word appears.
5. Use the pass button to skip a word.
6. Keep playing until time runs out!

## Installation & Setup
1. Clone this repository:
   ```sh
   git clone https://github.com/yourusername/tech-guess-game.git
   ```
2. Navigate to the project directory:
   ```sh
   cd tech-guess-game
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## Technologies Used
- React with TailwindCSS for UI
- Framer Motion for animations
- Zustand for state management
- Vite for fast development

## Contributing
Feel free to fork this repository and submit pull requests with improvements!

## License
This project is licensed under the MIT License.
