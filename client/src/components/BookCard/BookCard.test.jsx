import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { screen, render, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as matchers from "@testing-library/jest-dom/matchers";
import BookCard from ".";

expect.extend(matchers);

const mockBook = {
  title: "Example Book",
  img: "example.jpg",
  author: "John Doe",
  genres: ["Fiction", "Adventure"],
  owner: "Jane Smith",
  rating: 3.5
};

describe("BookCard Component", () => {
  beforeEach(() => {
    render(<BookCard book={mockBook} />);
  });

  afterEach(cleanup);

  it("should display the book title", () => {
    expect(screen.getByText(mockBook.title)).toBeInTheDocument();
  });

  it("should display the book author", () => {
    expect(screen.getByText(mockBook.author)).toBeInTheDocument();
  });

  it("should display the book genres as badges", () => {
    mockBook.genres.forEach(genre => {
      expect(screen.getByText(genre)).toBeInTheDocument();
    });
  });

  it("should display the book owner", () => {
    expect(screen.getByText(`Owner: ${mockBook.owner}`)).toBeInTheDocument();
  });

  it("should display the correct number of filled stars for rating", () => {
    const filledStars = screen.getAllByText("★").filter(star => star.className.includes("text-warning"));
    expect(filledStars).toHaveLength(Math.floor(mockBook.rating));
  });

  it("should display the book image", () => {
    const image = screen.getByAltText(mockBook.title);
    expect(image.src).toContain(mockBook.img);
  });

  // Add more tests as needed
});
