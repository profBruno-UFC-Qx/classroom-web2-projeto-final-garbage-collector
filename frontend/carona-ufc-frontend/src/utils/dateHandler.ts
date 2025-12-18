export const formatDateToISO = (brDate: string): string => {
  if (!brDate || brDate.length !== 10) return '';

  const parts = brDate.split('/');

  if (parts.length !== 3) return '';

  const [day, month, year] = parts;

  return `${year}-${month}-${day}`;
};

export const formatISOToBr = (isoDate: string): string => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};
