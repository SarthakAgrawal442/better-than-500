// components/results/DetailedBreakdown.tsx - Detailed analysis
import { BarChart, Home, DollarSign } from "lucide-react";
import { formatCurrency } from "../../utils/calculations";
import Card from "../ui/Card";
import type { ComparisonResult, InvestmentType } from "../../types/types";

interface DetailedBreakdownProps {
  data: ComparisonResult;
  type: InvestmentType;
}

function DetailedBreakdown({ data, type }: DetailedBreakdownProps) {
  const { user, sp500 } = data;

  // Calculate total contributions for both investments
  const userTotalContributions =
    user.initialInvestment +
    (user.monthlyContribution ? user.monthlyContribution * 12 * user.years : 0);

  const sp500TotalContributions =
    sp500.initialInvestment +
    (sp500.monthlyContribution
      ? sp500.monthlyContribution * 12 * sp500.years
      : 0);

  // Calculate gains
  const userGains = user.futureValue - userTotalContributions;
  const sp500Gains = sp500.futureValue - sp500TotalContributions;

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart className="w-5 h-5 text-blue-600" />
          Detailed Financial Breakdown
        </h3>
      </div>

      {/* Investment Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* User Investment Breakdown */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
            {user.name} Breakdown
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700">Initial Investment:</span>
              <span className="font-semibold">
                {formatCurrency(user.initialInvestment)}
              </span>
            </div>

            {user.monthlyContribution !== undefined &&
              user.monthlyContribution > 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-700">
                      Monthly Contributions:
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(user.monthlyContribution)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total Contributions:</span>
                    <span className="font-semibold">
                      {formatCurrency(
                        userTotalContributions - user.initialInvestment
                      )}
                    </span>
                  </div>
                </>
              )}

            <div className="flex justify-between">
              <span className="text-gray-700">Total Invested:</span>
              <span className="font-semibold text-blue-600">
                {formatCurrency(userTotalContributions)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-700">Investment Gains:</span>
              <span
                className={`font-semibold ${
                  userGains >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(userGains)}
              </span>
            </div>

            <div className="flex justify-between border-t pt-3">
              <span className="text-gray-800 font-semibold">Final Value:</span>
              <span className="font-bold text-lg">
                {formatCurrency(user.futureValue)}
              </span>
            </div>
          </div>
        </div>

        {/* S&P 500 Breakdown */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
            {type === "realestate"
              ? "S&P 500 (Renting) Breakdown"
              : "S&P 500 Breakdown"}
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700">Initial Investment:</span>
              <span className="font-semibold">
                {formatCurrency(sp500.initialInvestment)}
              </span>
            </div>

            {sp500.monthlyContribution !== undefined && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-700">
                    {type === "realestate"
                      ? sp500.monthlyContribution >= 0
                        ? "Monthly Savings:"
                        : "Monthly Extra Cost:"
                      : "Monthly Contributions:"}
                  </span>
                  <span
                    className={`font-semibold ${
                      type === "realestate" && sp500.monthlyContribution < 0
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {formatCurrency(Math.abs(sp500.monthlyContribution))}
                  </span>
                </div>
                {type === "realestate" && (
                  <div className="text-xs text-gray-500 italic">
                    {sp500.monthlyContribution >= 0
                      ? "(Ownership cost - Rent = Amount invested monthly)"
                      : "(Rent costs more than owning)"}
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-700">Total Contributions:</span>
                  <span className="font-semibold">
                    {formatCurrency(
                      Math.abs(
                        sp500TotalContributions - sp500.initialInvestment
                      )
                    )}
                  </span>
                </div>
              </>
            )}

            <div className="flex justify-between">
              <span className="text-gray-700">Total Invested:</span>
              <span className="font-semibold text-blue-600">
                {formatCurrency(sp500TotalContributions)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-700">Investment Gains:</span>
              <span
                className={`font-semibold ${
                  sp500Gains >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(sp500Gains)}
              </span>
            </div>

            <div className="flex justify-between border-t pt-3">
              <span className="text-gray-800 font-semibold">Final Value:</span>
              <span className="font-bold text-lg">
                {formatCurrency(sp500.futureValue)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Real Estate Specific Details */}
      {type === "realestate" && user.details && (
        <div className="border-t pt-6">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Home className="w-5 h-5 text-blue-600" />
            Real Estate Details
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Information */}
            <div className="space-y-3">
              <h5 className="font-semibold text-gray-700">Property Details</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Property Value:</span>
                  <span className="font-medium">
                    {formatCurrency(user.details.propertyValue || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Future Property Value:</span>
                  <span className="font-medium">
                    {formatCurrency(user.details.futurePropertyValue || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Appreciation:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(user.details.capitalGain || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mortgage Paid Down:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(user.details.equityFromPaydown || 0)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-700 font-semibold">
                    Total Equity:
                  </span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(
                      user.details.totalEquity || user.futureValue
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Cash Flow Information */}
            <div className="space-y-3">
              <h5 className="font-semibold text-gray-700">
                Cash Flow Analysis
              </h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Ownership Cost:</span>
                  <span className="font-medium text-red-600">
                    {formatCurrency(user.details.monthlyExpenses || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Comparable Rent:</span>
                  <span className="font-medium">
                    {formatCurrency(user.details.monthlyRent || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Net Monthly Difference:</span>
                  <span
                    className={`font-medium ${
                      (user.details.monthlyCashFlow || 0) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {user.details.monthlyCashFlow >= 0 ? "+" : "-"}
                    {formatCurrency(
                      Math.abs(user.details.monthlyCashFlow || 0)
                    )}
                  </span>
                </div>
                <div className="text-xs text-gray-500 italic">
                  {user.details.monthlyCashFlow >= 0
                    ? "Owning costs less than renting"
                    : "Owning costs more than renting"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Comparison */}
      <div className="border-t pt-6 mt-6">
        <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-blue-600" />
          Investment Summary
        </h4>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-sm text-gray-600 mb-1">Best Investment</div>
              <div className="text-xl font-bold text-green-600">
                {user.futureValue > sp500.futureValue
                  ? type === "realestate"
                    ? "Buy Property"
                    : user.name
                  : type === "realestate"
                  ? "Rent + S&P 500"
                  : "S&P 500"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Difference</div>
              <div className="text-xl font-bold text-blue-600">
                {formatCurrency(Math.abs(user.futureValue - sp500.futureValue))}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Time Period</div>
              <div className="text-xl font-bold text-gray-800">
                {user.years} years
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default DetailedBreakdown;
