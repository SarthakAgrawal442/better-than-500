// App.tsx
import { useState } from "react";
import { TrendingUp, Home, BarChart3 } from "lucide-react";
import EtfForm from "./components/EtfForm";
import RealEstateForm from "./components/RealEstateForm";
import InvestmentResults from "./components/InvestmentResults";
import RealEstateAnalysis from "./components/RealEstateAnalysis";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import type { InvestmentResult, RealEstateResult } from "./types/types";

const SP500_RETURN_RATE = 7;

export default function App() {
  const [investmentType, setInvestmentType] = useState<"etf" | "realestate">(
    "etf"
  );
  const [comparisonData, setComparisonData] = useState<InvestmentResult[]>([]);
  const [realEstateResult, setRealEstateResult] =
    useState<RealEstateResult | null>(null);

  const handleEtfSubmit = (etfResult: any) => {
    const etfInvestmentResult: InvestmentResult = {
      name: etfResult.name,
      futureValue: etfResult.userFV,
      netReturn:
        etfResult.userFV > 0
          ? (Math.pow(
              etfResult.userFV / etfResult.principal,
              1 / etfResult.years
            ) -
              1) *
            100
          : -100,
      years: etfResult.years,
      initialInvestment: etfResult.principal,
      totalReturn: etfResult.userFV - etfResult.principal,
    };

    const sp500InvestmentResult: InvestmentResult = {
      name: "S&P 500",
      futureValue: etfResult.sp500FV,
      netReturn:
        etfResult.sp500FV > 0
          ? (Math.pow(
              etfResult.sp500FV / etfResult.principal,
              1 / etfResult.years
            ) -
              1) *
            100
          : -100,
      years: etfResult.years,
      initialInvestment: etfResult.principal,
      totalReturn: etfResult.sp500FV - etfResult.principal,
    };

    setComparisonData([etfInvestmentResult, sp500InvestmentResult]);
    setRealEstateResult(null); // Clear real estate results when switching to ETF
  };

  const handleRealEstateSubmit = (realEstateResult: any) => {
    const realEstateInvestmentResult: InvestmentResult = {
      name: realEstateResult.name,
      futureValue: realEstateResult.futureValue,
      netReturn: realEstateResult.netReturn,
      years: realEstateResult.years,
      initialInvestment: parseFloat(realEstateResult.downPayment),
      totalReturn: realEstateResult.totalReturn,
    };

    const sp500FutureValue =
      parseFloat(realEstateResult.downPayment) *
      Math.pow(1 + SP500_RETURN_RATE / 100, realEstateResult.years);
    const sp500InvestmentResult: InvestmentResult = {
      name: "S&P 500",
      futureValue: sp500FutureValue,
      netReturn:
        sp500FutureValue > 0
          ? (Math.pow(
              sp500FutureValue / parseFloat(realEstateResult.downPayment),
              1 / realEstateResult.years
            ) -
              1) *
            100
          : -100,
      years: realEstateResult.years,
      initialInvestment: parseFloat(realEstateResult.downPayment),
      totalReturn: sp500FutureValue - parseFloat(realEstateResult.downPayment),
    };

    setComparisonData([realEstateInvestmentResult, sp500InvestmentResult]);
    setRealEstateResult(realEstateResult);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-blue-600">
              Better Than 500
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Compare your investments against the S&P 500
          </p>
        </div>

        {/* Investment Type Toggle */}
        <div className="bg-white rounded-2xl p-2 shadow-lg mb-8">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setInvestmentType("etf")}
              className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 ${
                investmentType === "etf"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">Stocks/ETF</span>
            </button>
            <button
              onClick={() => setInvestmentType("realestate")}
              className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 ${
                investmentType === "realestate"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-semibold">Real Estate</span>
            </button>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {investmentType === "etf" && <EtfForm onSubmit={handleEtfSubmit} />}
          {investmentType === "realestate" && (
            <RealEstateForm onResult={handleRealEstateSubmit} />
          )}
        </div>

        {/* Results */}
        <InvestmentResults data={comparisonData} type={investmentType} />
        {realEstateResult && <RealEstateAnalysis result={realEstateResult} />}
      </div>
    </div>
  );
}
