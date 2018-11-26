import React from "react";
import Book from "../../../../dashBoard/bookList/book/Book";
import { shallow } from "enzyme";

const testBook = {
  id: 1,
  title: "Harry Potter",
  author: "JK Rowling",
  isbn: "1000000000",
  publishDate: "1999"
};

describe("Book Component Tests", () => {
  test("title matches test data", () => {
    const wrapper = shallow(<Book book={testBook} />);
    expect(wrapper.find("h3").text()).toBe(testBook.title);
  });

  test("all fields are populated", () => {
    const wrapper = shallow(<Book book={testBook} />);
    expect(wrapper.find("#author1").text()).toBe(`Author: ${testBook.author}`);
    expect(wrapper.find("#isbn1").text()).toBe(`ISBN: ${testBook.isbn}`);
    expect(wrapper.find("#publishDate1").text()).toBe(
      `Publish Date: ${testBook.publishDate}`
    );
  });

  test("Check Availability button rendered by default", () => {
    const wrapper = shallow(<Book book={testBook} />);
    expect(wrapper.find("RequestButton").exists()).toBe(true);
    expect(wrapper.find("RequestButton").props().buttonText).toEqual(
      "Check Availability"
    );
    expect(wrapper.find("RequestButton").props().colour).toEqual(null);
  });
});
