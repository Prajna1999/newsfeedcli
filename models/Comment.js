class Comment {
  
  constructor(post_id, parent_id, user_id, content) {
    this.post_id=post_id;
    this.parent_id=parent_id;
    this.user_id=user_id;
    this.content=content;
    
  }

  
}
module.exports = Comment;