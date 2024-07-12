import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import UsernameForm from ".";

describe("UsernameForm", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <UsernameForm
          inputUn=""
          setInputUn={() => {}}
          inputPw=""
          setInputPw={() => {}}
          button_Text="Login"
          setButtonText={() => {}} />
      </BrowserRouter>
    );
  });

  afterEach(() => {
    cleanup();
  });

  it("Form exists", () => {
    const form = screen.getByTestId("login-form");
    expect(form).toBeDefined();
  });

  it('renders email input', () => {
    const emailInput = screen.getByTestId('email');
    expect(emailInput).toBeDefined();
  });

  it('renders password input', () => {
    const passwordInput = screen.getByTestId('password');
    expect(passwordInput).toBeDefined();
  });

  it('renders login button', () => {
    const loginButton = screen.getByTestId('submit');
    expect(loginButton).toBeDefined();
  });

  // Other tests...
});
