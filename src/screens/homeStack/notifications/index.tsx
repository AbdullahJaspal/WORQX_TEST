import type React from 'react';
import { useState, useCallback, memo, useMemo } from 'react';
import {
  Pressable,
  View,
  FlatList,
  Image,
  ListRenderItem,
} from 'react-native';
import {
  Button,
  Header,
  Icon,
  InputField,
  ProfileAvatar,
  Text,
} from '../../../components';
import { useTheme } from '../../../context/themeContext';
import { icons } from '../../../assets/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import {
  markAllAsRead,
  markAsRead,
  markAsUnread,
  setBadge,
} from '../../../redux/features/notificationSlice';
import { getNotification, openNotification } from '../../../api/notificationAPis';
import { useFocusEffect } from '@react-navigation/native';
import { showLoader } from '../../../redux/features/loaderSlice';
import { formatDate } from '../../../utils/utils';
import { routes } from '../../../navigation/Routes';
import { ThemeColors } from '../../../theme/colors';
import styles from './styles';
import { ActionButtonsProps, ActionTakenProps, EmptyListProps, NotificationItem, NotificationItemProps, NotificationsProps, ProfileCompletionHeaderProps } from './types';



// Components
const ItemSeparator = memo(() => <View style={styles.separator} />);

const EmptyList = memo(({ colors }: EmptyListProps) => (
  <View style={styles.emptyContainer}>
    <Text textStyle="regular14" color={colors.textSecondary}>
      No notifications found
    </Text>
  </View>
));

const ProfileCompletionHeader = memo(({ userInfo, colors }: ProfileCompletionHeaderProps) => (
  <View style={styles.profileHeader}>
    <ProfileAvatar
      uri={userInfo?.imageUrl}
      firstName={userInfo?.firstName}
      lastName={userInfo?.lastName}
      size={45}
      textStyle="medium16"
    />
    <View style={styles.profileCompletion}>
      <Text color={colors.textPrimary} textStyle="regular14">
        Your profile is <Text textStyle="regular14">95%</Text> Completed
      </Text>
      <View style={[styles.progressBarBackground, { backgroundColor: colors.grey }]}>
        <View
          style={[
            styles.progressBar,
            {
              backgroundColor: colors.primary,
              width: '94%',
            }
          ]}
        />
      </View>
      <Text textStyle="regular10" style={styles.underlinedText}>
        Click To Complete
      </Text>
    </View>
  </View>
));

const ActionButtons = memo(({ item, colors, onActionPress }: ActionButtonsProps) => (
  <View style={styles.actionButtons}>
    <Button
      height={30}
      backgroundColor={colors.primary}
      title={item.type === 'calendarEvent' ? 'Approve' : 'Accept'}
      textColor={colors.primaryLight}
      borderColor={colors.primary}
      textStyle="semibold10"
      onPress={() => onActionPress(item.type === 'calendarEvent' ? 'Approve' : 'Accept')}
    />
    <Button
      height={30}
      backgroundColor={colors.primaryLight}
      title="Decline"
      borderColor={colors.primary}
      textStyle="semibold10"
      onPress={() => onActionPress('Reject')}
    />
  </View>
));

const ActionTaken = memo(({ action, colors }: ActionTakenProps) => (
  <View style={styles.actionTakenContainer}>
    <Text
      textStyle="regular10"
      color={
        action === 'Approve' || action === 'Accept'
          ? colors.primary
          : colors.error
      }>
      {action === 'Approve' ? `${action}d` : `${action}ed`}
    </Text>
  </View>
));



const Notifications: React.FC<NotificationsProps> = ({ navigation }) => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const [activeTab, setActiveTab] = useState<'All' | 'Unread' | 'Time Sheets'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const dispatch = useDispatch();
  const { colors } = useTheme() as { colors: ThemeColors };

  const fetchNotifications = useCallback(async () => {
    try {
      dispatch(showLoader(true));
      const response = await getNotification();
      dispatch(setBadge(response.count));
      setNotifications(response.notifications);
      console.log('Notifcation Data[]', response.notifications);

    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      dispatch(showLoader(false));
    }
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [fetchNotifications])
  );

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      if (activeTab === 'Unread' && notification.isRead) return false;
      if (activeTab === 'Time Sheets' && notification.type !== 'timesheet') return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const nameMatch = (notification.name || '').toLowerCase().includes(query);
        const descriptionMatch = (notification.description || '').toLowerCase().includes(query);
        const titleMatch = (notification.title || '').toLowerCase().includes(query);
        const messageMatch = (notification.message || '').toLowerCase().includes(query);

        return nameMatch || descriptionMatch || titleMatch || messageMatch;
      }

      return true;
    });
  }, [notifications, activeTab, searchQuery]);

  const handleMarkAsRead = useCallback((id: string) => {
    dispatch(markAsRead(id));
  }, [dispatch]);

  const handleMarkAsUnread = useCallback((id: string) => {
    dispatch(markAsUnread(id));
  }, [dispatch]);

  const handleMarkAllAsRead = useCallback(() => {
    dispatch(markAllAsRead());
  }, [dispatch]);

  const renderItem: ListRenderItem<NotificationItem> = useCallback(({ item }) => (
    <NotificationItem
      item={item}
      onMarkAsRead={handleMarkAsRead}
      onMarkAsUnread={handleMarkAsUnread}
      colors={colors}
      navigation={navigation}
    />
  ), [colors, handleMarkAsRead, handleMarkAsUnread, navigation]);


  const NotificationItem = memo(({ item, onMarkAsRead, onMarkAsUnread, colors, navigation }: NotificationItemProps) => {
    const userInfo = useSelector((state: RootState) => state.auth.userInfo);
    const [actionTaken, setActionTaken] = useState<string | null>(null);
    const handleOpenNotification = useCallback(async () => {

      console.log('Opening notification:', item);

      try {
        if ((item.type === 'calendarEventUpdate' || item.type === 'calendarEvent') && item.eventId) {
          navigation.navigate(routes.eventDetail, {
            item: { _id: item.eventId },
          });
        }
      } catch (error) {
        console.log('Error opening notification:', error);
      } finally {
        console.log('Finally:[]');

        const response = await openNotification(item._id);
        console.log('Notification Opened:[]', response);
        fetchNotifications()
      }
    }, [item, navigation]);

    const handleMarkAsUnread = useCallback(() => {
      if (item.id) {
        onMarkAsUnread(item.id);
      }
    }, [item.id, onMarkAsUnread]);

    const handleActionPress = useCallback((action: string) => {
      setActionTaken(action);
      if (item.id) {
        onMarkAsRead(item.id);
      }
    }, [item.id, onMarkAsRead]);

    const renderProfile = useCallback(() => {
      if (item.type === 'invitation' && item.profiles && item.profiles.length > 0) {
        return (
          <View style={styles.multipleAvatars}>
            {item.profiles.map((profile, index) => (
              <Image
                key={index}
                source={profile}
                style={[
                  styles.multipleAvatarImage,
                  index === 1 && styles.secondAvatar,
                  index === 0 && styles.firstAvatar,
                ]}
              />
            ))}
          </View>
        );
      }
      if (item.type === 'timesheet' || item.type === 'calendarEvent') {
        return (
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
            <Icon
              source={item.type === 'timesheet' ? icons.menu : icons.calendar}
              size={20}
              color={colors.white}
            />
          </View>
        );
      }
      return (
        <View style={styles.avatarContainer}>
          <ProfileAvatar
            uri={item.profile}
            firstName={userInfo?.firstName}
            lastName={userInfo?.lastName}
            size={45}
            textStyle="medium16"
          />
          <Icon
            source={icons.verified}
            size={14}
            style={styles.verifiedIcon}
          />
        </View>
      );
    }, [item, colors, userInfo]);

    return (
      <Pressable
        style={[
          styles.notificationItem,
          { backgroundColor: item.isRead ? colors.background : colors.primaryLight }
        ]}
        onPress={handleOpenNotification}
      >
        <View style={styles.notificationContent}>
          {renderProfile()}
          <View style={styles.notificationText}>
            <Text textStyle="regular14" color={colors.textPrimary}>
              {item.type === 'timesheet' || item.type === 'calendarEvent'
                ? item.eventSubject
                : item.name}
            </Text>
            {item.organiser && (
              <Text textStyle="semibold10">
                Invited by{' '}
                {item.type === 'timesheet' || item.type === 'calendarEvent'
                  ? item.organiser
                  : item.title}
              </Text>
            )}
            <Text
              textStyle="regular12"
              color={colors.textBody}
              numberOfLines={2}
              style={styles.messageText}>
              {item.message}
            </Text>
            {item.createdAt && (
              <Text textStyle="medium10">
                {formatDate(item.createdAt, 'timeAgo')}
              </Text>
            )}
          </View>

          {item.type === 'calendarEvent' && (
            <View style={styles.actionsContainer}>
              {actionTaken ? (
                <ActionTaken action={actionTaken} colors={colors} />
              ) : (
                <ActionButtons
                  item={item}
                  colors={colors}
                  onActionPress={handleActionPress}
                />
              )}
            </View>
          )}

          {item.isRead && item.type === 'update' && !actionTaken && item.id && (
            <Pressable
              style={styles.markUnreadButton}
              onPress={handleMarkAsUnread}>
              <Text
                textStyle="regular10"
                color={colors.primary}
                style={styles.underlinedText}>
                Mark As Unread
              </Text>
            </Pressable>
          )}
        </View>
      </Pressable>
    );
  });
  const keyExtractor = useCallback((item: NotificationItem) => item._id || item.id || '', []);

  const renderEmptyComponent = useCallback(() => (
    <EmptyList colors={colors} />
  ), [colors]);

  const renderHeaderComponent = useCallback(() => (
    <ProfileCompletionHeader userInfo={userInfo} colors={colors} />
  ), [userInfo, colors]);

  const hasUnreadNotifications = useMemo(() =>
    notifications.some(item => !item.isRead),
    [notifications]
  );

  const renderTab = useCallback((tabName: 'All' | 'Unread' | 'Time Sheets') => (
    <Pressable
      style={[styles.tab, activeTab === tabName && styles.activeTab]}
      onPress={() => setActiveTab(tabName)}>
      <Text
        textStyle="regular12"
        color={activeTab === tabName ? colors.primary : colors.textPrimary}>
        {tabName}
      </Text>
      {activeTab === tabName && (
        <View
          style={[
            styles.activeIndicator,
            { backgroundColor: colors.primary },
          ]}
        />
      )}
    </Pressable>
  ), [activeTab, colors]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Notifications" />

      <View style={styles.contentContainer}>
        {hasUnreadNotifications && (
          <Pressable style={styles.markAllReadButton} onPress={handleMarkAllAsRead}>
            <Text
              style={styles.underlinedText}
              textStyle="regular12"
              color={colors.primary}>
              Mark all as read
            </Text>
          </Pressable>
        )}

        <View style={styles.tabsContainer}>
          {renderTab('All')}
          {renderTab('Unread')}
          {renderTab('Time Sheets')}
        </View>
      </View>

      <InputField
        variant="search"
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
        containerStyle={styles.searchContainer}
        icon={icons.search}
        iconColor={colors.primary}
      />

      <FlatList
        data={filteredNotifications}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeaderComponent}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={renderEmptyComponent}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
        updateCellsBatchingPeriod={30}
      />
    </View>
  );
};



export default Notifications;