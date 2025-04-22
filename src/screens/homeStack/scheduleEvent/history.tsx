import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, StyleSheet, Image, FlatList } from 'react-native';
import {
  Dropdown,
  Icon,
  InputField,
  LoadingScreen,
  Text,
} from '../../../components';
import { icons } from '../../../assets/icons';
import { useTheme } from '../../../context/themeContext';
import { images } from '../../../assets/images';
import { filterOptions } from '../../../constants/data';
import { getEventHistory } from '../../../api/calendar';
import { formatDate } from '../../../utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import DatePicker from '../../../components/DatePicker';
import { showLoader } from '../../../redux/features/loaderSlice';
import { DropdownItem } from '../../../components/types';
import { AllAttendee, Event, HistoryItem, HistoryScreenProps } from './types';



const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);

  const filteredData = useMemo(() => {
    let filtered = [...historyData];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.firstName?.toLowerCase().includes(query) ||
          item.lastName?.toLowerCase().includes(query) ||
          item.email?.toLowerCase().includes(query) ||
          item.eventName?.toLowerCase().includes(query),
      );
    }

    if (selectedFilter.value !== 'All') {
      filtered = filtered.filter(item => item.status === selectedFilter.value);
    }

    return filtered;
  }, [historyData, searchQuery, selectedFilter]);

  const performSearch = () => { };
  const fetchHistory = useCallback(async () => {
    try {
      dispatch(showLoader(true));
      const response = await getEventHistory({
        businessId: userInfo?.lastAccessBusiness || '',
        date: new Date(selectedDate),
      });

      if (response && response.events) {
        dispatch(showLoader(false));

        const allAttendees = response?.events?.flatMap((event) =>
          [
            ...event.confirmedAttendees,
            ...event.declinedAttendees,
            ...event.pendingAttendees,
          ].map(attendee => ({
            eventId: event.eventId,
            eventName: event.eventName,
            ...attendee,
          })),
        );

        const attendeesWithTime = allAttendees.map(attendee => ({
          ...attendee,
          time: attendee.timestamp
            ? formatDate(new Date(attendee.timestamp), 'time')
            : 'N/A',
        }));

        setHistoryData(attendeesWithTime);
      } else {
        setHistoryData([]);
        dispatch(showLoader(false));
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      dispatch(showLoader(false));
      setHistoryData([]);
    }
  }, [selectedDate, userInfo?.lastAccessBusiness, dispatch, formatDate]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);


  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setCalendarVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <Text textStyle="semibold20">History</Text>
        <Icon
          onPress={() => {
            navigation.goBack();
          }}
          source={icons.closed}
          size={20}
        />
      </View>

      <Dropdown
        data={filterOptions}
        selectedItem={selectedFilter}
        onSelect={(item: DropdownItem) => setSelectedFilter(item as { id: string; label: string; value: string })}
        variant="filter"
        placeholder="History by"
      />

      <InputField
        variant="search"
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
        containerStyle={{ marginTop: 12 }}
        icon={icons.search}
        onPressIcon={performSearch}
        iconColor={colors.primary}
      />

      <View
        style={[
          styles.dateContainer,
          { borderColor: colors.grey, marginTop: 10 },
        ]}>
        <Text textStyle="semibold16" color={colors.textPrimary}>
          {selectedDate || 'Select a date'}
        </Text>
        <Icon
          source={icons.calendar}
          size={20}
          color={colors.primary}
          onPress={() => setCalendarVisible(true)}
        />
      </View>

      {filteredData.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredData}
          keyExtractor={(item, index) => `${item._id}-${index}`}
          contentContainerStyle={styles.scrollContent}
          renderItem={({ item }) => <TimelineItem item={item} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text textStyle="regular16" color={colors.textSecondary}>
            No history data found for the selected date and filters.
          </Text>
        </View>
      )}

      <DatePicker
        visible={calendarVisible}
        onClose={() => setCalendarVisible(false)}
        onSelectDate={handleDateSelect}
        currentDate={selectedDate}
        calendarTheme={calendarTheme}
      />
      <LoadingScreen />
    </View>
  );
};

const TimelineItem = ({ item }: { item: HistoryItem }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.timelineItem}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '33%',
        }}>
        <Text textStyle="regular12" color={colors.textSecondary}>
          {item.timestamp}
        </Text>
        <View style={styles.timeColumn}>
          <View style={styles.timelineDotContainer}>
            <View
              style={[
                styles.timelineDot,
                {
                  backgroundColor:
                    item.status === 'Pending'
                      ? colors.warning
                      : item.status === 'Accepted'
                        ? colors.primary
                        : colors.error,
                },
              ]}
            />
            <View
              style={[
                styles.timelineLine,
                { backgroundColor: colors.textSecondary },
              ]}
            />
          </View>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.userInfo}>
          <Image
            source={item.imageUrl ? { uri: item.imageUrl } : images.profile}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text textStyle="bold16" color={colors.textPrimary}>
              {item.firstName} {item.lastName}{' '}
            </Text>
            <Text textStyle="medium14" color={colors.textPrimary}>
              {item.eventName}
            </Text>
            <Text textStyle="regular12" color={colors.textSecondary}>
              {item.email}
            </Text>
            <Text
              textStyle="semibold12"
              color={
                item.status === 'Accepted'
                  ? colors.success
                  : item.status === 'Rejected' || item.status === 'Declined'
                    ? colors.error
                    : colors.warning
              }>
              {item.status}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  filterContainer: {
    gap: 16,
    marginBottom: 20,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdown: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderRadius: 100,
    borderWidth: 0.5,
    padding: 10,
    paddingHorizontal: 15,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    height: 120,
  },
  timeColumn: {
    width: 50,
    alignItems: 'center',
  },
  timelineDotContainer: {
    alignItems: 'center',
  },
  timelineDot: {
    width: 11,
    height: 11,
    borderRadius: 100,
  },
  timelineLine: {
    width: 2,
    height: 120,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 100,
    alignSelf: 'center',
  },
  textContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendar: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 10,
  },
});

const calendarTheme = {
  textSectionTitleColor: 'black',
  selectedDayBackgroundColor: '#1B5E20',
  selectedDayTextColor: 'white',
  todayTextColor: '#1B5E20',
  dayTextColor: 'black',
  textDisabledColor: '#d9d9d9',
  arrowColor: 'black',
  monthTextColor: 'black',
};

export default HistoryScreen;
