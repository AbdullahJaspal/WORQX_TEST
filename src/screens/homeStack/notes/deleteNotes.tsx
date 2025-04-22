import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useTheme } from '../../../context/themeContext';
import { Button, Icon, LoadingScreen, Text } from '../../../components';
import { icons } from '../../../assets/icons';
import { styles } from './styles';
import { deleteNote } from '../../../api/notesApis';
import { useDispatch } from 'react-redux';
import { showLoader } from '../../../redux/features/loaderSlice';
import { showToast } from '../../../redux/features/toastSlice';
import { moderateScale } from '../../../utils/scaling';
import { DeleteNotesProps } from './types';

const DeleteNotes: React.FC<DeleteNotesProps> = ({ navigation, route }) => {
  const { checkedNoteIds } = route.params;
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const handleBack = () => {
    navigation.goBack();
  };

  const handleDelete = async () => {
    try {
      dispatch(showLoader(true));
      const response = await deleteNote({ noteIds: checkedNoteIds });
      dispatch(showLoader(false));
      dispatch(showToast({ message: response?.message, type: 'success' }));
      handleBack();
    } catch (error) {
      console.log('Error[handleDelete]', error);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <Pressable
            style={{
              backgroundColor: colors.white,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 24,
              gap: 22,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text textStyle="semibold20">Delete Note</Text>
              <Icon
                onPress={() => {
                  navigation.goBack();
                }}
                source={icons.closed}
                size={moderateScale(20)}
              />
            </View>
            <Text textStyle="regular16" color={colors.textPrimary}>
              Delete notes would be permanently disappear
            </Text>
            <Button
              height={35}
              width={150}
              backgroundColor={colors.error}
              title="Delete Anyway"
              textColor={colors.white}
              textStyle="semibold12"
              style={{ alignSelf: 'flex-end' }}
              onPress={() => handleDelete()}
            />
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
      <LoadingScreen />
    </KeyboardAvoidingView>
  );
};

export default DeleteNotes;
