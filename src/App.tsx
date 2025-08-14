import { useState } from "react";
import { BarChart3 } from "lucide-react";
import StockForm from "./components/forms/StockForm";
import RealEstateForm from "./components/forms/RealEstateForm";
import SimpleResults from "./components/results/SimpleResults";
import TabSwitcher from "./components/ui/TabSwitcher";
import useInvestmentCalculator from "./hooks/useInvestmentCalculator";
import type {
  ComparisonResult,
  InvestmentType,
  StockFormData,
  RealEstateFormData,
} from "./types/types";

function App() {
  // Simple state - no complex logic here
  const [activeTab, setActiveTab] = useState<InvestmentType>("stocks");
  const [results, setResults] = useState<ComparisonResult | null>(null);

  // Custom hook handles all calculations
  const { calculateInvestment, error } = useInvestmentCalculator();

  // Simple handlers - just pass data to calculator
  const handleStockSubmit = async (formData: StockFormData) => {
    const calculatedResults = await calculateInvestment(formData, "stocks");
    if (calculatedResults) {
      setResults(calculatedResults);
    } else if (error) {
      alert(error.message);
    }
  };

  const handleRealEstateSubmit = async (formData: RealEstateFormData) => {
    const calculatedResults = await calculateInvestment(formData, "realestate");
    if (calculatedResults) {
      setResults(calculatedResults);
    } else if (error) {
      alert(error.message);
    }
  };

  const clearResults = () => setResults(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4">
      <div className="max-w-2xl mx-auto">
        {/* Simple Header */}
        <header className="text-center mb-4 sm:mb-8">
          <div className="flex items-center justify-center gap-2 mb-2 sm:mb-4">
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            <h1 className="text-2xl sm:text-4xl font-bold text-blue-600">
              Better Than 500
            </h1>
          </div>
        </header>

        {/* Tab Switcher Component */}
        <TabSwitcher
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onClear={clearResults}
        />

        {/* Forms - only show one at a time */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 mb-4 sm:mb-8">
          {activeTab === "stocks" && <StockForm onSubmit={handleStockSubmit} />}
          {activeTab === "realestate" && (
            <RealEstateForm onSubmit={handleRealEstateSubmit} />
          )}
        </div>

        {/* Results - only show if we have data */}
        {results && (
          <SimpleResults
            data={results}
            type={activeTab}
            onClear={clearResults}
          />
        )}
      </div>
    </div>
  );
}

export default App;
