export const setTimeToDateStart = (date: Date) => {
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
};

export const setTimeToDateEnd = (date: Date) => {
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
};
