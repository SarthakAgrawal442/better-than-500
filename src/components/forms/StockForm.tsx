import { useState } from "react";
import { INVESTMENT_PRESETS } from "../../utils/constants";
import type { StockFormData } from "../../types/types";

interface StockFormProps {
  onSubmit: (data: StockFormData) => void;
}

function StockForm({ onSubmit }: StockFormProps) {
  // Use strings for form inputs
  const [formData, setFormData] = useState({
    name: "S&P 500",
    initialAmount: "1000",
    monthlyAmount: "100",
    returnRate: "7",
    feeRate: "0.1",
    years: "10",
  });

  // Update any form field
  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Apply preset values to form
  const applyPreset = (presetIndex: string) => {
    if (presetIndex === "") return;

    const preset = INVESTMENT_PRESETS[parseInt(presetIndex)];
    setFormData((prev) => ({
      ...prev,
      name: preset.name,
      returnRate: preset.returnRate.toString(),
      feeRate: preset.fees.toString(),
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Convert strings to numbers for the data object
    const data: StockFormData = {
      name: formData.name || "My Investment",
      initialAmount: parseFloat(formData.initialAmount) || 0,
      monthlyAmount: parseFloat(formData.monthlyAmount) || 0,
      returnRate: parseFloat(formData.returnRate) || 0,
      feeRate: parseFloat(formData.feeRate) || 0,
      years: parseInt(formData.years) || 1,
    };

    // Basic validation
    if (data.initialAmount <= 0) {
      alert("Please enter a valid initial amount");
      return;
    }
    if (data.years <= 0) {
      alert("Please enter a valid number of years");
      return;
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-6">
      {/* Header */}
      <div className="text-center mb-3 sm:mb-6">
        <h2 className="text-sm sm:text-lg font-bold text-gray-800">
          Compare Stocks/ETFs vs S&P 500
        </h2>
      </div>

      {/* Quick Presets */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          Quick Presets 🚀
        </label>
        <select
          onChange={(e) => applyPreset(e.target.value)}
          className="w-full px-2 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          defaultValue=""
        >
          <option value="">Choose preset...</option>
          {INVESTMENT_PRESETS.map((preset, index) => (
            <option key={index} value={index}>
              {preset.name} — {preset.returnRate}% return
            </option>
          ))}
        </select>
      </div>

      {/* Investment Name */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          Investment Name
        </label>
        <input
          type="text"
          placeholder="e.g., VFIAX, QQQ"
          className="w-full px-2 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
      </div>

      {/* Initial Amount and Monthly Contribution */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Initial ($)
          </label>
          <input
            type="number"
            placeholder="1000"
            className="w-full px-2 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.initialAmount}
            onChange={(e) => updateField("initialAmount", e.target.value)}
            min="0"
            step="any"
            required
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Monthly ($)
          </label>
          <input
            type="number"
            placeholder="100"
            className="w-full px-2 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.monthlyAmount}
            onChange={(e) => updateField("monthlyAmount", e.target.value)}
            min="0"
            step="any"
          />
        </div>
      </div>

      {/* Return Rate and Fees */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Return (%)
          </label>
          <input
            type="number"
            placeholder="7"
            className="w-full px-2 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.returnRate}
            onChange={(e) => updateField("returnRate", e.target.value)}
            min="0"
            step="any"
            required
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Fees (%)
          </label>
          <input
            type="number"
            placeholder="0.1"
            className="w-full px-2 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.feeRate}
            onChange={(e) => updateField("feeRate", e.target.value)}
            min="0"
            step="any"
          />
        </div>
      </div>

      {/* Time Period */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          Years
        </label>
        <input
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

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <span>📊</span>
        Compare with S&P 500
      </button>
    </form>
  );
}

export default StockForm;
