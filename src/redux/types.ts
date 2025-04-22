//authSlice

export interface UserInfoObject {
    _id: string;
    createdAt: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    updatedAt: string;
    verified: boolean;
    lastAccessBusiness: string;
    phoneNo: string;
    mobile: string;
    imageUrl: string;
    gender: string;
    dob: string;
    uuid: string;
    sessionId: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    userInfo: UserInfoObject | null;
    myBusinesses: Array<object>;
}

//EventSlice

export interface EventState {
    invited: any[];
    invitedCount: number;
    linkedCount: number;
    linkedAll: boolean;
    invitedAll: boolean;
    linkedRecords: any[];
}


//LoaderSlice
export interface LoaderState {
    loading: boolean;
}


//NetworkSlice
export interface NetworkState {
    isConnected: boolean;
    showNetworkError: boolean;
}

//NotificationSlice

export interface Notification {
    id: string;
    read: boolean;
}

export interface NotificationState {
    notifications: Notification[];
    badgeCount: number;
}

//ToastSlice
export interface ToastState {
    toastStack: Array<{
        id: string;
        message: string;
        visible: boolean;
        type: 'success' | 'error' | 'warning' | 'info';
    }>;
}

