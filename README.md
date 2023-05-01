Fix the upvote and downvote bug where an user can simultaneously upvote and downvote post



Design a News Feed

Your aim is to write a console program that can simulate a social network.
Users have the following capabilities (command to be used in [ - ]):
● [signup] A user can signup to the system
● [login] A user will be able to login to the system and the session will be created and used
across for the other commands. Any existing session will be reinitiated with the new user
logins.
● [post] A user can post a feed item.
● [follow] Users can follow other users.
● [reply] A user can comment on another user's feed item.
● [upvote/downvote] Upvote or downvote posts.
● [shownewsfeed] Any user can read his news feed. News items are sorted based on the
following (following options to sort feed by are available):
- Followed users: posts by followed users appear first.
- Score (= upvotes - downvotes): higher the better.
- The number of comments: higher the better.
- Timestamp: more recent the better.
● Allow users to comment on a comment and upvote/downvote a comment.
● Display time in language like 2m ago, 1 hr ago etc.
Input and output
The input should be taken in the form of commands input via the command line. The
statements should consist of commands and arguments. Commands can include ‘signup’,
‘newsfeed’, ‘upvote’ etc. Arguments can vary depending on the commands.
Example - reply(feed_id, reply_text)
Question 1: Class Diagram
Create a class diagram to fulfil the above given set of requirements. Ensure your class
diagram contains all entities required as well as mention classes around any design patterns
you may use in the system. Create the diagram on https://draw.io and share the URL via
submission form below. Ensure the link you share is visible in an incognito tab without
requiring any login.

Question 2: Schema Design
Create a schema design to fulfil the above given set of requirements. Ensure all
relationships are taken care of as well as mention the cardinality of relationship between
each pair of entities separately. Create the design on https://draw.io and share the URL via
submission form below. Ensure the link you share is visible in an incognito tab without
requiring any login.

Question 3: Machine Coding
Implement requirement 1, 2 above. Ensure you follow best practices of structuring your
codebase. Your codebase should be able to take inputs from the command line in the format
specified. The data can be persisted in memory or a real Database. You can write code in
any programming language. Please push the code to Github and share the repository URL
via submission form below. Ensure the link you share is visible in an incognito tab without
requiring any login.