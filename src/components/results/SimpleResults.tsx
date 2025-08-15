// components/results/SimpleResults.tsx - Clean results display
import { useState } from "react";
import { Trophy, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { formatCurrency, formatPercentage } from "../../utils/calculations";
import DetailedBreakdown from "./DetailedBreakdown";
import Card from "../ui/Card";
import type { ComparisonResult, InvestmentType } from "../../types/types";

interface SimpleResultsProps {
  data: ComparisonResult;
  type: InvestmentType;
  onClear: () => void;
}

function SimpleResults({ data, type, onClear }: SimpleResultsProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (!data) return null;

  const { user, sp500, winner, difference } = data;
  const isUserWinner = winner === "user";

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Main Results Card */}
      <Card className="p-4 sm:p-6">
        <div className="text-center mb-3 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            Results after {user.years} years
          </h2>
        </div>

        {/* Winner Announcement */}
        <div
          className={`text-center p-3 sm:p-6 rounded-xl mb-3 sm:mb-6 ${
            isUserWinner
              ? "bg-green-50 border-2 border-green-200"
              : "bg-yellow-50 border-2 border-yellow-200"
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-1 sm:mb-2">
            <Trophy
              className={`w-6 h-6 sm:w-8 sm:h-8 ${
                isUserWinner ? "text-green-600" : "text-yellow-600"
              }`}
            />
            <h3 className="text-base sm:text-xl font-bold text-gray-800">
              {isUserWinner ? `${user.name} Wins!` : "S&P 500 Wins!"}
            </h3>
          </div>
          <p
            className={`text-sm sm:text-lg font-semibold ${
              isUserWinner ? "text-green-700" : "text-yellow-700"
            }`}
          >
            {isUserWinner ? "Your investment" : "The S&P 500"} outperformed by{" "}
            {formatCurrency(difference)}
          </p>
        </div>

        {/* Side-by-side Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
          {/* User Investment */}
          <div
            className={`p-3 sm:p-6 rounded-xl border-2 ${
              isUserWinner
                ? "bg-green-50 border-green-300"
                : "bg-gray-50 border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2 mb-2 sm:mb-4">
              {isUserWinner && (
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              )}
              <h4 className="text-sm sm:text-lg font-bold text-gray-800">
                {user.name}
              </h4>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-700">
                  {type === "realestate" ? "Total Equity:" : "Final Value:"}
                </span>
                <span
                  className={`text-lg sm:text-2xl font-bold ${
                    isUserWinner ? "text-green-600" : "text-gray-800"
                  }`}
                >
                  {formatCurrency(user.futureValue)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-700">
                  Annual Return:
                </span>
                <span className="text-xs sm:text-sm font-semibold">
                  {formatPercentage(user.rate)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-700">
                  Initial:
                </span>
                <span className="text-xs sm:text-sm font-medium">
                  {formatCurrency(user.initialInvestment)}
                </span>
              </div>

              {user.monthlyContribution !== undefined &&
                user.monthlyContribution > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-700">
                      Monthly:
                    </span>
                    <span className="text-xs sm:text-sm font-medium">
                      {formatCurrency(user.monthlyContribution)}
                    </span>
                  </div>
                )}
            </div>
          </div>

          {/* S&P 500 */}
          <div
            className={`p-3 sm:p-6 rounded-xl border-2 ${
              !isUserWinner
                ? "bg-green-50 border-green-300"
                : "bg-gray-50 border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2 mb-2 sm:mb-4">
              {!isUserWinner && (
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              )}
              <h4 className="text-sm sm:text-lg font-bold text-gray-800">
                {type === "realestate" ? "S&P 500 (Renting)" : "S&P 500"}
              </h4>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-700">
                  Final Value:
                </span>
                <span
                  className={`text-lg sm:text-2xl font-bold ${
                    !isUserWinner ? "text-green-600" : "text-gray-800"
                  }`}
                >
                  {formatCurrency(sp500.futureValue)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-700">
                  Annual Return:
                </span>
                <span className="text-xs sm:text-sm font-semibold">
                  {formatPercentage(sp500.rate)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-700">
                  Initial:
                </span>
                <span className="text-xs sm:text-sm font-medium">
                  {formatCurrency(sp500.initialInvestment)}
                </span>
              </div>

              {sp500.monthlyContribution !== undefined && sp500.monthlyContribution !== 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-700">
                    {type === "realestate"
                      ? sp500.monthlyContribution >= 0
                        ? "Monthly:"
                        : "Extra Cost:"
                      : "Monthly:"}
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      type === "realestate" && sp500.monthlyContribution < 0
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {formatCurrency(Math.abs(sp500.monthlyContribution))}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Performance Difference */}
        <div className="mt-3 sm:mt-6 p-3 sm:p-4 bg-gray-100 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-gray-700 font-medium">
              Difference:
            </span>
            <div className="flex items-center gap-2">
              {isUserWinner ? (
                <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              ) : (
                <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              )}
              <span
                className={`text-sm sm:text-lg font-bold ${
                  isUserWinner ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(difference)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-3 sm:mt-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base"
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </button>

          <button
            onClick={onClear}
            className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            New Calculation
          </button>
        </div>
      </Card>

      {/* Detailed Breakdown */}
      {showDetails && <DetailedBreakdown data={data} type={type} />}
    </div>
  );
}

export default SimpleResults;
