import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import App from "../App";

// Mock window.alert to prevent jsdom errors
global.alert = vi.fn();

describe("App Integration", () => {
  it("should render the main app with tabs", () => {
    render(<App />);

    expect(screen.getByText("Better Than 500")).toBeInTheDocument();
    expect(screen.getByText("Stocks/ETF")).toBeInTheDocument();
    expect(screen.getByText("Real Estate")).toBeInTheDocument();
    expect(
      screen.getByText("Compare Stocks/ETFs vs S&P 500")
    ).toBeInTheDocument();
  });

  it("should switch between tabs", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Initially on stocks tab
    expect(
      screen.getByText("Compare Stocks/ETFs vs S&P 500")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Home vs Rent + S&P 500")
    ).not.toBeInTheDocument();

    // Click real estate tab
    const realEstateTab = screen.getByText("Real Estate");
    await user.click(realEstateTab);

    expect(screen.getByText("Home vs Rent + S&P 500")).toBeInTheDocument();
    expect(
      screen.queryByText("Compare Stocks/ETFs vs S&P 500")
    ).not.toBeInTheDocument();

    // Click back to stocks tab
    const stocksTab = screen.getByText("Stocks/ETF");
    await user.click(stocksTab);

    expect(
      screen.getByText("Compare Stocks/ETFs vs S&P 500")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Home vs Rent + S&P 500")
    ).not.toBeInTheDocument();
  });

  it("should complete full stock investment flow", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Fill out the stock form using placeholder text
    await user.clear(screen.getByPlaceholderText("e.g., VFIAX, QQQ"));
    await user.type(
      screen.getByPlaceholderText("e.g., VFIAX, QQQ"),
      "Test Investment"
    );

    await user.clear(screen.getByPlaceholderText("1000"));
    await user.type(screen.getByPlaceholderText("1000"), "5000");

    await user.clear(screen.getByPlaceholderText("100"));
    await user.type(screen.getByPlaceholderText("100"), "200");

    await user.clear(screen.getByPlaceholderText("7"));
    await user.type(screen.getByPlaceholderText("7"), "8");

    await user.clear(screen.getByPlaceholderText("10"));
    await user.type(screen.getByPlaceholderText("10"), "5");

    // Submit the form
    const submitButton = screen.getByRole("button", {
      name: /Compare with S&P 500/,
    });
    await user.click(submitButton);

    // Check for results
    await waitFor(() => {
      expect(screen.getByText(/Results after 5 years/)).toBeInTheDocument();
      expect(screen.getByText("Test Investment")).toBeInTheDocument();
      expect(screen.getByText("S&P 500")).toBeInTheDocument();
    });

    // Check that winner is determined
    const winnerText = screen.getByText(/Wins!/);
    expect(winnerText).toBeInTheDocument();
    expect(winnerText.textContent).toMatch(/(Test Investment|S&P 500) Wins!/);
  });

  it("should complete full real estate investment flow", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Switch to real estate tab
    const realEstateTab = screen.getByText("Real Estate");
    await user.click(realEstateTab);

    // Fill out the real estate form using placeholder text
    await user.clear(screen.getByPlaceholderText("My Property"));
    await user.type(screen.getByPlaceholderText("My Property"), "My Home");

    await user.clear(screen.getByPlaceholderText("500000"));
    await user.type(screen.getByPlaceholderText("500000"), "400000");

    // Down payment should auto-calculate to 20%
    await waitFor(() => {
      expect(screen.getByDisplayValue("80000")).toBeInTheDocument();
    });

    // Find the years field by placeholder since it's more specific
    const yearsField = screen.getByPlaceholderText("10"); // Years field has placeholder "10"
    await user.clear(yearsField);
    await user.type(yearsField, "7");

    // Submit the form
    const submitButton = screen.getByRole("button", {
      name: /Calculate Returns/,
    });
    await user.click(submitButton);

    // Check for results
    await waitFor(() => {
      expect(screen.getByText(/Results after 7 years/)).toBeInTheDocument();
      expect(screen.getByText("My Home")).toBeInTheDocument();
      expect(screen.getByText("S&P 500 (Renting)")).toBeInTheDocument();
    });

    // Check for real estate specific labels
    expect(screen.getByText("Total Equity:")).toBeInTheDocument();
  });

  it("should show detailed breakdown when requested", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Submit default stock form
    const submitButton = screen.getByRole("button", {
      name: /Compare with S&P 500/,
    });
    await user.click(submitButton);

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText(/Results after/)).toBeInTheDocument();
    });

    // Click show details
    const detailsButton = screen.getByText("Show Details");
    await user.click(detailsButton);

    // Check for detailed breakdown
    await waitFor(() => {
      expect(
        screen.getByText("Detailed Financial Breakdown")
      ).toBeInTheDocument();
    });
  });

  it("should clear results when new calculation button is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Submit form to get results
    const submitButton = screen.getByRole("button", {
      name: /Compare with S&P 500/,
    });
    await user.click(submitButton);

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText(/Results after/)).toBeInTheDocument();
    });

    // Click new calculation
    const newCalcButton = screen.getByText("New Calculation");
    await user.click(newCalcButton);

    // Results should be gone
    expect(screen.queryByText(/Results after/)).not.toBeInTheDocument();
    expect(
      screen.getByText("Compare Stocks/ETFs vs S&P 500")
    ).toBeInTheDocument();
  });

  it("should clear results when switching tabs", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Submit stock form to get results
    const submitButton = screen.getByRole("button", {
      name: /Compare with S&P 500/,
    });
    await user.click(submitButton);

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText(/Results after/)).toBeInTheDocument();
    });

    // Switch to real estate tab
    const realEstateTab = screen.getByText("Real Estate");
    await user.click(realEstateTab);

    // Results should be cleared
    expect(screen.queryByText(/Results after/)).not.toBeInTheDocument();
    expect(screen.getByText("Home vs Rent + S&P 500")).toBeInTheDocument();
  });

  it("should handle form validation errors", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Clear required field
    await user.clear(screen.getByPlaceholderText("1000"));

    // Try to submit
    const submitButton = screen.getByRole("button", {
      name: /Compare with S&P 500/,
    });
    await user.click(submitButton);

    // Should not show results
    expect(screen.queryByText(/Results after/)).not.toBeInTheDocument();
  });
});
