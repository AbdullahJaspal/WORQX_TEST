import { FilterOption, GenderData, ProjectItem } from "./types";

export const urlRegex =
  /^(https?:\/\/)(localhost|\d{1,3}(\.\d{1,3}){3}|[\w.-]+\.[a-z]{2,})(:\d+)?([/?#].*)?$/i;


export const BIOMETRIC_MESSAGES = {
  TITLE: 'Use passcode',
  DESCRIPTION: 'Enter phone screen lock pattern, PIN, password or fingerprint',
  UNAUTHORIZED: 'You are not authorized to use this application. Please complete biometric authentication to continue.',
};


export const calendarData = Array.from({ length: 31 }, (_, i) => {
  const date = new Date(2025, 2, i + 2);
  const formattedDate = date.toISOString().split('T')[0];
  return {
    title: formattedDate,
    data: [{
      subject: '',
      startTime: '',
      endTime: '',
      meeting: false,
      date: formattedDate
    }]
  };
});

export const tabs = ['All', 'My Network', 'Employees', 'Clients'];

export const repeatOptions = [
  { id: '1', label: 'Does Not Repeat', value: 'noRepeat' },
  { id: '2', label: 'Daily', value: 'daily' },
  { id: '3', label: 'Weekly', value: 'weekly' },
  { id: '4', label: 'Fortnightly', value: 'fortnightly' },
  { id: '5', label: 'Monthly', value: 'monthly' },
  { id: '6', label: 'Quarterly', value: 'quarterly' },
  { id: '7', label: 'Annually', value: 'annually' },
  { id: '8', label: 'Biannually', value: 'biAnnually' },
];
export const projects: ProjectItem[] = [
  {
    id: '1',
    title: 'Western Sydney Airport',
    description: 'Project · Built · Shopping Centre',
    location: '25 Sydney Road, Sydney',
    timeframe: '15 Feb 2024 12:30pm to Current',
    type: 'Built',
    category: 'Shopping Centre',
    unread: true,
  },
  {
    id: '2',
    title: 'Greenfield Solar Farm',
    description: 'Project · Ongoing · Renewable Energy Plant',
    location: '100 Solar Way, Queensland',
    timeframe: '1 Jan 2023 9:00am to 1 Jan 2023 10:00am',
    type: 'Ongoing',
    category: 'Renewable Energy Plant',
    unread: false,
  },
  {
    id: '3',
    title: 'Metro Rail Expansion',
    description: 'Project · Planned · Underground Rail',
    location: 'City Center to North District',
    timeframe: '15 Jan 2025 8:00am to 15 Jan 2025 11:00am',
    type: 'Planned',
    category: 'Underground Rail',
    unread: true,
  },
  {
    id: '4',
    title: 'Urban Park Revitalization',
    description: 'Project · In Progress · Public Park',
    location: '50 Green Avenue, Melbourne',
    timeframe: '15 May 2023 10:00am to Current',
    type: 'In Progress',
    category: 'Public Park',
    unread: false,
  },
];

export const genderData: GenderData[] = [
  { id: '1', label: 'Male', value: 'Male' },
  { id: '2', label: 'Female', value: 'Female' },
  { id: '3', label: 'Not sepcified', value: 'Not sepcified' },
];

export const filterOptions: FilterOption[] = [
  { id: '1', label: 'All', value: 'All' },
  { id: '2', label: 'Accepted', value: 'Accepted' },
  { id: '3', label: 'Rejected', value: 'Rejected' },
  { id: '4', label: 'Pending', value: 'Pending' },
];
