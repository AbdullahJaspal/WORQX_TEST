import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Button, Text } from '.';
import { useTheme } from '../context/themeContext';
import Carousel from 'react-native-reanimated-carousel';
import { getDefaultStartTime, getEndTimeFromStart } from '../utils/utils';

const ITEM_HEIGHT = 60;
const VISIBLE_ITEMS = 3;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const { width } = Dimensions.get('window');

const TimePicker = ({
  initialTime = '',
  onClose = () => { },
  onConfirm = (time: string) => {
    console.log(time);
  },
  title = 'Start time',
}) => {
  const { colors } = useTheme();
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedMinute, setSelectedMinute] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | number>('');
  const [initialized, setInitialized] = useState(false);

  const hourCarouselRef = useRef(null);
  const minuteCarouselRef = useRef(null);
  const periodCarouselRef = useRef(null);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const periods = ['AM', 'PM'];

  useEffect(() => {
    if (!initialized) {
      let defaultTime;

      if (initialTime) {
        if (typeof initialTime === 'string') {
          const timeParts = initialTime.match(/(\d+):(\d+)\s+([AP]M)/);
          if (timeParts) {
            const [_, hourStr, minuteStr, period] = timeParts;
            defaultTime = {
              hour: parseInt(hourStr),
              minute: parseInt(minuteStr),
              period,
            };
          }
        }
      }

      if (!defaultTime) {
        if (title.toLowerCase().includes('start')) {
          defaultTime = getDefaultStartTime();
        } else if (title.toLowerCase().includes('end')) {
          const startTime = getDefaultStartTime();
          defaultTime = getEndTimeFromStart(
            startTime.hour,
            startTime.minute,
            startTime.period,
          );
        } else {
          defaultTime = getDefaultStartTime();
        }
      }

      setSelectedHour(defaultTime.hour);
      setSelectedMinute(defaultTime.minute);
      setSelectedPeriod(defaultTime.period === 'AM' ? 0 : 1);

      setTimeout(() => {
        const hourIndex = defaultTime.hour - 1;
        const minuteIndex = defaultTime.minute;
        const periodIndex = defaultTime.period === 'AM' ? 0 : 1;

        if (hourCarouselRef.current) {
          hourCarouselRef.current.scrollTo({ index: hourIndex, animated: false });
        }

        if (minuteCarouselRef.current) {
          minuteCarouselRef.current.scrollTo({
            index: minuteIndex,
            animated: false,
          });
        }

        if (periodCarouselRef.current) {
          periodCarouselRef.current.scrollTo({
            index: periodIndex,
            animated: false,
          });
        }
      }, 150);

      setInitialized(true);
    }
  }, [initialTime, initialized, title]);

  const handleConfirm = () => {
    if (
      selectedHour === null ||
      selectedMinute === null ||
      selectedPeriod === null
    ) {
      return;
    }

    const formattedMinute =
      selectedMinute < 10 ? `0${selectedMinute}` : selectedMinute;
    const timeString = `${selectedHour}:${formattedMinute} ${selectedPeriod}`;
    onConfirm(timeString);
  };

  const renderHourItem = ({ item }: { item: number }) => {
    const isSelected = selectedHour !== null && item === selectedHour;
    return (
      <View style={[styles.pickerItem, { height: ITEM_HEIGHT }]}>
        <Text
          textStyle="semibold20"
          style={[styles.pickerItemText, isSelected && styles.selectedItemText]}
          color={isSelected ? colors.primary : colors.textPrimary}>
          {item}
        </Text>
      </View>
    );
  };

  const renderMinuteItem = ({ item }: { item: number }) => {
    const isSelected = selectedMinute !== null && item === selectedMinute;
    return (
      <View style={[styles.pickerItem, { height: ITEM_HEIGHT }]}>
        <Text
          textStyle="semibold20"
          style={[styles.pickerItemText, isSelected && styles.selectedItemText]}
          color={isSelected ? colors.primary : colors.textPrimary}>
          {item < 10 ? `0${item}` : `${item}`}
        </Text>
      </View>
    );
  };

  const renderPeriodItem = ({ item }: { item: string }) => {
    const isSelected = selectedPeriod !== null && item === periods[selectedPeriod];
    return (
      <View style={[styles.pickerItem, { height: ITEM_HEIGHT }]}>
        <Text
          textStyle="semibold20"
          style={[styles.pickerItemText, isSelected && styles.selectedItemText]}
          color={isSelected ? colors.primary : colors.textPrimary}>
          {item}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text
        textStyle="semibold20"
        color={colors.textPrimary}
        style={styles.titleText}>
        {title}
      </Text>
      <Text></Text>

      <View style={styles.pickerOuterContainer}>
        <View
          style={[
            styles.selectionBox,
            {
              borderColor: colors.grey,
              top: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
            },
          ]}
        />

        <View style={styles.pickerContainer}>
          <View style={styles.pickerColumn}>
            <Carousel
              ref={hourCarouselRef}
              loop
              vertical
              windowSize={5}
              data={hours}
              renderItem={renderHourItem}
              height={ITEM_HEIGHT}
              width={70}
              style={{ height: PICKER_HEIGHT, justifyContent: 'center' }}
              autoFillData={false}
              scrollAnimationDuration={200}
              panGestureHandlerProps={{
                activeOffsetY: [-10, 10],
              }}
              onSnapToItem={index => setSelectedHour(hours[index])}
              snapEnabled={true}
              enabled={true}
              mode="default"
              modeConfig={{
                snapDirection: 'center',
                stackInterval: ITEM_HEIGHT,
                scaleInterval: 0,
                opacityInterval: 0,
              }}
              snapOffsetTop={0}
              defaultIndex={selectedHour ? selectedHour - 1 : 0}
            />
          </View>

          <View style={styles.separatorColumn}>
            <Text textStyle="semibold20" color={colors.textPrimary}>
              :
            </Text>
          </View>

          <View style={styles.pickerColumn}>
            <Carousel
              ref={minuteCarouselRef}
              loop
              vertical
              windowSize={5}
              data={minutes}
              renderItem={renderMinuteItem}
              height={ITEM_HEIGHT}
              width={70}
              style={{ height: PICKER_HEIGHT, justifyContent: 'center' }}
              autoFillData={false}
              scrollAnimationDuration={200}
              panGestureHandlerProps={{
                activeOffsetY: [-10, 10],
              }}
              onSnapToItem={index => setSelectedMinute(minutes[index])}
              snapEnabled={true}
              enabled={true}
              mode="default"
              modeConfig={{
                snapDirection: 'center',
                stackInterval: ITEM_HEIGHT,
                scaleInterval: 0,
                opacityInterval: 0,
              }}
              snapOffsetTop={0}
              defaultIndex={selectedMinute || 0}
            />
          </View>

          <View style={styles.periodColumn}>
            <Carousel
              ref={periodCarouselRef}
              loop
              vertical
              windowSize={3}
              data={periods}
              renderItem={renderPeriodItem}
              height={ITEM_HEIGHT}
              width={70}
              style={{ height: PICKER_HEIGHT, justifyContent: 'center' }}
              autoFillData={false}
              scrollAnimationDuration={700}
              panGestureHandlerProps={{
                activeOffsetY: [-10, 10],
              }}
              onSnapToItem={index => setSelectedPeriod(periods[index])}
              snapEnabled={true}
              enabled={true}
              mode="default"
              modeConfig={{
                snapDirection: 'center',
                stackInterval: ITEM_HEIGHT,
                scaleInterval: 0,
                opacityInterval: 0,
              }}
              snapOffsetTop={0}
              defaultIndex={selectedPeriod === 'PM' ? 1 : 0}
            />
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          height={45}
          width={'48%'}
          title="Cancel"
          onPress={onClose}
          textColor={colors.primary}
          backgroundColor="transparent"
          borderColor={colors.primary}
        />
        <Button
          height={45}
          width={'48%'}
          backgroundColor={colors.primary}
          title="Set"
          onPress={handleConfirm}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: width * 0.9,
    maxWidth: 350,
    alignSelf: 'center',
    height: 340,
    justifyContent: 'space-between',
    paddingBottom: 28,
  },
  titleText: {
    marginBottom: 15,
    textAlign: 'left',
    alignSelf: 'flex-start',
    paddingLeft: 10,
  },
  pickerOuterContainer: {
    height: PICKER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pickerContainer: {
    flexDirection: 'row',
    height: PICKER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    zIndex: 1,
  },
  selectionBox: {
    position: 'absolute',
    height: ITEM_HEIGHT,
    width: '90%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    zIndex: 0,
  },
  pickerColumn: {
    width: 70,
    height: PICKER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separatorColumn: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodColumn: {
    width: 70,
    height: PICKER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  pickerItemText: {
    fontSize: 24,
  },
  selectedItemText: {
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
});

export default TimePicker;
