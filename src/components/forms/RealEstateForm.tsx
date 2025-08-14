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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-1xl font-bold text-gray-800">
          Compare Home Ownership vs Renting + S&P 500 Investing
        </h2>
        {/* <p className="text-gray-600">
          Compare home ownership against renting + S&P 500 investing
        </p> */}
        {/* <p className="text-xs text-gray-500 mt-2">
          We'll compare buying this property vs renting and investing the
          difference in S&P 500
        </p> */}
      </div>

      {/* Investment Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Investment Name
        </label>
        <input
          type="text"
          placeholder="My Property"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
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
            placeholder="500000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.propertyValue}
            onChange={(e) => handlePropertyValueChange(e.target.value)}
            min="0"
            step="any"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Down Payment ($)
          </label>
          <input
            type="number"
            placeholder="100000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.downPayment}
            onChange={(e) => updateField("downPayment", e.target.value)}
            min="0"
            step="any"
            required
          />
        </div>
      </div>

      {/* Mortgage Rate and Loan Term */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mortgage Interest Rate (%)
          </label>
          <input
            type="number"
            placeholder="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Term (Years)
          </label>
          <input
            type="number"
            placeholder="30"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Similar Property Rent Monthly ($)
          <span className="block text-xs text-gray-500 font-normal mt-1">
            What you would pay to rent a similar property
          </span>
        </label>
        <input
          type="number"
          placeholder="1800"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Property Tax ($)
          </label>
          <input
            type="number"
            placeholder="150"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.monthlyPropertyTax}
            onChange={(e) => updateField("monthlyPropertyTax", e.target.value)}
            min="0"
            step="any"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly HOA Fees ($)
          </label>
          <input
            type="number"
            placeholder="250"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.monthlyHoa}
            onChange={(e) => updateField("monthlyHoa", e.target.value)}
            min="0"
            step="any"
            required
          />
        </div>
      </div>

      {/* Insurance and Maintenance */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Home Insurance ($)
          </label>
          <input
            type="number"
            placeholder="150"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.monthlyInsurance}
            onChange={(e) => updateField("monthlyInsurance", e.target.value)}
            min="0"
            step="any"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Maintenance ($)
          </label>
          <input
            type="number"
            placeholder="75"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.monthlyMaintenance}
            onChange={(e) => updateField("monthlyMaintenance", e.target.value)}
            min="0"
            step="any"
            required
          />
        </div>
      </div>

      {/* Appreciation and Holding Period */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Appreciation (%)
          </label>
          <input
            type="number"
            placeholder="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.annualAppreciation}
            onChange={(e) => updateField("annualAppreciation", e.target.value)}
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
            placeholder="10"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.years}
            onChange={(e) => updateField("years", e.target.value)}
            min="1"
            max="50"
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">How the comparison works:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Option 1: Buy the property with your down payment</li>
          <li>
            Option 2: Rent a similar property and invest your down payment in
            S&P 500
          </li>
          <li>
            If owning costs more than rent, the difference is invested monthly
            in S&P 500
          </li>
          <li>
            We compare total equity (property value - mortgage) vs S&P 500
            portfolio value
          </li>
        </ul>
      </div> */}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <span>🏠</span>
        Calculate Real Estate Returns
      </button>
    </form>
  );
}

export default RealEstateForm;
