import React, { useCallback, useState } from 'react';
import { SafeAreaView, View, Linking } from 'react-native';
import { useTheme } from '../../../context/themeContext';
import { Button, Header, Icon, Modal, ProfileAvatar, Text } from '../../../components';
import { formatDate, getAddress, getRepeatLabel } from '../../../utils/utils';
import { icons } from '../../../assets/icons';
import { routes } from '../../../navigation/Routes';
import { useDispatch, useSelector } from 'react-redux';
import { showLoader } from '../../../redux/features/loaderSlice';
import {
  acceptEvent,
  deleteEvent,
  getEventDetail,
  rejectEvent,
} from '../../../api/calendar';
import { showToast } from '../../../redux/features/toastSlice';
import { RootState } from '../../../redux/store';
import { useFocusEffect } from '@react-navigation/native';
import { userRoles } from '../../../utils/enums';
import styles from './styles';
import { EventDetailData, EventDetailProps } from './types';



const EventDetail: React.FC<EventDetailProps> = ({ navigation, route }) => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const { item } = route.params;

  const { colors } = useTheme();
  const dispatch = useDispatch();

  const [eventDetail, setEventDetail] = useState<EventDetailData | null>(null);
  const [buttonStatus, setButtonStatus] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  const fetchEvent = async () => {
    try {
      dispatch(showLoader(true));
      const response = await getEventDetail(item._id);
      setEventDetail(response.event);
      dispatch(showLoader(false));
    } catch (error) {
      dispatch(showLoader(false));
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvent();
    }, [fetchEvent]),
  );



  const handleSeeMore = () => {
    navigation.navigate(routes.participants, {
      participants: eventDetail?.participants || [],
    });
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  }

  const handleDelete = async () => {
    try {
      dispatch(showLoader(true));
      if (eventDetail) {
        const response = await deleteEvent(eventDetail._id);
        if (response.success) {
          dispatch(showToast({ message: response.message, type: 'success' }));
        }
      }
      navigation.goBack();
      dispatch(showLoader(false));
    } catch (error) {
      dispatch(showLoader(false));
    }
  };

  const handleAccept = async () => {
    try {
      if (eventDetail) {
        const response = await acceptEvent(eventDetail._id);
        if (response.success) {
          dispatch(
            showToast({ message: 'Accepted successfully', type: 'success' }),
          );
        }
        setButtonStatus('Accepted');
        setButtonStatus('Accepted');
      }
    } catch (error) {
      console.log('Error[handleAccept]', error);
    }
  };

  const handleReject = async () => {
    try {
      if (eventDetail) {
        const response = await rejectEvent(eventDetail._id);
        if (response.success) {
          dispatch(
            showToast({ message: 'Rejected successfully', type: 'success' }),
          );
        }
        setButtonStatus('Rejected');

        dispatch(
          showToast({ message: 'Rejected successfully', type: 'success' }),
        );
      }
      setButtonStatus('Rejected');
    } catch (error) {
      console.log('Error[handleReject]', error);
    }
  };

  const handleEdit = () => {
    navigation.navigate(routes.scheduleEvent, { item: eventDetail });
  };

  const buttonRenderAccept = eventDetail?.confirmedAttendees?.some(
    att => userInfo && (att.userId === userInfo._id || buttonStatus === 'Accepted'),
  );

  const buttonRenderRejected =
    eventDetail?.declinedAttendees?.some(att => userInfo && att.userId === userInfo._id) ||
    buttonStatus === 'Rejected';

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Event Detail" />
      {!eventDetail ? (
        <View />)
        :
        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.detailsContainer}>
              <View style={styles.subjectContainer}>
                <Text
                  textStyle="semibold24"
                  color={colors.textPrimary}
                  style={styles.subjectText}>
                  {eventDetail.subject}
                </Text>
                {eventDetail.userId === userInfo?._id && (
                  <Button
                    height={25}
                    title="Edit meeting"
                    textStyle="semibold12"
                    icon={icons.pen}
                    iconSize={8}
                    onPress={handleEdit}
                    style={styles.editButton}
                  />
                )}
              </View>
              <Text textStyle="regular12" color={colors.textBody}>
                {formatDate(new Date(eventDetail.date), 'shortDate')}
              </Text>
              <View style={styles.timeContainer}>
                <Text textStyle="regular12" color={colors.textBody}>
                  {eventDetail.startTime}-{eventDetail.endTime}
                </Text>
                {eventDetail.repeat !== 'noRepeat' && (
                  <Icon source={icons.repeat} size={14} />
                )}
              </View>
              {eventDetail.meetingLink ? (
                <Text color={colors.textPrimary} textStyle="regular14">
                  Online :{' '}
                  <Text style={{ textDecorationLine: 'underline' }}>
                    {eventDetail?.meetingLink}
                  </Text>
                </Text>
              ) : (
                <Text color={colors.textPrimary} textStyle="regular14">
                  On Site:{' '}
                  <Text
                    color={
                      eventDetail.manualAddress
                        ? colors.textPrimary
                        : colors.primary
                    }
                    style={{
                      textDecorationLine: eventDetail.manualAddress
                        ? 'none'
                        : 'underline',
                    }}>
                    {eventDetail.manualAddress
                      ? eventDetail?.manualAddress &&
                      getAddress(eventDetail?.manualAddress)
                      : 'View on Google Maps'}
                  </Text>
                </Text>
              )}
            </View>

            <View style={styles.buttonContainer}>
              {eventDetail.userId !== userInfo?._id && (
                <>
                  {buttonRenderAccept ? (
                    <Button
                      backgroundColor={''}
                      height={35}
                      width="33%"
                      title="Accepted"
                      disabled
                    />
                  ) : buttonRenderRejected ? (
                    <Button
                      backgroundColor={colors.error}
                      height={35}
                      width="33%"
                      title="Rejected"
                      textColor={colors.white}
                      disabled
                    />
                  ) : (
                    <>
                      <Button
                        backgroundColor=""
                        height={35}
                        width="33%"
                        title="Accept"
                        onPress={handleAccept}
                      />
                      <Button
                        backgroundColor={colors.error}
                        height={35}
                        width="33%"
                        title="Reject"
                        textColor={colors.white}
                        onPress={handleReject}
                      />
                    </>
                  )}
                </>
              )}

              {eventDetail.meetingLink && (
                <Button
                  backgroundColor={colors.primary}
                  height={35}
                  width={'33%'}
                  title="Join"
                  textColor={colors.white}
                  icon={icons.group}
                  onPress={async () => {
                    const url = eventDetail?.meetingLink;

                    if (url) {
                      const supported = await Linking.canOpenURL(url);
                      if (supported) {
                        Linking.openURL(url);
                      } else {
                        dispatch(
                          showToast({
                            message: `Invalid Link', 'Cannot open this link.`,
                            type: 'error',
                          }),
                        );
                      }
                    } else {
                      dispatch(
                        showToast({
                          message: `No Link', 'Meeting link is not available.`,
                          type: 'error',
                        }),
                      );
                    }
                  }}
                />
              )}
            </View>

            {eventDetail?.participants?.length !== 0 && (
              <>
                <Text textStyle="medium16" color={colors.textPrimary}>
                  Participants ({eventDetail?.participants?.length})
                </Text>

                {eventDetail?.participants
                  ?.filter(p => p?.firstName || p?.lastName || p?.imageUrl)
                  ?.slice(0, 3)
                  .map(participant => (
                    <View
                      key={participant?.userId}
                      style={styles.participantContainer}>
                      <View style={styles.imageContainer}>
                        <ProfileAvatar
                          uri={participant?.imageUrl}
                          firstName={participant?.firstName}
                          lastName={participant?.lastName}
                          size={34}
                          textStyle={'medium16'}
                        />

                        <Icon
                          source={icons.verified}
                          size={12}
                          style={styles.verifiedIcon}
                        />
                      </View>
                      <View>
                        <Text textStyle="medium14" color={colors.textPrimary}>
                          {participant?.firstName} {participant?.lastName}{' '}
                          {participant.userId === userInfo?._id && (
                            <Text textStyle="medium14">(Me)</Text>
                          )}
                        </Text>
                        <Text textStyle="regular12" color={colors.textBody}>
                          {userRoles[participant?.role as keyof typeof userRoles] || 'Unknown Role'}{' '}
                          {participant.userId === eventDetail.userId && (
                            <Text textStyle="medium14" color={colors.textPrimary}>
                              (Organizer)
                            </Text>
                          )}
                        </Text>
                      </View>
                    </View>
                  ))}
              </>
            )}

            {eventDetail?.participants &&
              eventDetail?.participants?.length > 3 && (
                <Text
                  style={styles.seeMoreText}
                  textStyle="regular12"
                  onPress={handleSeeMore}>
                  See More
                </Text>
              )}

            <View style={styles.statusContainer}>
              <Text textStyle="medium16" color={colors.textPrimary}>
                Status
              </Text>
              <View style={styles.repeatContainer}>
                <Text textStyle="medium14" color={colors.textBody}>
                  {getRepeatLabel(eventDetail.repeat)}
                </Text>
                {eventDetail.repeat && <Icon source={icons.repeat} size={14} />}
              </View>
            </View>
            <Modal
              visible={showDeleteModal}
              onClose={handleCancelDelete}
              onAction={handleDelete}
              message="Are you sure, you want to delete this event?"
              leftButton="Cancel"
              rightButton="Delete"
              title={'Delete Event'}
            />
            {eventDetail.userId === userInfo?._id && (
              <Button
                backgroundColor={colors.error}
                height={35}
                style={styles.deleteButton}
                textStyle="semibold12"
                textColor={colors.white}
                title="Delete From Calendar"
                onPress={() => setShowDeleteModal(true)}
              />
            )}
          </View>
        </View>}
    </SafeAreaView>
  );
};

export default EventDetail;