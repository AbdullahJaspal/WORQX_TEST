import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        height: 2,
        width: '70%',
    },
    projectsContainer: {
        flex: 1,
    },
    projectItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 12,
        borderLeftWidth: 2,
        paddingRight: 8,
        paddingLeft: 12,
        height: 82,
        width: '90%',
        gap: 12,
        alignSelf: 'center',
    },
    projectContent: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        height: '100%',
    },
    projectDetails: {
        flex: 1,
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
});


export default styles;