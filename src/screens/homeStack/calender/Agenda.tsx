import { useEffect, } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { AgendaList } from 'react-native-calendars';
import AgendaItem from './AgendaItems';
import { Text } from '../../../components';
import { useTheme } from '../../../context/themeContext';
import { formatDate } from '../../../utils/utils';
import { useNavigation } from '@react-navigation/native';
import { TasklistProps } from './types';


const Tasklist = ({ sections, selectedDate, sectionListRef }: TasklistProps) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    if (selectedDate && sections.length > 0 && sectionListRef?.current) {
      const selectedIndex = sections.findIndex(
        section => section?.title === selectedDate,
      );

      if (selectedIndex !== -1) {
        setTimeout(() => {
          try {
            if (sectionListRef.current) {
              sectionListRef.current.scrollToLocation({
                sectionIndex: selectedIndex,
                itemIndex: 0,
                viewPosition: 0.5,
                animated: true,
              });
            }
          } catch (error) {
            console.log('Error scrolling to selected date:', error);
          }
        }, 100);
      }
    }
  }, [selectedDate, sections, sectionListRef]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AgendaList
        ref={sectionListRef}
        sections={sections}
        removeClippedSubviews={false}
        keyExtractor={(item, index) => item + index}
        renderSectionHeader={({ section }) => (
          <View
            style={[
              styles.sectionHeader,
              { backgroundColor: colors.background },
              section?.title === selectedDate
                ? { borderLeftWidth: 3, borderLeftColor: colors.primary }
                : {},
            ]}>
            <Text
              textStyle="medium20"
              style={section?.title === selectedDate ? { color: colors.primary } : {}}>
              {formatDate(section?.title, 'dateMonth')}
            </Text>
          </View>
        )}
        renderItem={({ item }: { item: any }) => (
          <AgendaItem item={item} colors={colors} navigation={navigation} />
        )}
        stickySectionHeadersEnabled={true}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={21}
        onScrollToIndexFailed={info => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            if (sectionListRef?.current?.scrollToLocation) {
              sectionListRef.current.scrollToLocation({
                sectionIndex: info.index,
                itemIndex: 0,
                animated: true,
              });
            }
            console.log('Error scrolling to index:', info);
          });
        }}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        onViewableItemsChanged={({ viewableItems }) => {
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    color: '#2E4924',
  },
});
export default Tasklist;