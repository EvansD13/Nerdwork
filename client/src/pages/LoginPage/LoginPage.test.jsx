import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { screen, render, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import LoginPage from ".";

describe("LoginPage", () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );
    });
    afterEach(cleanup);

    it("renders the login page with the correct elements", () => {
      expect(screen.getByTestId("welcome")).toBeDefined();
      expect(screen.getByTestId("login-request")).toBeDefined();
      expect(screen.getByTestId("no-account")).toBeDefined();
  });

  it("renders input fields for email and password", () => {
      const emailInput = screen.getByPlaceholderText("Email");
      const passwordInput = screen.getByPlaceholderText("Password");

      expect(emailInput).toBeDefined();
      expect(passwordInput).toBeDefined();
  });

  it("renders a link to the signup page", () => {
      const signupLink = screen.getByText(/Create one here!/i);
      expect(signupLink).toBeDefined();
      expect(signupLink.getAttribute('href')).toBe('/signup');
  });

    // Add more tests as needed
});
