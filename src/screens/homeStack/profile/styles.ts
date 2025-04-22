import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: { flex: 1 },
    contentContainer: { paddingHorizontal: 24, flex: 1 },
    profileContainer: { alignSelf: 'center' },
    profileImage: {
        height: 100,
        width: 100,
        borderRadius: 50,
        marginTop: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editIcon: {
        height: 20,
        width: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        position: 'absolute',
        bottom: 4,
        right: 6,
    },
    userInfoContainer: { alignSelf: 'center', alignItems: 'center', width: '100%' },
    editProfileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 141,
        justifyContent: 'center',
        gap: 8,
        borderRadius: 100,
        borderWidth: 0.5,
        height: 26,
        marginTop: 12,
    },
    sectionContainer: { marginTop: 15, gap: 12 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingVertical: 24,
    },
    calendar: {
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 10,
        padding: 10,
    },
    yearPickerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    yearItem: {
        padding: 16,
        backgroundColor: 'white',
        marginVertical: 4,
        borderRadius: 8,
    },
});

export default styles;
export const calendarTheme = {
    textSectionTitleColor: 'black',
    selectedDayTextColor: 'white',
    todayTextColor: '#1B5E20',
    dayTextColor: 'black',
    textDisabledColor: '#d9d9d9',
    arrowColor: 'black',
    monthTextColor: 'black',
};