import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { icons } from '../../../assets/icons';
import { routes } from '../../../navigation/Routes';
import { useDispatch, useSelector } from 'react-redux';
import { repeatOptions } from '../../../constants/data';
import { RootState } from '../../../redux/store';
import { styles } from './styles';
import { createEvent, updateEvent } from '../../../api/calendar';
import { showLoader } from '../../../redux/features/loaderSlice';
import { showToast } from '../../../redux/features/toastSlice';
import DatePicker from '../../../components/DatePicker';
import { userRoles } from '../../../utils/enums';
import { validateEventForm } from '../../../utils/validation';
import { EventFormData, EventFormDataApi, ScheduleEventProps, User } from './types';
import {
  KeyboardAvoidingView,
  Modal as RNModal,
  Pressable,
  ScrollView,
  View,
  Platform,
} from 'react-native';
import { useTheme } from '../../../context/themeContext';
import {
  Button,
  Dropdown,
  Header,
  Icon,
  InputField,
  ProfileAvatar,
  Switch,
  Text,
  TimePicker,
} from '../../../components';

import {
  inviteAll,
  linkAll,
  removeInvitedUser,
  removelinkedRecords,
} from '../../../redux/features/eventSlice';
import {
  formatDate,
  getEndTimeFromStart,
  parseTimeString,
  isEndTimeAfterStartTime
} from '../../../utils/utils';
import { DropdownItem } from '../../../components/types';



const ScheduleEvent: React.FC<ScheduleEventProps> = ({ navigation, route }) => {
  const editingEvent = route.params?.item;
  const { invited, linkedRecords, invitedAll, linkedAll } = useSelector(
    (state: RootState) => state.event,
  );
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const { myBusinesses } = useSelector((state: RootState) => state.auth);
  const isEditing = !!editingEvent;
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [clockVisible, setClockVisible] = useState({ start: false, end: false });
  const [showAllRecords, setShowAllRecords] = useState(false);
  const [showAllInvitations, setShowAllInvitations] = useState(false);
  const [isSelectingEndDate, setIsSelectingEndDate] = useState(false);
  const [manualAddress, setManualAddress] = useState(
    isEditing &&
    editingEvent.manualAddress &&
    Object.values(editingEvent.manualAddress).some(val => val),
  );

  const [formData, setFormData] = useState<EventFormData>(() => {
    if (isEditing) {
      const eventDate = new Date(editingEvent.date);
      const eventEndDate = editingEvent.endDate
        ? new Date(editingEvent.endDate)
        : '';
      return {
        selectedBusiness: {
          _id: editingEvent.businessId,
          value: editingEvent.businessId,
          label: editingEvent.businessName,
        },
        subject: editingEvent.subject,
        selectedDate: formatDate(eventDate),
        startTime: editingEvent.startTime,
        endTime: editingEvent.endTime,
        isAllDay: editingEvent.allDay,
        location: editingEvent.location || '',
        address: editingEvent.manualAddress?.address || '',
        city: editingEvent.manualAddress?.city || '',
        state: editingEvent.manualAddress?.state || '',
        postalCode: editingEvent.manualAddress?.postalCode || '',
        networkCheck:
          editingEvent.invitedUsers && editingEvent.invitedUsers.length > 0,
        businessCheck: false,
        eventType: editingEvent.meetingLink ? 'Online' : 'OnSite',
        meetingLink: editingEvent.meetingLink || '',
        endDate: eventEndDate ? formatDate(eventEndDate) : '',
      };
    } else {
      return {
        selectedBusiness: { _id: '' },
        subject: '',
        selectedDate: '',
        startTime: '',
        endTime: '',
        isAllDay: false,
        location: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        networkCheck: false,
        businessCheck: false,
        eventType: 'OnSite',
        meetingLink: '',
        endDate: '',
      };
    }
  });

  const [selectedRepeatOption, setSelectedRepeatOption] =
    useState(() => {
      if (isEditing && editingEvent.repeat) {
        const matchingOption = repeatOptions.find(option => option.value === editingEvent.repeat);
        if (matchingOption) {
          return matchingOption;
        }
      }
      return repeatOptions[0];
    });

  const calendarTheme = useMemo(
    () => ({
      textSectionTitleColor: 'black',
      selectedDayTextColor: 'white',
      todayTextColor: colors.primary,
      dayTextColor: 'black',
      textDisabledColor: '#d9d9d9',
      arrowColor: 'black',
      monthTextColor: 'black',
    }),
    [colors.primary],
  );

  const handleChange = useCallback(
    (key: string, value: any) => {
      if (!formData.selectedDate && (key === 'startTime' || key === 'endTime')) {
        dispatch(
          showToast({ message: 'Please select a date first', type: 'error' }),
        );
        return;
      }

      if (key === 'startTime') {
        const startTime = parseTimeString(value);
        if (startTime) {
          const endTime = getEndTimeFromStart(
            startTime.hour,
            startTime.minute,
            startTime.period,
          );

          const formattedMinute =
            endTime.minute < 10 ? `0${endTime.minute}` : endTime.minute;
          const endTimeStr = `${endTime.hour}:${formattedMinute} ${endTime.period}`;

          setFormData(prev => ({
            ...prev,
            [key]: value,
            endTime: endTimeStr,
          }));
          return;
        }
      }

      if (key === 'endTime' && formData.startTime && value) {
        if (!isEndTimeAfterStartTime(formData.startTime, value)) {
          dispatch(
            showToast({
              message: 'End time must be after start time',
              type: 'error',
            }),
          );
          return;
        }
      }

      if (key === 'endDate') {
        if (!formData.selectedDate) {
          dispatch(
            showToast({
              message: 'Please select a start date first',
              type: 'error',
            }),
          );
          return;
        }

        const endDate = new Date(value);
        const selectedDate = new Date(formData.selectedDate);

        if (endDate <= selectedDate) {
          dispatch(
            showToast({
              message: 'End date must be after the start date',
              type: 'error',
            }),
          );
          return;
        }
      }

      setFormData(prev => ({ ...prev, [key]: value }));
    },
    [formData.selectedDate, formData.startTime, dispatch],
  );


  const handleInvite = useCallback(
    () => navigation.navigate(routes.invite),
    [navigation],
  );

  const handleLink = useCallback(
    () => navigation.navigate(routes.linkRecord),
    [navigation],
  );

  const handleHistory = useCallback(
    () => navigation.navigate(routes.historyScreen),
    [navigation],
  );

  const handleCancel = useCallback(() => navigation.goBack(), [navigation]);

  const toggleCalendarVisible = useCallback((type = 'date') => {
    if (type === 'EndDate') {
      setIsSelectingEndDate(true);
      setCalendarVisible(prev => !prev);
    } else {
      setIsSelectingEndDate(false);
      setCalendarVisible(prev => !prev);
    }
  }, []);

  const toggleClockVisible = useCallback(
    (type: 'start' | 'end', value: boolean) => {
      setClockVisible(prev => ({ ...prev, [type]: value }));
    },
    [],
  );

  const toggleShowAllRecords = useCallback(
    () => setShowAllRecords(prev => !prev),
    [],
  );

  const toggleShowAllInvitations = useCallback(
    () => setShowAllInvitations(prev => !prev),
    [],
  );

  const handleInvitedPress = useCallback(
    (id: string) => dispatch(removeInvitedUser(id)),
    [dispatch],
  );

  const handleLinkedRecordsPress = useCallback(
    (id: string) => dispatch(removelinkedRecords(id)),
    [dispatch],
  );

  const handleSchedule = async () => {
    const error = validateEventForm(formData);
    if (error) {
      dispatch(showToast({ message: error, type: 'error' }));
      return;
    }
    try {
      dispatch(showLoader(true));
      const eventData: EventFormDataApi = {
        businessId: typeof formData.selectedBusiness === 'object' ? formData.selectedBusiness._id : '',
        subject: formData.subject,
        date: formData.selectedDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        allDay: formData.isAllDay,
        repeat: selectedRepeatOption.value,
        endDate: formData.endDate,
        manualAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
        },
        meetingLink:
          formData.eventType === 'Online' ? formData.meetingLink : '',
        inviteOption: formData.networkCheck ? 'selected' : null,
        invitedUsers: invited?.filter(p => p?.firstName && p?.lastName)
          .map(user => user._id),
        eventType: formData.eventType,
      };

      console.log('Event data:', JSON.stringify(invited?.filter(p => p?.firstName && p?.lastName), null, 2));
      console.log('Event data:', JSON.stringify(eventData, null, 2));

      const response = isEditing
        ? await updateEvent(editingEvent._id, eventData)
        : await createEvent(eventData);

      if (response.success) {
        dispatch(
          showToast({
            message: isEditing
              ? 'Event updated successfully'
              : response?.message,
            type: 'success',
          }),
        );
        navigation.goBack();
      }
    } catch (error) {
      console.log('Error[]', error);
    } finally {
      dispatch(showLoader(false));
    }
  };

  useEffect(() => {
    try {
      if (isEditing && editingEvent.participants) {

        console.log('Invited memebers []...', editingEvent.participants);

        const invitedUsers = editingEvent.participants
          .filter((p: User) => p?.firstName && p?.lastName && p?.userId !== userInfo?._id)
          .map(
            (participant: {
              _id: string;
              firstName: string;
              lastName: string;
              imageUrl: string;
              me: boolean;
              role: string;
              userId: string;
            }) => ({
              _id: participant.userId,
              firstName: participant.firstName,
              lastName: participant.lastName,
              imageUrl: participant.imageUrl,
              me: participant.me,
              role: participant.role,
            }),
          );
        console.log('invitedUsers[]', invitedUsers);

        dispatch(
          inviteAll({
            invited: invitedUsers,
            length: invitedUsers.length,
            isAll: false,
          }),
        );
      } else {
        dispatch(inviteAll({ invited: [], length: 0, isAll: false }));
      }
    } catch (error) {
      console.log('error[]', error);
    }

    dispatch(linkAll({ linked: [], length: 0, isAll: false }));

    return () => { };
  }, [dispatch, isEditing, editingEvent, userInfo?._id]);

  const renderMoreLessButton = useCallback((
    totalItems: number,
    showAll: boolean,
    toggleShowAll: () => void,
  ) => {
    if (totalItems <= 3) return null;

    return (
      <Pressable
        style={{
          backgroundColor: colors.primaryLight,
          padding: 3,
          paddingHorizontal: 12,
          borderRadius: 100,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={toggleShowAll}
        accessibilityLabel={showAll ? "View less" : "View more"}>
        <Text textStyle='semibold12'>{showAll ? 'View Less' : 'View More'}</Text>
      </Pressable>
    );
  }, [colors.primaryLight]);

  const InvitedUsers = useMemo(() => {
    const usersToShow = showAllInvitations ? invited : invited.slice(0, 3);

    return (
      <View style={styles.invitedUsersContainer}>
        {usersToShow
          ?.filter(p => p?.firstName && p?.lastName && p?._id !== userInfo?._id)
          .map((item, index) => (
            <Pressable
              disabled={(isEditing && item._id === editingEvent?.userId) || invitedAll}
              key={item._id || index}
              style={[styles.invitedUserItem, { backgroundColor: colors.primaryLight }]}
              onPress={() => handleInvitedPress(item._id)}
              accessibilityLabel={`Remove ${item.firstName} ${item.lastName}`}>
              <View style={styles.invitedUserAvatarContainer}>
                <ProfileAvatar
                  uri={item?.avatar}
                  firstName={item.firstName}
                  lastName={item.lastName}
                  size={24}
                  textStyle={'medium12'}
                />
                <Icon
                  source={icons.verified}
                  size={8}
                  style={styles.invitedUserVerifiedIcon}
                />
              </View>
              <View style={styles.invitedUserInfo}>
                <Text textStyle="medium10" color={colors.textPrimary}>
                  {item?.firstName} {item.lastName}
                </Text>
                <Text textStyle="regular8" color={colors.textPrimary}>
                  {userRoles[item?.role as keyof typeof userRoles]}
                </Text>
              </View>
              {((isEditing && item._id === editingEvent?.userId) || !invitedAll) && (
                <Icon source={icons.cross} size={10} disabled />
              )}
            </Pressable>
          ))}

        {invited.length > 0 &&
          renderMoreLessButton(
            invited.length,
            showAllInvitations,
            toggleShowAllInvitations,
          )}
      </View>
    );
  }, [
    invited,
    userInfo?._id,
    showAllInvitations,
    invitedAll,
    isEditing,
    editingEvent?.userId,
    colors.primaryLight,
    colors.textPrimary,
    handleInvitedPress,
    renderMoreLessButton,
    toggleShowAllInvitations,
  ]);

  const LinkedRecords = useMemo(() => {
    const recordsToShow = showAllRecords ? linkedRecords : linkedRecords.slice(0, 3);

    return (
      <View style={styles.linkedRecordsContainer}>
        {recordsToShow.map((item, index) => (
          <Pressable
            key={item.id || index}
            style={[styles.linkedRecordItem, { backgroundColor: colors.primaryLight }]}
            onPress={() => handleLinkedRecordsPress(item.id)}
            accessibilityLabel={`Remove ${item.name}`}>
            <Text textStyle="semibold12" numberOfLines={1}>
              {item?.name}
            </Text>
            {!linkedAll && <Icon source={icons.cross} size={10} disabled />}
          </Pressable>
        ))}

        {linkedRecords.length > 0 &&
          renderMoreLessButton(
            linkedRecords.length,
            showAllRecords,
            toggleShowAllRecords,
          )}
      </View>
    );
  }, [
    linkedRecords,
    linkedAll,
    colors.primaryLight,
    showAllRecords,
    handleLinkedRecordsPress,
    renderMoreLessButton,
    toggleShowAllRecords,
  ]);

  const LocationOptions = useMemo(() => (
    <View style={styles.locationOptionsContainer}>
      <View style={styles.locationOption}>
        <Icon
          size={18}
          source={formData.eventType === 'OnSite' ? icons.circleChecked : icons.circleCheck}
          onPress={() => handleChange('eventType', 'OnSite')}
        />
        <Text textStyle="medium16" color={colors.textPrimary}>
          Onsite
        </Text>
      </View>
      <View style={styles.locationOption}>
        <Icon
          size={18}
          source={formData.eventType === 'Online' ? icons.circleChecked : icons.circleCheck}
          onPress={() => handleChange('eventType', 'Online')}
        />
        <Text textStyle="medium16" color={colors.textPrimary}>
          Online
        </Text>
      </View>
    </View>
  ), [formData.eventType, colors.textPrimary, handleChange]);

  const ActionButtons = useMemo(() => (
    <View style={styles.actionButtonsContainer}>
      <Button
        height={36}
        textStyle="semibold12"
        title="History"
        onPress={handleHistory}
      />

      <View style={styles.rightActionButtons}>
        <Button
          height={36}
          title="Cancel"
          textStyle="semibold12"
          onPress={handleCancel}
        />
        <Button
          height={36}
          backgroundColor={colors.primary}
          textStyle="semibold12"
          textColor={colors.white}
          title={isEditing ? 'Update' : 'Schedule'}
          onPress={handleSchedule}
        />
      </View>
    </View>
  ), [
    colors.primary,
    colors.white,
    handleHistory,
    handleCancel,
    handleSchedule,
    isEditing,
  ]);

  const InviteOptions = useMemo(() => (
    <>
      <Text textStyle="semibold16">Invite Users From</Text>
      {['networkCheck', 'businessCheck'].map((key, index) => (
        <View key={index} style={styles.inviteOption}>
          <Icon
            source={formData[key as keyof typeof formData] ? icons.approved : icons.unchecked}
            size={28}
            color={formData[key as keyof typeof formData] ? colors.primary : '#BCB3E2'}
            onPress={() => handleChange(key, !formData[key as keyof typeof formData])}
          />
          <Text textStyle="medium16" color={colors.textBody}>
            {key === 'networkCheck' ? 'My Network Connections' : 'Business Record'}
          </Text>
        </View>
      ))}
    </>
  ), [formData, colors.primary, colors.textBody, handleChange]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Header title={isEditing ? 'Edit Event' : 'Schedule Event'} />

        <View style={styles.content}>
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}>

            <Dropdown
              label={isEditing ? 'Business' : 'Select Business'}
              data={myBusinesses}
              placeholder="Select Business"
              selectedItem={formData.selectedBusiness}
              onSelect={val => handleChange('selectedBusiness', val)}
              variant="default"
              showIcons={true}
              disabled={isEditing}
            />

            <View>
              <Text textStyle="semibold16">
                From{' '}
                <Text textStyle="semibold16" color={colors.error}>*</Text>
              </Text>
              <View style={[styles.userContainer, { borderColor: colors.textBody }]}>
                <View style={styles.imageContainer}>
                  <ProfileAvatar
                    uri={userInfo?.imageUrl}
                    firstName={userInfo?.firstName}
                    lastName={userInfo?.lastName}
                    size={38}
                    textStyle={'medium16'}
                  />
                  <Icon
                    source={icons.verified}
                    size={12}
                    style={styles.verifiedIcon}
                  />
                </View>
                <View>
                  <Text textStyle="regular16" color={colors.textPrimary}>
                    {userInfo?.firstName} {userInfo?.lastName}
                  </Text>
                  <View style={styles.regulatorContainer}>
                    <Text textStyle="regular8" color={colors.textPrimary}>
                      {userRoles[userInfo?.role as keyof typeof userRoles] || 'Unknown Role'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <InputField
              label="Subject"
              placeholder="Enter Subject"
              required
              value={formData.subject}
              onChangeText={val => handleChange('subject', val)}
            />

            <InputField
              label="Date"
              placeholder="Select Date"
              editable={false}
              required
              icon={icons.calendar}
              value={formData.selectedDate}
              onPressIcon={toggleCalendarVisible}
            />

            <InputField
              label="Start Time"
              placeholder="Select Start Time"
              required
              editable={false}
              icon={icons.clock}
              value={formData.startTime}
              onPressIcon={() => toggleClockVisible('start', true)}
            />

            <InputField
              label="End Time"
              placeholder="Select End Time"
              editable={false}
              required
              icon={icons.clock}
              value={formData.endTime}
              onPressIcon={() => toggleClockVisible('end', true)}
            />

            <View style={styles.switchContainer}>
              <Text textStyle="semibold16">All Day</Text>
              <Switch
                value={formData.isAllDay}
                onValueChange={val => handleChange('isAllDay', val)}
              />
            </View>

            {InviteOptions}

            {formData.businessCheck && (
              <View style={styles.sectionContainer}>
                <Text textStyle="semibold16">
                  Linked Record<Text color={colors.error}>*</Text>
                </Text>
                <Button
                  backgroundColor={colors.primary}
                  height={40}
                  title="Link a Record"
                  textStyle="semibold12"
                  textColor={colors.white}
                  onPress={handleLink}
                />
                {LinkedRecords}
              </View>
            )}

            {formData.networkCheck && (
              <View style={styles.sectionContainer}>
                <Text textStyle="semibold16">
                  Invite Person<Text color={colors.error}>*</Text>
                </Text>
                <Button
                  backgroundColor={colors.primary}
                  height={40}
                  title="Invite"
                  textStyle="semibold12"
                  textColor={colors.white}
                  onPress={handleInvite}
                />
                {InvitedUsers}
              </View>
            )}

            {LocationOptions}

            {formData.eventType === 'OnSite' ? (
              manualAddress ? (
                <>
                  <InputField
                    label="Manual Address"
                    placeholder="Enter address"
                    value={formData.address}
                    onChangeText={val => handleChange('address', val)}
                  />
                  <InputField
                    label="City"
                    placeholder="Enter City"
                    value={formData.city}
                    onChangeText={val => handleChange('city', val)}
                  />
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                    <InputField
                      label="State/Territory"
                      placeholder="Enter State/Territory"
                      onChangeText={val => handleChange('state', val)}
                      value={formData.state}
                      containerStyle={{ width: '48%' }}
                    />
                    <InputField
                      label="Postal Code"
                      placeholder="Enter Postal Code"
                      value={formData.postalCode}
                      containerStyle={{ width: '45%' }}
                      keyboardType="numeric"
                      onChangeText={val => handleChange('postalCode', val)}
                    />
                  </View>
                  <Text
                    style={{
                      marginVertical: 8,
                      textDecorationLine: 'underline',
                    }}
                    textStyle="semibold12">
                    Search Address with Google
                  </Text>
                </>
              ) : (
                <>
                  <InputField
                    label="Location"
                    placeholder="Enter Location"
                    value={formData.location}
                    onChangeText={val => handleChange('location', val)}
                  />
                  <Text
                    style={{
                      marginVertical: 8,
                      textDecorationLine: 'underline',
                      alignSelf: 'center',
                    }}
                    textStyle="semibold12"
                    onPress={() => setManualAddress(true)}>
                    Add Manually
                  </Text>
                </>
              )
            ) : (
              <InputField
                label="Meeting Link"
                placeholder="Enter Meeting link"
                value={formData.meetingLink}
                onChangeText={val => handleChange('meetingLink', val)}
              />
            )}

            <Dropdown
              data={repeatOptions}
              selectedItem={selectedRepeatOption}
              onSelect={(item: DropdownItem) => setSelectedRepeatOption(item as { id: string; label: string; value: string })}
              label="Repeat"
              placeholder="Do not repeat"
              variant="simple"
              dropdownStyle={{
                shadowOpacity: 0.05,
              }}
              itemStyle={{
                borderBottomWidth: 0,
              }}
              showIcons={false}
            />

            {selectedRepeatOption.id !== '1' && (
              <InputField
                label="End Date"
                placeholder="Enter Date"
                editable={false}
                required
                icon={icons.calendar}
                value={formData.endDate}
                onPressIcon={() => toggleCalendarVisible('EndDate')}
              />
            )}

            {ActionButtons}

            <View style={{ height: 220 }} />
          </ScrollView>
        </View>

        <DatePicker
          visible={calendarVisible}
          onClose={() => setCalendarVisible(false)}
          onSelectDate={text =>
            isSelectingEndDate
              ? handleChange('endDate', formatDate(text))
              : handleChange('selectedDate', formatDate(text))
          }
          currentDate={isSelectingEndDate ? formData.endDate : formData.selectedDate}
          calendarTheme={calendarTheme}
          initialDate={isSelectingEndDate ? formData.endDate : formData.selectedDate}
        />

        {['start', 'end'].map(type => (
          <RNModal
            key={type}
            visible={clockVisible[type as keyof typeof clockVisible]}
            transparent
            animationType="slide">
            <Pressable style={styles.modalContainer} disabled>
              <TimePicker
                title={`${type.charAt(0).toUpperCase() + type.slice(1)} time`}
                initialTime={formData[type === 'start' ? 'startTime' : 'endTime']}
                onClose={() => toggleClockVisible(type as 'start' | 'end', false)}
                onConfirm={(timeString: string) => {
                  toggleClockVisible(type as 'start' | 'end', false);
                  handleChange(`${type}Time`, timeString);
                }}
              />
            </Pressable>
          </RNModal>
        ))}
      </View>
    </KeyboardAvoidingView>
  );
};

export default React.memo(ScheduleEvent);