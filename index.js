const Session = require('./models/Session')
const User = require('./models/User');
const {
  NewsFeedSortStrategy,
  CommentCountSortStrategy,
  FollowedUsersSortStrategy,
  ScoreSortStrategy,
  NewsFeed } = require('./models/Newsfeed')



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
  console.log("FOLLOWING COMMANDS ARE AVAILABLE");
  console.log("'signup' Create a new user")
  console.log("'login' Login an existing user");
  console.log("'follow' Follow a user");
  console.log(" 'unfollow' Unfollow a user");

  console.log(" 'upvote' Upvote a post");
  console.log("'downvote' a post");
  console.log("'upvoteComment' Upvote a comment");
  console.log("'downvoteComment' Downvote a comment");
  console.log("'comment' comment on a post")
  console.log("'reply' Reply on a comment")

  console.log("'showallusers' Show all users");
  console.log("'shownewsfeed' Show Newsfeed");
  console.log("'logout' Logout User")
  console.log("'exit' Exit the application");
  console.log("'help' ")

  console.log("\n");

  rl.question('> ', (input) => {
    const [command, ...args] = input.split(' ');
    const flags = parseFlags(args);
    const { username, password } = flags;
    switch (command) {
      case 'login':
        // console.log("You entered 'login'");


        Session.login(username, password)
        promptUser()
        break;
      case 'signup':



        Session.signup(username, password)

        promptUser()
        // signup()
        // promptUser()
        break;
      case 'follow':
        // console.log("You entered 'follow'");
        // console.log('You followed', args[0])
        Session.currentSession.follow(args[0])
        promptUser()
        break;
      case 'unfollow':
        Session.currentSession.unfollow(args[0])
        promptUser()
        break;


      case 'post':
        const title = args[0];
        const content = args.slice(1).join(' ');
        Session.currentSession.postItem(title, content);
        promptUser();
        break;

      case "comment":
        const postId = args[0]
        const comment = args.slice(1).join(' ');
        Session.currentSession.comment(postId, comment);
        promptUser();
        break;


      case 'reply':
        const commentId = args[0]
        const reply = args.slice(1).join(' ');
        Session.currentSession.reply(commentId, reply);
        promptUser();
        break;

      case 'upvote':
        Session.currentSession.upvotePost(args[0]);
        promptUser();
        break;
      case 'downvote':
        Session.currentSession.downvotePost(args[0]);
        promptUser();
        break;
      case 'upvotecomment':
        Session.currentSession.upvoteComment(args[0]);
        promptUser();
        break;
      case 'downvotecomment':
        Session.currentSession.downvoteComment(args[0], args[1]);
        promptUser();
        break;
      case "showallusers":
        Session.currentSession.getAllUsers()
        promptUser();
        break;

      case 'logout':
        Session.logout();

        process.exit(0);


      case 'shownewsfeed':
        const sortStrategy = args[0]
        // Session.currentSession.showNewsFeed(sortStrategy);
        const currentUser = Session.currentSession;
        const newsFeed = new NewsFeed(currentUser, new NewsFeedSortStrategy());
        const newsFeedItems = newsFeed.getNewsFeed();
        console.log(newsFeedItems)
        promptUser()
        break;


      case 'exit':
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