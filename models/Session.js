const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment')

const { getUserByUsername, supabase, findUserByUsernameAndPassword } = require('../utils')

class Session {

  static currentSession = null;

  constructor(user) {
    this.user = user

    this.newsfeed = [];

  }

  static async login(username, password) {

    const user = await findUserByUsernameAndPassword(username, password)

    if (user) {
      // set the session
      Session.currentSession = new Session(user);
      // this.isLoggedin = true
      console.log(`User ${username} logged in successfully`)
    } else {
      console.error(`Invalid username or password.`);
    }
  }

  static logout() {
    // this.isLoggedIn = false;
    Session.currentSession = null;
    console.log(`User logged out successfully.`);
  }

  // signup static method
  static async signup(username, password) {

    if (Session.currentSession !== null) {

      console.log(`User ${this.user.username} is already logged in.`);

      return;

    }

    //if the username available, then create a user.
    const usernameExists = await getUserByUsername(username)
    if (usernameExists) {
      throw new Error(username + 'is already taken')
    }



    const newUser = new User(username, password);

    const { insertError } = await supabase
      .from('users')
      .insert(newUser)

    // insert user data into the table

    if (insertError) {
      throw new Error(insertError.message)
    }




    // newUser.signup();

    console.log(`User ${username} has been created successfully.`);

    Session.login(username, password)

    return;



  }

  async follow(username) {
    if (Session.currentSession) {

      // Get the current user's ID
      // const { user } = await supabase.auth.user();
      const currentUserId = Session.currentSession.user.id;

      // Get the ID of the user being followed
      const { data: users, error } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      const userId = users.id;

      // Insert a new row into the followers table
      const { error: insertError } = await supabase
        .from('follows')
        .insert({ follower_id: currentUserId, followee_id: userId });

      if (insertError) {
        console.error(insertError);
        return;
      }

      console.log(`You are now following ${username}.`);
    } else {
      console.log(`You are not logged in.`);
    }


  }

  unfollow(username) {
    if (this.isLoggedin) {
      const userToUnfollow = User.users.find(user => user.username === username);
      if (userToUnfollow) {
        this.user.unfollow(userToUnfollow);
      } else {
        console.error(`Could not find user ${username} to unfollow.`);
      }
    } else {
      console.error('User is not logged in.');
    }
  }
  // postItem to the wall
  async postItem(title, content) {

    if (Session.currentSession !== null) {

      const authorId = Session.currentSession.user.id;


      const { data, error } = await supabase.from('posts').insert({ user_id: authorId, title: title, text: content });

      if (error) {
        // throw new Error(error.message);
        console.log(error.message);
        return
      }

      console.log(`User ${this.user.username} posted: ${title}`);



    } else {
      console.error('User not logged in');

    }
  }

  // upvote post
  upvotePost(postId) {
    const post = this.newsfeed.find((post) => post.id === postId)
    // const currentUser = this.user.username
    if (Session.currentSession) {
      if (post.downvotedUsers.includes(this.user.username)) {
        //user has already downvoted, remove their downvote
        const index = post.downvotedUsers.indexOf(this.user.username);

        post.downvotedUsers.splice(index, 1);
      }






      if (!post.upvotedUsers.includes(this.user.username)) {
        post.upvotedUsers.push(this.user.username);
        post.upvote()
        console.log(`User ${this.user.username} upvoted the post with ID ${post.id}`);
      } else {
        console.log(`User ${this.user.username} already upvoted the post with ID ${post.id}`);
      }
      // post.upvote();

    } else {
      console.error("User not logged in lalal");
    }
    // console.log(post.upvotedUsers);
  }

  // downvote post
  downvotePost(postId) {
    const post = this.newsfeed.find((post) => post.id === postId)




    if (Session.currentSession) {

      if (post.downvotedUsers.includes(this.user.username)) {
        //user has already downvoted, remove their downvote
        const index = post.downvotedUsers.indexOf(this.user.username);
        post.downvotedUsers.splice(index, 1);
      }

      // post.downvote();
      if (!post.downvotedUsers.includes(this.user)) {
        post.downvotedUsers.push(this.user);
        post.downvote();
        console.log(`User ${this.user.username} downvoted the post with ID ${post.id}`);
      } else {
        console.log(`User ${this.user.username} already downvoted the post with ID ${post.id}`);
      }

    } else {
      console.error("User not logged in");
    }
  }
  // add comment to a post
  comment(postId, reply) {
    const post = this.newsfeed.find((post) => post.id === postId)
    if (Session.currentSession) {
      // post.comments.push(reply);
      const newComment = new Comment(reply, this.user, postId);
      post.addComment(newComment);
      console.log(`User ${this.user.username} commented on the post with ID ${post.id}`);
    } else {
      console.error("User not logged in");
    }
  }

  // reply to a comment on a post
  addReply(commentId, replyText, postId) {
    if (!Session.currentSession) {
      console.log("You must be logged in to reply to a comment");
      return;
    }
    const currentUser = Session.currentSession.user;
    // const comment = this.comments.find((c) => c.id === commentId);
    const post = this.newsfeed.find(post => post.id === postId);
    const comment = post.comments.find(comment => comment.id === commentId);
    if (!comment) {
      console.log(`Comment with id ${commentId} not found`);
      return;
    }
    const reply = new Comment(replyText, currentUser, commentId);

    // comment.addReply(reply.text);
    comment.replies.push(reply);
    console.log(`${reply.text} added to comment with id ${commentId}`);
  }

  // upvote a comment
  upvoteComment(commentId, postId) {
    const post = this.newsfeed.find(post => post.id === postId);
    const comment = post.comments.find(comment => comment.id === commentId);
    if (Session.currentSession) {
      if (comment.downvotedUsers.includes(this.user.username)) {
        //user has already downvoted, remove their downvote
        const index = comment.downvotedUsers.indexOf(this.user.username);
        comment.downvotedUsers.splice(index, 1);
      }



      if (!comment.upvotedUsers.includes(this.user.username)) {
        comment.upvotedUsers.push(this.user.username);
        comment.upvote();
        console.log(`User ${this.user.username} upvoted the comment with ID ${comment.id}`);
      } else {
        console.log(`User ${this.user.username} already upvoted the comment with ID ${comment.id}`);
      }

    } else {
      console.error("User not logged in");
    }
  }

  // downvote a comment
  downvoteComment(commentId, postId) {
    const post = this.newsfeed.find(post => post.id === postId);
    const comment = post.comments.find(comment => comment.id === commentId);
    if (Session.currentSession) {
      if (comment.upvotedUsers.includes(this.user.username)) {
        //user has already upvoted, remove their upvote
        const index = comment.upvotedUsers.indexOf(this.user.username);
        comment.upvotedUsers.splice(index, 1);
      }



      if (!comment.downvotedUsers.includes(this.user.username)) {
        comment.downvotedUsers.push(this.user.username);
        comment.downvote();
        console.log(`User ${this.user.username} downvoted the comment with ID ${comment.id}`);
      } else {
        consol.log(`User ${this.user.username} already downvoted the comment with ID ${comment.id}`);
      }
    } else {
      console.error("User not logged in")
    }
  }





  //get news feed sorted by some properties
  // we are using default params

  getNewsFeed(sortBy = "mostRecent") {
    if (Session.currentSession) {
      const sortedFeed = this.newsfeed.sort((a, b) => {
        if (sortBy === "mostRecent") {
          return b.timestamp - a.timestamp;
        } else if (sortBy === "mostUpvoted") {
          return b.upvotedUsers.length - a.upvotedUsers.length;
        } else if (sortBy === "mostCommented") {
          return b.comments.length - a.comments.length;
        }
      });
      console.log(`News feed for user ${this.user.username} sorted by ${sortBy}`)
      sortedFeed.forEach(post => console.log(post))
    } else {
      console.error("User not logged in");
    }
  }


  // static method for is Username Available


}
module.exports = Session;




