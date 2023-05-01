const readline = require('readline');
const { program } = require('commander');

// Define the quiz questions and answers
const quiz = [
  {
    question: "What is the capital of France?",
    answer: "Paris"
  },
  {
    question: "What is the largest country in the world?",
    answer: "Russia"
  },
  {
    question: "What is the currency of Japan?",
    answer: "Yen"
  }
];

// Create a readline interface for reading user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Keep track of the user's score
let score = 0;

// Define the login function
function login(username, password) {
  // Check if the username and password are valid
  if (username === "admin" && password === "password") {
    console.log("Login successful!");
    // Start the quiz by asking the first question
    askQuestion(0);
  } else {
    console.log("Login failed. Please try again.");
    // Ask the user to log in again
    program.prompt();
  }
}

// Ask the user each question in the quiz
function askQuestion(index) {
  rl.question(quiz[index].question + "\n", (answer) => {
    if (answer.toLowerCase() === quiz[index].answer.toLowerCase()) {
      console.log("Correct!");
      score++;
    } else {
      console.log("Incorrect. The correct answer is: " + quiz[index].answer);
    }
    if (index < quiz.length - 1) {
      askQuestion(index + 1);
    } else {
      console.log("Quiz complete! Your score is: " + score + "/" + quiz.length);
      rl.close();
    }
  });
}

// Define the command-line options
program
  .version('0.1.0')
  .option('-u, --username <username>', 'Specify the username')
  .option('-p, --password <password>', 'Specify the password')
  .parse(process.argv);

// Prompt the user to log in
program.prompt = () => {
  rl.question('Enter your username: ', (username) => {
    rl.question('Enter your password: ', (password) => {
      login(username, password);
    });
  });
};

// Parse the command-line arguments and start the program
program.parse(process.argv);

