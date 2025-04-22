import { Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        gap: 12,
    },
    separator: {
        height: 2,
    },
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tab: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        position: 'relative',
    },
    activeTab: {},
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        height: 1,
        width: '100%',
    },
    notificationItem: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        width: width,
    },
    notificationContent: {
        flexDirection: 'row',
        position: 'relative',
        alignItems: 'flex-start',
    },
    notificationText: {
        marginLeft: 10,
        flex: 1,
    },
    messageText: {
        marginTop: 2,
    },
    multipleAvatars: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 50,
        height: 50,
    },
    multipleAvatarImage: {
        height: 40,
        width: 40,
        borderRadius: 100,
    },
    firstAvatar: {
        top: -10,
        left: -5,
    },
    secondAvatar: {
        position: 'absolute',
        left: 6,
        top: 10,
    },
    avatarContainer: {
        width: 45,
        height: 45,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    verifiedIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    actionButtons: {
        justifyContent: 'flex-end',
        gap: 8,
    },
    actionTakenContainer: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingVertical: 5,
    },
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchContainer: {
        marginTop: 12,
        marginHorizontal: 24,
        marginVertical: 10,
    },
    markAllReadButton: {
        marginRight: 24,
        alignSelf: 'flex-end',
    },
    markUnreadButton: {
        alignSelf: 'flex-end',
        marginTop: 5,
    },
    underlinedText: {
        textDecorationLine: 'underline',
    },
    profileHeader: {
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 5,
    },
    profileCompletion: {
        flex: 1,
        gap: 2,
    },
    progressBarBackground: {
        height: 12,
        width: '100%',
        borderRadius: 100,
    },
    progressBar: {
        height: 12,
        borderRadius: 100,
    },
});


export default styles;