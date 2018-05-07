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
Add queries :

query getMessages{
	getMessages(roomName:"42",since:1){
    id
    createdAt
    message
    roomName
    userHash
  }
}

mutation post($msg: String!,$room: String!, $secret: String) {
	post(msg:$msg, roomName:$room, secret:$secret) {
    message
    userHash
    roomName
 	}
}


query getRooms{
	getRooms{
		name
    numberOfMessages
  }
}


```

# Variable

```

{
  "msg": "Query Graphiql",
  "room": "42",
  "secret": "public"
}


```
