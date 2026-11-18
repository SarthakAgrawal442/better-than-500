// utils/calculations.ts - Fixed real estate vs S&P 500 comparison
import { SP500_RATE } from "./constants";
import type {
  StockFormData,
  RealEstateFormData,
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
  const monthlyRate = Math.expm1(Math.log1p(annualRate / 100) / 12);
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
  if (principal <= 0 || annualRate < 0 || years <= 0) return 0;

  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  if (annualRate === 0) return principal / numPayments;

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
) {
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

  const recurring = monthlyTax + monthlyHOA + monthlyInsurance + monthlyMaintenance;
  const startingCash = downPayment + propertyValue * (propertyData.purchaseCostPercent ?? 0) / 100;
  const marketFactor = (1 + SP500_RATE / 100) ** (1 / 12);
  let ownerPortfolio = 0;
  let renterPortfolio = startingCash;
  let ownerDeposits = 0;
  let renterDeposits = 0;
  let remainingBalance = loanAmount;
  let totalCashFlow = 0;
  let annualExpenses = 0;
  const flows = [-startingCash];

  for (let month = 0; month < years * 12; month++) {
    const year = Math.floor(month / 12);
    const rent = monthlyRentSavings * (1 + (propertyData.rentGrowth ?? 0) / 100) ** year;
    const interest = remainingBalance * annualRate / 1200;
    const payment = month < loanTermYears * 12 ? monthlyMortgage : 0;
    remainingBalance = month + 1 >= loanTermYears * 12
      ? 0 : Math.max(0, remainingBalance + interest - payment);
    const expenses = payment + recurring * (1 + (propertyData.expenseGrowth ?? 0) / 100) ** year;
    const savings = rent - expenses;
    const ownerDeposit = Math.max(0, savings);
    const renterDeposit = Math.max(0, -savings);
    ownerPortfolio = ownerPortfolio * marketFactor + ownerDeposit;
    renterPortfolio = renterPortfolio * marketFactor + renterDeposit;
    ownerDeposits += ownerDeposit;
    renterDeposits += renterDeposit;
    flows.push(savings);
    totalCashFlow += savings;
    if (month < 12) annualExpenses += expenses;
  }

  const futurePropertyValue = propertyValue * (1 + annualAppreciation / 100) ** years;
  const totalEquity = futurePropertyValue - remainingBalance;
  const saleCosts = futurePropertyValue * (propertyData.saleCostPercent ?? 0) / 100;
  const saleProceeds = totalEquity - saleCosts;
  flows[flows.length - 1] += saleProceeds;
  return {
    propertyValue, futurePropertyValue, totalEquity, saleCosts, saleProceeds,
    ownerPortfolio, renterPortfolio, ownerDeposits, renterDeposits,
    capitalGain: futurePropertyValue - propertyValue,
    equityFromPaydown: loanAmount - remainingBalance,
    remainingMortgage: remainingBalance,
    monthlyExpenses: totalMonthlyExpenses, annualExpenses, totalCashFlow,
    monthlyRent: monthlyRentSavings,
    monthlyCashFlow: monthlyRentSavings - totalMonthlyExpenses,
    annualizedReturn: annualHousingIRR(flows),
  };
}

/** Only report IRR when a conventional cash-flow sequence guarantees a unique root. */
function annualHousingIRR(flows: number[]): number {
  const firstReceipt = flows.findIndex(value => value > 0);
  if (firstReceipt < 0 || flows.slice(firstReceipt).some(value => value < 0)) return NaN;
  // Evaluate the terminal value by rolling each monthly flow forward.
  const terminal = (factor: number) => flows.reduce((balance, flow) => balance * factor + flow, 0);
  let low = 0;
  let high = 2;
  while (terminal(high) > 0) high *= 2;
  for (let step = 0; step < 80; step++) {
    const mid = (low + high) / 2;
    if (terminal(mid) > 0) low = mid;
    else high = mid;
  }
  return (((low + high) / 2) ** 12 - 1) * 100;
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
        netReturn: netRate,
        totalReturn: userValue - stockData.initialAmount - stockData.monthlyAmount * 12 * stockData.years,
      },
      sp500: {
        name: "S&P 500",
        futureValue: sp500Value,
        initialInvestment: stockData.initialAmount,
        monthlyContribution: stockData.monthlyAmount,
        years: stockData.years,
        rate: SP500_RATE,
        netReturn: SP500_RATE,
        totalReturn: sp500Value - stockData.initialAmount - stockData.monthlyAmount * 12 * stockData.years,
      },
      winner: userValue > sp500Value ? "user" : "sp500",
      difference: Math.abs(userValue - sp500Value),
    };
  } else {
    // Real estate calculation
    const realEstateData = formData as RealEstateFormData;
    const realEstateResults = calculateRealEstateReturns(realEstateData);

    const initialCash = realEstateData.downPayment +
      realEstateData.propertyValue * (realEstateData.purchaseCostPercent ?? 0) / 100;
    const ownerValue = realEstateResults.saleProceeds + realEstateResults.ownerPortfolio;
    const sp500Value = realEstateResults.renterPortfolio;
    const firstMonthSavings = realEstateResults.monthlyCashFlow;

    return {
      user: {
        name: realEstateData.name || "Real Estate",
        futureValue: ownerValue,
        initialInvestment: initialCash,
        years: realEstateData.years,
        rate: realEstateResults.annualizedReturn,
        details: realEstateResults,
        netReturn: realEstateResults.annualizedReturn,
        totalReturn:
          ownerValue - initialCash - realEstateResults.ownerDeposits + realEstateResults.totalCashFlow,
        monthlyContribution: Math.max(0, firstMonthSavings),
      },
      sp500: {
        name: "S&P 500 (Renting)",
        futureValue: sp500Value,
        initialInvestment: initialCash,
        monthlyContribution: Math.max(0, -firstMonthSavings),
        years: realEstateData.years,
        rate: SP500_RATE,
        netReturn: SP500_RATE,
        totalReturn: sp500Value - initialCash - realEstateResults.renterDeposits,
      },
      winner:
        ownerValue > sp500Value ? "user" : "sp500",
      difference: Math.abs(ownerValue - sp500Value),
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
