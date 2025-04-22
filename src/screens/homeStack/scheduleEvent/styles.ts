import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 22,
    marginTop: 15,
    flex: 1,
  },
  scrollViewContent: {
    gap: 10,
    paddingBottom: 30,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 0.2,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 38,
    height: 38,
    borderRadius: 100,
  },
  verifiedIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  regulatorContainer: {
    borderWidth: 0.4,
    paddingHorizontal: 8,
    borderRadius: 10,
    paddingBottom: 2,
    borderColor: '#FF6624',
    backgroundColor: '#E8DDD5',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 8,
  },
  inviteOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionContainer: {
    marginTop: 12,
    gap: 8,
  },
  linkedRecordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    gap: 10,
  },
  linkedRecordItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  invitedUsersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    gap: 10,
  },
  invitedUserItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  invitedUserInitials: {
    height: 24,
    width: 24,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  invitedUserAvatarContainer: {
    position: 'relative',
  },
  invitedUserVerifiedIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  invitedUserInfo: {
    flexDirection: 'column',
  },
  moreLessButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationOptionsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  locationOption: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  rightActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
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
  bottomSpacing: {
    height: 200,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
