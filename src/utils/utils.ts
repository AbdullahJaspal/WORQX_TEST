import { repeatOptions } from '../constants/data';
import { icons } from '../assets/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import NetInfo from '@react-native-community/netinfo';
dayjs.extend(relativeTime);

const CONNECTIVITY_CHECK_TIMEOUT = 3000;

type FormatType =
  | 'day'
  | 'shortDate'
  | 'longDate'
  | 'time'
  | 'time12h'
  | 'isoDate'
  | 'monthYear'
  | 'dateMonth'
  | 'numeric'
  | 'timeAgo';

const formatDate = (
  date: Date | string = new Date(),
  formatType: FormatType = 'isoDate',
): string => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;

  switch (formatType) {
    case 'day':
      return parsedDate.toLocaleDateString('en-US', { weekday: 'long' });

    case 'shortDate':
      return parsedDate.toLocaleDateString('en-US', {
        // weekday: 'short',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

    case 'longDate':
      return parsedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      });

    case 'time':
      return parsedDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

    case 'time12h':
      let hours = parsedDate.getHours();
      const minutes = parsedDate.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${ampm}`;

    case 'isoDate':
      return dayjs(parsedDate).format('YYYY-MM-DD');

    case 'monthYear':
      return parsedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      });

    case 'dateMonth':
      return parsedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
      });

    case 'numeric':
      return parsedDate.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

    case 'timeAgo':
      return dayjs(parsedDate).fromNow();

    default:
      return parsedDate.toISOString();
  }
};

const getGreeting = (hour: number) => {
  return hour < 12
    ? 'Good Morning'
    : hour < 18
      ? 'Good Afternoon'
      : 'Good Night';
};

const getGreetingImage = (hour: number) => {
  return hour < 12
    ? icons.morning
    : hour < 18
      ? icons.afternoon
      : icons.evening;
};

const getUserInitials = (firstName: string, lastName: string) => {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
  return firstInitial + lastInitial;
};

const getRepeatLabel = (value: string) => {
  const option = repeatOptions.find(option => option.value === value);
  return option ? option.label : 'Unknown';
};

const getAddress = (manualAddress: {
  postalCode: string;
  address: string;
  city: string;
  state: string;
}) => {
  return `${manualAddress.postalCode} ${manualAddress.address} ${manualAddress.city} ${manualAddress.state}`;
};

const checkInternetConnectivity = async (): Promise<boolean> => {
  try {
    const networkState = await NetInfo.fetch();

    if (!networkState.isConnected) {
      return false;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      CONNECTIVITY_CHECK_TIMEOUT,
    );

    try {
      await fetch('https://8.8.8.8', {
        method: 'HEAD',
        signal: controller.signal,
      });
      return true;
    } catch (error) {
      return false;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    return false;
  }
};

const getDefaultStartTime = () => {
  const now = new Date();
  now.setHours(now.getHours() + 1);
  now.setMinutes(0, 0, 0);

  const hours = now.getHours();
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;

  return {
    hour: hour12,
    minute: 0,
    period: period,
  };
};

const parseTimeString = (timeStr: string) => {
  if (!timeStr) return null;

  const match = timeStr.match(/(\d+):(\d+)\s+([AP]M)/);
  if (!match) return null;

  let [_, hours, minutes, period] = match;
  return {
    hour: parseInt(hours),
    minute: parseInt(minutes),
    period,
  };
};

const isEndTimeAfterStartTime = (startTimeStr: string, endTimeStr: string): boolean => {
  const startTime = parseTimeString(startTimeStr);
  const endTime = parseTimeString(endTimeStr);

  if (!startTime || !endTime) return false;

  // Convert to 24-hour format for comparison
  let startHour = startTime.hour;
  if (startTime.period === 'PM' && startHour < 12) startHour += 12;
  if (startTime.period === 'AM' && startHour === 12) startHour = 0;

  let endHour = endTime.hour;
  if (endTime.period === 'PM' && endHour < 12) endHour += 12;
  if (endTime.period === 'AM' && endHour === 12) endHour = 0;

  if (endHour < startHour) return false;
  if (endHour === startHour && endTime.minute <= startTime.minute) return false;

  return true;
};

const getEndTimeFromStart = (
  startHour: number,
  startMinute: number,
  startPeriod: string,
) => {
  if (startHour === undefined || startMinute === undefined || !startPeriod) {
    const defaultTime = getDefaultStartTime();
    return {
      hour: defaultTime.hour === 12 ? 1 : defaultTime.hour + 1,
      minute: defaultTime.minute,
      period:
        defaultTime.hour === 11
          ? 'PM'
          : defaultTime.hour === 12
            ? 'PM'
            : defaultTime.period,
    };
  }

  let hour = startHour;
  if (startPeriod === 'PM' && hour < 12) hour += 12;
  if (startPeriod === 'AM' && hour === 12) hour = 0;

  hour += 1;

  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;

  return { hour: hour12, minute: startMinute, period };
};

const getChangedFields = (original: any, updated: any): Record<string, any> => {
  const changedFields: Record<string, any> = {};

  for (const key in updated) {
    if (updated[key] !== original[key]) {
      changedFields[key] = updated[key];
    }
  }

  return changedFields;
};

export {
  getGreeting,
  getGreetingImage,
  formatDate,
  getUserInitials,
  getRepeatLabel,
  getAddress,
  getDefaultStartTime,
  getEndTimeFromStart,
  getChangedFields,
  parseTimeString,
  isEndTimeAfterStartTime,
};