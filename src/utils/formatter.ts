export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long", // abbreviated weekday name (e.g., 'Monday')
    month: "long", // abbreviated month name (e.g., 'October')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  return {
    formattedDateTime,
    formattedDate,
    formattedTime,
  };
};

export const formatPrice = (price: string) => {
  const amount = parseFloat(price);
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0, // Ensure no decimal places
    maximumFractionDigits: 0, // Ensure no decimal places
  }).format(amount);

  return formattedPrice;
};

export const formatDimension = (dimension: number | undefined): string => {
  if (dimension === undefined) {
    return "0 cm";
  }
  const formattedDimension = Math.round(dimension * 100) / 100;
  return `${formattedDimension} cm`;
};

export const formatWeight = (weight: number | undefined): string => {
  if (weight === undefined) {
    return "0 Kg";
  }
  const formattedWeight = Math.round(weight * 100) / 100;
  return `${formattedWeight} kg`;
};
