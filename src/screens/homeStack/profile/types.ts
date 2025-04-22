import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export interface ProfileProps {
    navigation: NativeStackNavigationProp<any>;
}

export type VerificationType = 'updateEmail' | 'updateMobile' | undefined | null;

export interface InfoType {
    personalInfo: {
        firstName: string
        lastName: string
    },
    contactInfo: {
        mobile: string
        email: string
    },
    additionalInfo: {
        dob: string | Date | undefined
        gender: string
    },
    image: {
        uri: string
        name: string
        type: string
    },
    profile: string
}
