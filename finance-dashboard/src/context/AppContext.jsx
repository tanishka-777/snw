import { createContext, useContext, useReducer, useEffect } from 'react';
import { loadTransactions, saveTransactions } from '../data/transactions';

const AppContext = createContext(null);

const initialState = {
  transactions: [],
  role: 'admin', // 'admin' | 'viewer'
  darkMode: false,
  filters: {
    search: '',
    type: 'all',       // 'all' | 'income' | 'expense'
    category: 'all',
    dateFrom: '',
    dateTo: '',
    sortBy: 'date',    // 'date' | 'amount' | 'category'
    sortOrder: 'desc',  // 'asc' | 'desc'
  },
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };

    case 'ADD_TRANSACTION': {
      const updated = [action.payload, ...state.transactions];
      saveTransactions(updated);
      return { ...state, transactions: updated };
    }

    case 'UPDATE_TRANSACTION': {
      const updated = state.transactions.map(t =>
        t.id === action.payload.id ? action.payload : t
      );
      saveTransactions(updated);
      return { ...state, transactions: updated };
    }

    case 'DELETE_TRANSACTION': {
      const updated = state.transactions.filter(t => t.id !== action.payload);
      saveTransactions(updated);
      return { ...state, transactions: updated };
    }

    case 'SET_ROLE':
      return { ...state, role: action.payload };

    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };

    case 'SET_FILTER':
      return {
        ...state,
        filters: { ...state.filters, [action.payload.key]: action.payload.value },
      };

    case 'RESET_FILTERS':
      return { ...state, filters: initialState.filters };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load transactions on mount
  useEffect(() => {
    const transactions = loadTransactions();
    dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
  }, []);

  // Persist dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (state.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('zorvyn_dark_mode', JSON.stringify(state.darkMode));
    } catch { /* ignore */ }
  }, [state.darkMode]);

  // Load dark mode preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem('zorvyn_dark_mode');
      if (stored === 'true') {
        dispatch({ type: 'TOGGLE_DARK_MODE' });
      }
    } catch { /* ignore */ }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
