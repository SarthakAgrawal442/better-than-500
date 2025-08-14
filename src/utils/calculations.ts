// utils/calculations.ts - Fixed real estate vs S&P 500 comparison
import type {
  StockFormData,
  RealEstateFormData,
  RealEstateDetails,
  ComparisonResult,
  InvestmentType,
} from "../types/types";

/**
 * Calculate future value of stock/ETF investment with monthly contributions
 */
export function calculateStockGrowth(
  initialAmount: number,
  monthlyAmount: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = years * 12;

  // Future value of initial lump sum
  const futureValueOfInitial =
    initialAmount * Math.pow(1 + monthlyRate, totalMonths);

  // Future value of monthly contributions
  const futureValueOfMonthly =
    monthlyRate === 0
      ? monthlyAmount * totalMonths
      : monthlyAmount *
        ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);

  return futureValueOfInitial + futureValueOfMonthly;
}

/**
 * Calculate S&P 500 comparison for any investment
 */
export function calculateSP500Comparison(
  initialAmount: number,
  monthlyAmount: number,
  years: number
): number {
  const SP500_RATE = 7; // Historical average
  return calculateStockGrowth(initialAmount, monthlyAmount, SP500_RATE, years);
}

/**
 * Calculate mortgage monthly payment
 */
export function calculateMortgagePayment(
  principal: number,
  annualRate: number,
  years: number
): number {
  if (principal <= 0 || annualRate <= 0 || years <= 0) return 0;

  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;

  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
  );
}

/**
 * Calculate real estate investment returns
 */
export function calculateRealEstateReturns(
  propertyData: RealEstateFormData
): RealEstateDetails {
  const {
    propertyValue,
    downPayment,
    annualRate,
    loanTermYears,
    monthlyTax,
    monthlyHOA,
    monthlyInsurance,
    monthlyMaintenance,
    annualAppreciation,
    years,
    monthlyRentSavings,
  } = propertyData;

  // Basic calculations
  const loanAmount = propertyValue - downPayment;
  const monthlyMortgage = calculateMortgagePayment(
    loanAmount,
    annualRate,
    loanTermYears
  );

  const totalMonthlyExpenses =
    monthlyMortgage +
    monthlyTax +
    monthlyHOA +
    monthlyInsurance +
    monthlyMaintenance;

  const annualExpenses = totalMonthlyExpenses * 12;
  const annualRentSavings = monthlyRentSavings * 12;
  const netAnnualCashFlow = annualRentSavings - annualExpenses;

  // Property appreciation
  const futurePropertyValue =
    propertyValue * Math.pow(1 + annualAppreciation / 100, years);
  const capitalGain = futurePropertyValue - propertyValue;

  // Calculate remaining mortgage balance after 'years'
  const monthsElapsed = Math.min(years * 12, loanTermYears * 12);
  let remainingBalance = loanAmount;

  if (monthsElapsed < loanTermYears * 12) {
    const r = annualRate / 100 / 12;
    const n = loanTermYears * 12;
    const m = monthsElapsed;
    remainingBalance =
      (loanAmount * (Math.pow(1 + r, n) - Math.pow(1 + r, m))) /
      (Math.pow(1 + r, n) - 1);
  } else {
    remainingBalance = 0;
  }

  // Equity from mortgage paydown
  const equityFromPaydown = loanAmount - remainingBalance;

  // Total equity = down payment + appreciation + mortgage paydown
  const totalEquity = downPayment + capitalGain + equityFromPaydown;

  // Net worth from real estate = total equity (since we own the property)
  const futureValue = totalEquity;

  // Annualized return based on initial investment (down payment)
  const annualizedReturn =
    downPayment > 0
      ? (Math.pow(futureValue / downPayment, 1 / years) - 1) * 100
      : 0;

  return {
    propertyValue,
    futurePropertyValue,
    capitalGain,
    totalCashFlow: netAnnualCashFlow * years,
    annualExpenses,
    monthlyExpenses: totalMonthlyExpenses,
    monthlyCashFlow: (annualRentSavings - annualExpenses) / 12,
    annualizedReturn,
    remainingMortgage: remainingBalance,
    equityFromPaydown,
    totalEquity: futureValue,
    monthlyRent: monthlyRentSavings, // Add this for display purposes
  };
}

/**
 * Calculate investment comparison (main function used by components)
 */
export function calculateInvestmentComparison(
  formData: StockFormData | RealEstateFormData,
  type: InvestmentType
): ComparisonResult {
  if (type === "stocks") {
    const stockData = formData as StockFormData;
    const netRate = stockData.returnRate - stockData.feeRate;

    const userValue = calculateStockGrowth(
      stockData.initialAmount,
      stockData.monthlyAmount,
      netRate,
      stockData.years
    );

    const sp500Value = calculateSP500Comparison(
      stockData.initialAmount,
      stockData.monthlyAmount,
      stockData.years
    );

    return {
      user: {
        name: stockData.name || "Your Investment",
        futureValue: userValue,
        initialInvestment: stockData.initialAmount,
        monthlyContribution: stockData.monthlyAmount,
        years: stockData.years,
        rate: netRate,
        netReturn:
          ((userValue / stockData.initialAmount) ** (1 / stockData.years) - 1) *
          100,
        totalReturn: userValue - stockData.initialAmount,
      },
      sp500: {
        name: "S&P 500",
        futureValue: sp500Value,
        initialInvestment: stockData.initialAmount,
        monthlyContribution: stockData.monthlyAmount,
        years: stockData.years,
        rate: 7,
        netReturn:
          ((sp500Value / stockData.initialAmount) ** (1 / stockData.years) -
            1) *
          100,
        totalReturn: sp500Value - stockData.initialAmount,
      },
      winner: userValue > sp500Value ? "user" : "sp500",
      difference: Math.abs(userValue - sp500Value),
    };
  } else {
    // Real estate calculation
    const realEstateData = formData as RealEstateFormData;
    const realEstateResults = calculateRealEstateReturns(realEstateData);

    // If renting instead of buying:
    // 1. Invest the down payment
    // 2. Each month, pay rent but save the difference vs ownership costs
    const monthlyRent = realEstateData.monthlyRentSavings; // What rent would be
    const monthlyOwnershipCost = realEstateResults.monthlyExpenses; // Total cost to own

    // If owning costs MORE than renting, that's money saved by renting
    // If owning costs LESS than renting, renter pays more (negative contribution)
    const monthlySavingsByRenting = monthlyOwnershipCost - monthlyRent;

    // Calculate S&P 500 with down payment + monthly savings
    const sp500Value = calculateSP500Comparison(
      realEstateData.downPayment,
      monthlySavingsByRenting, // This could be positive (saving) or negative (costing more)
      realEstateData.years
    );

    return {
      user: {
        name: realEstateData.name || "Real Estate",
        futureValue: realEstateResults.totalEquity ?? 0, // Use total equity, not property value (default to 0 if undefined)
        initialInvestment: realEstateData.downPayment,
        years: realEstateData.years,
        rate: realEstateResults.annualizedReturn,
        details: realEstateResults,
        netReturn: realEstateResults.annualizedReturn,
        totalReturn:
          (realEstateResults.totalEquity ?? 0) - realEstateData.downPayment,
        monthlyContribution: 0, // No additional monthly investment for real estate
      },
      sp500: {
        name: "S&P 500 (Renting)",
        futureValue: sp500Value,
        initialInvestment: realEstateData.downPayment,
        monthlyContribution: monthlySavingsByRenting,
        years: realEstateData.years,
        rate: 7,
        netReturn:
          sp500Value > 0
            ? (Math.pow(
                sp500Value / realEstateData.downPayment,
                1 / realEstateData.years
              ) -
                1) *
              100
            : -100,
        totalReturn: sp500Value - realEstateData.downPayment,
      },
      winner:
        (realEstateResults.totalEquity ?? 0) > sp500Value ? "user" : "sp500",
      difference: Math.abs((realEstateResults.totalEquity ?? 0) - sp500Value),
    };
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format percentage for display
 */
export function formatPercentage(rate: number): string {
  return `${rate.toFixed(1)}%`;
}
