const currentYear = new Date().getFullYear();
export const year_options = Array.from(
  { length: currentYear - 1990 + 1 },
  (_, i) => {
    const year = 1990 + i;
    return { label: String(year), value: String(year) };
  }
);
