export const addOneHour = (dateString: string) => {
  const date = new Date(dateString);
  date.setHours(date.getHours() + 1); // Add 1 hour
  return date;
};