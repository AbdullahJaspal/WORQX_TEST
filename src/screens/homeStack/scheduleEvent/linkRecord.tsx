import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../../context/themeContext';
import { Header, InputField, Button, Text, Switch } from '../../../components';
import { icons } from '../../../assets/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  linkAll,
  linkRecords,
  removelinkedRecords,
} from '../../../redux/features/eventSlice';
import { RootState } from '../../../redux/store';
import { LinkRecordProps, Record } from './types';



const LinkRecord: React.FC<LinkRecordProps> = ({ }) => {
  const { colors } = useTheme();
  const [selectedTab, setSelectedTab] = useState('All');
  const [records, setRecords] = useState<Record[]>([]);
  const { linkedRecords, linkedAll } = useSelector(
    (state: RootState) => state.event,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();

  const tabs = ['All', 'Employees', 'Sales', 'Projects', 'Services', 'Budget'];

  const fetchRecordsList = useCallback(
    async (pageNum: number) => {
      if (!hasMore && pageNum > 1) return;
      setLoading(true);
      try {
        const staticRecords = [
          { id: 1, name: 'Lendlease', category: 'Employees' },
          { id: 2, name: 'Barangaroo South', category: 'Employees' },
          { id: 3, name: 'Lendlease - Collins Arch', category: 'Sales' },
          { id: 4, name: 'Mirvac - Southbank Place', category: 'Sales' },
          { id: 5, name: 'Multiplex - One Circular Quay', category: 'Sales' },
          { id: 6, name: 'John Holland - Melbourne Quarter', category: 'Sales' },
          { id: 7, name: 'Lendlease - Darling Square', category: 'Projects' },
          { id: 8, name: 'CPB Contractors - WestConnex', category: 'Projects' },
          {
            id: 9,
            name: 'Hutchinson Builders - 80 Collins Street',
            category: 'Projects',
          },
          {
            id: 10,
            name: 'Queen Victoria Market Renewal',
            category: 'Projects',
          },
          {
            id: 11,
            name: 'Probuild - The Ribbon Darling Harbour',
            category: 'Services',
          },
          { id: 12, name: 'Icon - Spencer Street Tower', category: 'Budget' },
        ];
        const start = (pageNum - 1) * limit;
        const end = start + limit;
        const paginatedRecords = staticRecords.slice(start, end);
        setRecords(prevRecords =>
          pageNum === 1
            ? paginatedRecords
            : [...prevRecords, ...paginatedRecords],
        );
        setHasMore(paginatedRecords.length >= limit);
      } catch (error) {
        console.error('Error fetching records:', error);
      } finally {
        setLoading(false);
      }
    },
    [limit, hasMore],
  );

  useEffect(() => {
    fetchRecordsList(1);
  }, [fetchRecordsList]);

  const loadMoreRecords = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchRecordsList(nextPage);
    }
  };

  const filteredRecords = records.filter(
    record =>
      (selectedTab === 'All' || record.category === selectedTab) &&
      record.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const isRecordLinked = useCallback(
    (recordId: string | number) => {
      return linkedRecords.some(record => record.id === recordId) || linkedAll;
    },
    [linkedRecords, linkedAll],
  );

  const handleLink = useCallback(
    (item: Record) => {
      if (!isRecordLinked(item.id)) {
        dispatch(linkRecords([...linkedRecords, item]));
      } else {
        dispatch(removelinkedRecords(item.id));
      }
    },
    [dispatch, linkedRecords, isRecordLinked],
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleAllLinked = (val: boolean | string) => {
    if (val) {
      const recordsToLink = filteredRecords.filter(
        record => !linkedRecords.some(linked => linked.id === record.id),
      );
      const allLinkedRecords = [...linkedRecords, ...recordsToLink];
      dispatch(
        linkAll({
          linked: allLinkedRecords,
          length: allLinkedRecords.length,
          isAll: true,
        }),
      );
    } else {
      const recordsToKeep = linkedRecords.filter(
        linked => !filteredRecords.some(record => record.id === linked.id),
      );

      dispatch(
        linkAll({
          linked: recordsToKeep,
          length: recordsToKeep.length,
          isAll: false,
        }),
      );
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Schedule Event" />
      <View style={styles.searchContainer}>
        <InputField
          label=""
          placeholder="Search record"
          icon={icons.search}
          onChangeText={handleSearch}
        />
      </View>

      <View>
        <FlatList
          data={tabs}
          removeClippedSubviews={false}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabContainer}
          getItemLayout={(data, index) => ({
            length: 70,
            offset: 70 * index,
            index,
          })}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.tab,
                {
                  backgroundColor:
                    selectedTab === item ? colors.primary : 'transparent',
                  borderColor:
                    selectedTab === item ? colors.primary : colors.grey,
                },
              ]}
              onPress={() => setSelectedTab(item)}>
              <Text
                textStyle="semibold12"
                color={selectedTab === item ? colors.white : colors.primary}>
                {item}
              </Text>
            </Pressable>
          )}
        />
      </View>

      <FlatList
        data={filteredRecords}
        contentContainerStyle={styles.recordListContainer}
        keyExtractor={item => item.id.toString()}
        initialNumToRender={10}
        onEndReached={loadMoreRecords}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        removeClippedSubviews={false}
        ListHeaderComponent={
          selectedTab === 'All' ? (
            <View style={styles.switchContainer}>
              <Text textStyle="semibold16">Link all</Text>
              <Switch value={linkedAll} onValueChange={handleAllLinked} />
            </View>
          ) : null
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text textStyle="medium14">No records found</Text>
          </View>
        )}
        renderItem={({ item }) => {
          const linked = isRecordLinked(item.id);
          return (
            <View key={item.id} style={styles.recordItem}>
              <Text
                style={{ width: '65%' }}
                textStyle="medium12"
                color={colors.textPrimary}>
                {item.name}
              </Text>
              <Button
                title={linked ? 'Unlink Record' : 'Link Record'}
                onPress={() => handleLink(item)}
                height={24}
                width={137}
                backgroundColor={linked ? colors.grey : colors.primary}
                textColor={linked ? colors.primary : colors.white}
                textStyle="semibold12"
                disabled={linkedAll}
              />
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: { paddingHorizontal: 24, marginBottom: 16 },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    height: 35,
  },
  tab: {
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
  recordListContainer: {
    paddingHorizontal: 24,
    flexGrow: 1,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LinkRecord;
