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
            likes: 3
        }
    ];
    expect(listHelper.totalLikes(blogs)).toBe(3);
  });

  test("of a bigger list is calculated right", () => {
    const blogs = [
        {
            author: "Someone",
            title: "How to do nothing",
            likes: 3
        },
        {
            author: "Someone else",
            title: "How to do something",
            likes: 5
        }
    ];
    expect(listHelper.totalLikes(blogs)).toBe(8);
  });
});
