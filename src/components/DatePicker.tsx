import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { CalendarList, DateData } from 'react-native-calendars';
import { useTheme } from '../context/themeContext';
import { Icon, Text } from '.';
import { icons } from '../assets/icons';
import { formatDate } from '../utils/utils';
import { DimensionsData } from '../utils/scaling';
import { DatePickerProps } from './types';



const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DatePicker: React.FC<DatePickerProps> = ({
  initialDate,
  visible,
  onClose,
  onSelectDate,
  currentDate,
  calendarTheme,
}) => {
  const { colors } = useTheme();
  const calendarRef = useRef<any>(null);
  const yearListRef = useRef<FlatList>(null);

  const parseDate = useCallback((date?: Date | string): Date => {
    if (!date) return new Date();

    if (typeof date === 'string') {
      const parsedDate = new Date(date);
      return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    }

    return date;
  }, []);

  const formatDateString = useCallback((date: Date): string => {
    return date.toISOString().split('T')[0];
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    parseDate(currentDate || initialDate)
  );
  const [userSelected, setUserSlected] = useState<Date>(() =>
    parseDate(currentDate || initialDate)
  );

  const [pickerMode, setPickerMode] = useState<'calendar' | 'year' | 'month'>('calendar');

  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({ length: 100 }, (_, i) => currentYear - i),
    [currentYear]
  );

  useEffect(() => {
    if (visible) {
      if (currentDate) {
        setSelectedDate(parseDate(currentDate));
      } else if (initialDate) {
        setSelectedDate(parseDate(initialDate));
      }
    }
  }, [visible, currentDate, initialDate, parseDate]);

  useEffect(() => {
    if (!visible) {
      setPickerMode('calendar');
    }
  }, [visible]);

  const handleDayPress = useCallback((day: any) => {
    if (!day || !day.dateString) return;

    try {
      const newDate = new Date(day.dateString);
      setSelectedDate(newDate);
      onSelectDate(day.dateString);
      setUserSlected(newDate);
      onClose();
    } catch (error) {
      console.error('Error handling day press:', error);
      onClose();
    }
  }, [onSelectDate, onClose]);

  const toggleDatePicker = useCallback(() => {
    setPickerMode(prev => prev === 'calendar' ? 'year' : 'calendar');
  }, []);

  const handleYearSelect = useCallback((year: number) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(year);
    setSelectedDate(newDate);
    setPickerMode('month');
  }, [selectedDate]);

  const handleMonthSelect = useCallback((monthIndex: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(monthIndex);
    setSelectedDate(newDate);

    if (calendarRef.current) {
      calendarRef.current.scrollToMonth(formatDateString(newDate));
    }

    setPickerMode('calendar');
  }, [selectedDate, formatDateString]);

  const handleMonthNavigation = useCallback((direction: 'next' | 'prev') => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);

    if (calendarRef.current) {
      calendarRef.current.scrollToMonth(formatDateString(newDate));
    }
  }, [selectedDate, formatDateString]);

  const handleNext = useCallback(() => handleMonthNavigation('next'), [handleMonthNavigation]);
  const handlePrev = useCallback(() => handleMonthNavigation('prev'), [handleMonthNavigation]);

  const renderCustomHeader = useCallback(() => {
    return (
      <View style={styles.customHeaderContainer}>
        <Icon source={icons.left} size={18} onPress={handlePrev} />
        <Pressable onPress={toggleDatePicker} style={styles.headerTextContainer}>
          <Text textStyle="semibold16" color={colors.textPrimary}>
            {formatDate(formatDateString(selectedDate), 'monthYear')}
          </Text>
        </Pressable>
        <Icon source={icons.rightt} size={18} onPress={handleNext} />
      </View>
    );
  }, [
    colors.textPrimary,
    handlePrev,
    handleNext,
    selectedDate,
    toggleDatePicker,
    formatDate,
    formatDateString,
  ]);

  const markedDates = useMemo(() => ({
    [formatDateString(selectedDate)]: { selected: true, selectedColor: colors.primary },
  }), [selectedDate, colors.primary, formatDateString]);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: 50,
    offset: 50 * index,
    index,
  }), []);

  const initialYearIndex = useMemo(() => {
    return years.findIndex(year => year === selectedDate.getFullYear());
  }, [years, selectedDate]);

  const initialMonthIndex = useMemo(() => {
    return selectedDate.getMonth();
  }, [selectedDate]);

  const renderYearItem = useCallback(({ item }: { item: number }) => {
    const isSelected = selectedDate.getFullYear() === item;

    return (
      <TouchableOpacity
        style={[
          styles.pickerItem,
          isSelected && { backgroundColor: colors.primary },
        ]}
        onPress={() => handleYearSelect(item)}>
        <Text
          textStyle="medium16"
          color={isSelected ? colors.white : colors.textPrimary}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  }, [colors, handleYearSelect, selectedDate]);

  const renderMonthItem = useCallback(({ item, index }: { item: string; index: number }) => {
    const isSelected = selectedDate.getMonth() === index;

    return (
      <TouchableOpacity
        style={[
          styles.pickerItem,
          isSelected && { backgroundColor: colors.primary },
        ]}
        onPress={() => handleMonthSelect(index)}>
        <Text
          textStyle="medium16"
          color={isSelected ? colors.white : colors.textPrimary}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  }, [colors, handleMonthSelect, selectedDate]);

  const renderDayComponent = useCallback(({ date }: { date?: DateData }) => {
    if (!date || typeof date.dateString !== 'string' || !date.day) {
      return <View style={styles.emptyDay} />;
    }


    const today = new Date().toISOString().split('T')[0];
    const isToday = date.dateString === today;
    const isSelected = formatDateString(userSelected) === date.dateString;

    let bgColor = 'transparent';

    if (isSelected) {
      bgColor = colors.primary;
    } else if (isToday) {
      bgColor = '#8BAD9B';
    }

    return (
      <Pressable style={[styles.dayContainer, { backgroundColor: bgColor }]}>
        <Text
          onPress={() => handleDayPress(date)}
          textStyle="semibold16"
          color={isSelected || isToday ? colors.white : colors.textPrimary}>
          {date.day}
        </Text>
      </Pressable>
    );
  }, [colors, handleDayPress, selectedDate, formatDateString]);

  const calendarWidth = useMemo(() => DimensionsData.windowWidth - 60, []);

  const theme = useMemo(() => ({
    ...calendarTheme,
    todayBackgroundColor: '#8BAD9B',
  }), [calendarTheme]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.modalContainer} onPress={onClose}>
        <View
          style={[styles.calendarContainer, { backgroundColor: colors.background }]}
          onStartShouldSetResponder={() => true}>

          {pickerMode === 'calendar' && (
            <CalendarList
              horizontal
              ref={calendarRef}
              current={formatDateString(selectedDate)}
              staticHeader
              hideArrows
              enableSwipeMonths={false}
              calendarWidth={calendarWidth}
              markedDates={markedDates}
              dayComponent={renderDayComponent}
              renderHeader={renderCustomHeader}
              theme={theme}
              scrollEnabled={false}
            />
          )}

          {pickerMode === 'year' && (
            <View style={styles.pickerOverlay}>
              <View style={styles.pickerHeader}>
                <Text textStyle="semibold16" color={colors.primary}>
                  Select Year
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setPickerMode('calendar')}>
                  <Icon source={icons.close} size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <FlatList
                ref={yearListRef}
                data={years}
                keyExtractor={item => item.toString()}
                renderItem={renderYearItem}
                showsVerticalScrollIndicator={true}
                initialScrollIndex={initialYearIndex > -1 ? initialYearIndex : 0}
                getItemLayout={getItemLayout}
                windowSize={21}
                maxToRenderPerBatch={10}
              />
            </View>
          )}

          {pickerMode === 'month' && (
            <View style={styles.pickerOverlay}>
              <View style={styles.pickerHeader}>
                <Text textStyle="semibold16" color={colors.primary}>
                  Select Month for {selectedDate.getFullYear()}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setPickerMode('calendar')}>
                  <Icon source={icons.close} size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={MONTHS}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderMonthItem}
                showsVerticalScrollIndicator={true}
                initialScrollIndex={initialMonthIndex}
                getItemLayout={getItemLayout}
                windowSize={12}
                maxToRenderPerBatch={12}
              />
            </View>
          )}
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarContainer: {
    margin: 20,
    borderRadius: 10,
    padding: 10,
    minHeight: 350,
  },
  customHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
    alignSelf: 'center',
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  pickerOverlay: {
    flex: 1,
    padding: 10,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  pickerItem: {
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 2,
    borderRadius: 8,
  },
  dayContainer: {
    borderRadius: 100,
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyDay: {
    height: 30,
    width: 30,
  },
  closeButton: {
    padding: 10,
  },
});

export default DatePicker;