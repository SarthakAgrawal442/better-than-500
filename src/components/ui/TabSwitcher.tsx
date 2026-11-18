// components/ui/TabSwitcher.tsx - Tab switching component
import { TrendingUp, Home } from "lucide-react";
import type { InvestmentType } from "../../types/types";

interface TabSwitcherProps {
  activeTab: InvestmentType;
  onTabChange: (tabName: InvestmentType) => void;
  onClear?: () => void;
}

function TabSwitcher({ activeTab, onTabChange, onClear }: TabSwitcherProps) {
  const handleTabClick = (tabName: InvestmentType) => {
    if (activeTab !== tabName) {
      onTabChange(tabName);
      if (onClear) onClear(); // Clear results when switching tabs
    }
  };

  return (
    <div className="mode-switch" role="group" aria-label="Comparison type">
      <button aria-pressed={activeTab === "stocks"} onClick={() => handleTabClick("stocks")}>
        <TrendingUp size={17} />Stocks/ETF
      </button>
      <button aria-pressed={activeTab === "realestate"} onClick={() => handleTabClick("realestate")}>
        <Home size={17} />Real Estate
      </button>
    </div>
  );
}

export default TabSwitcher;
