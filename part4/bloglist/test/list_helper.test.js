const listHelper = require("../util/list_helper");

test("Dummy returns one", () => {
  const blogs = [];
  expect(listHelper.dummy(blogs)).toBe(1);
});

describe("Total likes", () => {
  test("When list is empty return zero", () => {
    const blogs = [];
    expect(listHelper.totalLikes(blogs)).toBe(0);
  });

  test("When list has only one blog, equals the likes of that", () => {
    const blogs = [
      {
        author: "Someone",
        title: "How to do nothing",
        likes: 3,
      },
    ];
    expect(listHelper.totalLikes(blogs)).toBe(3);
  });

  test("of a bigger list is calculated right", () => {
    const blogs = [
      {
        author: "Someone",
        title: "How to do nothing",
        likes: 3,
      },
      {
        author: "Someone else",
        title: "How to do something",
        likes: 5,
      },
    ];
    expect(listHelper.totalLikes(blogs)).toBe(8);
  });
});

describe("Find favorite blog with most likes", () => {
  test("Undefined blog list has no favorite blog", () => {
    expect(listHelper.favoriteBlog()).toEqual(undefined);
  });

  test("An empty blog list has no favorite blog", () => {
    const blogs = [];

    expect(listHelper.favoriteBlog(blogs)).toEqual(undefined);
  });

  test("When only one blog in the list, it is the favorite blog", () => {
    const singleBlog = {
      author: "Christiansen",
      title: "It's a perfect day for programming",
      likes: 21,
    };

    const blogs = [singleBlog];

    expect(listHelper.favoriteBlog(blogs)).toEqual(singleBlog);
  });

  test("When several blogs, then get one with most likes", () => {
    const expectedBlog = {
      author: "Christiansen",
      title: "Snowy Sunday",
      likes: 33,
    };

    const blogs = [
      {
        author: "Christiansen",
        title: "It's a perfect day for programming",
        likes: 21,
      },
      expectedBlog,
      {
        author: "Wifey",
        title: "Dinner time",
        likes: 14,
      },
    ];

    const actualBlog = listHelper.favoriteBlog(blogs);
    expect(actualBlog).toEqual(expectedBlog);
  });

  test("When several blogs have the same amount of likes, get first", () => {
    const expectedBlog = {
      author: "Christiansen",
      title: "Snowy Sunday",
      likes: 33,
    };

    const blogs = [
      {
        author: "Christiansen",
        title: "It's a perfect day for programming",
        likes: 21,
      },
      expectedBlog,
      {
        author: "Wifey",
        title: "Dinner time",
        likes: 33,
      },
    ];

    const actualBlog = listHelper.favoriteBlog(blogs);
    expect(actualBlog).toEqual(expectedBlog);
  });
});

describe("Blogger with most blogs", () => {
  test("When no blogs defined, no top blogger", () => {
    expect(listHelper.mostBlogs()).toEqual(undefined);
  });

  test("When empty list of blogs, no top blogger", () => {
    expect(listHelper.mostBlogs([])).toEqual(undefined);
  });

  test("When several bloggers, get one with most blogs", () => {
    const blogs = [
      {
        author: "Christiansen",
        title: "It's a perfect day for programming",
        likes: 21,
      },
      {
        author: "Christiansen",
        title: "Snowy Sunday",
        likes: 33,
      },
      {
        author: "Wifey",
        title: "Breakfast time",
        likes: 14,
      },
      {
        author: "Wifey",
        title: "Lunch time",
        likes: 14,
      },
      {
        author: "Wifey",
        title: "Dinner time",
        likes: 14,
      },
      {
        author: "Son",
        title: "Lego playtime",
        likes: 100,
      },
    ];

    const expectedTopBlogger = {
      author: "Wifey",
      blogs: 3,
    };

    const topBlogger = listHelper.mostBlogs(blogs);
    expect(topBlogger).toEqual(expectedTopBlogger);
  });

  describe("Blogger with most likes", () => {
    test("When no blogs, get no likes", () => {
      const mostLikedAuthor = listHelper.mostLikes();
      expect(mostLikedAuthor).toBe(undefined);
    });

    test("When empty blogs, get no likes", () => {
      const blogs = [];
      const mostLikedAuthor = listHelper.mostLikes(blogs);
      expect(mostLikedAuthor).toBe(undefined);
    });

    test("When multiple authors with multiple blogs, get author with most likes", () => {
      const blogs = [
        {
          author: "Somebody",
          title: "How to lorem ipsum very much",
          likes: 20,
        },
        {
          author: "Wifey",
          title: "How to be a software engineer",
          likes: 10,
        },
        {
          author: "Wifey",
          title: "How to be anyone",
          likes: 90,
        },
        {
          author: "Somebody",
          title: "How to lorem ipsum",
          likes: 6,
        },
      ];

      const expectedMostLikedAuthor = {
        author: "Wifey",
        likes: 100,
      };

      const mostLikedAuthor = listHelper.mostLikes(blogs);
      expect(mostLikedAuthor).toEqual(expectedMostLikedAuthor);
    });
  });
});
