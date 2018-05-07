const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
var sha256 = require('js-sha256');


// Load db from postgres
const sequelize = new Sequelize('HyperChat', 'postgres', 'root', {
  host: 'localhost',
  dialect: 'postgres',
  operatorsAliases: false,
  alter: true,
});

// Definition of our messages from pg
const Messages = sequelize.define('messages', {
  message: Sequelize.STRING,
  roomName: Sequelize.STRING,
  userHash: Sequelize.STRING,
});


// testing purpose (and table creation if not defined)
sequelize.sync()
  .then(() => Messages.create({
    message: "Test Message ",
    roomName: "01",
    userHash: sha256("secret"),
  }))
  .then(m => {
    console.log(m.toJSON());
  });


// the GraphQL schema in string form
const typeDefs = `
  type Message {
    id: Int!
    message: String
    createdAt: String!
    userHash: String
    roomName: String
  }

  type Room {
    name: String
    numberOfMessages: Int
  }

  type Query {
    getMessages(roomName: String!, since: Int): [Message!]
    getRooms: [Room!]

  }

  type Mutation {
    post(msg: String!, roomName: String!, secret: String): Message!
  }
`;

// The resolvers
const resolvers = {

  Query: {
    getMessages: function(root, {roomName, since}) {
      return Messages.findAll({
        where: {
          id: {
            [Op.gte]: since,
          },
          roomName: roomName
        }
      });
    },
    getRooms: function() {
      return Messages.findAll({
        attributes: [['roomName', 'name'], [sequelize.fn('COUNT', 'Messages.id'), 'numberOfMessages']],
        group: ['name']
      })
    }
  },

  Mutation: {
    post:function (root, {msg, roomName, secret}) {
      Messages.create({
        message: msg,
        roomName: roomName,
        userHash: sha256(secret)
      });
      return msg
    },
  },
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});


// Initialize the app
const app = express();

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Start the server
app.listen(3000, () => {
  console.log('Go to http://localhost:3000/graphiql !');
});
