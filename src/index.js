// External libraries
import { GraphQLServer } from "graphql-yoga";
import { v4 as uuidv4 } from "uuid";

// Internal
import { customIncludes } from "./common";

// ----------- Demo data -----------
const posts = [
  {
    id: "1",
    title: "iphone SE is the best",
    body: "The reason is because it is fit in a hand.",
    published: false,
    author: "1",
  },
  {
    id: "2",
    title: "Greens are great",
    body: "Greens has positive influences physically and mentally",
    published: false,
    author: "1",
  },
  {
    id: "3",
    title: "Bose is the king!",
    body: "Without the headphone, I cannot work",
    published: false,
    author: "2",
  },
  {
    id: "4",
    title: "Dummy title 4",
    body: "This is the body of dummy title 4!",
    published: false,
    author: "1",
  },
  {
    id: "5",
    title: "Dummy title 5",
    body: "This is the body of dummy title 5!",
    published: false,
    author: "3",
  },
];

const users = [
  {
    id: "1",
    name: "Takuya Kikuchi",
    email: "takuya@gmail.com",
    age: 30,
  },
  {
    id: "2",
    name: "Fumiko Kikuchi",
    email: "fumiko@gmail.com",
    age: 29,
  },
  {
    id: "3",
    name: "Hiroshi Yoshida",
    email: "hiroshi@gmail.com",
  },
];

const comments = [
  {
    id: "1",
    text: "This is a comment.",
    author: "1",
    post: "1",
  },
  {
    id: "2",
    text: "The chime just ringed.",
    author: "1",
    post: "1",
  },
  {
    id: "3",
    text: "Dinner tonight is curry.",
    author: "1",
    post: "3",
  },
  {
    id: "4",
    text: "Excellent!",
    author: "3",
    post: "4",
  },
];

// ----------- Type definition(Schema) -----------
const typeDefs = `
  type Query {
    comment: Comment!
    post: Post!
    user: User!
    comments: [Comment!]!
    posts(query: String): [Post!]!
    users(query: String): [User!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
    createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
    createComment(text: String!, author: ID!, post: ID!): Comment!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }
`;

// ------------- Resolver(function) ----------------
const resolvers = {
  Query: {
    comments(parent, args, ctx, info) {
      return comments;
    },

    posts(parent, args, ctx, info) {
      if (!args.query) return posts;

      return posts.filter((post) => {
        return (
          customIncludes(post.title, args.query) ||
          customIncludes(post.body, args.query)
        );
      });
    },

    users(parent, args, ctx, info) {
      if (!args.query) return users;
      return users.filter((user) => {
        return customIncludes(user.name, args.query);
      });
    },
  },

  Mutation: {
    // Create New User
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => user.email === args.email);

      if (emailTaken) {
        throw new Error("Email already taken.");
      }

      const user = {
        id: uuidv4(),
        ...args,
      };

      users.push(user);
      return user;
    },

    // Create New Post
    createPost(parent, args, ctx, info) {
      const userExist = users.some((user) => user.id === args.author);

      if (!userExist) {
        throw new Error("User doesn't exist.");
      }

      const post = {
        id: uuidv4(),
        ...args,
      };

      posts.push(post);
      return post;
    },

    // Create New Comment
    createComment(parent, args, ctx, info) {
      const userExist = users.some((user) => user.id === args.author);
      const postExist = posts.some(
        (post) => post.id === args.post && post.published
      );

      if (!userExist) {
        throw new Error("User doesn't exist.");
      } else if (!postExist) {
        throw new Error("Post doesn't exist or not published.");
      }

      const comment = {
        id: uuidv4(),
        ...args,
      };

      comments.push(comment);
      return comment;
    },
  },

  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return post.id === parent.post;
      });
    },
  },

  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id;
      });
    },
  },

  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id;
      });
    },
  },
};

// -------------- Server -----------------
const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log("The server is up!");
});
