import { formatCurrency, formatPercentage } from "../../utils/calculations";
import HousingResult from "./HousingResult";
import type { SimpleResultsProps } from "../../types/types";

export default function SimpleResults({ data, type }: SimpleResultsProps) {
  if (!data) return null;
  if (type === "realestate") return <HousingResult data={data} />;

  const { user, sp500 } = data;
  const gap = Math.round(user.futureValue) - Math.round(sp500.futureValue);
  const deposits = user.initialInvestment + (user.monthlyContribution ?? 0) * user.years * 12;
  return (
    <section className="form-panel housing-result" aria-labelledby="stock-outcome">
      <p className="text-sm font-medium text-gray-600">
        Estimate after {user.years} {user.years === 1 ? "year" : "years"}
      </p>
      <h2 id="stock-outcome" className="mt-2">
        {gap === 0 ? "Both investments finish even." : <>
          {gap > 0 ? "Your investment" : "The S&P 500 benchmark"} finishes{" "}
          <strong>{formatCurrency(Math.abs(gap))} ahead.</strong>
        </>}
      </h2>
      <dl className="mt-6 divide-y">
        <div><dt className="min-w-0 break-words">{user.name} (after fees)</dt><dd>{formatCurrency(user.futureValue)}</dd></div>
        <div><dt>S&amp;P 500 benchmark</dt><dd>{formatCurrency(sp500.futureValue)}</dd></div>
      </dl>
      <details className="mt-4 border-t pt-4">
        <summary className="cursor-pointer font-medium text-blue-700">How the totals add up</summary>
        <p className="mt-3 text-sm text-gray-600">Both start with the same deposits, totaling {formatCurrency(deposits)}.
          Your estimated annual return after fees is {formatPercentage(user.rate)}.
          The benchmark assumes {formatPercentage(sp500.rate)} a year with no fee.</p>
      </details>
    </section>
  );
}
