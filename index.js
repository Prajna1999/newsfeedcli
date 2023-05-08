const Session = require('./models/Session')

const { timeAgo } = require('./utils.js');
const {
  getNewsFeed,
  fetchPosts,
  fetchFollowedUsers,
  fetchPostVotes,
  fetchComments


} = require('./models/Newsfeed')



const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// write the function showNewsFeed

async function showNewsFeed() {
  try {
    const userId = Session.currentSession.user.id;
    const posts = await fetchPosts();
    const followedUsers = await fetchFollowedUsers(userId);
    const postVotes = await fetchPostVotes();
    const comments = await fetchComments();

    // Add comments and score to each post
    posts.forEach(post => {
      post.comments = comments.filter(comment => comment.post_id === post.id);
      post.score = postVotes.reduce(
        (score, vote) =>
          vote.post_id === post.id
            ? score + (vote.vote_type === 'UPVOTE' ? 1 : -1)
            : score,
        0
      );
      console.log(`${post.title}- ${post.text} - ${timeAgo(post.created_at)}`)

    });

    const strategyName = await prompt('Enter strategy name (followedusers, score, comments, timestamp): ');

    // Call getNewsFeed() function from the previous example
    getNewsFeed(strategyName, posts, followedUsers);

    // rl.close();
    promptUser()
  } catch (error) {
    console.error('Error fetching data:', error.message);
    // rl.close();
    promptUser()
  }
}

function promptUser() {

  console.log("\n");
  console.log("FOLLOWING COMMANDS ARE AVAILABLE");
  console.log("'signup --username <username> --password <password>' Create a new user")
  console.log("'login --username <username> --password <password>' Login an existing user");
  console.log("'follow <username>' Follow a user");
  console.log("'unfollow <username>' Unfollow a user");
  console.log("'post <title_text> <content_text>")
  console.log(" 'upvote <post_id>' Upvote a post");
  console.log("'downvote <post_id>' a post");
  console.log("'upvoteComment <comment_id>' Upvote a comment");
  console.log("'downvoteComment <comment_id>' Downvote a comment");
  console.log("'comment <post_id>' comment on a post")
  console.log("'reply <comment_id> <text>' Reply on a comment")

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



        Session.login(username, password)
        promptUser()
        break;
      case 'signup':



        Session.signup(username, password)

        promptUser()

        break;
      case 'follow':

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
      case "shownewsfeed":
        showNewsFeed();
        break;
      case 'logout':
        Session.logout();

        process.exit(0);





      case 'exit':
        process.exit(0);

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





promptUser()