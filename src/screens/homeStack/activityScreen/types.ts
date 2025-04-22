import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type TabType = 'All' | 'Active' | 'Visited';

export interface ProjectItem {
    id: string;
    title: string;
    description: string;
    location: string;
    timeframe: string;
    unread: boolean;
}

export interface ActivityScreenProps {
    navigation: NativeStackNavigationProp<any>;
}
