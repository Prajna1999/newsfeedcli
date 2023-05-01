const Session = require('./models/Session')
const User = require('./models/User');
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

// rl.question("Do you have an account? (y/n): ", (answer) => {
//   if (answer === "y") {
//     console.log("You have an account. Logging in...");
//     login();
//   } else {
//     console.log("You don't have an account. Signuping...");
//     // signup();
//     promptSignup()
//   }
// });

// function promptSignup(username, password) {

//   Session.signup(username, password);
//   promptUser()
// }

function promptUser() {

  console.log("\n");
  console.log("MAIN MENU");
  console.log("0. Show Your Newsfeed")
  console.log("1. Post an item");
  console.log("2. Comment on a post");
  console.log("3. Reply to a comment");
  console.log("4. Follow a user");
  console.log("5. Unfollow a user");
  console.log("6. Upvote a post");
  console.log("7. Downvote a post");
  console.log("8. Upvote a comment");
  console.log("9. Logout");
  console.log("10. Show all users")
  console.log("\n");

  rl.question('Enter command:', (input) => {
    const [command, ...args] = input.split(' ');

    switch (command) {
      case 'login':
        console.log("You entered 'login'");
        promptUser()
        break;
      case 'signup':
        // console.log("You entered'signup'");
        // promptSignup(args[0], args[1])
        const [username, password] = args;
        Session.signup(args[0], args[1])
        promptUser()
        // signup()
        // promptUser()
        break;
      case 'follow':
        // console.log("You entered 'follow'");
        console.log('You followed', args[0])
        promptUser()
        break;
      case 'help':

        console.log('List of available commands:');
        console.log('- signup --name <name> --email <email> --password <password>: create a new user');
        console.log('- login --email <email> --password <password>: log in as an existing user');
        console.log('- follow <follower_email> <followee_email>: make the follower user follow the followee user');
        console.log('- help: display this help message');
        promptUser();
        break;
      default:
        console.log("Invalid command. Please try again.\n");
        promptUser()


    }
  })
}
promptUser()