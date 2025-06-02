// RealEstateForm.tsx
import React, { useState, useMemo } from "react";
import type { RealEstateFormProps } from "../types/types";

const RealEstateForm: React.FC<RealEstateFormProps> = ({ onResult }) => {
  const [form, setForm] = useState({
    name: "Real Estate",
    propertyValue: "500000",
    downPayment: "100000",
    annualMortgageInterestRate: "4",
    loanTermYears: "30",
    monthlyPropertyTax: "400",
    monthlyHoa: "200",
    monthlyInsurance: "150",
    monthlyMaintenance: "200",
    annualAppreciation: "3",
    years: "10",
    estimatedMonthlyRentSavings: "1800",
  });

  const parseNumber = (value: string): number => parseFloat(value) || 0;

  const calculateMortgagePayment = (
    principal: number,
    monthlyRate: number,
    numPayments: number
  ): number => {
    if (principal <= 0 || monthlyRate <= 0 || numPayments <= 0) return 0;

    const r = monthlyRate;
    const n = numPayments;
    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  const calculations = useMemo(() => {
    const propertyValue = parseNumber(form.propertyValue);
    const downPayment = parseNumber(form.downPayment);
    const loanAmount = propertyValue - downPayment;
    const monthlyRate = parseNumber(form.annualMortgageInterestRate) / 100 / 12;
    const numPayments = parseInt(form.loanTermYears) * 12;

    const monthlyMortgage = calculateMortgagePayment(
      loanAmount,
      monthlyRate,
      numPayments
    );

    const monthlyExpenses =
      monthlyMortgage +
      parseNumber(form.monthlyPropertyTax) +
      parseNumber(form.monthlyHoa) +
      parseNumber(form.monthlyInsurance) +
      parseNumber(form.monthlyMaintenance);

    const monthlyRentSavings = parseNumber(form.estimatedMonthlyRentSavings);
    const netMonthlyCost = monthlyExpenses - monthlyRentSavings;

    return {
      propertyValue,
      downPayment,
      loanAmount,
      monthlyMortgage,
      monthlyExpenses,
      monthlyRentSavings,
      netMonthlyCost,
      annualExpenses: monthlyExpenses * 12,
      netAnnualCost: netMonthlyCost * 12,
    };
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "propertyValue") {
      const propertyValue = parseNumber(value);
      const suggestedDownPayment = (propertyValue * 0.2).toString();
      setForm((prev) => ({
        ...prev,
        propertyValue: value,
        downPayment: suggestedDownPayment,
      }));
      return;
    }

    if (name === "downPayment") {
      const downPaymentValue = parseNumber(value);
      const propertyValue = parseNumber(form.propertyValue);
      if (downPaymentValue > propertyValue) {
        alert("Down payment cannot exceed property value.");
        return;
      }
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = (): string | null => {
    const propertyValue = parseNumber(form.propertyValue);
    const downPayment = parseNumber(form.downPayment);
    const interestRate = parseNumber(form.annualMortgageInterestRate);
    const loanTerm = parseInt(form.loanTermYears);
    const years = parseInt(form.years);
    const appreciation = parseNumber(form.annualAppreciation);
    const rentSavings = parseNumber(form.estimatedMonthlyRentSavings);

    if (propertyValue <= 0) return "Please enter a valid property value.";
    if (downPayment <= 0 || downPayment > propertyValue)
      return "Please enter a valid down payment.";
    if (interestRate <= 0)
      return "Please enter a valid mortgage interest rate.";
    if (loanTerm <= 0) return "Please enter a valid loan term.";
    if (years <= 0) return "Please enter a valid holding period.";
    if (appreciation < 0) return "Annual appreciation cannot be negative.";
    if (rentSavings < 0) return "Rent savings cannot be negative.";

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateInputs();
    if (validationError) {
      alert(validationError);
      return;
    }

    const years = parseInt(form.years);
    const propertyValue = calculations.propertyValue;
    const downPayment = calculations.downPayment;
    const annualAppreciation = parseNumber(form.annualAppreciation) / 100;
    const monthlyRentSavings = calculations.monthlyRentSavings;

    const futurePropertyValue =
      propertyValue * Math.pow(1 + annualAppreciation, years);
    const capitalGain = futurePropertyValue - propertyValue;

    const totalRentSaved = monthlyRentSavings * 12 * years;
    const totalExpenses = calculations.annualExpenses * years;
    const totalCashFlow = totalRentSaved - totalExpenses;

    const totalReturn = capitalGain + totalCashFlow;

    const futureValue = downPayment + totalReturn;
    const annualizedReturn =
      futureValue > 0
        ? (Math.pow(futureValue / downPayment, 1 / years) - 1) * 100
        : -100;

    const propertyValueHistory = Array.from(
      { length: years + 1 },
      (_, i) => propertyValue * Math.pow(1 + annualAppreciation, i)
    );

    const totalMortgagePayments = calculations.monthlyMortgage * 12 * years;
    const principalPaidDown = Math.min(
      totalMortgagePayments,
      calculations.loanAmount
    );
    const totalInterestPaid = totalMortgagePayments - principalPaidDown;

    onResult({
      name: form.name,
      years,
      netReturn: annualizedReturn,
      futureValue,
      annualReturn: parseNumber(form.annualAppreciation),
      totalAnnualExpenses: calculations.annualExpenses,
      annualCashFlow: totalRentSaved / years - calculations.annualExpenses,
      totalCashFlow,
      capitalGain,
      propertyValue,
      futurePropertyValue,
      totalReturn,
      totalInterestPaid,
      totalRentSaved,
      propertyValueHistory,
      downPayment: downPayment.toString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Investment Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Investment Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="Real Estate"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={form.name}
          onChange={handleChange}
        />
      </div>

      {/* Property Value and Down Payment */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Value ($)
          </label>
          <input
            type="number"
            name="propertyValue"
            placeholder="500000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={form.propertyValue}
            onChange={handleChange}
            min="0"
            step="any"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Down Payment ($) 💡
          </label>
          <input
            type="number"
            name="downPayment"
            placeholder="100000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={form.downPayment}
            onChange={handleChange}
            min="0"
            step="any"
            required
          />
        </div>
      </div>

      {/* Annual Mortgage Interest Rate and Loan Term */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Mortgage Interest Rate (%)
          </label>
          <input
            type="number"
            name="annualMortgageInterestRate"
            placeholder="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={form.annualMortgageInterestRate}
            onChange={handleChange}
            min="0"
            step="any"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Term (Years)
          </label>
          <input
            type="number"
            name="loanTermYears"
            placeholder="30"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={form.loanTermYears}
            onChange={handleChange}
            min="0"
            step="any"
            required
          />
        </div>
      </div>

      {/* Estimated Monthly Rent Savings */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Estimated Monthly Rent Savings ($)
        </label>
        <input
          type="number"
          name="estimatedMonthlyRentSavings"
          placeholder="1800"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={form.estimatedMonthlyRentSavings}
          onChange={handleChange}
          min="0"
          step="any"
          required
        />
      </div>

      {/* Monthly Property Tax and Monthly Strata/HOA Fees */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Property Tax ($)
          </label>
          <input
            type="number"
            name="monthlyPropertyTax"
            placeholder="400"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={form.monthlyPropertyTax}
            onChange={handleChange}
            min="0"
            step="any"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Strata / HOA Fees ($)
          </label>
          <input
            type="number"
            name="monthlyHoa"
            placeholder="200"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={form.monthlyHoa}
            onChange={handleChange}
            min="0"
            step="any"
            required
          />
        </div>
      </div>

      {/* Monthly Home Insurance and Monthly Maintenance & Repairs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Home Insurance ($)
          </label>
          <input
            type="number"
            name="monthlyInsurance"
            placeholder="150"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={form.monthlyInsurance}
            onChange={handleChange}
            min="0"
            step="any"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Maintenance & Repairs ($)
          </label>
          <input
            type="number"
            name="monthlyMaintenance"
            placeholder="200"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={form.monthlyMaintenance}
            onChange={handleChange}
            min="0"
            step="any"
            required
          />
        </div>
      </div>

      {/* Expected Annual Appreciation and Holding Period */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Annual Appreciation (%)
          </label>
          <input
            type="number"
            name="annualAppreciation"
            placeholder="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={form.annualAppreciation}
            onChange={handleChange}
            min="0"
            step="any"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Holding Period (Years)
          </label>
          <input
            type="number"
            name="years"
            placeholder="10"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={form.years}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
      </div>

      {/* Cash Flow Preview */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-bold text-gray-800 mb-3">
          Cash Flow Preview
        </h3>
        <div className="grid grid-cols-2 gap-8 text-sm">
          {/* Left Column */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Mortgage:</span>
              <span className="font-medium">
                ${calculations.monthlyMortgage.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-gray-600">Total Monthly Expenses:</span>
              <span className="font-medium text-red-600">
                ${calculations.monthlyExpenses.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Rent Savings:</span>
              <span className="font-medium text-green-600">
                +${calculations.monthlyRentSavings.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="font-medium text-gray-800">
                Net Monthly Cost:
              </span>
              <span
                className={`font-bold ${
                  calculations.netMonthlyCost >= 0
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                ${calculations.netMonthlyCost.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
      >
        Calculate Home Ownership Return
      </button>
    </form>
  );
};

export default RealEstateForm;
