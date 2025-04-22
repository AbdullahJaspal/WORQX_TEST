import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ref, RefObject } from "react";
import { FlatList, SectionList } from "react-native";
import { ThemeColors } from "../../../theme/colors";



//Agenda/tasklist
export interface TasklistProps {
    sections: any[];
    selectedDate: string;
    sectionListRef?: RefObject<SectionList>;
}



//AgendaItem

export interface ManualAddress {
    postalCode: string;
    address: string;
    city: string;
    state: string;
}

export interface AgendaItem {
    sessionTime?: string;
    meetingPeriod?: string;
    name?: string;
    platform?: string;
    subject: string;
    meeting?: boolean;
    repeat?: string;
    manualAddress?: ManualAddress;
    startTime: string;
    endTime: string;
    meetingLink?: string;
    _id?: string;
}

export interface AgendaItemProps {
    item: AgendaItem;
    colors: {
        primary: string;
        grey: string;
        textPrimary: string;
        textSecondary: string;
    };
    navigation: any;
}


//calendarHeader
export interface CalendarHeaderProps {
    selectedDate: string;
    timeline: boolean;
    onTimelineToggle: () => void;
}

//CalendarScreen
export interface CalendarScreenProps {
    navigation: NativeStackNavigationProp<any>;
}

export interface MarkedDate {
    [date: string]: {
        selected?: boolean;
        marked?: boolean;
        dotColor?: string;
        selectedColor?: string;
        selectedTextColor?: string;
    };
}


//timeline

export interface ManualAddress {
    address: string;
    city: string;
    state: string;
    postalCode: string;
}

export interface Event {
    subject: string;
    startTime: string;
    endTime: string;
    meeting: boolean;
    date: string;
    manualAddress?: ManualAddress;
    _id?: string;
    businessId?: string;
    userId?: string;
    allDay?: boolean;
    repeat?: string;
    meetingLink?: string | null;
    invitedUsers?: any[];
    isDeleted?: boolean;
    location?: string | null;
    confirmedAttendees?: any[];
    declinedAttendees?: any[];
}

export interface DayEvents {
    title: string;
    data: Event[];
}

export interface TimelineViewProps {
    timelineRef: Ref<FlatList>;
    eventsData: DayEvents[];
    selectedDate: string;
    setSelectedDate: (date: string) => void;
}


export interface DayEventsComponentProps {
    item: DayEvents;
    colors: ThemeColors;
    timeCache: Record<string, number>;
    isSelected: boolean;
}
