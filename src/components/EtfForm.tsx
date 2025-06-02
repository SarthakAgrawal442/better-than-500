//EtfForm.tsx
import { useState } from "react";
import { TrendingUp } from "lucide-react";

interface FormState {
  name: string;
  amount: string;
  monthlyContribution: string;
  returnRate: string;
  years: string;
  feeRate: string;
}

interface ResultState {
  name: string;
  principal: number;
  monthlyContribution: number;
  userRate: number;
  userFV: number;
  years: number;
  sp500Rate: number;
  sp500FV: number;
  feeRate: number;
}

interface EtfFormProps {
  onSubmit: (result: any) => void;
}

const presets = [
  { name: "S&P 500 (avg) (7%)", returnRate: 7, fees: 0.1 },
  { name: "NASDAQ (avg) (10%)", returnRate: 10, fees: 0.2 },
  { name: "Conservative Bond (4%)", returnRate: 4, fees: 0.5 },
  { name: "High-Risk Growth (12%)", returnRate: 12, fees: 0.8 },
];

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);

export default function EtfForm({ onSubmit }: EtfFormProps) {
  const [form, setForm] = useState<FormState>({
    name: "S&P 500 (avg)",
    amount: "1000",
    monthlyContribution: "10",
    returnRate: "7",
    years: "10",
    feeRate: "1",
  });

  const [result, setResult] = useState<ResultState | null>(null);
  const sp500ReturnRate = 7;

  const calculateFutureValue = (
    principal: number,
    monthlyContribution: number,
    rate: number,
    years: number
  ) => {
    const r = rate / 100;
    const n = years * 12;
    const monthlyRate = r / 12;

    const fvLumpSum = principal * Math.pow(1 + r, years);
    const fvAnnuity =
      monthlyRate === 0
        ? monthlyContribution * n
        : monthlyContribution *
          ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate);

    return fvLumpSum + fvAnnuity;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      const preset = presets[parseInt(e.target.value)];
      setForm({
        ...form,
        name: preset.name,
        returnRate: preset.returnRate.toString(),
        feeRate: preset.fees.toString(),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const principal = parseFloat(form.amount || "0");
    if (isNaN(principal) || principal <= 0) {
      alert("Please enter a valid initial amount.");
      return;
    }

    const monthlyContribution = parseFloat(form.monthlyContribution || "0");
    const years = parseInt(form.years || "0");
    if (isNaN(years) || years <= 0) {
      alert("Please enter a valid number of years.");
      return;
    }

    const userRate = form.returnRate
      ? parseFloat(form.returnRate)
      : sp500ReturnRate;
    if (isNaN(userRate) || userRate < 0) {
      alert("Please enter a valid return rate or leave blank.");
      return;
    }

    const feeRate = form.feeRate ? parseFloat(form.feeRate) : 0;
    if (isNaN(feeRate) || feeRate < 0) {
      alert("Please enter a valid fee rate or leave blank.");
      return;
    }

    const effectiveUserRate = userRate - feeRate;

    const userFV = calculateFutureValue(
      principal,
      monthlyContribution,
      effectiveUserRate,
      years
    );
    const sp500FV = calculateFutureValue(
      principal,
      monthlyContribution,
      sp500ReturnRate,
      years
    );

    const etfResult = {
      name: form.name || "Your Investment",
      principal,
      monthlyContribution,
      userRate: effectiveUserRate,
      userFV,
      years,
      sp500Rate: sp500ReturnRate,
      sp500FV,
      feeRate,
    };

    setResult(etfResult);
    onSubmit(etfResult);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quick Presets */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Presets (fill below)
          </label>
          <select
            onChange={handlePresetChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            defaultValue=""
          >
            <option value="">Select a preset or fill manually...</option>
            {presets.map((preset, index) => (
              <option key={index} value={index}>
                {preset.name} — {preset.returnRate}% return, {preset.fees}% fees
              </option>
            ))}
          </select>
        </div>

        {/* Investment Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Investment Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="e.g., VFIAX, QQQ, Custom Portfolio"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        {/* Initial Amount and Monthly Contribution */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Initial Amount ($)
            </label>
            <input
              type="number"
              name="amount"
              placeholder="1000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={form.amount}
              onChange={handleChange}
              min="0"
              step="any"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Contribution ($)
            </label>
            <input
              type="number"
              name="monthlyContribution"
              placeholder="10"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={form.monthlyContribution}
              onChange={handleChange}
              min="0"
              step="any"
            />
          </div>
        </div>

        {/* Annual Return and Annual Fees */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Return (%)
            </label>
            <input
              type="number"
              name="returnRate"
              placeholder="7"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={form.returnRate}
              onChange={handleChange}
              min="0"
              step="any"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Fees (%) — Optional
            </label>
            <input
              type="number"
              name="feeRate"
              placeholder="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={form.feeRate}
              onChange={handleChange}
              min="0"
              step="any"
            />
          </div>
        </div>

        {/* Holding Period */}
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

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
        >
          Compare with S&P 500
        </button>
      </form>

      {result && (
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Results after {result.years} years
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white rounded-xl">
              <div>
                <div className="font-semibold text-gray-800">{result.name}</div>
                <div className="text-sm text-gray-600">
                  {result.userRate.toFixed(2)}% effective return (after{" "}
                  {result.feeRate}% fees)
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(result.userFV)}
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-white rounded-xl">
              <div>
                <div className="font-semibold text-gray-800">S&P 500</div>
                <div className="text-sm text-gray-600">
                  {result.sp500Rate}% return
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(result.sp500FV)}
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-white rounded-xl border-2 border-gray-300">
              <div className="font-semibold text-gray-800">
                Net Difference vs S&P 500
              </div>
              <div
                className={`text-2xl font-bold ${
                  result.userFV > result.sp500FV
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatCurrency(result.userFV - result.sp500FV)}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
