import { useState } from "react";
import { calculateInvestmentComparison } from "../utils/calculations";
import type {
  ComparisonResult,
  StockFormData,
  RealEstateFormData,
  InvestmentType,
  ValidationResult,
} from "../types/types";

type FormData = StockFormData | RealEstateFormData;

interface UseInvestmentCalculatorReturn {
  isCalculating: boolean;
  error: Error | null;
  calculateInvestment: (
    formData: FormData,
    type: InvestmentType
  ) => Promise<ComparisonResult | null>;
  clearError: () => void;
}

/**
 * Validate form inputs before calculation
 */
function validateInputs(
  formData: FormData,
  type: InvestmentType
): ValidationResult {
  if (type === "stocks") {
    const stockData = formData as StockFormData;

    if (!stockData.initialAmount || stockData.initialAmount <= 0) {
      return { isValid: false, error: "Please enter a valid initial amount" };
    }
    if (!stockData.years || stockData.years <= 0) {
      return { isValid: false, error: "Please enter a valid number of years" };
    }
    if (stockData.returnRate < 0) {
      return { isValid: false, error: "Return rate cannot be negative" };
    }
    return { isValid: true };
  }

  if (type === "realestate") {
    const realEstateData = formData as RealEstateFormData;

    if (!realEstateData.propertyValue || realEstateData.propertyValue <= 0) {
      return { isValid: false, error: "Please enter a valid property value" };
    }
    if (!realEstateData.downPayment || realEstateData.downPayment <= 0) {
      return { isValid: false, error: "Please enter a valid down payment" };
    }
    if (realEstateData.downPayment > realEstateData.propertyValue) {
      return {
        isValid: false,
        error: "Down payment cannot exceed property value",
      };
    }
    if (!realEstateData.years || realEstateData.years <= 0) {
      return { isValid: false, error: "Please enter a valid holding period" };
    }
    return { isValid: true };
  }

  return { isValid: false, error: "Unknown investment type" };
}

/**
 * Custom hook for investment calculations
 */
function useInvestmentCalculator(): UseInvestmentCalculatorReturn {
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const clearError = () => setError(null);

  const calculateInvestment = async (
    formData: FormData,
    type: InvestmentType
  ): Promise<ComparisonResult | null> => {
    setIsCalculating(true);
    setError(null);

    try {
      // Validate inputs first
      const validation = validateInputs(formData, type);

      if (!validation.isValid) {
        const errorMessage = validation.error || "Validation failed";
        setError(new Error(errorMessage));
        setIsCalculating(false);
        return null;
      }

      // Do the actual calculation
      const results = calculateInvestmentComparison(formData, type);

      setIsCalculating(false);
      return results;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Calculation failed. Please check your inputs.";
      setError(new Error(errorMessage));
      setIsCalculating(false);
      return null;
    }
  };

  return {
    calculateInvestment,
    isCalculating,
    error,
    clearError,
  };
}

export default useInvestmentCalculator;
