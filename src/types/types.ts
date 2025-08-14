// src/types/types.ts - ALL types in one place for easy management

// ============================================================================
// CORE CALCULATION TYPES
// ============================================================================

export interface InvestmentResult {
  name: string;
  futureValue: number;
  netReturn: number;
  years: number;
  initialInvestment: number;
  totalReturn: number;
  monthlyContribution?: number;
  rate: number;
  details?: RealEstateDetails; // For real estate calculations
}

export interface RealEstateDetails {
  propertyValue: number;
  futurePropertyValue: number;
  capitalGain: number;
  totalCashFlow: number;
  annualExpenses: number;
  monthlyExpenses: number;
  monthlyCashFlow: number;
  annualizedReturn: number;
  totalInterestPaid?: number;
  totalRentSaved?: number;
  propertyValueHistory?: number[];
  remainingMortgage?: number;
  equityFromPaydown?: number;
  totalEquity?: number;
  monthlyRent?: number;
}

export interface ComparisonResult {
  user: InvestmentResult;
  sp500: InvestmentResult;
  winner: "user" | "sp500";
  difference: number;
}

// ============================================================================
// FORM DATA TYPES
// ============================================================================

export interface StockFormData {
  name: string;
  initialAmount: number;
  monthlyAmount: number;
  returnRate: number;
  feeRate: number;
  years: number;
}

export interface RealEstateFormData {
  name: string;
  propertyValue: number;
  downPayment: number;
  annualRate: number;
  loanTermYears: number;
  monthlyTax: number;
  monthlyHOA: number;
  monthlyInsurance: number;
  monthlyMaintenance: number;
  annualAppreciation: number;
  monthlyRentSavings: number;
  years: number;
}

// Form state types (string versions for form inputs)
export interface StockFormState {
  name: string;
  initialAmount: string;
  monthlyAmount: string;
  returnRate: string;
  feeRate: string;
  years: string;
}

export interface RealEstateFormState {
  name: string;
  propertyValue: string;
  downPayment: string;
  annualMortgageInterestRate: string;
  loanTermYears: string;
  monthlyPropertyTax: string;
  monthlyHoa: string;
  monthlyInsurance: string;
  monthlyMaintenance: string;
  annualAppreciation: string;
  estimatedMonthlyRentSavings: string;
  years: string;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface StockFormProps {
  onSubmit: (data: StockFormData) => void;
}

export interface RealEstateFormProps {
  onSubmit: (data: RealEstateFormData) => void;
}

export interface SimpleResultsProps {
  data: ComparisonResult;
  type: InvestmentType;
  onClear: () => void;
}

export interface DetailedBreakdownProps {
  data: ComparisonResult;
  type: InvestmentType;
}

export interface TabSwitcherProps {
  activeTab: InvestmentType;
  onTabChange: (tabName: InvestmentType) => void;
  onClear?: () => void;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface InvestmentPreset {
  name: string;
  returnRate: number;
  fees: number;
  description: string;
}

export interface RealEstateDefaults {
  propertyValue: number;
  downPaymentPercent: number;
  mortgageRate: number;
  loanTerm: number;
  propertyTax: number;
  hoaFees: number;
  insurance: number;
  maintenance: number;
  appreciation: number;
  rentSavings: number;
}

export interface ValidationLimits {
  minInvestment: number;
  maxInvestment: number;
  minYears: number;
  maxYears: number;
  minRate: number;
  maxRate: number;
  minPropertyValue: number;
  maxPropertyValue: number;
}

export interface CurrencyFormat {
  style: "currency";
  currency: "USD";
  maximumFractionDigits: number;
}

export interface TimePeriod {
  years: number;
  label: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

// EXPORT THIS TYPE SO WE CAN USE IT EVERYWHERE
export type InvestmentType = "stocks" | "realestate";

export type TabType = "stocks" | "realestate";

export type WinnerType = "user" | "sp500";

// Hook return types
export interface UseInvestmentCalculatorReturn {
  calculateInvestment: (
    formData: StockFormData | RealEstateFormData,
    type: InvestmentType
  ) => Promise<ComparisonResult | null>;
  isCalculating: boolean;
  error: Error | null;
  clearError: () => void;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// ============================================================================
// LEGACY TYPES (for backwards compatibility - can be removed later)
// ============================================================================

/** @deprecated Use RealEstateDetails instead */
export interface RealEstateResult extends RealEstateDetails {
  name: string;
  years: number;
  netReturn: number;
  futureValue: number;
  annualReturn: number;
  totalAnnualExpenses: number;
  annualCashFlow: number;
  downPayment: string;
}

/** @deprecated Use RealEstateFormState instead */
export interface FormFieldConfig {
  name: keyof RealEstateFormState;
  label: string;
  type: "text" | "number";
  placeholder: string;
  tooltip?: string;
}