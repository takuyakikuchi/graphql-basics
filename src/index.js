// External libraries
import { GraphQLServer } from "graphql-yoga";

// Internal
import db from "./db";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Comment from "./resolvers/Comment";
import Post from "./resolvers/Post";
import User from "./resolvers/User";

// Server
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    Comment,
    Post,
    User,
  },
  context: {
    db,
  },
});

server.start(() => {
  console.log("The server is up!");
});
