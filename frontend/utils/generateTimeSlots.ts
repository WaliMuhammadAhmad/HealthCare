import { format, parseISO } from "date-fns";

export const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 17; hour++) {
    const ampm = hour < 12 ? "AM" : "PM";
    const displayHour = hour <= 12 ? hour : hour - 12;
    slots.push(`${displayHour}:00 ${ampm}`);
  }
  return slots;
};

export const generateAvailableTimeSlots = (
  date: Date,
  bookedAppointments: Array<{
    appointmentID: number;
    appointmentDate: string;
    appointmentTime: string;
  }>,
  startHour: number,
  endHour: number
) => {
  const allTimeSlots = generateTimeSlots();
  const dateString = format(date, "yyyy-MM-dd");

  // Filter booked appointments for the selected date
  const bookedTimes = bookedAppointments
    .filter((appt) => {
      const apptDate = parseISO(appt.appointmentDate);
      return format(apptDate, "yyyy-MM-dd") === dateString;
    })
    .map((appt) => {
      // Convert appointmentTime (e.g., "14:30:00") to display format (e.g., "2:30 PM")
      const [hour, minute] = appt.appointmentTime.split(":");
      const hourNum = parseInt(hour);
      const ampm = hourNum < 12 ? "AM" : "PM";
      const displayHour = hourNum <= 12 ? hourNum : hourNum - 12;
      return `${displayHour}:${minute} ${ampm}`;
    });

  // Filter time slots to include only those within availability hours and not booked
  return allTimeSlots.filter((slot) => {
    const [hourStr, ampm] = slot.split(" ");
    let hour = parseInt(hourStr.split(":")[0]);
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    return hour >= startHour && hour < endHour && !bookedTimes.includes(slot);
  });
};
