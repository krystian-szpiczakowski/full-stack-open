const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  if (!blogs) {
    return 0;
  }

  const reducer = (sum, item) => sum + item;
  const sumOfLikes = blogs.map((item) => item.likes).reduce(reducer, 0);
  return sumOfLikes;
};

const favoriteBlog = (blogs) => {
  if (!blogs) {
    return undefined;
  }

  const maxFinder = (max, currentItem) =>
    currentItem.likes > max.likes ? currentItem : max;

  return blogs.reduce(maxFinder, blogs[0]);
};

const mostBlogs = (blogs) => {
  if (!blogs) {
    return undefined;
  }

  if (blogs.length === 0) {
    return undefined
  }

  var _ = require("lodash");
  const blogsByAuthor = _.groupBy(blogs, "author");

  const authors = Object.keys(blogsByAuthor);
  const maxedAuthor = _.maxBy(
    authors,
    (currentAuthor) => blogsByAuthor[currentAuthor].length
  );
  const numberOfBlogs = blogsByAuthor[maxedAuthor].length;

  return {
    author: maxedAuthor,
    blogs: numberOfBlogs,
  };
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs };
