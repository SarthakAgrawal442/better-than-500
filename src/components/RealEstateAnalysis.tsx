// RealEstateAnalysis.tsx
import { Line } from "react-chartjs-2";
import { Home } from "lucide-react";
import type { RealEstateResult } from "../types/types";

interface RealEstateAnalysisProps {
  result: RealEstateResult;
}

export default function RealEstateAnalysis({
  result,
}: RealEstateAnalysisProps) {
  const chartData = {
    labels: Array.from({ length: result.years + 1 }, (_, i) => `Year ${i}`),
    datasets: [
      {
        label: "Property Value",
        data: result.propertyValueHistory,
        fill: false,
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        borderColor: "rgba(16, 185, 129, 1)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Property Value Over Time",
        font: {
          size: 16,
          weight: "bold" as const, // Using 'as const' to ensure type safety
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function (value: string | number) {
            const numValue =
              typeof value === "string" ? parseFloat(value) : value;
            return `$${numValue.toLocaleString()}`;
          },
        },
      },
    },
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-2xl border">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Home className="w-6 h-6 text-green-600" />
        Real Estate Analysis
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-700">Holding Period:</span>
            <span className="font-semibold">{result.years} years</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Annual Appreciation:</span>
            <span className="font-semibold">{result.annualReturn}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Total Capital Gain:</span>
            <span className="font-semibold text-green-600">
              ${formatCurrency(result.capitalGain)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Total Rent Saved:</span>
            <span className="font-semibold text-green-600">
              ${formatCurrency(result.totalRentSaved)}
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-700">Total Return:</span>
            <span className="font-bold text-green-700 text-lg">
              ${formatCurrency(result.totalReturn)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Annualized Return:</span>
            <span className="font-bold text-green-700 text-lg">
              {result.netReturn.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Total Interest Paid:</span>
            <span className="font-semibold text-red-600">
              ${formatCurrency(result.totalInterestPaid)}
            </span>
          </div>
        </div>
      </div>

      {/* Property Value Chart */}
      <div className="bg-white p-4 rounded-xl">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
