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

  it.each([
    [mockDataUserWins, "Your investment finishes $20,000 ahead."],
    [mockDataSP500Wins, "The S&P 500 benchmark finishes $20,000 ahead."],
  ] as const)("shows the projected lead", (data, headline) => {
    render(<SimpleResults data={data} type="stocks" onClear={mockOnClear} />);
    expect(screen.getByRole("heading", { name: headline })).toBeVisible();
    expect(screen.getByText(data.user.name + " (after fees)")).toBeVisible();
    expect(screen.getByText("S&P 500 benchmark")).toBeVisible();
  });

  it("explains contributions and rates on demand", async () => {
    render(<SimpleResults data={mockDataUserWins} type="stocks" onClear={mockOnClear} />);
    const explanation = screen.getByText(/Both start with the same deposits/);
    expect(explanation).not.toBeVisible();
    await userEvent.click(screen.getByText("How the totals add up"));
    expect(explanation).toBeVisible();
    expect(explanation).toHaveTextContent("$70,000");
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

    expect(screen.getByText("Buy a home")).toBeVisible();
    expect(screen.getByText("Rent and invest")).toBeVisible();
    expect(screen.getByRole("heading", { name: /Buying leaves you with \$20,000 more/ })).toBeVisible();
    expect(screen.getByText("Estimated sale price")).not.toBeVisible();
  });

  it("reports equal rounded values without declaring a winner", () => {
    const equal = { ...mockDataUserWins, sp500: { ...mockDataUserWins.sp500,
      futureValue: mockDataUserWins.user.futureValue }, difference: 0 };
    render(<SimpleResults data={equal} type="stocks" onClear={mockOnClear} />);
    expect(screen.getByText(/finish even/)).toBeInTheDocument();
    expect(screen.queryByText(/Wins!/)).not.toBeInTheDocument();
  });

});
