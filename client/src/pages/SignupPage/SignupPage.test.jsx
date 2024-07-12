import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { screen, render, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SignupPage from ".";

describe("SignupPage", () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <SignupPage />
            </BrowserRouter>
        );
    });
    afterEach(cleanup);

    it("renders the signup page with the correct elements", () => {
        expect(screen.getByText("Register")).toBeDefined();
        // Check for presence of input fields in UsernameForm component
        const usernameInput = screen.getByPlaceholderText("Username");
        const passwordInput = screen.getByPlaceholderText("Password");
        expect(usernameInput).toBeDefined();
        expect(passwordInput).toBeDefined();
        // Check for the 'Create Account' button
        expect(screen.getByRole("button", { name: "Create Account" })).toBeDefined();
        // Check for the link back to the login page
        const backToLoginLink = screen.getByText(/Back to Login/i);
        expect(backToLoginLink).toBeDefined();
        expect(backToLoginLink.getAttribute('href')).toBe('/');
    });

});
