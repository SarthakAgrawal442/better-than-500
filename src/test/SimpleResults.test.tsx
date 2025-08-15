import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SimpleResults from "../components/results/SimpleResults";
import type { ComparisonResult } from "../types/types";

// Mock window.alert to prevent jsdom errors
global.alert = vi.fn();

describe("SimpleResults", () => {
  const mockOnClear = vi.fn();

  // Mock data where user investment wins
  const mockDataUserWins: ComparisonResult = {
    user: {
      name: "NASDAQ 100",
      futureValue: 150000,
      initialInvestment: 10000,
      monthlyContribution: 500,
      years: 10,
      rate: 9.8,
      netReturn: 12.5,
      totalReturn: 140000,
    },
    sp500: {
      name: "S&P 500",
      futureValue: 130000,
      initialInvestment: 10000,
      monthlyContribution: 500,
      years: 10,
      rate: 7,
      netReturn: 10.8,
      totalReturn: 120000,
    },
    winner: "user",
    difference: 20000,
  };

  // Mock data where S&P 500 wins
  const mockDataSP500Wins: ComparisonResult = {
    user: {
      name: "Conservative Bonds",
      futureValue: 110000,
      initialInvestment: 10000,
      monthlyContribution: 500,
      years: 10,
      rate: 3.5,
      netReturn: 6.2,
      totalReturn: 100000,
    },
    sp500: {
      name: "S&P 500",
      futureValue: 130000,
      initialInvestment: 10000,
      monthlyContribution: 500,
      years: 10,
      rate: 7,
      netReturn: 10.8,
      totalReturn: 120000,
    },
    winner: "sp500",
    difference: 20000,
  };

  beforeEach(() => {
    mockOnClear.mockClear();
  });

  it("should not render when no data provided", () => {
    render(
      <SimpleResults data={null as any} type="stocks" onClear={mockOnClear} />
    );

    expect(screen.queryByText(/Results after/)).not.toBeInTheDocument();
  });

  it("should display winner when user investment wins", () => {
    render(
      <SimpleResults
        data={mockDataUserWins}
        type="stocks"
        onClear={mockOnClear}
      />
    );

    expect(screen.getByText("NASDAQ 100 Wins!")).toBeInTheDocument();
    expect(
      screen.getByText(/Your investment.*outperformed by.*\$20,000/)
    ).toBeInTheDocument();
    expect(screen.getByText("Results after 10 years")).toBeInTheDocument();
  });

  it("should display winner when S&P 500 wins", () => {
    render(
      <SimpleResults
        data={mockDataSP500Wins}
        type="stocks"
        onClear={mockOnClear}
      />
    );

    expect(screen.getByText("S&P 500 Wins!")).toBeInTheDocument();
    expect(
      screen.getByText(/The S&P 500.*outperformed by.*\$20,000/)
    ).toBeInTheDocument();
  });

  it("should display investment details correctly", () => {
    render(
      <SimpleResults
        data={mockDataUserWins}
        type="stocks"
        onClear={mockOnClear}
      />
    );

    // User investment details
    expect(screen.getByText("NASDAQ 100")).toBeInTheDocument();
    expect(screen.getByText("$150,000")).toBeInTheDocument();
    expect(screen.getByText("9.8%")).toBeInTheDocument();

    // Use getAllByText for elements that appear multiple times
    const initialAmounts = screen.getAllByText("$10,000");
    expect(initialAmounts).toHaveLength(2); // Both user and S&P 500 have same initial

    const monthlyAmounts = screen.getAllByText("$500");
    expect(monthlyAmounts).toHaveLength(2); // Both have same monthly

    // S&P 500 details
    expect(screen.getByText("S&P 500")).toBeInTheDocument();
    expect(screen.getByText("$130,000")).toBeInTheDocument();
    expect(screen.getByText("7.0%")).toBeInTheDocument();
  });

  it("should show correct styling for winner", () => {
    render(
      <SimpleResults
        data={mockDataUserWins}
        type="stocks"
        onClear={mockOnClear}
      />
    );

    // Look for the sections by their content and check their parent containers
    const userSection = screen.getByText("NASDAQ 100").closest(".bg-green-50");
    const sp500Section = screen.getByText("S&P 500").closest(".bg-gray-50");

    expect(userSection).toBeInTheDocument();
    expect(sp500Section).toBeInTheDocument();
  });

  it("should toggle detailed view", async () => {
    const user = userEvent.setup();
    render(
      <SimpleResults
        data={mockDataUserWins}
        type="stocks"
        onClear={mockOnClear}
      />
    );

    const detailsButton = screen.getByText("Show Details");
    expect(
      screen.queryByText("Detailed Financial Breakdown")
    ).not.toBeInTheDocument();

    await user.click(detailsButton);
    expect(screen.getByText("Hide Details")).toBeInTheDocument();
    expect(
      screen.getByText("Detailed Financial Breakdown")
    ).toBeInTheDocument();

    await user.click(screen.getByText("Hide Details"));
    expect(screen.getByText("Show Details")).toBeInTheDocument();
    expect(
      screen.queryByText("Detailed Financial Breakdown")
    ).not.toBeInTheDocument();
  });

  it("should call onClear when clear button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <SimpleResults
        data={mockDataUserWins}
        type="stocks"
        onClear={mockOnClear}
      />
    );

    const clearButton = screen.getByText("New Calculation");
    await user.click(clearButton);

    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  it("should display real estate specific labels", () => {
    const realEstateData: ComparisonResult = {
      ...mockDataUserWins,
      user: {
        ...mockDataUserWins.user,
        name: "My Home",
        details: {
          propertyValue: 500000,
          futurePropertyValue: 600000,
          capitalGain: 100000,
          totalCashFlow: 24000,
          annualExpenses: 30000,
          monthlyExpenses: 2500,
          monthlyCashFlow: 200,
          annualizedReturn: 8.5,
          totalEquity: 150000,
          monthlyRent: 1800,
          equityFromPaydown: 25000,
        },
      },
      sp500: {
        ...mockDataUserWins.sp500,
        name: "S&P 500 (Renting)",
        monthlyContribution: -200, // Negative indicates extra cost
      },
    };

    render(
      <SimpleResults
        data={realEstateData}
        type="realestate"
        onClear={mockOnClear}
      />
    );

    expect(screen.getByText("My Home")).toBeInTheDocument();
    expect(screen.getByText("S&P 500 (Renting)")).toBeInTheDocument();
    expect(screen.getByText("Total Equity:")).toBeInTheDocument();
    expect(screen.getByText("Extra Cost:")).toBeInTheDocument();
  });

  it("should display performance difference with correct styling", () => {
    // Test user wins scenario
    const { unmount } = render(
      <SimpleResults
        data={mockDataUserWins}
        type="stocks"
        onClear={mockOnClear}
      />
    );

    const differenceSection = screen.getByText("Difference:").closest("div");
    expect(differenceSection).toContainHTML("text-green-600"); // User wins
    expect(screen.getByText("$20,000")).toBeInTheDocument();

    unmount(); // Clean up before next render

    // Test S&P 500 wins scenario
    render(
      <SimpleResults
        data={mockDataSP500Wins}
        type="stocks"
        onClear={mockOnClear}
      />
    );

    const sp500DifferenceSection = screen
      .getByText("Difference:")
      .closest("div");
    expect(sp500DifferenceSection).toContainHTML("text-red-600"); // SP500 wins
  });

  it("should handle missing monthly contribution gracefully", () => {
    const dataWithoutMonthly: ComparisonResult = {
      ...mockDataUserWins,
      user: {
        ...mockDataUserWins.user,
        monthlyContribution: undefined,
      },
      sp500: {
        ...mockDataUserWins.sp500,
        monthlyContribution: undefined,
      },
    };

    render(
      <SimpleResults
        data={dataWithoutMonthly}
        type="stocks"
        onClear={mockOnClear}
      />
    );

    expect(screen.queryByText("Monthly:")).not.toBeInTheDocument();
    expect(screen.getByText("$150,000")).toBeInTheDocument(); // Still shows final value
  });

  it("should handle zero monthly contribution", () => {
    const dataWithZeroMonthly: ComparisonResult = {
      ...mockDataUserWins,
      user: {
        ...mockDataUserWins.user,
        monthlyContribution: 0,
      },
      sp500: {
        ...mockDataUserWins.sp500,
        monthlyContribution: 0,
      },
    };

    render(
      <SimpleResults
        data={dataWithZeroMonthly}
        type="stocks"
        onClear={mockOnClear}
      />
    );

    expect(screen.queryByText("Monthly:")).not.toBeInTheDocument();
  });
});
