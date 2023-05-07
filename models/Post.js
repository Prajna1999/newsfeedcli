

class Post {

  constructor(userId, title, text) {
    this.userId = userId;
    this.title = title;
    this.text = text;
    this.comments = []
    this.upvotes = 0;
    this.downvotes = 0


  }




}
module.exports = Post;