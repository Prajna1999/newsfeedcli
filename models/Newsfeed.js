const { supabase } = require('../utils')


class SortingStrategy {
  sort(posts) {
    throw new Error("Not Implemented");
  }
}

// sorting strategies
class SortByFollowedUsers extends SortingStrategy {
  constructor(followedUsers) {
    super();
    this.followedUsers = followedUsers;
  }

  sort(posts) {
    return posts.sort((a, b) => {
      const aFollowed = this.followedUsers.includes(a.user_id) ? 1 : 0;
      const bFollowed = this.followedUsers.includes(b.user_id) ? 1 : 0;
      return bFollowed - aFollowed
    });
  }
}
class SortByScore extends SortingStrategy {
  sort(posts) {
    return posts.sort((a, b) => b.score - a.score)
  }
}

class SortByNumberOfComments extends SortingStrategy {
  sort(posts) {
    return posts.sort((a, b) => b.comments.length - a.comments.length);
  }
}

class SortByTimestamp extends SortingStrategy {
  sort(posts) {
    return posts.sort((a, b) => new Date(b.created_at) - new Data(a.created_at))
  }
}

function getNewsFeed(strategyName, posts, followedUsers) {
  let sortedPost;

  switch (strategyName) {
    case "followedusers":
      sortedPosts = new SortByFollowedUsers(followedUsers).sort(posts);
      break;
    case "score":
      sortedPosts = new SortByScore().sort(posts);
      break;
    case "comments":
      sortedPosts = new SortByNumberOfComments().sort(posts);
      break;
    case "timestamp":
      sortedPosts = new SortByTimestamp().sort(posts);
      break;
    default:
      throw new Error("Invalid Strategy name");
  }

  console.log(sortedPosts)
}

async function fetchPosts() {
  const { data: posts, error } = await supabase.from('posts').select('*');
  if (error) throw error;
  return posts;
}
//fetch data from supabase db
async function fetchFollowedUsers(userId) {
  const { data: follows, error } = await supabase
    .from('follows')
    .select('followee_id')
    .eq('follower_id', userId);
  if (error) throw error;
  return follows.map(follow => follow.followee_id);
}

async function fetchPostVotes() {
  const { data: postVotes, error } = await supabase.from('postvote').select('*');
  if (error) throw error;
  return postVotes;
}

async function fetchComments() {
  const { data: comments, error } = await supabase.from('comments').select('*');
  if (error) throw error;
  return comments;
}
module.exports = { getNewsFeed, fetchFollowedUsers, fetchPostVotes, fetchComments, fetchPosts }