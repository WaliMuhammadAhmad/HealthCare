export const formatTime = (time: string | Date): string => {
  const dateObj =
    typeof time === "string" ? new Date(`1970-01-01T${time}`) : time;
  let hours = dateObj.getHours();
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 0 to 12
  return `${hours}:${minutes} ${ampm}`;
};
