import React, { useState } from 'react';
import {
  Pressable,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useTheme } from '../../../context/themeContext';
import { Button, Icon, LoadingScreen, Text } from '../../../components';
import { icons } from '../../../assets/icons';
import { styles } from './styles';
import { addNote } from '../../../api/notesApis';
import { useDispatch } from 'react-redux';
import { showLoader } from '../../../redux/features/loaderSlice';
import { showToast } from '../../../redux/features/toastSlice';
import { moderateScale } from '../../../utils/scaling';
import { AddNotesProps } from './types';


const AddNotes: React.FC<AddNotesProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const [notes, setNotes] = useState<string>('');
  const [notesError, setNotesError] = useState<string>('');
  const [focus, setFocus] = useState<boolean>(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddNotes = async () => {
    if (notes) {
      try {
        dispatch(showLoader(true));
        const response = await addNote({ content: notes });
        if (response) {
          console.log('this one', response);
          dispatch(showToast({ message: response?.message, type: 'success' }));
          handleBack();
        }
        dispatch(showLoader(false));
      } catch (error) {
        dispatch(showLoader(false));
        console.log('Error[]', error);
      }
    } else {
      setNotesError('This field is required ');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 5 : 0}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <Pressable
            style={[styles.container, { backgroundColor: colors.white }]}>
            <View style={styles.header}>
              <Text textStyle="semibold20">Add Note</Text>
              <Icon
                onPress={handleBack}
                source={icons.closed}
                size={moderateScale(20)}
              />
            </View>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: focus
                    ? colors.primary
                    : notesError
                      ? colors.error
                      : colors.grey,
                  textAlignVertical: 'top',
                  color: colors.black,
                },
              ]}
              value={notes}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              placeholderTextColor={colors.grey}
              onChangeText={text => {
                setNotes(text);
                setNotesError('');
              }}
              multiline
              placeholder="Write Note Here...."
            />
            {notesError && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text textStyle="regular12" color={colors.error}>
                  {notesError}
                </Text>
                <Icon source={icons.info} size={13} />
              </View>
            )}
            <Button
              height={35}
              width={105}
              backgroundColor={colors.primary}
              title="Add Note"
              textColor={colors.white}
              textStyle="semibold12"
              style={[
                styles.button,
                Platform.OS === 'android' && { marginBottom: 14 },
              ]}
              onPress={handleAddNotes}
            />
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
      <LoadingScreen />
    </KeyboardAvoidingView>
  );
};

export default AddNotes;
