

class Post {
  // static idCounter = 0
  constructor(title, text, author) {
    // this.id = ++Post.idCounter;
    this.title=title;
    this.text = text;
    this.author = author;
    // this.upvotes = 0;
    // this.downvotes = 0;
    // this.upvotedUsers = []
    // this.downvotedUsers = [];

    // this.comments = [];
    
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