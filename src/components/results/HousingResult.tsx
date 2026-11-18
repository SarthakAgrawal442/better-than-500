import type { ComparisonResult } from "../../types/types";
import { formatCurrency } from "../../utils/calculations";

export default function HousingResult({ data }: { data: ComparisonResult }) {
  const { user, sp500 } = data;
  const gap = Math.round(user.futureValue) - Math.round(sp500.futureValue);
  const period = user.years === 1 ? "1 year" : `${user.years} years`;
  const details = user.details;
  const rows: [string, number | undefined][] = [
    ["Estimated sale price", details?.futurePropertyValue],
    ["Mortgage left to repay", details?.remainingMortgage],
    ["Selling costs", details?.saleCosts],
    ["Buyer's investments", details?.ownerPortfolio],
  ];
  return (
    <section className="form-panel housing-result" aria-labelledby="housing-outcome">
      <p className="text-sm font-medium text-gray-600">Estimate after {period}</p>
      <h2 id="housing-outcome" className="mt-2">
        {gap === 0 ? "Buying and renting finish even." :
          <>{gap > 0 ? "Buying" : "Renting and investing"} leaves you with{" "}
            <strong>{formatCurrency(Math.abs(gap))} more.</strong></>}
      </h2>
      <dl className="mt-6 divide-y">
        <div><dt>Buy a home</dt><dd>{formatCurrency(user.futureValue)}</dd></div>
        <div><dt>Rent and invest</dt><dd>{formatCurrency(sp500.futureValue)}</dd></div>
      </dl>
      {details && <details className="mt-4 border-t pt-4">
        <summary className="cursor-pointer font-medium text-blue-700">How the totals add up</summary>
        <h3 className="mt-5 font-semibold">Buying</h3>
        <p className="text-sm text-gray-600">Cash from selling the home, plus any savings invested.</p>
        <dl>{rows.filter(([, value]) => value !== undefined && value !== 0).map(([label, value]) =>
          <div key={label}><dt>{label}</dt><dd>{formatCurrency(value!)}</dd></div>)}</dl>
        <h3 className="mt-4 font-semibold">Renting and investing</h3>
        <dl>
          <div><dt>Starting investment</dt><dd>{formatCurrency(sp500.initialInvestment)}</dd></div>
          {!!details.renterDeposits && <div><dt>Savings added over {period}</dt><dd>{formatCurrency(details.renterDeposits)}</dd></div>}
          <div><dt>Investment growth</dt><dd>{formatCurrency(sp500.futureValue - sp500.initialInvestment - (details.renterDeposits ?? 0))}</dd></div>
        </dl>
      </details>}
    </section>
  );
}
