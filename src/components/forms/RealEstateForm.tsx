import { useState } from "react";
import { REAL_ESTATE_DEFAULTS } from "../../utils/constants";
import type { RealEstateFormData } from "../../types/types";

interface RealEstateFormProps {
  onSubmit: (data: RealEstateFormData) => void;
}

function RealEstateForm({ onSubmit }: RealEstateFormProps) {
  // Use strings for form inputs
  const [formData, setFormData] = useState({
    name: "Real Estate Investment",
    propertyValue: REAL_ESTATE_DEFAULTS.propertyValue.toString(),
    downPayment: (REAL_ESTATE_DEFAULTS.propertyValue * 0.2).toString(),
    annualMortgageInterestRate: REAL_ESTATE_DEFAULTS.mortgageRate.toString(),
    loanTermYears: REAL_ESTATE_DEFAULTS.loanTerm.toString(),
    monthlyPropertyTax: REAL_ESTATE_DEFAULTS.propertyTax.toString(),
    monthlyHoa: REAL_ESTATE_DEFAULTS.hoaFees.toString(),
    monthlyInsurance: REAL_ESTATE_DEFAULTS.insurance.toString(),
    monthlyMaintenance: REAL_ESTATE_DEFAULTS.maintenance.toString(),
    annualAppreciation: REAL_ESTATE_DEFAULTS.appreciation.toString(),
    estimatedMonthlyRentSavings: REAL_ESTATE_DEFAULTS.rentSavings.toString(),
    purchaseCostPercent: "0",
    saleCostPercent: "0",
    rentGrowth: "0",
    expenseGrowth: "0",
    years: "10",
  });

  // Update any form field
  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Auto-calculate down payment when property value changes
  const handlePropertyValueChange = (value: string) => {
    const propertyValue = parseFloat(value) || 0;
    const suggestedDownPayment = (propertyValue * 0.2).toString();

    setFormData((prev) => ({
      ...prev,
      propertyValue: value,
      downPayment: suggestedDownPayment,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert strings to numbers for the calculation data
    const calculationData: RealEstateFormData = {
      name: formData.name || "Real Estate Investment",
      propertyValue: parseFloat(formData.propertyValue) || 0,
      downPayment: parseFloat(formData.downPayment) || 0,
      annualRate: parseFloat(formData.annualMortgageInterestRate) || 0,
      loanTermYears: parseInt(formData.loanTermYears) || 30,
      monthlyTax: parseFloat(formData.monthlyPropertyTax) || 0,
      monthlyHOA: parseFloat(formData.monthlyHoa) || 0,
      monthlyInsurance: parseFloat(formData.monthlyInsurance) || 0,
      monthlyMaintenance: parseFloat(formData.monthlyMaintenance) || 0,
      annualAppreciation: parseFloat(formData.annualAppreciation) || 0,
      monthlyRentSavings: parseFloat(formData.estimatedMonthlyRentSavings) || 0,
      purchaseCostPercent: Number(formData.purchaseCostPercent),
      saleCostPercent: Number(formData.saleCostPercent),
      rentGrowth: Number(formData.rentGrowth),
      expenseGrowth: Number(formData.expenseGrowth),
      years: parseInt(formData.years) || 1,
    };

    // Basic validation
    if (calculationData.propertyValue <= 0) {
      alert("Please enter a valid property value");
      return;
    }
    if (
      calculationData.downPayment <= 0 ||
      calculationData.downPayment > calculationData.propertyValue
    ) {
      alert("Please enter a valid down payment");
      return;
    }
    if (calculationData.years <= 0) {
      alert("Please enter a valid holding period");
      return;
    }

    onSubmit(calculationData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-sm sm:text-lg font-bold text-gray-800">
          Home vs Rent + S&P 500
        </h2>
      </div>

      {/* Investment Name */}
      <div>
        <label htmlFor="RealEstateForm-investment-name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          Investment Name
        </label>
        <input id="RealEstateForm-investment-name"
          type="text"
          placeholder="My Property"
          className="w-full px-2 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
      </div>

      {/* Property Value and Down Payment */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <div>
          <label htmlFor="RealEstateForm-property" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Property ($)
          </label>
          <input id="RealEstateForm-property"
            type="number"
            placeholder="500000"
            className="w-full px-2 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.propertyValue}
            onChange={(e) => handlePropertyValueChange(e.target.value)}
            min="0"
            step="any"
            required
          />
        </div>
        <div>
          <label htmlFor="RealEstateForm-down-pay" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Down Pay ($)
          </label>
          <input id="RealEstateForm-down-pay"
            type="number"
            placeholder="100000"
            className="w-full px-2 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.downPayment}
            onChange={(e) => updateField("downPayment", e.target.value)}
            min="0"
            step="any"
            required
          />
        </div>
      </div>

      {/* Mortgage Rate and Loan Term */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <div>
          <label htmlFor="RealEstateForm-mortgage" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Mortgage (%)
          </label>
          <input id="RealEstateForm-mortgage"
            type="number"
            placeholder="4"
            className="w-full px-2 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.annualMortgageInterestRate}
            onChange={(e) =>
              updateField("annualMortgageInterestRate", e.target.value)
            }
            min="0"
            step="any"
            required
          />
        </div>
        <div>
          <label htmlFor="RealEstateForm-loan-term-y" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Loan Term (Y)
          </label>
          <input id="RealEstateForm-loan-term-y"
            type="number"
            placeholder="30"
            className="w-full px-2 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.loanTermYears}
            onChange={(e) => updateField("loanTermYears", e.target.value)}
            min="1"
            step="1"
            required
          />
        </div>
      </div>

      {/* Monthly Rent Savings */}
      <div>
        <label htmlFor="RealEstateForm-rent" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          Comparable monthly rent ($)
        </label>
        <input id="RealEstateForm-rent"
          type="number"
          placeholder="1800"
          className="w-full px-2 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={formData.estimatedMonthlyRentSavings}
          onChange={(e) =>
            updateField("estimatedMonthlyRentSavings", e.target.value)
          }
          min="0"
          step="any"
          required
        />
      </div>

      {/* Property Tax and HOA */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <div>
          <label htmlFor="RealEstateForm-tax" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Monthly tax ($)
          </label>
          <input id="RealEstateForm-tax"
            type="number"
            placeholder="150"
            className="w-full px-2 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.monthlyPropertyTax}
            onChange={(e) => updateField("monthlyPropertyTax", e.target.value)}
            min="0"
            step="any"
            required
          />
        </div>
        <div>
          <label htmlFor="RealEstateForm-hoa" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Monthly HOA ($)
          </label>
          <input id="RealEstateForm-hoa"
            type="number"
            placeholder="250"
            className="w-full px-2 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.monthlyHoa}
            onChange={(e) => updateField("monthlyHoa", e.target.value)}
            min="0"
            step="any"
            required
          />
        </div>
      </div>

      {/* Insurance and Maintenance */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <div>
          <label htmlFor="RealEstateForm-insurance" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Monthly insurance ($)
          </label>
          <input id="RealEstateForm-insurance"
            type="number"
            placeholder="150"
            className="w-full px-2 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.monthlyInsurance}
            onChange={(e) => updateField("monthlyInsurance", e.target.value)}
            min="0"
            step="any"
            required
          />
        </div>
        <div>
          <label htmlFor="RealEstateForm-maintenance" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Monthly maintenance ($)
          </label>
          <input id="RealEstateForm-maintenance"
            type="number"
            placeholder="75"
            className="w-full px-2 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.monthlyMaintenance}
            onChange={(e) => updateField("monthlyMaintenance", e.target.value)}
            min="0"
            step="any"
            required
          />
        </div>
      </div>

      {/* Appreciation and Holding Period */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <div>
          <label htmlFor="RealEstateForm-appreciation" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Appreciation (%)
          </label>
          <input id="RealEstateForm-appreciation"
            type="number"
            placeholder="3"
            className="w-full px-2 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.annualAppreciation}
            onChange={(e) => updateField("annualAppreciation", e.target.value)}
            min="0"
            step="any"
            required
          />
        </div>
        <div>
          <label htmlFor="RealEstateForm-years" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Years
          </label>
          <input id="RealEstateForm-years"
            type="number"
            placeholder="10"
            className="w-full px-2 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.years}
            onChange={(e) => updateField("years", e.target.value)}
            min="1"
            max="50"
            required
          />
        </div>
      </div>

      <details className="assumptions"><summary>Comparison assumptions</summary>
      <fieldset className="grid gap-3 sm:grid-cols-2">
        <legend className="sr-only">Comparison assumptions</legend>
        {([
          ["purchaseCostPercent", "Purchase costs (% of purchase price)"],
          ["saleCostPercent", "Selling costs (% of final home value)"],
          ["rentGrowth", "Annual rent growth (%)"],
          ["expenseGrowth", "Annual growth in non-mortgage ownership costs (%)"],
        ] as const).map(([key, label]) => (
          <label key={key} className="text-sm">{label}
            <input className="w-full rounded-lg border p-2" type="number"
              min={key.endsWith("Growth") ? -100 : 0} max={100}
              step="any" value={formData[key]} onChange={e => updateField(key, e.target.value)} />
          </label>
        ))}
      </fieldset>
      <p className="text-sm text-gray-600">Both households invest monthly savings at an assumed 7% effective annual total return with dividends reinvested. Use nominal dollars. Results are before income and capital gains taxes. Growth in rent and recurring expenses starts in year two.</p>
      </details>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        Calculate Returns
      </button>
    </form>
  );
}

export default RealEstateForm;
