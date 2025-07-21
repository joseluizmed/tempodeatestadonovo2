
// Parses DD/MM/AAAA to Date object (UTC to avoid timezone issues)
export const parseDateString = (dateString: string): Date | null => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return null;
  const parts = dateString.split("/");
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  const date = new Date(Date.UTC(year, month, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month || date.getUTCDate() !== day) {
    return null; // Invalid date like 31/02/2023
  }
  return date;
};

// Formats Date object to DD/MM/AAAA
export const formatDate = (date: Date): string => {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

// Adds days to a Date object
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setUTCDate(date.getUTCDate() + days);
  return result;
};

// Calculates difference in days between two Date objects (inclusive of start date for duration)
export const differenceInDays = (dateLeft: Date, dateRight: Date): number => {
  const utc1 = Date.UTC(dateLeft.getUTCFullYear(), dateLeft.getUTCMonth(), dateLeft.getUTCDate());
  const utc2 = Date.UTC(dateRight.getUTCFullYear(), dateRight.getUTCMonth(), dateRight.getUTCDate());
  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
};

export const formatInputDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  const day = cleaned.slice(0, 2);
  const month = cleaned.slice(2, 4);
  const year = cleaned.slice(4, 8);

  let formatted = "";
  if (day) formatted += day;
  if (month) formatted = `${formatted}/${month}`;
  if (year) formatted = `${formatted}/${year}`;
  
  return formatted;
};
