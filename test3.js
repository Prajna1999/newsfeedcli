const User = require('./models/User');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// import Session class
const Session = require('./models/Session');
// users array

console.log("Welcome to our social media app!");
function promptShowAllUsers() {
  Session.currentSession.users.forEach((user) => console.log(user.username));

  promptMainMenu()
}
function promptLogin() {
  rl.question("Please enter your username: ", (username) => {
    rl.question("Please enter your password: ", (password) => {
      Session.login(username, password);
      promptMainMenu();
    });
  });
}

function promptSignup() {
  rl.question("Please enter your desired username: ", (username) => {
    rl.question("Please enter your desired password: ", (password) => {
      Session.signup(username, password);
      promptMainMenu();
    });
  });
}

function promptPostItem() {
  rl.question("What's on your mind? ", (content) => {
    Session.currentSession.postItem(content);
    promptMainMenu();
  });
}

function promptComment() {
  rl.question("Enter the ID of the post you want to comment on: ", (postId) => {
    rl.question("Enter your comment: ", (comment) => {
      Session.currentSession.comment(postId, comment);
      promptMainMenu();
    });
  });
}

function promptReply() {
  rl.question("Enter the ID of the comment you want to reply to: ", (commentId) => {
    rl.question("Enter your reply: ", (reply) => {
      rl.question("Enter the ID of the post the comment belongs to: ", (postId) => {
        Session.currentSession.addReply(commentId, reply, postId);
        promptMainMenu();
      });
    });
  });
}

function promptFollow() {
  rl.question("Enter the username of the user you want to follow: ", (username) => {
    Session.currentSession.follow(username);
    promptMainMenu();
  });
}

function promptUnfollow() {
  rl.question("Enter the username of the user you want to unfollow: ", (username) => {
    Session.currentSession.unfollow(username);
    promptMainMenu();
  });
}

function promptUpvotePost() {
  rl.question("Enter the ID of the post you want to upvote: ", (postId) => {
    Session.currentSession.upvotePost(postId);
    promptMainMenu();
  });
}

function promptDownvotePost() {
  rl.question("Enter the ID of the post you want to downvote: ", (postId) => {
    Session.currentSession.downvotePost(postId);
    promptMainMenu();
  });
}

function promptUpvoteComment() {
  rl.question("Enter the ID of the comment you want to upvote: ", (commentId) => {
    rl.question("Enter the ID of the post the comment belongs to: ", (postId) => {
      Session.currentSession.upvoteComment(commentId, postId);
      promptMainMenu();
    });
  });
}

function promptGetNewsFeed() {
  Session.currentSession.getNewsFeed();
  promptMainMenu()
}
function promptMainMenu() {
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

  rl.question("Please enter your choice: ", (choice) => {
    switch (choice) {
      case "0":
        console.log("Here comes your newsfeed.")
        promptGetNewsFeed()
        break;
      case "1":
        console.log("You selected 'Post an item'");
        promptPostItem()
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
        promptDownvotePost()
        break;
      case "8":
        console.log("You selected 'Upvote a comment'");
        break;
      case "9":
        // console.log("You selected 'Logout'");
        promptSignup()
        // promptMainMenu()
        break;
      case "10":
        // console.log("You selected 'Logout'");
        promptShowAllUsers()
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
    // login();
    promptLogin()
  } else {
    // signup();
    promptSignup()
  }
});

