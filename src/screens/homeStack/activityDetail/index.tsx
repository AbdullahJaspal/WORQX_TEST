import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, View } from 'react-native';
import { useTheme } from '../../../context/themeContext';
import { Button, Header, InputField, Modal, Text } from '../../../components';
import { images } from '../../../assets/images';
import { routes } from '../../../navigation/Routes';
import { ActivityDetailProps } from './types';



const ActivityDetail: React.FC<ActivityDetailProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [showModal, setShowModal] = useState(false);

  const handleScan = () => {
    navigation.navigate(routes.qrScanner);
  };
  const handleSignout = () => {
    setShowModal(true);
  };

  const handleLogout = async () => {
    setShowModal(false);
  };
  const handleCancel = () => {
    setShowModal(false);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Activity" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, paddingHorizontal: 24, marginTop: 15, gap: 22 }}>
          <View>
            <Text textStyle="semibold20" color={colors.textPrimary}>
              Greenfield Solar Farm
            </Text>
            <Text textStyle="medium12" color={colors.textPrimary}>
              Project Site attendance
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Button
              height={36}
              width={'49%'}
              title="Manual Sign Out"
              textStyle="semibold12"
              onPress={handleSignout}
            />
            <Button
              height={36}
              width={'49%'}
              backgroundColor={colors.primary}
              title="Scan QR to Sign Out"
              textStyle="semibold12"
              textColor={colors.white}
              onPress={handleScan}
            />
          </View>
          <View style={{ gap: 12 }}>
            <InputField
              label="Activity Type"
              placeholder="Project Site attendance"
              editable={false}
            />
            <InputField
              label="Address"
              placeholder="Built - Shopping Centre - 25 Sydney Road"
              editable={false}
            />
            <InputField
              label="Location"
              placeholder="Built - Shopping Centre - 25 Sydney Road"
              editable={false}
            />
          </View>
          <View>
            <Text textStyle="medium16" color={colors.textPrimary}>
              Entery Date and Time <Text color={colors.error}>(Scanned)</Text>
            </Text>

            <Text textStyle="medium12" color={colors.textPrimary}>
              18 August 2024, 11:30am
            </Text>
          </View>
          <Image source={images.dummyMap} />
          <View>
            <Text textStyle="medium16" color={colors.textPrimary}>
              Exit Date and Time
              <Text color={colors.error}> (Manual Sign out)</Text>
            </Text>

            <Text textStyle="medium12" color={colors.textPrimary}>
              18 August 2024, 12:30am
            </Text>
          </View>
          <Image source={images.dummyMap} />
        </View>
        <View style={{ height: 40 }} />
        <View style={{ zIndex: 800 }}>
          <Modal
            visible={showModal}
            onClose={handleCancel}
            onAction={handleLogout}
            message={`Your Activity signing out status will show "Manual Sign out" and your location will not be captured. This action can not be changed`}
            leftButton="Cancel"
            rightButton="Logout"
            title={'Logout'}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ActivityDetail;
