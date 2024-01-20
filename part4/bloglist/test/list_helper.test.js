const listHelper = require('../util/list_helper')

test("Dummy returns one", () => {
    const blogs = [];
    expect(listHelper.dummy(blogs)).toBe(1);
})