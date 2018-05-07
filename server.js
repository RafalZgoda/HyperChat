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
  userHash: Sequelize.STRING,
  room: Sequelize.STRING,
});


// testing purpose (and table creation if not defined)
sequelize.sync()
  .then(() => Messages.create({
    message: "Test Message ",
    userHash: sha256("secret"),
    room: "01",
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
  }

  type Query {
    messages(room: String!, since: Int): [Message!]
  }

  type Mutation {
    post(msg: String!, room: String!, secret: String): Message!
  }
`;

// The resolvers
const resolvers = {

  Query: {
    messages: function(root, {room, since}) {
      return Messages.findAll({
        where: {
          id: {
            [Op.gte]: since,
          },
          room: room
        }
      });
    }
  },

  Mutation: {
    post:function (root, {msg, room, secret}) {
      Messages.create({
        message: msg,
        room: room, 
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
