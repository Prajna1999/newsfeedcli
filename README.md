# Social Media CLI Tool (First look-this is a live document. I keep adding things while I optimize my code)

Social Media CLI Tool is a powerful command-line interface built with Node.js, allowing users to interact with their social media account for actions like following, posting, upvoting, and downvoting directly from the terminal.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Commands](#commands)
  - [follow](#follow)
  - [post](#post)
  - [upvote](#upvote)
  - [downvote](#downvote)
  -and others (write later)
- [Options](#options)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Installation

Before you can use the Social Media CLI Tool, make sure you have Node.js (version 14.0 or higher) and npm (version 7.0 or higher) installed on your system. You can check your installed versions by running:

or you can use directly from replit link on the top right coner.
```sh
node -v
npm -v

To install the Social Media CLI Tool globally, run the following command:

npm install -g newsfeed_cli

Usage

To use the Social Media CLI Tool, run the following command in your terminal:

node index.js

## Commands

follow

Follow another user.

Usage:

login --username <username> --password <password>

or signup --username <username> --password <password>

then on your commnd prompt

follow <username>

post

Create a new post.

Usage:



s post <message>

upvote

Upvote a post by its ID.

Usage:



 upvote <post_id>

downvote

Downvote a post by its ID.

Usage:



 downvote <post_id>

Options

    --help: Display help information for the CLI tool and its commands.
    -

2. Examples

Here are some example commands to help you get started with the Social Media CLI Tool:

Follow a user with the username john_doe:

    

 follow john_doe

Create a new post with the message "Hello, world!":


post <title> Hello world

Upvote a post with the ID 12345:


upvote 12345

Downvote a post with the ID 67890:



downvote 67890

Show All users

showallusers

Comment on a post.

comment <postid> Your comment


## Contributing

Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests.
License

This project is licensed under the MIT License - see the LICENSE.md file for details.
