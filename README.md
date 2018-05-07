# HyperChat
HyperChat is a very simple chat API that allows anyone to chat with people across the world. It is just an API, we want to let people build their own client on top of it


# Installation

```
Install NodeJS > 7
Install Postgresql and create table HyperChat
npm install
node server.js
Open http://localhost:3000/graphiql
```

# Query

```
Add queries like :

query Messages{
	messages(since:5){
    id
    message
    createdAt
    userHash
  }
}

mutation post($t: String!, $secret: String) {
 post(msg:$t, secret:$secret) {
  message	
  userHash
 }
}
```
