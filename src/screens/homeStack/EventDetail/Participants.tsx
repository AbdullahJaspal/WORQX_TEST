import React from 'react';
import {
  FlatList,
  SafeAreaView,
  View,
  StyleSheet,
} from 'react-native';
import { Header, Icon, ProfileAvatar, Text } from '../../../components';
import { icons } from '../../../assets/icons';
import { useTheme } from '../../../context/themeContext';
import { userRoles } from '../../../utils/enums';
import { ParticipantsProps } from './types';



const Participants: React.FC<ParticipantsProps> = ({ route }) => {
  const { participants } = route.params;
  const { colors } = useTheme();

  const renderParticipants = ({
    item,
  }: {
    item: {
      imageUrl?: string;
      firstName: string;
      lastName: string;
      role: string;
      userId: string;
    };
  }) => {
    return (
      <View style={[styles.participantContainer, { borderColor: colors.grey }]}>
        <View style={styles.imageContainer}>
          <ProfileAvatar
            uri={item?.imageUrl}
            firstName={item?.firstName}
            lastName={item?.lastName}
            size={34}
            textStyle={'medium12'}
          />

          <Icon source={icons.verified} size={12} style={styles.verifiedIcon} />
        </View>
        <View>
          <Text textStyle="medium14" color={colors.textPrimary}>
            {item?.firstName} {item?.lastName}
          </Text>
          <Text textStyle="regular12" color={colors.textBody}>
            {userRoles[item?.role as keyof typeof userRoles] || 'Unknown Role'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Event Participants" />
      <View style={styles.listContainer}>
        <FlatList
          data={participants}
          removeClippedSubviews={false}
          renderItem={renderParticipants}
          keyExtractor={(item) => item.userId}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => <View style={styles.footer} />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 24,
  },
  participantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    borderBottomWidth: 0.5,
    height: 55,
  },
  imageContainer: {
    position: 'relative',
  },
  verifiedIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  footer: {
    height: 40,
  },
});

export default Participants;