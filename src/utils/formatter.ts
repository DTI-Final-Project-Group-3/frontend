export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    year: "numeric", // numeric year (e.g., '2023')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long", // abbreviated weekday name (e.g., 'Monday')
    month: "short", // abbreviated month name (e.g., 'October')
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
    dateTimeOptions,
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions,
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions,
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

export const formatDistance = (meters: number | undefined): string => {
  if (meters === undefined) {
    return "0 km";
  }
  const distanceInKm = meters / 1000;
  const formattedDistance = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(distanceInKm);
  return `${formattedDistance} km`;
};

export function formatDateString(dateString: string) {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  return new Intl.DateTimeFormat("en-GB", options).format(date);
}

export function formatDateHyphen(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
