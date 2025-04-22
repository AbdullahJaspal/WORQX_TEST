import { StyleSheet } from 'react-native';
import { moderateScale } from '../../../utils/scaling';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    height: 200,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 22,
  },
  button: {
    marginTop: 22,
    alignSelf: 'flex-end',
  },
  notes: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 10,
    borderRadius: 8,
    marginTop: 24,
  },
  floatingButton: {
    height: moderateScale(56),
    width: moderateScale(56),
    position: 'absolute',
    bottom: moderateScale(30),
    right: moderateScale(30),
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
