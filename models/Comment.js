class Comment {
  static commentId = 0;
  constructor(text, user, postId) {
    this.id = ++Comment.commentId;
    this.text = text;
    this.timestamp = new Date();
    this.upvotes = 0;
    this.downvotes = 0;
    this.user = user.username;
    this.postId = postId;
    this.replies = [];
    this.upvotedUsers=[];
    this.downvotedUsers=[];
  }

  upvote() {
    this.upvotes++;
  }

  downvote() {
    this.downvotes++;
  }

  // addReply(reply) {
  //   // const reply = new Comment(text, user, feed_item);
  //   this.replies.push(reply);
  // }
}
module.exports = Comment;