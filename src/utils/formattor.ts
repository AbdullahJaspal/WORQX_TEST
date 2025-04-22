
export const formatTimeSlot = (hours: number): string => {
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour = hours % 12 || 12;
  return `${hour}${period}`;
};

export const parseTime = (time: string): number => {
  if (!time || typeof time !== 'string') return 0;

  const match = time.match(/(\d+):(\d+) (\w{2})/);
  if (!match) return 0;

  const [_, rawHour, minutes, period] = match;
  let hour = parseInt(rawHour, 10);
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return hour * 60 + parseInt(minutes, 10);
};
