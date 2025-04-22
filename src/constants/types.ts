export interface ProjectItem {
    id: string;
    title: string;
    description: string;
    location: string;
    timeframe: string;
    type: 'Built' | 'Ongoing' | 'Planned' | 'In Progress';
    category: string;
    unread: boolean;
}

export type FilterOption = {
    id: string;
    label: string;
    value: string;
};

export type GenderData =
    { id: string, label: string, value: string }

