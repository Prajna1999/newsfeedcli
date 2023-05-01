const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const users = [];

function login() {
  rl.question("Please enter your username: ", (username) => {
    rl.question("Please enter your password: ", (password) => {
      const user = users.find(
        (user) => user.username === username && user.password === password
      );

      if (user) {
        console.log(`Welcome back, ${username}!\n`);
        promptMainMenu(); // Call to the main menu function after successful login
      } else {
        console.log("Invalid login information. Please try again.\n");
        login();
      }
    });
  });
}

function signup() {
  rl.question("Please choose a username: ", (username) => {
    rl.question("Please choose a password: ", (password) => {
      users.push({ username, password });
      console.log("Signup successful. Please log in.\n");
      login();
    });
  });
}

function promptMainMenu() {
  console.log("\n");
  console.log("MAIN MENU");
  console.log("1. Post an item");
  console.log("2. Comment on a post");
  console.log("3. Reply to a comment");
  console.log("4. Follow a user");
  console.log("5. Unfollow a user");
  console.log("6. Upvote a post");
  console.log("7. Downvote a post");
  console.log("8. Upvote a comment");
  console.log("9. Logout");
  console.log("\n");

  rl.question("Please enter your choice: ", (choice) => {
    switch (choice) {
      case "1":
        console.log("You selected 'Post an item'");
        break;
      case "2":
        console.log("You selected 'Comment on a post'");
        break;
      case "3":
        console.log("You selected 'Reply to a comment'");
        break;
      case "4":
        console.log("You selected 'Follow a user'");
        break;
      case "5":
        console.log("You selected 'Unfollow a user'");
        break;
      case "6":
        console.log("You selected 'Upvote a post'");
        break;
      case "7":
        console.log("You selected 'Downvote a post'");
        break;
      case "8":
        console.log("You selected 'Upvote a comment'");
        break;
      case "9":
        console.log("You selected 'Logout'");
        break;
      default:
        console.log("Invalid choice. Please try again.\n");
        promptMainMenu();
    }
  });
}

console.log("Welcome to my application!");
rl.question("Do you have an account? (y/n): ", (answer) => {
  if (answer === "y") {
    login();
  } else {
    signup();
  }
});
