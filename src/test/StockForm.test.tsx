import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StockForm from "../components/forms/StockForm";
import type { StockFormData } from "../types/types";

// Mock window.alert to prevent jsdom errors
global.alert = vi.fn();

describe("StockForm", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("should render all form fields", () => {
    render(<StockForm onSubmit={mockOnSubmit} />);

    expect(
      screen.getByText("Compare Stocks/ETFs vs S&P 500")
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("Choose preset...")).toBeInTheDocument(); // Use display value instead
    expect(screen.getByPlaceholderText("e.g., VFIAX, QQQ")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("1000")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("100")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("7")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("0.1")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("10")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Compare with S&P 500/ })
    ).toBeInTheDocument();
  });

  it("should have default values", () => {
    render(<StockForm onSubmit={mockOnSubmit} />);

    expect(screen.getByDisplayValue("S&P 500")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("100")).toBeInTheDocument();
    expect(screen.getByDisplayValue("7")).toBeInTheDocument();
    expect(screen.getByDisplayValue("0.1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10")).toBeInTheDocument();
  });

  it("should update fields when user types", async () => {
    const user = userEvent.setup();
    render(<StockForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByPlaceholderText("e.g., VFIAX, QQQ");
    const initialInput = screen.getByPlaceholderText("1000");

    await user.clear(nameInput);
    await user.type(nameInput, "VTSAX");
    await user.clear(initialInput);
    await user.type(initialInput, "5000");

    expect(screen.getByDisplayValue("VTSAX")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5000")).toBeInTheDocument();
  });

  it("should apply preset values when selected", async () => {
    const user = userEvent.setup();
    render(<StockForm onSubmit={mockOnSubmit} />);

    const presetSelect = screen.getByDisplayValue("Choose preset...");
    await user.selectOptions(presetSelect, "1"); // NASDAQ 100 preset

    await waitFor(() => {
      expect(screen.getByDisplayValue("NASDAQ 100")).toBeInTheDocument();
      // Be more specific - check the return rate field by placeholder
      const returnField = screen.getByPlaceholderText("7");
      expect(returnField).toHaveValue(10); // Return rate should be 10

      // Check fees field
      const feesField = screen.getByPlaceholderText("0.1");
      expect(feesField).toHaveValue(0.2); // Fees should be 0.2
    });
  });

  it("should submit form with valid data", async () => {
    const user = userEvent.setup();
    render(<StockForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole("button", {
      name: /Compare with S&P 500/,
    });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: "S&P 500",
      initialAmount: 1000,
      monthlyAmount: 100,
      returnRate: 7,
      feeRate: 0.1,
      years: 10,
    });
  });

  it("should validate required fields", async () => {
    const user = userEvent.setup();
    render(<StockForm onSubmit={mockOnSubmit} />);

    // Clear required fields
    const initialInput = screen.getByPlaceholderText("1000");
    await user.clear(initialInput);

    const submitButton = screen.getByRole("button", {
      name: /Compare with S&P 500/,
    });
    await user.click(submitButton);

    // Should not call onSubmit for empty required field
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("should handle invalid initial amount", async () => {
    const user = userEvent.setup();
    render(<StockForm onSubmit={mockOnSubmit} />);

    const initialInput = screen.getByPlaceholderText("1000");
    await user.clear(initialInput);
    await user.type(initialInput, "0");

    const submitButton = screen.getByRole("button", {
      name: /Compare with S&P 500/,
    });
    await user.click(submitButton);

    // Should not call onSubmit for invalid amount
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("should handle invalid years", async () => {
    const user = userEvent.setup();
    render(<StockForm onSubmit={mockOnSubmit} />);

    const yearsInput = screen.getByPlaceholderText("10");
    await user.clear(yearsInput);
    await user.type(yearsInput, "0");

    const submitButton = screen.getByRole("button", {
      name: /Compare with S&P 500/,
    });
    await user.click(submitButton);

    // Should not call onSubmit for invalid years
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("should handle form submission with custom values", async () => {
    const user = userEvent.setup();
    render(<StockForm onSubmit={mockOnSubmit} />);

    // Update all fields using placeholder text
    await user.clear(screen.getByPlaceholderText("e.g., VFIAX, QQQ"));
    await user.type(
      screen.getByPlaceholderText("e.g., VFIAX, QQQ"),
      "Custom Investment"
    );

    await user.clear(screen.getByPlaceholderText("1000"));
    await user.type(screen.getByPlaceholderText("1000"), "2500");

    await user.clear(screen.getByPlaceholderText("100"));
    await user.type(screen.getByPlaceholderText("100"), "250");

    await user.clear(screen.getByPlaceholderText("7"));
    await user.type(screen.getByPlaceholderText("7"), "8.5");

    await user.clear(screen.getByPlaceholderText("0.1"));
    await user.type(screen.getByPlaceholderText("0.1"), "0.15");

    await user.clear(screen.getByPlaceholderText("10"));
    await user.type(screen.getByPlaceholderText("10"), "15");

    const submitButton = screen.getByRole("button", {
      name: /Compare with S&P 500/,
    });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: "Custom Investment",
      initialAmount: 2500,
      monthlyAmount: 250,
      returnRate: 8.5,
      feeRate: 0.15,
      years: 15,
    });
  });

  it("should handle empty name field gracefully", async () => {
    const user = userEvent.setup();
    render(<StockForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByPlaceholderText("e.g., VFIAX, QQQ");
    await user.clear(nameInput);

    const submitButton = screen.getByRole("button", {
      name: /Compare with S&P 500/,
    });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "My Investment", // Default fallback
      })
    );
  });
});
