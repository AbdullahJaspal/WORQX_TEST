import { StyleSheet, } from 'react-native';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  eventCard: {
    backgroundColor: 'white',
    padding: 20,
    marginRight: 10,
    marginTop: 17,
  },
  selectedEventCard: {
    backgroundColor: '#F0F9F6',
    borderLeftWidth: 3,
    borderLeftColor: '#1B4332',
  },
  calendar: { overflow: 'hidden' },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    width: '100%',
    backgroundColor: 'red',
  },
  dayContainer: {
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  dragHandle: {
    height: 5,
    width: 100,
    backgroundColor: '#C6C6C8',
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 5,
  },
  agendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 74,
    width: '90%',
    marginTop: 15,
    alignSelf: 'center',
    paddingBottom: 5,
  },
  agendaItemTime: {
    justifyContent: 'center',
    width: 70,
    height: '100%',
  },
  agendaItemContent: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 5,
    justifyContent: 'space-between',
  },
  agendaItemDetails: {
    height: '100%',
    justifyContent: 'space-evenly',
  },
  agendaItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dateHeader: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    paddingVertical: 8,
  },
  floatingButton: {
    height: 56,
    width: 56,
    position: 'absolute',
    bottom: 10,
    right: 20,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // New styles for the Reanimated calendar implementation
  timelineContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  timeColumn: {
    width: 60,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  timeSlotLabel: {
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  dayEventsContainer: {
    height: 24 * 90, // HOUR_HEIGHT
    position: 'relative',
  },
  hourDivider: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  currentTimeIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
  },
  currentTimeLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentTimeDot: {
    height: 5,
    width: 5,
    backgroundColor: 'red',
    borderRadius: 100,
  },
  currentTimeLine: {
    height: 0.5,
    backgroundColor: 'red',
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  sectionHeader: {
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  agendaContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});
