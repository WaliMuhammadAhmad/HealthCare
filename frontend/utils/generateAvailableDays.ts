import { startOfToday, addDays, format } from "date-fns";

export const generateAvailableDays = (serviceDays?: string) => {
  const today = startOfToday();
  const threeWeeksLater = addDays(today, 21);
  const availableDays: Date[] = [];
  let currentDay = today;

  // If no serviceDays (no doctor selected), default to Monday-Friday
  const validDays = serviceDays
    ? serviceDays.split(",").map((day) => day.trim().toLowerCase())
    : ["mon", "tue", "wed", "thu", "fri"];

  // Map service days to JavaScript Date.getDay() values (0 = Sunday, 1 = Monday, etc.)
  const dayMap: { [key: string]: number } = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
  };

  while (currentDay <= threeWeeksLater) {
    const dayName = format(currentDay, "EEE").toLowerCase();
    if (validDays.includes(dayName)) {
      availableDays.push(new Date(currentDay));
    }
    currentDay = addDays(currentDay, 1);
  }

  return availableDays;
};
