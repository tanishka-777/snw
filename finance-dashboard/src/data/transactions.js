const CATEGORIES = [
  'Housing', 'Food & Dining', 'Transportation', 'Entertainment',
  'Healthcare', 'Shopping', 'Utilities', 'Education', 'Travel', 'Salary',
  'Freelance', 'Investment', 'Gifts', 'Other'
];

const EXPENSE_CATEGORIES = CATEGORIES.filter(c => !['Salary', 'Freelance', 'Investment'].includes(c));
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gifts', 'Other'];

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateTransactions() {
  const transactions = [];
  const now = new Date(2026, 2, 31);
  const sixMonthsAgo = new Date(2025, 9, 1);

  // Generate income transactions
  for (let m = 0; m < 6; m++) {
    const monthStart = new Date(2025, 9 + m, 1);
    const monthEnd = new Date(2025, 10 + m, 0);
    // Monthly salary
    transactions.push({
      id: `inc-salary-${m}`,
      date: new Date(2025, 9 + m, 1).toISOString().split('T')[0],
      description: 'Monthly Salary',
      amount: 5500 + Math.floor(Math.random() * 500),
      category: 'Salary',
      type: 'income',
    });
    // Random freelance income
    if (Math.random() > 0.4) {
      transactions.push({
        id: `inc-free-${m}`,
        date: randomDate(monthStart, monthEnd).toISOString().split('T')[0],
        description: 'Freelance Project',
        amount: 800 + Math.floor(Math.random() * 1200),
        category: 'Freelance',
        type: 'income',
      });
    }
    // Random investment returns
    if (Math.random() > 0.6) {
      transactions.push({
        id: `inc-inv-${m}`,
        date: randomDate(monthStart, monthEnd).toISOString().split('T')[0],
        description: 'Investment Dividend',
        amount: 200 + Math.floor(Math.random() * 400),
        category: 'Investment',
        type: 'income',
      });
    }
  }

  // Generate expense transactions
  const expenseDescriptions = {
    'Housing': ['Rent Payment', 'Home Insurance', 'Property Tax'],
    'Food & Dining': ['Grocery Store', 'Restaurant Dinner', 'Coffee Shop', 'Food Delivery', 'Lunch Out'],
    'Transportation': ['Gas Station', 'Uber Ride', 'Car Maintenance', 'Parking Fee', 'Metro Pass'],
    'Entertainment': ['Netflix Subscription', 'Movie Tickets', 'Concert Tickets', 'Gaming Purchase', 'Spotify'],
    'Healthcare': ['Doctor Visit', 'Pharmacy', 'Gym Membership', 'Dental Checkup'],
    'Shopping': ['Online Shopping', 'Clothing Store', 'Electronics', 'Home Decor'],
    'Utilities': ['Electric Bill', 'Internet Bill', 'Water Bill', 'Phone Bill'],
    'Education': ['Online Course', 'Books', 'Workshop Fee'],
    'Travel': ['Flight Booking', 'Hotel Stay', 'Travel Insurance'],
  };

  const expenseRanges = {
    'Housing': [1200, 2000],
    'Food & Dining': [15, 120],
    'Transportation': [10, 80],
    'Entertainment': [10, 60],
    'Healthcare': [30, 300],
    'Shopping': [20, 250],
    'Utilities': [40, 150],
    'Education': [30, 200],
    'Travel': [100, 800],
  };

  let expId = 0;
  for (let m = 0; m < 6; m++) {
    const monthStart = new Date(2025, 9 + m, 1);
    const monthEnd = new Date(2025, 10 + m, 0);

    // Rent every month
    transactions.push({
      id: `exp-${expId++}`,
      date: new Date(2025, 9 + m, 1).toISOString().split('T')[0],
      description: 'Rent Payment',
      amount: 1500,
      category: 'Housing',
      type: 'expense',
    });

    // Utilities
    ['Electric Bill', 'Internet Bill', 'Phone Bill'].forEach(desc => {
      transactions.push({
        id: `exp-${expId++}`,
        date: randomDate(monthStart, monthEnd).toISOString().split('T')[0],
        description: desc,
        amount: 40 + Math.floor(Math.random() * 80),
        category: 'Utilities',
        type: 'expense',
      });
    });

    // Random expenses
    const numExpenses = 8 + Math.floor(Math.random() * 6);
    for (let i = 0; i < numExpenses; i++) {
      const cats = Object.keys(expenseDescriptions).filter(c => c !== 'Housing' && c !== 'Utilities');
      const cat = cats[Math.floor(Math.random() * cats.length)];
      const descs = expenseDescriptions[cat];
      const desc = descs[Math.floor(Math.random() * descs.length)];
      const [min, max] = expenseRanges[cat];
      transactions.push({
        id: `exp-${expId++}`,
        date: randomDate(monthStart, monthEnd).toISOString().split('T')[0],
        description: desc,
        amount: min + Math.floor(Math.random() * (max - min)),
        category: cat,
        type: 'expense',
      });
    }
  }

  return transactions.sort((a, b) => b.date.localeCompare(a.date));
}

// Use localStorage to persist data if available
const STORAGE_KEY = 'zorvyn_finance_transactions';

export function loadTransactions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Fall through to generate
  }
  const transactions = generateTransactions();
  saveTransactions(transactions);
  return transactions;
}

export function saveTransactions(transactions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch {
    // localStorage unavailable
  }
}

export { CATEGORIES, EXPENSE_CATEGORIES, INCOME_CATEGORIES };
