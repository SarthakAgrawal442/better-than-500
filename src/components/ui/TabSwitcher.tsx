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
    <div className="bg-white rounded-2xl p-1 sm:p-2 shadow-lg mb-4 sm:mb-8">
      <div className="grid grid-cols-2 gap-1 sm:gap-2">
        {/* Stocks/ETF Tab */}
        <button
          onClick={() => handleTabClick("stocks")}
          className={`flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4 rounded-xl transition-all duration-300 ${
            activeTab === "stocks"
              ? "bg-blue-600 text-white shadow-lg transform scale-105"
              : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
          }`}
        >
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-semibold text-sm sm:text-base">Stocks/ETF</span>
        </button>

        {/* Real Estate Tab */}
        <button
          onClick={() => handleTabClick("realestate")}
          className={`flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4 rounded-xl transition-all duration-300 ${
            activeTab === "realestate"
              ? "bg-blue-600 text-white shadow-lg transform scale-105"
              : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
          }`}
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-semibold text-sm sm:text-base">
            Real Estate
          </span>
        </button>
      </div>
    </div>
  );
}

export default TabSwitcher;
