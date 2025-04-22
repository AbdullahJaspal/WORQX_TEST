import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export interface ScheduleEventProps {
    navigation: NativeStackNavigationProp<any>;
    route: any;
}

export interface User {
    _id: string;
    name: string;
    role: string;
    imageUrl?: string;
    firstName?: string;
    lastName?: string;
    userId?: string;
    category?: string
}

export interface EventFormData {
    selectedBusiness: {
        _id: string;
        value?: string;
        label?: string;
    };
    subject: string;
    selectedDate: string;
    startTime: string;
    endTime: string;
    isAllDay: boolean;
    location: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    networkCheck: boolean;
    businessCheck: boolean;
    eventType: 'Online' | 'OnSite';
    meetingLink: string;
    endDate: string | undefined;

    //for APi
    date?: string;
    businessId?: string;
    allDay?: boolean;
    repeat?: string;
    manualAddress?: {
        address: string;
        city: string;
        state: string;
        postalCode: string;
    },
    inviteOption?: string | null;
    invitedUsers?: any[]
}

export interface EventFormDataApi {

    businessId: string,
    subject: string,
    date: string,
    startTime: string,
    endTime: string,
    allDay: boolean,
    repeat: string,
    endDate: string | undefined,
    manualAddress: {
        address: string,
        city: string,
        state: string,
        postalCode: string,
    },
    meetingLink: string,
    inviteOption: string | null,
    invitedUsers: any[]
    eventType: string,
}



//history
export interface HistoryItem {
    _id: string;
    email: string;
    firstName: string;
    imageUrl: string;
    lastName: string;
    role: string;
    status: string;
    timestamp: null | string;
    userId: string;
    time?: string;
    eventName?: string
}
export interface Event {
    eventId: string;
    eventName: string;
    confirmedAttendees: Attendee[];
    declinedAttendees: Attendee[];
    pendingAttendees: Attendee[];
}
export interface Attendee {
    _id: string;
    email: string;
    firstName: string;
    imageUrl: string;
    lastName: string;
    role: string;
    status: string;
    timestamp: null | string;
    userId: string;
}
export interface AllAttendee extends Attendee {
    eventId: string;
    eventName: string;
}
export interface HistoryScreenProps {
    navigation: NativeStackNavigationProp<any>;
}

//invitePerson

export interface InviteProps {
    navigation: NativeStackNavigationProp<any>;
}


//linkRecord
export interface LinkRecordProps {
    navigation: NativeStackNavigationProp<any>;
}

export interface Record {
    id: string | number;
    name: string;
    category: string;
}


