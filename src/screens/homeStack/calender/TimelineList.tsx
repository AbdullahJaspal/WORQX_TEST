import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
  Pressable,
} from 'react-native';
import { useTheme } from '../../../context/themeContext';
import { Text } from '../../../components';
import { formatDate } from '../../../utils/utils';
import { formatTimeSlot, parseTime } from '../../../utils/formattor';
import debounce from 'lodash/debounce';
import { useNavigation } from '@react-navigation/native';
import { routes } from '../../../navigation/Routes';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DayEvents, DayEventsComponentProps, Event, TimelineViewProps } from './types';


const SCREEN_WIDTH = Dimensions.get('window').width;
const HOUR_HEIGHT = 90;
const TIME_COLUMN_WIDTH = 60;



const groupOverlappingEvents = (
  events: Event[],
  timeCache: Record<string, number>,
) => {
  const sortedEvents = [...events].sort((a, b) => {
    const aStart = timeCache[a.startTime] || parseTime(a.startTime);
    const bStart = timeCache[b.startTime] || parseTime(b.startTime);
    return aStart - bStart;
  });

  const groups: Event[][] = [];

  sortedEvents.forEach(event => {
    const start = timeCache[event.startTime] || parseTime(event.startTime);
    const end = timeCache[event.endTime] || parseTime(event.endTime);

    let placed = false;

    for (const group of groups) {
      const hasConflict = group.some(e => {
        const eStart = timeCache[e.startTime] || parseTime(e.startTime);
        const eEnd = timeCache[e.endTime] || parseTime(e.endTime);
        return start < eEnd && end > eStart;
      });

      if (hasConflict) {
        group.push(event);
        placed = true;
        break;
      }
    }

    if (!placed) {
      groups.push([event]);
    }
  });

  return groups;
};



const DayEventsComponent: React.FC<DayEventsComponentProps> = React.memo(
  ({ item, colors, timeCache, isSelected }) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const events = item.data;

    const handleEventPress = (event: Event) => {
      navigation.navigate(routes.eventDetail, { item: event });
    };

    const hourDividers = useMemo(
      () =>
        Array.from({ length: 24 }, (_, i) => (
          <View
            key={`divider-${i}`}
            style={[
              styles.hourDivider,
              {
                top: i * HOUR_HEIGHT,
                backgroundColor:
                  i % 2 === 0
                    ? colors.background
                    : colors.backgroundSecondary || '#F5F5F5',
                height: HOUR_HEIGHT,
              },
            ]}
          />
        )),
      [colors],
    );

    const renderedEvents = useMemo(() => {
      if (!events.length) return null;

      const availableWidth = SCREEN_WIDTH - TIME_COLUMN_WIDTH;

      return groupOverlappingEvents(events, timeCache).map(
        (group, groupIndex) => {
          const groupLaneCount = group.length;

          return group.map((event, eventIndex) => {
            const startTime =
              timeCache[event.startTime] || parseTime(event.startTime);
            const endTime =
              timeCache[event.endTime] || parseTime(event.endTime);
            const top = (startTime * HOUR_HEIGHT) / 60;
            const height = Math.max(
              30,
              ((endTime - startTime) * HOUR_HEIGHT) / 60,
            );

            const laneIndex = group.indexOf(event);
            const eventWidth = availableWidth / groupLaneCount - 5;
            const left = laneIndex * (eventWidth + 5);

            const isShortEvent = height < 40;

            return (
              <Pressable
                key={`${event._id || groupIndex}-${eventIndex}`}
                onPress={() => handleEventPress(event)}
                style={[
                  styles.eventCard,
                  {
                    backgroundColor: event.meeting
                      ? colors.primaryLight
                      : 'transparent',
                    borderLeftColor: event.meeting
                      ? colors.primary
                      : 'transparent',
                    top,
                    left,
                    height,
                    width: eventWidth,
                    justifyContent: 'center',
                  },
                ]}>
                {isShortEvent ? (
                  <Text textStyle="medium12" numberOfLines={1}>
                    {event.subject}
                  </Text>
                ) : (
                  <>
                    <Text textStyle="medium12" numberOfLines={1}>
                      {event.startTime} - {event.endTime}
                    </Text>
                    <Text textStyle="medium12" numberOfLines={1}>
                      {event.subject}
                    </Text>
                  </>
                )}
              </Pressable>
            );
          });
        },
      );
    }, [events, timeCache, colors, handleEventPress]);

    return (
      <View
        style={[
          styles.eventsContainer,
          {
            width: SCREEN_WIDTH - TIME_COLUMN_WIDTH,
            backgroundColor: isSelected ? '#F7FAFC' : colors.background,
            borderLeftColor: isSelected ? colors.primary : 'rgba(0,0,0,0.1)',
            borderLeftWidth: isSelected ? 3 : 0.5,
          },
        ]}>
        {hourDividers}
        {renderedEvents}
      </View>
    );
  },
);



export const TimelineList: React.FC<TimelineViewProps> = ({
  timelineRef,
  eventsData,
  selectedDate,
  setSelectedDate,
}) => {
  const { colors } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDateIndex, setCurrentDateIndex] = useState(
    Math.max(
      0,
      eventsData.findIndex(day => day.title === selectedDate),
    ),
  );
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const debouncedSetSelectedDate = useCallback(
    debounce((newDate: string) => {
      setSelectedDate(newDate);
    }, 200),
    [setSelectedDate],
  );

  const handleScrollEnd = (event: {
    nativeEvent: { contentOffset: { x: number } };
  }) => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    const contentOffsetX = event.nativeEvent?.contentOffset?.x ?? 0;

    scrollTimeout.current = setTimeout(() => {
      const newIndex = Math.round(
        contentOffsetX / (SCREEN_WIDTH - TIME_COLUMN_WIDTH),
      );

      if (
        newIndex >= 0 &&
        newIndex < eventsData.length &&
        eventsData[newIndex].title !== selectedDate
      ) {
        debouncedSetSelectedDate(eventsData[newIndex].title);
      }
    }, 50);
  };

  const timeCache = useMemo(() => {
    const cache: Record<string, number> = {};
    eventsData.forEach(day => {
      day.data.forEach(event => {
        if (!cache[event.startTime]) {
          cache[event.startTime] = parseTime(event.startTime);
        }
        if (!cache[event.endTime]) {
          cache[event.endTime] = parseTime(event.endTime);
        }
      });
    });
    return cache;
  }, [eventsData]);

  const timeSlots = useMemo(
    () => Array.from({ length: 24 }, (_, i) => formatTimeSlot(i)),
    [],
  );

  const renderedTimeSlots = useMemo(
    () =>
      timeSlots.map((time, index) => (
        <View
          key={`time-${index}`}
          style={[
            styles.timeSlotLabel,
            {
              backgroundColor:
                index % 2 === 0
                  ? colors.background
                  : colors.backgroundSecondary || '#F5F5F5',
            },
          ]}>
          <Text textStyle="semibold12" color={colors.textPrimary}>
            {time}
          </Text>
        </View>
      )),
    [timeSlots, colors],
  );

  const currentTimeOffset = useMemo(() => {
    const now = new Date();
    const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
    return (minutesSinceMidnight * HOUR_HEIGHT) / 60;
  }, [currentTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const newIndex = eventsData.findIndex(day => day.title === selectedDate);
    if (newIndex !== -1 && newIndex !== currentDateIndex) {
      if (timelineRef && 'current' in timelineRef && timelineRef.current) {
        setTimeout(() => {
          (timelineRef.current as FlatList<DayEvents>).scrollToIndex({
            index: newIndex,
            animated: true,
            viewPosition: 0.5,
          });
        }, 50);
      }
      setCurrentDateIndex(newIndex);
    }
  }, [selectedDate, eventsData, currentDateIndex, timelineRef]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} nestedScrollEnabled={true}
        removeClippedSubviews={false}

      >
        <View
          style={[
            styles.currentTimeIndicator,
            {
              top: currentTimeOffset - 18,
              zIndex: 100,
              marginLeft: TIME_COLUMN_WIDTH - 2,
            },
          ]}>
          <Text textStyle="regular10" color="red" style={{ marginLeft: 5 }}>
            {formatDate(new Date(), 'time12h')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                height: 5,
                width: 5,
                backgroundColor: 'red',
                borderRadius: 100,
              }}
            />
            <View
              style={{
                height: 0.5,
                backgroundColor: 'red',
                width: '100%',
              }}
            />
          </View>
        </View>
        <View style={styles.timelineContainer}>
          <View style={styles.timeColumn}>{renderedTimeSlots}</View>
          <FlatList
            ref={timelineRef as React.RefObject<FlatList<DayEvents>>}
            data={eventsData}
            removeClippedSubviews={false}
            horizontal
            pagingEnabled
            nestedScrollEnabled={true}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.title}
            initialScrollIndex={currentDateIndex >= 0 ? currentDateIndex : 0}
            getItemLayout={(data, index) => ({
              length: SCREEN_WIDTH - TIME_COLUMN_WIDTH,
              offset: (SCREEN_WIDTH - TIME_COLUMN_WIDTH) * index,
              index,
            })}
            onMomentumScrollEnd={handleScrollEnd}
            windowSize={3}
            maxToRenderPerBatch={1}
            renderItem={({ item }) => (
              <DayEventsComponent
                item={item}
                colors={colors}
                timeCache={timeCache}
                isSelected={item.title === selectedDate}
              />
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  timelineContainer: {
    flexDirection: 'row',
    flex: 1,
    borderLeftWidth: 1,
  },
  timeColumn: {
    width: TIME_COLUMN_WIDTH,
    position: 'relative',
    zIndex: 5,
  },
  timeSlotLabel: {
    height: HOUR_HEIGHT,
    paddingLeft: 16,
    justifyContent: 'center',
  },
  eventsContainer: {
    flex: 1,
    position: 'relative',
    height: 24 * HOUR_HEIGHT,
  },
  hourDivider: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 5,
  },
  currentTimeIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
  },
  eventCard: {
    position: 'absolute',
    padding: 8,
    borderLeftWidth: 2,
    overflow: 'hidden',
    flexDirection: 'column',
    zIndex: 10,
  },
  verticalBar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 4,
    backgroundColor: '#ffffff',
  },
});

export default React.memo(TimelineList);
