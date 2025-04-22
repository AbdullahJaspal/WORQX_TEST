import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList, RootStackParamList, routes } from "../../../navigation/Routes";
import { RouteProp } from "@react-navigation/native";

export interface EventDetailProps {
    navigation: NativeStackNavigationProp<RootStackParamList, typeof routes.eventDetail>;
    route: RouteProp<RootStackParamList, typeof routes.eventDetail>;
}

export interface EventDetailData {
    _id: string;
    subject: string;
    date: string;
    startTime: string;
    endTime: string;
    repeat: string;
    meetingLink?: string;
    manualAddress?: {
        postalCode: string;
        address: string;
        city: string;
        state: string;
    };
    participants?: Array<{
        name: string;
        imageUrl?: string;
        firstName: string;
        lastName: string;
        role: string;
        userId: string;
    }>;
    userId: string;
    confirmedAttendees?: Array<{
        userId: string;
        [key: string]: any;
    }>;
    declinedAttendees?: Array<{
        userId: string;
        [key: string]: any;
    }>;
}



//participants
export type ParticipantsRouteProp = RouteProp<
    HomeStackParamList,
    typeof routes.participants
>;

export interface ParticipantsProps {
    route: ParticipantsRouteProp;
}