# Better Than 500 📈

A clean, modern investment comparison tool that helps you evaluate whether your investments can beat the S&P 500. Compare stocks, ETFs, and real estate investments with detailed analysis and beautiful visualizations.

## ✨ Features

### 🎯 **Investment Types**

- **Stocks & ETFs** - Compare any stock or ETF against S&P 500 performance
- **Real Estate** - Comprehensive property investment analysis vs renting + S&P 500 investing

### 📊 **Smart Analysis**

- **Growth Comparison Charts** - Visual line graphs showing investment growth over time
- **Winner Highlighting** - Clear indicators showing which investment performs better
- **Real-time Calculations** - Instant results as you input data
- **Cash Flow Analysis** - Live preview of real estate monthly expenses vs rent

### 🎨 **Clean Design**

- **Compact UI** - Inspired by modern fintech applications
- **Responsive Layout** - Works perfectly on desktop and mobile
- **Quick Presets** - Smart defaults for faster input
- **Professional Results** - Clean cards and detailed breakdowns for easy interpretation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/better-than-500.git
   cd better-than-500
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application.

## 🛠️ Built With

- **React 18** - Modern React with hooks and TypeScript
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Beautiful, responsive charts
- **Lucide React** - Clean, consistent icons
- **Vite** - Fast build tool and dev server

## 📖 How to Use

### Stock/ETF Analysis

1. **Select "Stocks/ETF"** from the toggle
2. **Choose a preset** or enter custom details:
   - Investment name (e.g., "VFIAX", "QQQ")
   - Initial amount and monthly contributions
   - Expected annual return and fees
   - Investment period
3. **Click "Compare with S&P 500"** to see results
4. **View the analysis** - Side-by-side comparison showing your investment vs S&P 500 performance

### Real Estate Analysis

1. **Select "Real Estate"** from the toggle
2. **Enter property details**:
   - Property value and down payment
   - Mortgage terms (interest rate, loan term)
   - Monthly expenses (taxes, insurance, maintenance, HOA)
   - Comparable monthly rent and appreciation rate
3. **Click "Calculate Real Estate Returns"** to see comprehensive analysis:
   - Property equity vs S&P 500 investing (rent + invest difference)
   - Detailed financial breakdown
   - Cash flow analysis

## 🏗️ Project Structure

```
src/
├── components/
│   ├── forms/
│   │   ├── StockForm.tsx           # Stock/ETF input form
│   │   └── RealEstateForm.tsx      # Real estate input form
│   ├── results/
│   │   ├── InvestmentResults.tsx   # Stock/ETF results display
│   │   └── RealEstateResults.tsx   # Real estate results display
│   └── ui/
│       ├── Button.tsx              # Reusable button component
│       ├── Card.tsx                # Card wrapper component
│       └── ...                     # Other UI components
├── hooks/
│   └── useInvestmentCalculator.ts  # Investment calculation logic
├── utils/
│   └── calculations.ts             # Core calculation functions
├── types/
│   └── types.ts                    # TypeScript interfaces
└── App.tsx                         # Main application component
```

## 🎯 Key Calculations

### Stock/ETF Returns

- **Future Value** = Principal × (1 + rate)^years + Monthly contributions with compound growth
- **Effective Return** = Annual return - Annual fees
- **Comparison** = Your investment vs S&P 500 (assumed 7% effective annual total return, dividends reinvested)

### Real Estate vs Rent + Invest

- Both households start with the down payment plus purchase costs. The renter invests this cash immediately.
- Each month the household with lower housing costs invests the difference at month end. Mortgage payments end at payoff. Rent and recurring ownership costs can grow separately each year.
- Ending owner wealth includes net sale proceeds and accumulated stock investments. The breakdown also shows home equity before selling costs.
- Housing IRR uses purchase cash, monthly rent avoided less ownership expenses, and final sale proceeds. Results use nominal dollars before income and capital gains taxes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This tool is for educational and planning purposes only. It does not constitute financial advice. Past performance does not guarantee future results. Please consult with a qualified financial advisor before making investment decisions.

## 🔮 Future Features

- [ ] **More Investment Types** - Bonds, commodities, crypto comparisons
- [ ] **Advanced Analysis** - Risk metrics, Monte Carlo simulations
- [ ] **Export Features** - PDF reports, CSV data export
- [ ] **Saved Scenarios** - Save and compare multiple investment strategies
- [ ] **Tax Considerations** - Capital gains, depreciation for real estate
- [ ] **Inflation Adjustment** - Real vs nominal returns
- [ ] **Market Data Integration** - Live stock prices and real estate data

## 🙏 Acknowledgments

- S&P 500 historical return data
- Modern fintech UI/UX inspiration
- Recharts for beautiful visualizations
- Tailwind CSS for rapid styling

---

**Made with ❤️ for better investment decisions**
