import type React from 'react';
import { useRef, useState, useCallback, useEffect } from 'react';
import {
  type FlatList,
  Pressable,
  SafeAreaView,
  View,
  type SectionList,
} from 'react-native';
import { CalendarProvider, ExpandableCalendar } from 'react-native-calendars';
import { Header, Icon, Text } from '../../../components';
import { useTheme } from '../../../context/themeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { styles } from './styles';
import { formatDate } from '../../../utils/utils';
import CalendarHeader from './CalendarHeader';
import TimelineList from './TimelineList';
import Tasklist from './Agenda';
import { icons } from '../../../assets/icons';
import { routes } from '../../../navigation/Routes';
import { getAllEvents } from '../../../api/calendar';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';
import { showLoader } from '../../../redux/features/loaderSlice';
import { calendarData } from '../../../constants/data';
import { useFocusEffect } from '@react-navigation/native';
import { CalendarScreenProps, DayEvents, MarkedDate } from './types';


const CalendarScreen: React.FC<CalendarScreenProps> = ({ navigation }) => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const today = formatDate(new Date());
  const timelineRef = useRef<FlatList<any>>(null);
  const sectionListRef = useRef<SectionList>(null);
  const [selectedDate, setSelectedDate] = useState(today);
  const [timeline, setTimeline] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [agendaListData, setAgendaListData] = useState<DayEvents[]>(calendarData);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );

  const getMarkedDates = useCallback((): MarkedDate => {
    const markedDates: MarkedDate = {};

    markedDates[today] = {
      marked: true,
      dotColor: '#8BAD9B',
    };

    if (selectedDate !== today) {
      markedDates[selectedDate] = {
        selected: true,
        selectedColor: colors.primary,
        selectedTextColor: '#ffffff',
      };
    } else {
      markedDates[today] = {
        ...markedDates[today],
        selected: true,
        selectedColor: colors.primary,
        selectedTextColor: '#ffffff',
      };
    }

    return markedDates;
  }, [selectedDate, today, colors.primary]);

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    setIsExpanded(false);

    const dateIndex = agendaListData.findIndex(item => item.title === newDate);

    if (dateIndex !== -1 && timelineRef.current && timeline) {
      timelineRef.current.scrollToIndex({
        index: dateIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }

    if (!timeline && sectionListRef.current && dateIndex !== -1) {
      setTimeout(() => {
        try {
          if (sectionListRef.current)
            sectionListRef.current.scrollToLocation({
              sectionIndex: dateIndex,
              itemIndex: 0,
              viewPosition: 0.5,
              animated: true,
            });
        } catch (error) {
          console.log('Error scrolling to section:', error);
        }
      }, 100);
    }
  };

  const handleDayPress = (date: { dateString: string }) => {
    setSelectedDate(date.dateString);
    setIsExpanded(false);
  };

  const handleMonthChange = (date: { dateString: string }) => {
    const newMonth = date.dateString.slice(0, 7);

    if (newMonth !== currentMonth) {
      setCurrentMonth(newMonth);
      fetchEvents(newMonth);
    }

    setSelectedDate(date.dateString);
    setIsExpanded(false);
  };

  const onTimelineToggle = useCallback(() => {
    setTimeline(prev => !prev);
  }, []);

  const handleBack = () => {
    navigation.navigate(routes.dashboard);
  };

  const onPressAddEvent = () => {
    navigation.navigate(routes.scheduleEvent);
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, []),
  );

  const fetchEvents = async (monthStr?: string) => {
    try {
      dispatch(showLoader(true));
      if (userInfo?.lastAccessBusiness) {
        const month = monthStr || currentMonth;
        const response = await getAllEvents(userInfo.lastAccessBusiness, month);
        setAgendaListData(response.events);

        setDataLoaded(true);
        dispatch(showLoader(false));
      }
    } catch (error) {
      console.log(error);
      setDataLoaded(true);
      dispatch(showLoader(false));
    }
  };

  useEffect(() => {
    if (dataLoaded && agendaListData.length > 0) {
      const todayIndex = agendaListData.findIndex(item => item.title === today);
      if (todayIndex !== -1) {
        const waitAndScroll = setTimeout(() => {
          requestAnimationFrame(() => {
            try {
              if (!timeline && sectionListRef.current) {
                sectionListRef.current.scrollToLocation({
                  sectionIndex: todayIndex,
                  itemIndex: 0,
                  viewPosition: 0.5,
                  animated: true,
                });
              } else if (timeline && timelineRef.current) {
                timelineRef.current.scrollToIndex({
                  index: todayIndex,
                  animated: true,
                  viewPosition: 0.5,
                });
              }
            } catch (error) {
              console.log('Error scrolling to today:', error);
            }
          });
        }, 500);

        return () => clearTimeout(waitAndScroll);
      }
    }
  }, [dataLoaded, agendaListData, timeline, today]);

  return (
    <GestureHandlerRootView style={[styles.container, {}]}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}>
        <Header logoVisible={false} title="My Calendar" onPress={handleBack} />

        <CalendarProvider
          date={selectedDate}
          onMonthChange={handleMonthChange}
          showTodayButton={false}>
          <ExpandableCalendar
            firstDay={1}
            showSixWeeks={!isExpanded}
            allowShadow={false}
            onDayPress={handleDayPress}
            calendarHeight={350}
            renderHeader={() => {
              return (
                <CalendarHeader
                  selectedDate={selectedDate}
                  timeline={timeline}
                  onTimelineToggle={onTimelineToggle}
                />
              );
            }}
            theme={{
              selectedDayBackgroundColor: colors.primary,
              todayTextColor: colors.black,
              todayBackgroundColor: '#8BAD9B',
              selectedDayTextColor: '#ffffff',
            }}
            hideArrows
            markedDates={getMarkedDates()}
          />
          {timeline ? (
            <>
              <View style={styles.dateHeader}>
                <Text textStyle="medium20" style={{ color: colors.primary }}>
                  {formatDate(selectedDate, 'dateMonth')}
                </Text>
                {selectedDate === today && (
                  <Text textStyle="medium16"> Today</Text>
                )}
              </View>
              <TimelineList
                timelineRef={timelineRef}
                eventsData={agendaListData}
                selectedDate={selectedDate}
                setSelectedDate={handleDateChange}
              />
            </>
          ) : (
            <Tasklist
              sections={agendaListData}
              selectedDate={selectedDate}
              sectionListRef={sectionListRef}
            />
          )}
        </CalendarProvider>
        <Pressable
          onPress={onPressAddEvent}
          style={[styles.floatingButton, { backgroundColor: colors.primary }]}>
          <Icon source={icons.plus} disabled />
        </Pressable>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default CalendarScreen;
