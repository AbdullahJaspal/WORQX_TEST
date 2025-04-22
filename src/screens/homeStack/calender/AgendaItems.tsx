import React from 'react';
import { Pressable, View } from 'react-native';
import { Text, Icon, Button } from '../../../components';
import { icons } from '../../../assets/icons';
import { styles } from './styles';
import { routes } from '../../../navigation/Routes';
import { getAddress } from '../../../utils/utils';
import { AgendaItemProps } from './types';



const AgendaItem: React.FC<AgendaItemProps> = React.memo(
  ({ item, colors, navigation }) => {
    if (!item.meeting) {
      return (
        <View style={{ marginLeft: 20, paddingVertical: 10 }}>
          <Text textStyle="bold12">No meetings</Text>
        </View>
      );
    }

    const handleEventPress = () => {
      navigation.navigate(routes.eventDetail, { item });
    };

    return (
      <Pressable
        onPress={handleEventPress}
        style={[
          styles.agendaItem,
          {
            borderBottomWidth: 0.5,
            borderColor: colors.grey,
          },
        ]}>
        <View
          style={[
            styles.agendaItemTime,
            { borderRightWidth: 2, borderColor: colors.primary },
          ]}>
          <Text textStyle="medium12" color={colors.textPrimary}>
            {item.startTime}
          </Text>
          <Text textStyle="medium12" color={colors.textSecondary}>
            {item.endTime}
          </Text>
        </View>
        <View style={styles.agendaItemContent}>
          <View style={styles.agendaItemDetails}>
            <View style={[styles.agendaItemRow, { gap: 10, width: '70%' }]}>
              <Text
                numberOfLines={1}
                style={{ width: '90%' }}
                textStyle="semibold16">
                {item.subject}
              </Text>
              {item.repeat && item.repeat !== 'noRepeat' && (
                <Icon source={icons.repeat} size={15} />
              )}
            </View>
            {item.meetingLink ? (
              <Text color={colors.textPrimary} textStyle="regular14">
                Online
              </Text>
            ) : (
              <Text color={colors.textPrimary} textStyle="regular14" style={{}}>
                On Site:{' '}
                <Text
                  color={
                    item.manualAddress ? colors.textPrimary : colors.primary
                  }
                  style={{
                    textDecorationLine: item.manualAddress
                      ? 'none'
                      : 'underline',
                  }}>
                  {item.manualAddress
                    ? item?.manualAddress && getAddress(item?.manualAddress)
                    : 'View on Google Maps'}
                </Text>
              </Text>
            )}
          </View>
          {item.meetingLink && (
            <Button
              title="Join"
              height={30}
              backgroundColor={colors.primary}
              icon={icons.group}
              style={{ paddingHorizontal: 10 }}
            />
          )}
        </View>
      </Pressable>
    );
  },
);

export default AgendaItem;
