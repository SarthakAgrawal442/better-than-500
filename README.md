# Better Than 500 📈

A clean, modern investment comparison tool that helps you evaluate whether your investments can beat the S&P 500. Compare stocks, ETFs, and real estate investments with detailed analysis and beautiful visualizations.

## ✨ Features

### 🎯 **Investment Types**

- **Stocks & ETFs** - Compare any stock or ETF against S&P 500 performance
- **Real Estate** - Comprehensive property investment analysis including cash flow, appreciation, and expenses

### 📊 **Smart Analysis**

- **Growth Comparison Charts** - Visual line graphs showing investment growth over time
- **Winner Highlighting** - Clear indicators showing which investment performs better
- **Real-time Calculations** - Instant results as you input data
- **Cash Flow Preview** - Live preview of real estate monthly expenses vs rent savings

### 🎨 **Clean Design**

- **Compact UI** - Inspired by modern fintech applications
- **Responsive Layout** - Works perfectly on desktop and mobile
- **Intuitive Forms** - Quick presets and smart defaults for faster input
- **Professional Results** - Clean cards and charts for easy interpretation

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
   Navigate to `http://localhost:3000` to see the application.

## 🛠️ Built With

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Beautiful, responsive charts
- **Lucide React** - Clean, consistent icons
- **Vite** - Fast build tool and dev server

## 📖 How to Use

### Stock/ETF Analysis

1. **Select "Stocks/ETF"** from the toggle
2. **Choose a preset** or enter custom details:
   - Investment name (e.g., "VFIAX", "QQQ")
   - Initial amount and monthly contributions
   - Expected annual return and fees
   - Holding period
3. **Click "Compare with S&P 500"** to see results
4. **View the analysis** - Cards showing your investment vs S&P 500 performance plus growth chart

### Real Estate Analysis

1. **Select "Real Estate"** from the toggle
2. **Enter property details**:
   - Property value and down payment
   - Mortgage terms (interest rate, loan term)
   - Monthly expenses (taxes, insurance, maintenance, HOA)
   - Expected rent savings and appreciation
3. **Preview cash flow** in real-time
4. **Calculate returns** to see comprehensive analysis including:
   - Property value appreciation over time
   - Total return vs S&P 500 on down payment
   - Detailed breakdown of costs and benefits

## 🏗️ Project Structure

```
src/
├── components/
│   ├── EtfForm.tsx              # Stock/ETF input form
│   ├── RealEstateForm.tsx       # Real estate input form
│   ├── InvestmentResults.tsx    # Universal results with comparison chart
│   └── RealEstateAnalysis.tsx   # Detailed real estate breakdown
├── types/
│   └── types.ts                 # TypeScript interfaces
└── App.tsx                      # Main application component
```

## 🎯 Key Calculations

### Stock/ETF Returns

- **Future Value** = Principal × (1 + rate)^years + Monthly contributions with compound growth
- **Effective Return** = Annual return - Annual fees
- **Comparison** = Your investment vs S&P 500 (7% historical average)

### Real Estate Returns

- **Total Return** = Capital appreciation + Total rent savings - Total expenses
- **Annualized Return** = ((Future Value / Down Payment)^(1/years) - 1) × 100
- **Cash Flow** = Monthly rent savings - (Mortgage + Taxes + Insurance + Maintenance + HOA)

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

- [ ] **More Investment Types** - Bonds, commodities, crypto
- [ ] **Advanced Analysis** - Risk metrics, Monte Carlo simulations
- [ ] **Export Features** - PDF reports, CSV data export
- [ ] **Saved Scenarios** - Compare multiple investment strategies
- [ ] **Tax Considerations** - Capital gains, depreciation for real estate
- [ ] **Inflation Adjustment** - Real vs nominal returns

## 🙏 Acknowledgments

- S&P 500 historical return data
- Modern fintech UI/UX inspiration
- Chart.js for beautiful visualizations
- Tailwind CSS for rapid styling

---

**Made with ❤️ for better investment decisions**
