import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 24,
        marginTop: 24,
    },
    section: {
        gap: 24,
    },
    detailsContainer: {
        gap: 12,
    },
    subjectContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    subjectText: {
        width: '70%',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    participantContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    imageContainer: {
        position: 'relative',
    },
    profileImage: {
        width: 34,
        height: 34,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    verifiedIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    seeMoreText: {
        textDecorationLine: 'underline',
    },
    statusContainer: {
        gap: 10,
    },
    repeatContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    editButton: {
        paddingHorizontal: 8,
    },
    deleteButton: {
        alignSelf: 'flex-start',
    },
});

export default styles;