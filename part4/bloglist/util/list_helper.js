const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  if (!blogs) {
    return 0;
  }

  const reducer = (sum, item) => sum + item;
  const sumOfLikes = blogs
    .map(item => item.likes)
    .reduce(reducer, 0);
  return sumOfLikes;
}

module.exports = { dummy, totalLikes };
