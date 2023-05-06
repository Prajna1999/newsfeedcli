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
    console.log(`User logged out successfully. Adios friend`);
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

    Session.currentSession = new Session(newUser)

    return;



  }

  async follow(username) {
    if (Session.currentSession) {

      // Get the current user's ID
      // const { user } = await supabase.auth.user();
      const currentUserId = Session.currentSession.user.id;
      try {
        const { data: followee } = await supabase
          .from("users")
          .select("*")
          .eq("username", username)
          .single();

        if (!followee) {
          console.log(`User ${username} does not exist.`);
          return;
        }

        // if already following
        const { data: existingFollow } = await supabase
          .from("follows")
          .select("*")
          .eq("follower_id", this.user.id)
          .eq("followee_id", followee.id)
          .single();

        if (existingFollow) {
          console.log(`You are already following ${username}.`);
          return;
        }

        const { error } = await supabase.from("follows").insert([
          {
            follower_id: this.user.id,
            followee_id: followee.id,
          },
        ]);

        if (error) {
          console.error(error);
        } else {
          console.log(`You are now following ${username}.`);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log(`You are not logged in.`);
    }



  }

  async unfollow(username) {
    if (Session.currentSession) {
      try {
        const { data: followee } = await supabase
          .from("users")
          .select("*")
          .eq("username", username)
          .single();

        if (!followee) {
          console.log(`User ${username} does not exist.`);
          return;
        }

        const { data: existingFollow } = await supabase
          .from("follows")
          .select("*")
          .eq("follower_id", this.user.id)
          .eq("followee_id", followee.id)
          .single();

        if (!existingFollow) {
          console.log(`You are not following ${username}.`);
          return;
        }

        // delete the entry in the follows table
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("id", existingFollow.id);

        if (error) {
          console.error(error);
        } else {
          console.log(`You have unfollowed ${username}.`);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('User is not logged in.');
    }
  }
  // postItem to the wall
  async postItem(title, content) {

    if (Session.currentSession !== null) {

      try {
        const authorId = Session.currentSession.user.id;



        const { error } = await supabase.from('posts').insert({ user_id: authorId, title: title, text: content });

        if (error) {
          // throw new Error(error.message);
          console.log(error.message);
          return
        }

        console.log(`User ${this.user.username} posted: ${content}`);

      } catch (error) {
        console.error("error posting item")
        return;
      }



    } else {
      console.error('User not logged in');

    }
  }

  // upvote post
  async upvotePost(postId) {
    // const post = this.newsfeed.find((post) => post.id === postId)
    // const currentUser = this.user.username
    const userId = this.user.id
    if (Session.currentSession) {
      // const currentUserId = Session.currentSession.user.id;
      try {
        if (!postId) {
          throw new Error('Invalid input: postId and userId are required');
        }

        const { data: existingVote } = await supabase
          .from('postvote')
          .select('vote_type')
          .eq('post_id', postId)
          .eq('user_id', userId)
          .single();

        if (existingVote) {
          if (existingVote.vote_type === 'UPVOTE') {
            return; // user has already upvoted
          }

          await supabase.from('postvote').update('vote_type', { vote_type: 'UPVOTE' }).eq('post_id', postId).eq('user_id', userId);
        } else {
          await supabase.from('postvote').insert({ post_id: postId, user_id: userId, vote_type: 'UPVOTE' });
        }
      } catch (error) {
        console.error('Error upvoting post:', error.message);
        return
      }
    } else {
      console.error("User not logged in lalal");
      return
    }
    console.log(`You upvoted post ${postId}`);

  }

  // downvote post
  async downvotePost(postId) {





    if (Session.currentSession) {

      // const currentUserId = Session.currentSession.user.id;
      const userId = this.user.id
      try {
        if (!postId) {
          throw new Error('Invalid input: postId and userId are required');
        }

        const { data: existingVote } = await supabase
          .from('postvote')
          .select('vote_type')
          .eq('post_id', postId)
          .eq('user_id', userId)
          .single();

        if (existingVote) {
          if (existingVote.vote_type === 'DOWNVOTE') {
            return; // user has already upvoted
          }

          await supabase.from('postvote').update('vote_type', { vote_type: 'DOWNVOTE' }).eq('post_id', postId).eq('user_id', userId);
        } else {
          await supabase.from('postvote').insert({ post_id: postId, user_id: userId, vote_type: 'DOWNVOTE' });
        }
      } catch (error) {
        console.error('Error downvoting post:', error.message);
        return
      }
    } else {
      console.error("User not logged in lalal");
      return
    }
    console.log(`You downvoted post ${postId}`);

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




