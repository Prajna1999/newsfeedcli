

class Post {
  static idCounter = 0
  constructor(text, author) {
    this.id = ++Post.idCounter;
    this.text = text;
    this.timestampt = new Date();
    this.upvotes = 0;
    this.downvotes = 0;
    this.upvotedUsers = []
    this.downvotedUsers = [];

    this.comments = [];
    this.author = author;
  }

  upvote() {
    this.upvotes++;

  }
  downvote() {
    this.downvote++
  }

  addComment(comment) {
    this.comments.push(comment);

  }


}
module.exports = Post;