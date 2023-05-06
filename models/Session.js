const User = require('./User');
// const Post = require('./Post');
// const Comment = require('./Comment')


const { getUserByUsername, supabase, findUserByUsernameAndPassword } = require('../utils')

class Session {

  static currentSession = null;

  constructor(user) {
    this.user = user



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
            console.log("You have already upvoted", postId);
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
            console.log("You have already downvoted", postId);
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
  async comment(postId, text) {

    if (Session.currentSession) {
      const userId = this.user.id
      try {
        await supabase.from('comments').insert({ post_id: postId, content: text, parent_id: postId, user_id: userId }).select();
        console.log('Comment added successfully:', text);
      } catch (error) {
        console.error('Error adding comment:', error.message);
      }

    } else {
      console.error("User not logged in");
    }
  }

  // reply to a comment on a post
  async reply(commentId, text) {

    if (Session.currentSession) {
      const userId = this.user.id
      try {
        // Check if the comment exists
        const { data: comment, error: commentError } = await supabase
          .from('comments')
          .select('*')
          .eq('id', commentId)
          .single();

        if (commentError || !comment) {
          throw new Error(`Error fetching comment with id ${commentId}: ${commentError}`);
        }

        // Insert the reply comment
        const { data: reply, error: replyError } = await supabase
          .from('comments')
          .insert({ post_id: comment.post_id, content: text, parent_id: commentId, user_id: userId })
          .select();

        if (replyError || !reply) {
          throw new Error(`Error creating reply comment: ${replyError}`);
        }

        console.log(`Reply added successfully: ${reply[0].content}`);
      } catch (error) {
        console.error('Error replying to comment:', error.message);
      }





    } else {
      console.log("User not logged in");
    }

  }


  // upvote a comment
  async upvoteComment(commentId) {
    try {
      const userId = this.user.id
      const { data: existingVote, error } = await supabase
        .from('comment_votes')
        .select('vote_type')
        .eq('comment_id', commentId)
        .eq('user_id', userId)
        .single();

      if (error && error.message !== 'No single row found') {
        throw error;
      }

      if (existingVote) {
        if (existingVote.vote_type === 'UPVOTE') {
          return; // user has already upvoted
        }

        await supabase
          .from('comment_votes')
          .update({ vote_type: 'UPVOTE' })
          .eq('comment_id', commentId)
          .eq('user_id', userId);
      } else {
        await supabase.from('comment_votes').insert({ comment_id: commentId, user_id: userId, vote_type: 'UPVOTE' });
      }
    } catch (error) {
      console.error('Error upvoting comment:', error.message);
      return
    }
    console.log(`You upvoted comment ${commentId}`);
  }

  async downvoteComment(commentId) {
    try {
      const userId = this.user.id
      const { data: existingVote, error } = await supabase
        .from('comment_votes')
        .select('vote_type')
        .eq('comment_id', commentId)
        .eq('user_id', userId)
        .single();

      if (error && error.message !== 'No single row found') {
        throw error;
      }

      if (existingVote) {
        if (existingVote.vote_type === 'DOWNVOTE') {
          return; // user has already downvoted
        }

        await supabase
          .from('comment_votes')
          .update({ vote_type: 'DOWNVOTE' })
          .eq('comment_id', commentId)
          .eq('user_id', userId);
      } else {
        await supabase.from('comment_votes').insert({ comment_id: commentId, user_id: userId, vote_type: 'DOWNVOTE' });
      }
    } catch (error) {
      console.error('Error downvoting comment:', error.message);
      return
    }
    console.log(`You downvoted comment ${commentId}`);
  }







  // to see all users of the social media site.
  async getAllUsers() {
    if (Session.currentSession) {
      try {
        const { data: users, error } = await supabase
          .from('users')
          .select('id, username');

        if (error) {
          throw error;
        }

        // console.log(users);
        users.forEach((user) => console.log(`user_id: ${user.id} username: ${user.username}`))
      } catch (error) {
        console.error('Error getting all users:', error.message);
      }
    } else {
      console.log('User not loggedin')
    }
  }

  // show newsfeed
  //get news feed sorted by some properties

  async showNewsFeed(sortStrategy) {
    const newsFeedItems = await this.newsFeed.getNewsFeed(sortStrategy);
    console.log('News Feed:');
    newsFeedItems.forEach((item) => {
      console.log(`Post ID: ${item.id}`);
      console.log(`User: ${item.username}`);
      console.log(`Content: ${item.content}`);
      console.log(`Upvotes: ${item.upvotes}`);
      console.log(`Downvotes: ${item.downvotes}`);
      console.log(`Comment Count: ${item.commentCount}`);
      console.log(`Timestamp: ${item.timestamp}`);
      console.log('------------------------------------');
    });
  }

  setNewsFeedSortStrategy(sortStrategy) {
    this.newsFeed.setSortStrategy(sortStrategy);
  }
}
module.exports = Session;




