const currentYear = new Date().getFullYear();

export const year_options = Array.from(
  { length: currentYear - 2015 + 1 },
  (_, i) => {
    const year = 2015 + i;
    return { label: String(year), value: String(year) };
  }
);

// Format currency
  export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };