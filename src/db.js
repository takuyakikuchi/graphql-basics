const posts = [
  {
    id: "1",
    title: "iphone SE is the best",
    body: "The reason is because it is fit in a hand.",
    published: true,
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

const db = {
  posts,
  users,
  comments,
};

export { db as default };
