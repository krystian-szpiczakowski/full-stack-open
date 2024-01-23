const _ = require("lodash");

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
    return undefined;
  }

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

const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return undefined;
  }

  const blogsByAuthor = _.groupBy(blogs, "author");
  const authors = Object.keys(blogsByAuthor);

  const likesByAuthor = authors.map((author) => {
    const blogsOfSingleAuthor = blogsByAuthor[author];
    const totalLikesForAuthor = blogsOfSingleAuthor
      .map((blog) => blog.likes)
      .reduce((sum, likes) => sum + likes, 0);

    return {
      author: author,
      likes: totalLikesForAuthor,
    };
  });

  return likesByAuthor.reduce(
    (currentMax, authorLikes) =>
      authorLikes.likes > currentMax.likes ? authorLikes : currentMax,
    likesByAuthor[0]
  );
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
