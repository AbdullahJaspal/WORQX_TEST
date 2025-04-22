import React from 'react';
import { Pressable, View } from 'react-native';
import { Text, Icon } from '../../../components';
import { icons } from '../../../assets/icons';
import { styles } from './styles';
import { CalendarHeaderProps } from './types';



const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  selectedDate,
  timeline,
  onTimelineToggle,
}) => {
  const formattedDate = new Date(selectedDate).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const weekDays = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];

  return (
    <View style={styles.header}>
      <Text textStyle="medium20">{formattedDate}</Text>
      <View style={{ flexDirection: 'row', gap: 25, alignItems: 'center' }}>
        <Pressable
          onPress={onTimelineToggle}
          style={{
            backgroundColor: timeline ? '#E7EEEB' : 'transparent',
            padding: 10,
            borderRadius: 100,
          }}>
          <Icon source={icons.calenderView} size={14} disabled />
        </Pressable>
        <Icon source={icons.meeting} size={16} />
      </View>
      <View
        style={{
          position: 'absolute',
          top: 40,
          backgroundColor: 'white',
          zIndex: 100,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
        }}>
        {weekDays.map((day, index) => (
          <Text key={index} textStyle="medium16">
            {day}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default React.memo(CalendarHeader);
