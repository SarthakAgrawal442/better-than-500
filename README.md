# Better Than 500

Compare how much money you could have at the end of two different choices. The stock calculator compares a fund with the S&P 500. The housing calculator compares buying a home with renting a similar place and investing the savings.

[Open the calculator](https://better-than-500.vercel.app/)

## Compare an investment

Choose **Stocks/ETF**, pick a fund, and enter your starting amount, monthly deposit, and time horizon. Open **Customize investment** to change the assumed annual return and fee. Both options receive the same deposits at the end of each month, and the starting amount is invested immediately.

**Try the default example.** Start with $1,000 and add $100 a month for 10 years. At a 7% annual return and a 0.1% annual fee, the fund grows to **$18,966**. The fee-free benchmark grows to **$19,072**. The $106 gap shows the effect of the fee under otherwise identical assumptions.

## Compare buying with renting

Choose **Real Estate** and enter the price, down payment, mortgage terms, and rent for a comparable home. Include the monthly property tax, insurance, maintenance, and HOA costs. Under **Comparison assumptions**, you can add purchase and selling costs or set annual growth rates for rent and recurring ownership costs. All four adjustments default to zero.

Both households start with the same cash. The buyer spends it on the down payment and purchase costs. The renter invests it. Each month, whichever household spends less on housing invests the difference. Mortgage payments stop at payoff. At the end of the selected period, the buyer’s total includes sale proceeds after costs and mortgage repayment, plus any investments. The renter’s total is the investment balance.

**Try a change that can reverse the result.** With the default $500,000 home and $1,800 monthly rent, buying finishes **$34,442 ahead** after 10 years. Change only the selling cost to 6%, then calculate again. Selling the appreciated home costs about $40,317, moving renting ahead by about **$5,875**.

## Read the estimate

The headline gives the difference between the two projected ending balances, rounded to whole dollars. Open **How the totals add up** to see what went into them. All amounts are in nominal US dollars before income and capital gains taxes. The S&P 500 benchmark assumes a constant 7% effective annual total return with dividends reinvested. The calculator converts annual investment returns to monthly growth and deducts the fund’s annual fee from its assumed annual return before compounding.

## Run locally

The app uses React, TypeScript, Vite, and Tailwind CSS. With Node.js and npm installed, run the following commands.

```sh
git clone https://github.com/SarthakAgrawal442/better-than-500.git
cd better-than-500
npm ci
npm run dev
```

Open the local URL printed by Vite. Use `npm run test:run` to run the Vitest suite once and `npm run build` to type-check and produce a production build in `dist/`.

The financial formulas live in [calculations.ts](src/utils/calculations.ts), with worked cases and boundary checks in [calculations.test.ts](src/test/calculations.test.ts).

## License

MIT.
