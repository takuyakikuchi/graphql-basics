const Query = {
  comments(parent, args, { db }, info) {
    return db.comments;
  },

  posts(parent, args, { db }, info) {
    if (!args.query) return db.posts;

    return db.posts.filter((post) => {
      const titleMatched = post.title
        .toLowerCase()
        .includes(args.query.toLowerCase());

      const bodyMatched = post.body
        .toLowerCase()
        .includes(args.query.toLowerCase());

      return titleMatched || bodyMatched;
    });
  },

  users(parent, args, { db }, info) {
    if (!args.query) return db.users;
    return db.users.filter((user) => {
      return user.name.toLowerCase().includes(args.query.toLowerCase());
    });
  },
};

export { Query as default };
