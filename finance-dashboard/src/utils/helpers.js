export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getMonthLabel(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportToCSV(transactions) {
  const headers = ['Date', 'Description', 'Amount', 'Category', 'Type'];
  const rows = transactions.map(t =>
    [t.date, `"${t.description}"`, t.amount, t.category, t.type].join(',')
  );
  const csv = [headers.join(','), ...rows].join('\n');
  downloadFile(csv, 'transactions.csv', 'text/csv');
}

export function exportToJSON(transactions) {
  const json = JSON.stringify(transactions, null, 2);
  downloadFile(json, 'transactions.json', 'application/json');
}
