import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainCont: { flex: 1, alignItems: 'center' },
  header: { width: '85%', marginTop: 10, alignSelf: 'center' },
  logoContainer: { alignItems: 'center' },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '95%',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    width: '43%',
  },
  orContainer: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 5,
  },
});

export default styles;
