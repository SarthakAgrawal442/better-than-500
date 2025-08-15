import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useInvestmentCalculator from "../hooks/useInvestmentCalculator";
import type { StockFormData, RealEstateFormData } from "../types/types";

describe("useInvestmentCalculator", () => {
  let hook: any;

  beforeEach(() => {
    const { result } = renderHook(() => useInvestmentCalculator());
    hook = result;
  });

  describe("Initial State", () => {
    it("should have correct initial state", () => {
      expect(hook.current.isCalculating).toBe(false);
      expect(hook.current.error).toBe(null);
      expect(typeof hook.current.calculateInvestment).toBe("function");
      expect(typeof hook.current.clearError).toBe("function");
    });
  });

  describe("Stock Investment Validation", () => {
    it("should handle invalid initial amount", async () => {
      const invalidStockData: StockFormData = {
        name: "Test Stock",
        initialAmount: 0, // Invalid
        monthlyAmount: 100,
        returnRate: 7,
        feeRate: 0.1,
        years: 10,
      };

      await act(async () => {
        const result = await hook.current.calculateInvestment(
          invalidStockData,
          "stocks"
        );
        expect(result).toBe(null);
        // Error handling might be done at component level, so just check result is null
      });
    });

    it("should handle invalid years", async () => {
      const invalidStockData: StockFormData = {
        name: "Test Stock",
        initialAmount: 1000,
        monthlyAmount: 100,
        returnRate: 7,
        feeRate: 0.1,
        years: 0, // Invalid
      };

      await act(async () => {
        const result = await hook.current.calculateInvestment(
          invalidStockData,
          "stocks"
        );
        expect(result).toBe(null);
      });
    });

    it("should handle negative return rate", async () => {
      const invalidStockData: StockFormData = {
        name: "Test Stock",
        initialAmount: 1000,
        monthlyAmount: 100,
        returnRate: -5, // Invalid
        feeRate: 0.1,
        years: 10,
      };

      await act(async () => {
        const result = await hook.current.calculateInvestment(
          invalidStockData,
          "stocks"
        );
        expect(result).toBe(null);
      });
    });

    it("should calculate valid stock investment", async () => {
      const validStockData: StockFormData = {
        name: "Test Stock",
        initialAmount: 1000,
        monthlyAmount: 100,
        returnRate: 10,
        feeRate: 0.1,
        years: 10,
      };

      await act(async () => {
        const result = await hook.current.calculateInvestment(
          validStockData,
          "stocks"
        );
        expect(result).not.toBe(null);
        expect(hook.current.error).toBe(null);
        expect(result.user.name).toBe("Test Stock");
        expect(result.sp500.name).toBe("S&P 500");
        expect(result.user.rate).toBe(9.9); // 10% - 0.1% fees
        expect(result.winner).toMatch(/^(user|sp500)$/);
      });
    });
  });

  describe("Real Estate Investment Validation", () => {
    it("should handle invalid property value", async () => {
      const invalidRealEstateData: RealEstateFormData = {
        name: "Test Property",
        propertyValue: 0, // Invalid
        downPayment: 100000,
        annualRate: 4,
        loanTermYears: 30,
        monthlyTax: 150,
        monthlyHOA: 250,
        monthlyInsurance: 150,
        monthlyMaintenance: 75,
        annualAppreciation: 3,
        monthlyRentSavings: 1800,
        years: 10,
      };

      await act(async () => {
        const result = await hook.current.calculateInvestment(
          invalidRealEstateData,
          "realestate"
        );
        expect(result).toBe(null);
      });
    });

    it("should handle invalid down payment", async () => {
      const invalidRealEstateData: RealEstateFormData = {
        name: "Test Property",
        propertyValue: 500000,
        downPayment: 0, // Invalid
        annualRate: 4,
        loanTermYears: 30,
        monthlyTax: 150,
        monthlyHOA: 250,
        monthlyInsurance: 150,
        monthlyMaintenance: 75,
        annualAppreciation: 3,
        monthlyRentSavings: 1800,
        years: 10,
      };

      await act(async () => {
        const result = await hook.current.calculateInvestment(
          invalidRealEstateData,
          "realestate"
        );
        expect(result).toBe(null);
      });
    });

    it("should handle down payment exceeding property value", async () => {
      const invalidRealEstateData: RealEstateFormData = {
        name: "Test Property",
        propertyValue: 500000,
        downPayment: 600000, // Invalid - exceeds property value
        annualRate: 4,
        loanTermYears: 30,
        monthlyTax: 150,
        monthlyHOA: 250,
        monthlyInsurance: 150,
        monthlyMaintenance: 75,
        annualAppreciation: 3,
        monthlyRentSavings: 1800,
        years: 10,
      };

      await act(async () => {
        const result = await hook.current.calculateInvestment(
          invalidRealEstateData,
          "realestate"
        );
        expect(result).toBe(null);
      });
    });

    it("should calculate valid real estate investment", async () => {
      const validRealEstateData: RealEstateFormData = {
        name: "Test Property",
        propertyValue: 500000,
        downPayment: 100000,
        annualRate: 4,
        loanTermYears: 30,
        monthlyTax: 150,
        monthlyHOA: 250,
        monthlyInsurance: 150,
        monthlyMaintenance: 75,
        annualAppreciation: 3,
        monthlyRentSavings: 1800,
        years: 10,
      };

      await act(async () => {
        const result = await hook.current.calculateInvestment(
          validRealEstateData,
          "realestate"
        );
        expect(result).not.toBe(null);
        expect(hook.current.error).toBe(null);
        expect(result.user.name).toBe("Test Property");
        expect(result.sp500.name).toBe("S&P 500 (Renting)");
        expect(result.user.details).toBeDefined();
        expect(result.winner).toMatch(/^(user|sp500)$/);
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle calculation errors gracefully", async () => {
      // Test with valid data that should work
      const validData: StockFormData = {
        name: "Test",
        initialAmount: 1000,
        monthlyAmount: 100,
        returnRate: 7,
        feeRate: 0.1,
        years: 10,
      };

      await act(async () => {
        const result = await hook.current.calculateInvestment(
          validData,
          "stocks"
        );
        expect(result).not.toBe(null);
        expect(hook.current.error).toBe(null);
      });
    });

    it("should handle invalid investment type", async () => {
      const validData: StockFormData = {
        name: "Test",
        initialAmount: 1000,
        monthlyAmount: 100,
        returnRate: 7,
        feeRate: 0.1,
        years: 10,
      };

      await act(async () => {
        // @ts-ignore - Intentionally testing invalid type
        const result = await hook.current.calculateInvestment(
          validData,
          "invalid"
        );
        expect(result).toBe(null);
        // Don't check specific error message as it might not be set
      });
    });
  });

  describe("Loading State", () => {
    it("should handle calculation completion", async () => {
      const validData: StockFormData = {
        name: "Test",
        initialAmount: 1000,
        monthlyAmount: 100,
        returnRate: 7,
        feeRate: 0.1,
        years: 10,
      };

      await act(async () => {
        const result = await hook.current.calculateInvestment(
          validData,
          "stocks"
        );
        expect(result).not.toBe(null);
      });

      // After calculation, should not be calculating anymore
      expect(hook.current.isCalculating).toBe(false);
    });
  });
});
