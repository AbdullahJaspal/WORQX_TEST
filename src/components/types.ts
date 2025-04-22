import { ImageProps, ImageSourcePropType, ImageStyle, PressableProps, TextInputProps, TextProps, TextStyle, ViewProps, ViewStyle } from "react-native";
import { textStyles } from "./Text";
import { icons } from "../assets/icons";


//button
export type ButtonProps = {
    title: string;
    onPress?: () => void;
    backgroundColor?: string;
    textColor?: string;
    textStyle?: keyof typeof textStyles;
    borderRadius?: number;
    paddingHorizontal?: number;
    width?: ViewStyle['width'];
    height?: ViewStyle['height'];
    disabled?: PressableProps['disabled'];
    style?: ViewProps['style'];
    borderColor?: ViewStyle['borderColor'];
    icon?: ImageProps['source'];
    iconSize?: number;
};

//countdown
export interface CountdownTimerProps {
    duration: number;
    storageKey: string;
    onExpire?: () => void;
    onResend: () => void;
    resendLabel?: string;
    autoStart?: boolean;
    textStyle?: keyof typeof textStyles;
    activeStyle?: any;
    expiredStyle?: any;
    forceReset?: boolean;
}

//datePicker
export interface DatePickerProps {
    initialDate?: Date | string;
    visible: boolean;
    onClose: () => void;
    onSelectDate: (date: string) => void;
    currentDate?: Date | string;
    calendarTheme?: any;
}

//dropdown

export type DefaultDropdownItem = {
    _id: string;
    name?: string;
    abn?: string;
    color?: string;
    imageUrl?: string | null;
    role?: string;
    status?: string;
    icon?: keyof typeof icons;
    value?: string;
    label?: string;
};

export type SimpleDropdownItem = {
    id: string;
    label: string;
    value: string;
};

export type FilterDropdownItem = {
    id: string;
    label: string;
    value: string;
};

export type DropdownItem = DefaultDropdownItem | SimpleDropdownItem | FilterDropdownItem | Record<string, any>;

export type DropdownVariant = 'default' | 'simple' | 'filter';

export type DropdownProps = {
    data: DropdownItem[];
    selectedItem?: DropdownItem;
    onSelect: (item: DropdownItem) => void;
    label?: string;
    placeholder?: string;
    variant?: DropdownVariant;
    containerStyle?: object;
    headerStyle?: object;
    dropdownStyle?: object;
    itemStyle?: object;
    showIcons?: boolean;
    iconSize?: number;
    labelStyle?: keyof typeof textStyles;
    labelColor?: string;
    renderHeader?: (
        selectedItem: DropdownItem | undefined,
        isOpen: boolean,
    ) => React.ReactNode;
    renderItem?: (
        item: DropdownItem,
        isSelected: boolean,
        onSelect: (item: DropdownItem) => void,
    ) => React.ReactElement;
    disabled?: boolean;
    onOpenStateChange?: (isOpen: boolean) => void;
};
export interface DropdownHeaderProps {
    variant: DropdownVariant;
    item?: DropdownItem;
    isOpen: boolean;
    colors: any;
    placeholder: string;
    showIcons: boolean;
    iconSize: number;
    style?: object;
    disabled?: boolean;
}

export interface DropdownItemProps {
    item: DropdownItem;
    isSelected: boolean;
    onSelect: (item: DropdownItem) => void;
    variant: DropdownVariant;
    colors: any;
    showIcons: boolean;
    iconSize: number;
    itemStyle?: object;
}


//header
export interface HeaderProps {
    onPress?: () => void;
    logoVisible?: boolean;
    white?: boolean;
    title?: string;
    auth?: boolean;
    leftIcon?: ImageProps['source'];
    onPressLeft?: () => void;
}


//icon
export interface IconProps {
    source: ImageSourcePropType | undefined;
    size?: number;
    style?: ViewStyle;
    color?: ImageStyle['tintColor'];
    disabled?: PressableProps['disabled'];
    round?: boolean;
    onPress?: PressableProps['onPress'];
}


//inputField
export type InputVariant = 'default' | 'password' | 'phone' | 'search';

export interface InputFieldProps extends TextInputProps {
    label?: string;
    required?: boolean;
    error?: string;
    containerStyle?: ViewStyle;
    style?: ViewStyle;
    isPassword?: boolean;
    isPhoneNumber?: boolean;
    handleCountryCode?: (code: string) => void;
    icon?: ImageProps['source'];
    iconContainerStyle?: ViewStyle;
    onPressIcon?: () => void;
    marginTop?: ViewStyle['marginTop'];
    variant?: InputVariant;
    labelColor?: string;
    verifyStatus?: string;
    verify?: boolean;
    onPressVerify?: () => void;
}

//loadingScreen
export interface LoadingScreenProps {
    message?: string;
    spinnerSize?: number;
}

//Modal
export interface ModalProps {
    visible: boolean;
    onClose: () => void;
    onAction: () => void;
    title: string;
    message: string;
    leftButton: string;
    rightButton: string;
}

//pagingDots
export interface PaginationDotsProps {
    total: number;
    currentIndex: number;
    color?: string;
}


//profileAvatar
export interface ProfileAvatarProps {
    uri?: string | null | undefined;
    firstName?: string;
    lastName?: string;
    size?: number;
    style?: object;
    textStyle?: keyof typeof textStyles;
}

//scannerMask
export interface ScannerMaskProps {
    expirySeconds?: number;
}

//Spinner
export interface SpinnerProps {
    size?: number;
    color?: string;
    secondaryColor?: string;
    duration?: number;
    strokeWidth?: number;
    progress?: number;
}

//switch
export interface SwitchProps {
    value: boolean;
    onValueChange: (newValue: boolean | string) => void;
}


//Text
export interface CustomTextProps extends TextProps {
    textStyle?: keyof typeof textStyles;
    color?: string;
}




