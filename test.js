const User = require('./models/User')
const Session = require('./models/Session')

const { Command } = require("commander")
const program = new Command()

program
  .name("newsfeed cli")
  .description("A demo social media newsfeed cli")
  .version("1.0.0")

program
  .command("login")
  .description("login with username and password")
  .action(() => {
    console.log("It works")
  })

program.parse()

// Session.login("percy123", "1234")
// Session.currentSession.follow("Tormund")
// Session.currentSession.postItem("Just setting up my app")
// Session.currentSession.upvotePost(1)
// Session.currentSession.comment
