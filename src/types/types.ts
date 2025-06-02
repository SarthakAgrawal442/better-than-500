/**
 * Represents the result of an investment calculation
 */
export interface InvestmentResult {
  /** Name of the investment */
  name: string;
  /** Future value of the investment */
  futureValue: number;
  /** Annualized return percentage */
  netReturn: number;
  /** Investment duration in years */
  years: number;
  /** Initial investment amount */
  initialInvestment: number;
  /** Total return on investment (percentage) */
  totalReturn: number;
}

/**
 * Represents the result of a real estate investment calculation
 */
export interface RealEstateResult {
  /** Name of the real estate investment */
  name: string;
  /** Investment duration in years */
  years: number;
  /** Annualized return percentage on down payment invested */
  netReturn: number;
  /** Future value of the investment (down payment + total return) */
  futureValue: number;
  /** Expected annual property appreciation rate (%) */
  annualReturn: number;
  /** Total annual expenses for property ownership */
  totalAnnualExpenses: number;
  /** Annual cash flow (rent savings - annual expenses) */
  annualCashFlow: number;
  /** Total cash flow over the investment period */
  totalCashFlow: number;
  /** Capital gain from property value appreciation */
  capitalGain: number;
  /** Current property value */
  propertyValue: number;
  /** Projected future property value */
  futurePropertyValue: number;
  /** Total return amount (capital gain + total cash flow) */
  totalReturn: number;
  /** Total interest paid on mortgage over holding period */
  totalInterestPaid: number;
  /** Total rent saved by owning instead of renting */
  totalRentSaved: number;
  /** Historical property values over time (year 0 to final year) */
  propertyValueHistory: number[];
  /** Down payment amount (initial cash investment) */
  downPayment: string;
}

/**
 * Props for the RealEstateForm component
 */
export interface RealEstateFormProps {
  /** Callback function that receives the calculation results */
  onResult: (result: RealEstateResult) => void;
}

/**
 * Form state interface for better type safety in the component
 */
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
  years: string;
  estimatedMonthlyRentSavings: string;
}

/**
 * Input field configuration for dynamic form rendering
 */
export interface FormFieldConfig {
  name: keyof RealEstateFormState;
  label: string;
  type: "text" | "number";
  placeholder: string;
  tooltip?: string;
}
