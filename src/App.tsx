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
  const { calculateInvestment, error, clearError } = useInvestmentCalculator();

  // Simple handlers - just pass data to calculator
  const handleStockSubmit = async (formData: StockFormData) => {
    const calculatedResults = await calculateInvestment(formData, "stocks");
    if (calculatedResults) {
      setResults(calculatedResults);
    }
  };

  const handleRealEstateSubmit = async (formData: RealEstateFormData) => {
    const calculatedResults = await calculateInvestment(formData, "realestate");
    if (calculatedResults) {
      setResults(calculatedResults);
    }
  };

  const clearResults = () => setResults(null);

  return (
    <main className="calculator-shell">
      <div className="calculator-column">
        <header className="brand">
          <BarChart3 aria-hidden="true" size={28} />
          <h1>Better Than 500</h1>
        </header>

        {/* Tab Switcher Component */}
        <TabSwitcher
          activeTab={activeTab}
          onTabChange={tab => { clearError(); setActiveTab(tab); }}
          onClear={clearResults}
        />

        {/* Forms - only show one at a time */}
        <div className="form-panel" onChange={() => { clearResults(); clearError(); }}>
          {activeTab === "stocks" && <StockForm onSubmit={handleStockSubmit} />}
          {activeTab === "realestate" && (
            <RealEstateForm onSubmit={handleRealEstateSubmit} />
          )}
        </div>

        {error && <p role="alert">{error.message}</p>}
        {/* Results - only show if we have data */}
        {results && (
          <SimpleResults
            data={results}
            type={activeTab}
            onClear={clearResults}
          />
        )}
      </div>
    </main>
  );
}

export default App;
