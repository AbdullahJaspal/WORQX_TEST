import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import { ThemeColors } from "../../../theme/colors";

export interface NotificationProfile {
    uri: string;
}

export interface NotificationItem {
    _id: string;
    id?: string;
    eventId?: string;
    type: 'update' | 'invitation' | 'timesheet' | 'calendarEvent' | 'calendarEventUpdate';
    isRead: boolean;
    name?: string;
    title?: string;
    message?: string;
    createdAt?: string;
    profile?: string;
    profiles?: Array<NotificationProfile>;
    eventSubject?: string;
    organiser?: string;
    description?: string;
}

export interface EmptyListProps {
    colors: {
        textSecondary: string;
    };
}

export interface ProfileCompletionHeaderProps {
    userInfo: any;
    colors: ThemeColors;
}

export interface ActionButtonsProps {
    item: NotificationItem;
    colors: ThemeColors;
    onActionPress: (type: string) => void;
}

export interface ActionTakenProps {
    action: string;
    colors: {
        primary: string;
        error: string;
    };
}

export interface NotificationItemProps {
    item: NotificationItem;
    onMarkAsRead: (id: string) => void;
    onMarkAsUnread: (id: string) => void;
    colors: ThemeColors;
    navigation: NativeStackNavigationProp<ParamListBase>;
}

export interface NotificationsProps {
    navigation: NativeStackNavigationProp<ParamListBase>;
    route: RouteProp<ParamListBase, string>;
}