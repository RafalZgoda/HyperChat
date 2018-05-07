# HyperChat
HyperChat is a very simple chat API that allows anyone to chat with people across the world. It is just an API, we want to let people build their own client on top of it


# Installation

```

Install NodeJS > 7
Install Postgresql and create table HyperChat
npm install
node server.js
Open http://localhost:3000/graphiql
Add queries like :

query messages{
	messages{
    id
    message
    createdAt
  }
}


mutation post{
      post(message: "test message !") {
        message
      }

}


```
