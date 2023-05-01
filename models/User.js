class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.following = [];
    this.post = []
  }

  signup() {
    // validate username and password
    if (this.username && this.password) {
      // check if username is unique
      if (User.isUsernameAvailable(this.username)) {
        // create new user account
        User.users.push(this);
        console.log(`User ${this.username} has been created successfully.`);
      } else {
        console.error(`Username ${this.username} is already taken.`);
      }
    } else {
      console.error('Please provide a valid username and password.');
    }
  }

  login() {
    // find user account by username and password
    const user = User.findUserByUsernameAndPassword(this.username, this.password);
    if (user) {
      // console.log(`Welcome back, ${user.username}!`);
      return user;
    } else {
      // console.error('Invalid username or password.');
      return null;
    }
  }

  follow(user) {
    // check if user is already being followed
    if (this.following.includes(user)) {
      console.log(`${this.username} is already following ${user.username}.`);
    } else {
      // add user to following list
      this.following.push(user);
      console.log(`${this.username} is now following ${user.username}.`);
    }
  }

  unfollow(user) {
    // check if user is being followed
    const index = this.following.indexOf(user);
    if (index >= 0) {
      // remove user from following list
      this.following.splice(index, 1);
      console.log(`${this.username} has unfollowed ${user.username}.`);
    } else {
      console.log(`${this.username} is not following ${user.username}.`);
    }
  }

  static isUsernameAvailable(username) {
    // check if username is unique among all users
    return !User.users.some(user => user.username === username);
  }

  static findUserByUsernameAndPassword(username, password) {
    // find user account by matching username and password
    return User.users.find(user => user.username === username && user.password === password);
  }
}

// static variable to keep track of all users
User.users = [new User("percy123", "1234"), new User("Meg1234", "1234")];
module.exports = User;