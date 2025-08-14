// utils/constants.ts - Import types without .ts extension
import type {
  InvestmentPreset,
  RealEstateDefaults,
  ValidationLimits,
  CurrencyFormat,
  TimePeriod,
} from "../types/types";

// S&P 500 historical average return rate
export const SP500_RATE = 7;

// Investment presets for quick setup
export const INVESTMENT_PRESETS: InvestmentPreset[] = [
  {
    name: "S&P 500 Index Fund",
    returnRate: 7,
    fees: 0.1,
    description: "Low-cost broad market index",
  },
  {
    name: "NASDAQ 100",
    returnRate: 10,
    fees: 0.2,
    description: "Tech-heavy growth index",
  },
  {
    name: "Conservative Bonds",
    returnRate: 4,
    fees: 0.5,
    description: "Stable fixed income",
  },
  {
    name: "High Growth Tech",
    returnRate: 12,
    fees: 0.8,
    description: "Aggressive growth strategy",
  },
  {
    name: "Dividend Aristocrats",
    returnRate: 8,
    fees: 0.3,
    description: "Stable dividend payers",
  },
];

// Real estate default values
export const REAL_ESTATE_DEFAULTS: RealEstateDefaults = {
  propertyValue: 500000,
  downPaymentPercent: 20,
  mortgageRate: 4,
  loanTerm: 30,
  propertyTax: 150,
  hoaFees: 250,
  insurance: 150,
  maintenance: 75,
  appreciation: 3,
  rentSavings: 1800,
};

// Validation limits
export const VALIDATION_LIMITS: ValidationLimits = {
  minInvestment: 1,
  maxInvestment: 10000000,
  minYears: 1,
  maxYears: 50,
  minRate: -20,
  maxRate: 50,
  minPropertyValue: 1000,
  maxPropertyValue: 50000000,
};

// Currency formatting options
export const CURRENCY_FORMAT: CurrencyFormat = {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
};

// Common time periods for investment calculations
export const COMMON_TIME_PERIODS: TimePeriod[] = [
  { years: 5, label: "5 years" },
  { years: 10, label: "10 years" },
  { years: 15, label: "15 years" },
  { years: 20, label: "20 years" },
  { years: 25, label: "25 years" },
  { years: 30, label: "30 years" },
];
