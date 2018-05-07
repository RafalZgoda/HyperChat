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
  userHash: Sequelize.STRING
});


// testing purpose (and table creation if not defined)
sequelize.sync()
  .then(() => Messages.create({
    message: "message",
    userHash: sha256("secret")
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
    messages(since: Int): [Message!]
  }

  type Mutation {
    post(msg: String!, secret: String): Message!
  }
`;

// The resolvers
const resolvers = {

  Query: {
    messages: function(root, {since}) {
    //  var lastId = Messages.get(since)
    //  console.log(lastId)
      return Messages.findAll({
        where: {
          id: {
            [Op.gte]: since,
          }
        }
      });
    }
  },

  Mutation: {
    post:function (root, {msg, secret}) {
      Messages.create({
        message: msg,
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
