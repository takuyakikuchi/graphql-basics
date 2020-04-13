const Subscription = {
  comment: {
    subscribe(parent, { postId }, { db, pubsub }, info) {
      const postExist = db.posts.find(
        (post) => post.id === postId && post.published
      );

      if (!postExist) {
        throw new Error("Post with given ID does not exist.");
      }

      return pubsub.asyncIterator(`comment ${postId}`);
    },
  },
};

export { Subscription as default };
