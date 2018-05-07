const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const Sequelize = require('sequelize');

// Load db from postgres
const sequelize = new Sequelize('HyperChat', 'postgres', 'root', {
  host: 'localhost',
  dialect: 'postgres',
  operatorsAliases: false,
});

// Definition of our messages from pg
const messages = sequelize.define('message', {
  message: Sequelize.STRING//,
});

// testing purpose
messages.create({
  message: "message"
});

// the GraphQL schema in string form
const typeDefs = `
  type Message {
    id: Int!
    message: String
    createdAt: String!
  }

  type Query {
    messages: [Message!]
  }


  type Mutation {
    post(msg: String!): Message!
    toto(t:Int): String
  }


`;

// The resolvers
const resolvers = {

  Query: {
    messages() {
      return messages.findAll();
    }
  },

  Mutation: {
    post:function (msg) {
      return messages.create({
        message: msg
      });
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
