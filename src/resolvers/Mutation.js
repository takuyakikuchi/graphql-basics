import { v4 as uuidv4 } from "uuid";

const Mutation = {
  // --------------------- User ---------------------
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

  // Update User
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;

    const user = db.users.find((user) => user.id === id);

    if (!user) {
      throw new Error("User with given ID doesn't exist.");
    }

    if (typeof data.name === "string") {
      user.name = data.name;
    }

    if (typeof data.email === "string") {
      const emailExist = db.users.some((user) => user.email === data.email);
      if (emailExist) {
        throw new Error("The given email is already taken.");
      }

      user.email = data.email;
    }

    if (typeof data.age !== "undefined") {
      user.age = data.age;
    }

    return user;
  },

  // --------------------- Post ---------------------
  // Create New Post
  createPost(parent, args, { db, pubsub }, info) {
    const userExist = db.users.some((user) => user.id === args.data.author);

    if (!userExist) {
      throw new Error("User doesn't exist.");
    }

    const post = {
      id: uuidv4(),
      ...args.data,
    };

    db.posts.push(post);

    if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: post,
        },
      });
    }

    return post;
  },

  // Delete Post & appended Comments
  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);

    if (postIndex === -1) {
      throw new Error("Post with the given ID doesn't exist.");
    }

    // Delete Post
    const [deletedPost] = db.posts.splice(postIndex, 1);

    // Delete appended Comments
    db.comments = db.comments.filter((comment) => comment.post !== args.id);

    if (deletedPost) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: deletedPost,
        },
      });
    }

    return deletedPost;
  },

  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const post = db.posts.find((post) => post.id === id);
    const originalState = { ...post };
    let mutation = "UPDATED";

    if (!post) {
      throw new Error("Post with given ID doesn't exist.");
    }

    if (typeof data.title === "string") {
      post.title = data.title;
    }

    if (typeof data.body === "string") {
      post.body = data.body;
    }

    if (typeof data.published === "boolean") {
      post.published = data.published;
      // published false => true
      if (post.published && !originalState.published) {
        mutation = "CREATED";
      }
      // published true => false
      else if (!post.published && originalState.published) {
        mutation = "DELETED";
      }
    }

    if (post) {
      pubsub.publish("post", {
        post: {
          mutation,
          data: post,
        },
      });
    }

    return post;
  },

  // --------------------- Comment ---------------------
  // Create New Comment
  createComment(parent, args, { db, pubsub }, info) {
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

    if (comment) {
      db.comments.push(comment);
      pubsub.publish(`comment ${args.data.post}`, {
        comment: {
          mutation: "CREATED",
          data: comment,
        },
      });
    }

    return comment;
  },

  // Delete Comment
  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id
    );

    if (commentIndex === -1) {
      throw new Error("Comment with the given ID doesn't exist.");
    }

    const [deletedComment] = db.comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComment,
      },
    });
    return deletedComment;
  },

  updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const comment = db.comments.find((comment) => comment.id === id);

    if (!comment) {
      throw new Error("Comment with given ID doesn't exist.");
    }

    if (typeof data.text === "string") {
      comment.text = data.text;
      pubsub.publish(`comment ${comment.post}`, {
        comment: {
          mutation: "UPDATED",
          data: comment,
        },
      });
    }

    return comment;
  },
};

export { Mutation as default };
