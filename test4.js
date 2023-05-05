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
        // console.log("You entered 'login'");
        Session.login(args[0], args[1])
        promptUser()
        break;
      case 'signup':
        const flags = parseFlags(args);
        const { username, password } = flags;


        Session.signup(flags.username, flags.password)

        promptUser()
        // signup()
        // promptUser()
        break;
      case 'follow':
        // console.log("You entered 'follow'");
        // console.log('You followed', args[0])
        Session.currentSession.folllow(args[0])
        promptUser()
        break;
      case 'unfollow':
        Session.currentSession.unfollow(args[0])
        promptUser()
        break;
      case 'newsfeed':
        Session.currentSession.getNewsfeed()
        promptUser()
        break;
      case 'post':
        Session.currentSession.postItem(args[1]);
        promptUser();
        break;
      case 'comment':
        Session.currentSession.comment(args[1], args[2]);
        promptUser();
        break;

      case 'reply':
        Session.currentSession.addReply(args[0], args[1], args[2]);
        promptUser();
        break;
      case 'upvote':
        Session.currentSession.upvote(args[0]);
        promptUser();
        break;
      case 'downvote':
        Session.currentSession.downvote(args[0]);
        promptUser();
        break;
      case 'upvoteComment':
        Session.currentSession.upvoteComment(args[0], args[1]);
        promptUser();
        break;
      case 'downvoteComment':
        Session.currentSession.downvoteComment(args[0], args[1]);
        promptUser();
        break;

      case 'logout':
        Session.logout();
        // promptUser();
        process.exit(0);
      // break;
      case 'help':

        console.log('List of available commands:');
        console.log('- signup --username <username> --password <password>: create a new user');
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

//parse flags
function parseFlags(args) {
  const flags = {};
  for (let i = 0; i < args.length; i++) {
    let arg = args[i]
    if (arg.startsWith('--')) {
      const flagName = arg.slice(2);
      const flagValue = args[i + 1];
      flags[flagName] = flagValue;
      i++
    }

  }
  return flags;
}


// console.log("Welcome to my application!");
// rl.question("Do you have an account? (y/n): ", (answer) => {
//   if (answer === "y") {
//     // login();
//     // promptLogin()
//     Session.login(args[0], args[1])
//   } else {
//     // signup();
//     // promptSignup()
//     Session.signup()
//   }
// });


promptUser()