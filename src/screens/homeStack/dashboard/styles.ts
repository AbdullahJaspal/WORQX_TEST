import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 27,
    paddingBottom: 20,
  },
  cardContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4,
    borderRadius: 16,
    paddingHorizontal: 27,
    marginTop: 15,
    paddingVertical: 20,
    gap: 10,
  },
  title: {
    width: '90%',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 40,
  },
  dateContainer: {
    height: 40,

    justifyContent: 'space-between',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  notesTab: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4,
    width: '100%',
    height: 56,
    marginTop: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 27,
    gap: 10,
  },
  searchInput: {
    flex: 1,
  },
  menuContainer: {
    flex: 1,
    marginTop: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 32,
    gap: 24,
    width: '47%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarContainer: {
    margin: 35,
    borderRadius: 20,
  },
});

export default styles;
