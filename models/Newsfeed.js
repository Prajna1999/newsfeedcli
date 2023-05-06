const { supabase } = require('../utils')


class NewsFeedSortStrategy {
  sort(newsItems) {
    // Default implementation sorts by timestamp
    return newsItems.sort((a, b) => b.timestamp - a.timestamp);
  }
}

class FollowedUsersSortStrategy extends NewsFeedSortStrategy {
  constructor(followedUserIds) {
    super();
    this.followedUserIds = followedUserIds;
  }

  sort(newsItems) {
    const followedUserPosts = newsItems.filter((item) =>
      this.followedUserIds.includes(item.userId)
    );
    const nonFollowedUserPosts = newsItems.filter(
      (item) => !this.followedUserIds.includes(item.userId)
    );
    const sortedFollowedUserPosts = super.sort(followedUserPosts);
    const sortedNonFollowedUserPosts = super.sort(nonFollowedUserPosts);
    return [...sortedFollowedUserPosts, ...sortedNonFollowedUserPosts];
  }
}

class ScoreSortStrategy extends NewsFeedSortStrategy {
  sort(newsItems) {
    return newsItems.sort(
      (a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
    );
  }
}

class CommentCountSortStrategy extends NewsFeedSortStrategy {
  sort(newsItems) {
    return newsItems.sort((a, b) => b.commentCount - a.commentCount);
  }
}

class NewsFeed {
  constructor(currentUser, sortStrategy) {
    this.currentUser = currentUser;
    this.sortStrategy = sortStrategy;
  }

  async getNewsFeed() {
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id) as comment_count,
        (SELECT COUNT(*) FROM postvote WHERE postvote.post_id = posts.id AND postvote.vote_type = 'UPVOTE') as upvotes,
        (SELECT COUNT(*) FROM postvote WHERE postvote.post_id = posts.id AND postvote.vote_type = 'DOWNVOTE') as downvotes
      `)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching news feed:', error.message);
      return [];
    }

    const sortedPosts = this.sortStrategy.sort(posts);
    return sortedPosts;
  }

  setSortStrategy(sortStrategy) {
    this.sortStrategy = sortStrategy;
  }
}


module.exports = { NewsFeed, NewsFeedSortStrategy, CommentCountSortStrategy, FollowedUsersSortStrategy, ScoreSortStrategy }