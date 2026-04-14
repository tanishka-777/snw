# Finance Dashboard

A modern, responsive finance dashboard application built with React, Vite, and Tailwind CSS. Track your income, expenses, and financial insights with beautiful data visualizations.

## 🎯 Features

- **Dashboard Overview**: View your financial summary with key metrics and recent transactions
- **Transaction Management**: Track all your income and expenses with detailed transaction history
- **Insights & Analytics**: Analyze spending patterns with interactive charts and breakdowns
- **Balance Trends**: Visualize your account balance over time
- **Income vs Expense Analysis**: Compare income and expense patterns
- **Spending Breakdown**: See spending distribution across different categories
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.4
- **Build Tool**: Vite 8.0.1
- **Styling**: Tailwind CSS 4.2.2
- **Routing**: React Router DOM 7.13.2
- **Data Visualization**: Recharts 3.8.1
- **Icons**: Lucide React 1.7.0
- **Linting**: ESLint 9.39.4

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tanishka-777/snw.git
cd finance-dashboard
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Building for Production

Build the project for production:
```bash
npm run build
```

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

### Linting

Check code quality:
```bash
npm run lint
```

## 📁 Project Structure

```
finance-dashboard/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── BalanceTrendChart.jsx
│   │   ├── IncomeExpenseChart.jsx
│   │   ├── Layout.jsx
│   │   ├── RecentTransactions.jsx
│   │   ├── SpendingBreakdownChart.jsx
│   │   ├── SummaryCard.jsx
│   │   └── TransactionModal.jsx
│   ├── context/             # Application context & state management
│   │   └── AppContext.jsx
│   ├── data/                # Static data files
│   │   └── transactions.js
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Insights.jsx
│   │   └── Transactions.jsx
│   ├── utils/               # Utility functions
│   │   └── helpers.js
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── package.json             # Project dependencies and scripts
├── vite.config.js          # Vite configuration
├── eslint.config.js        # ESLint configuration
└── index.html              # HTML template
```

## 🎨 Key Components

### Dashboard
The main landing page displaying:
- Summary cards with key financial metrics
- Recent transactions list
- Balance trend chart
- Income vs expense comparison

### Transactions
Detailed transaction management page:
- Complete transaction history
- Transaction modal for adding new entries
- Filterable transaction list
- Transaction details view

### Insights
Analytics and reporting page:
- Spending breakdown by category
- Income and expense trends
- Financial summaries and recommendations

## 🔧 Configuration

### Tailwind CSS
Configured via `@tailwindcss/vite` for optimal build performance and development experience.

### Vite
Fast build tool with hot module replacement (HMR) for rapid development feedback.

### React Router
Navigation configured with the following routes:
- `/` - Dashboard page
- `/transactions` - Transactions page
- `/insights` - Insights page

## 📊 Data Management

Application state is managed using React Context API in `AppContext.jsx`. Transaction data is stored in `data/transactions.js`.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

**Tanishka**

## 🙋 Support

For issues, questions, or suggestions, please open an issue on the [GitHub repository](https://github.com/tanishka-777/snw).

---

Happy tracking! 💰
    else if (EXTENSIONS.has(extname(entry.name))) files.push(fullPath);
  }
  return files;
}
 
function removeComments(code) {
  code = code.replace(/\/\*[\s\S]*?\*\//g, '');
  code = code.replace(/(?<!:)\/\/(?!\/)[^\n]*/g, '');
  code = code.replace(/\n{3,}/g, '\n\n');
  return code.trim() + '\n';
}
 
const files = await getFiles(SRC_DIR);
for (const file of files) {
  const content = await readFile(file, 'utf-8');
  await writeFile(file, removeComments(content));
  console.log(`Cleaned: ${file}`);
}
console.log(`\nDone. Processed ${files.length} files.`);
```
 
Run it:
```bash
node remove-comments.mjs
```
 
---
 
## After Removing Comments
 
```bash
# Verify the build still works
npm run build
 
# Test the dev server
npm run dev
```
 
## Files Affected
 
```
src/
├── components/*.jsx
├── context/AppContext.jsx
├── data/transactions.js
├── pages/*.jsx
├── utils/helpers.js
├── App.jsx
└── main.jsx
```
 
> **Note:** `index.css` is excluded — Tailwind directives like `@import` and `@custom-variant` can resemble comments but are functional code.
