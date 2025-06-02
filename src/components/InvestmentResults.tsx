// InvestmentResults.tsx
import { Line } from "react-chartjs-2";
import { TrendingUp, Trophy } from "lucide-react";
import type { InvestmentResult } from "../types/types";

interface InvestmentResultsProps {
  data: InvestmentResult[];
  type: "etf" | "realestate";
}

export default function InvestmentResults({
  data,
  type,
}: InvestmentResultsProps) {
  if (data.length === 0) return null;

  const [userInvestment, sp500] = data;
  const years = userInvestment.years;

  // Generate year-over-year data for the line chart
  const generateGrowthData = (
    initial: number,
    monthlyContrib: number,
    annualReturn: number,
    years: number
  ) => {
    const yearlyData = [initial];
    let currentValue = initial;

    for (let year = 1; year <= years; year++) {
      // Add monthly contributions throughout the year
      const yearlyContributions = monthlyContrib * 12;
      // Apply growth to existing value + half the yearly contributions (simplified)
      currentValue =
        (currentValue + yearlyContributions / 2) * (1 + annualReturn / 100) +
        yearlyContributions / 2;
      yearlyData.push(currentValue);
    }

    return yearlyData;
  };

  // Estimate monthly contribution (this should ideally come from the form data)
  const estimatedMonthlyContrib =
    ((userInvestment.futureValue - userInvestment.initialInvestment) /
      (years * 12)) *
    0.1; // rough estimate

  const userGrowthData = generateGrowthData(
    userInvestment.initialInvestment,
    estimatedMonthlyContrib,
    userInvestment.netReturn,
    years
  );

  const sp500GrowthData = generateGrowthData(
    sp500.initialInvestment,
    estimatedMonthlyContrib,
    sp500.netReturn,
    years
  );

  const chartData = {
    labels: Array.from({ length: years + 1 }, (_, i) => `Year ${i}`),
    datasets: [
      {
        label: userInvestment.name,
        data: userGrowthData,
        borderColor: type === "etf" ? "#3B82F6" : "#10B981",
        backgroundColor:
          type === "etf"
            ? "rgba(59, 130, 246, 0.1)"
            : "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "S&P 500",
        data: sp500GrowthData,
        borderColor: "#6B7280",
        backgroundColor: "rgba(107, 114, 128, 0.1)",
        tension: 0.4,
        fill: false,
        borderDash: [5, 5],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Investment Growth Comparison",
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const winner =
    userInvestment.futureValue > sp500.futureValue ? userInvestment : sp500;
  const difference = Math.abs(userInvestment.futureValue - sp500.futureValue);

  return (
    <div className="mt-8 space-y-6">
      {/* Results Summary */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          Results after {years} years
        </h2>

        <div className="space-y-4">
          {/* User Investment */}
          <div className="flex justify-between items-center p-4 bg-white rounded-xl">
            <div>
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                {winner.name === userInvestment.name && (
                  <Trophy className="w-4 h-4 text-yellow-500" />
                )}
                {userInvestment.name}
              </div>
              <div className="text-sm text-gray-600">
                {userInvestment.netReturn.toFixed(2)}% annual return
              </div>
            </div>
            <div
              className={`text-2xl font-bold ${
                winner.name === userInvestment.name
                  ? "text-green-600"
                  : "text-gray-800"
              }`}
            >
              {formatCurrency(userInvestment.futureValue)}
            </div>
          </div>

          {/* S&P 500 */}
          <div className="flex justify-between items-center p-4 bg-white rounded-xl">
            <div>
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                {winner.name === sp500.name && (
                  <Trophy className="w-4 h-4 text-yellow-500" />
                )}
                S&P 500
              </div>
              <div className="text-sm text-gray-600">
                {sp500.netReturn.toFixed(2)}% annual return
              </div>
            </div>
            <div
              className={`text-2xl font-bold ${
                winner.name === sp500.name ? "text-green-600" : "text-gray-800"
              }`}
            >
              {formatCurrency(sp500.futureValue)}
            </div>
          </div>

          {/* Difference */}
          <div className="flex justify-between items-center p-4 bg-white rounded-xl border-2 border-gray-300">
            <div className="font-semibold text-gray-800">
              {winner.name === userInvestment.name
                ? "You're ahead by"
                : "S&P 500 is ahead by"}
            </div>
            <div
              className={`text-2xl font-bold ${
                winner.name === userInvestment.name
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formatCurrency(difference)}
            </div>
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
