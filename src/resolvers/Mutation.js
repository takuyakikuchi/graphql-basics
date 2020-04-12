import { v4 as uuidv4 } from "uuid";

const Mutation = {
  // Create New User
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some((user) => user.email === args.data.email);

    if (emailTaken) {
      throw new Error("Email already taken.");
    }

    const user = {
      id: uuidv4(),
      ...args.data,
    };

    db.users.push(user);
    return user;
  },

  // Delete User
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id === args.id);

    if (userIndex === -1) {
      throw new Error("User doesn't exist.");
    }

    // Delete User
    const deletedUsers = db.users.splice(userIndex, 1);

    // Delete related Posts & attached Comments
    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id;

      if (match) {
        // Delete comments attached to deleted post
        comments = comments.filter((comment) => post.id !== comment.id);
      }

      return !match;
    });

    // Delete User Comments
    db.comments = db.comments.filter((comment) => comment.author !== args.id);

    return deletedUsers[0];
  },

  // Create New Post
  createPost(parent, args, { db }, info) {
    const userExist = db.users.some((user) => user.id === args.data.author);

    if (!userExist) {
      throw new Error("User doesn't exist.");
    }

    const post = {
      id: uuidv4(),
      ...args.data,
    };

    db.posts.push(post);
    return post;
  },

  // Delete Post & appended Comments
  deletePost(parent, args, { db }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);

    if (postIndex === -1) {
      throw new Error("Post with the given ID doesn't exist.");
    }

    // Delete Post
    const deletedPosts = db.posts.splice(postIndex, 1);

    // Delete appended Comments
    db.comments = db.comments.filter((comment) => comment.post !== args.id);

    return deletedPosts[0];
  },

  // Create New Comment
  createComment(parent, args, { db }, info) {
    const userExist = db.users.some((user) => user.id === args.data.author);
    const postExist = db.posts.some(
      (post) => post.id === args.data.post && post.published
    );

    if (!userExist) {
      throw new Error("User doesn't exist.");
    } else if (!postExist) {
      throw new Error("Post doesn't exist or not published.");
    }

    const comment = {
      id: uuidv4(),
      ...args.data,
    };

    db.comments.push(comment);
    return comment;
  },

  // Delete Comment
  deleteComment(parent, args, { db }, info) {
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id
    );

    if (commentIndex === -1) {
      throw new Error("Comment with the given ID doesn't exist.");
    }

    return db.comments.splice(commentIndex, 1)[0];
  },
};

export { Mutation as default };
