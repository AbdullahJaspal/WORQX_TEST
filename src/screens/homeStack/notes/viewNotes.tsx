import React, { useRef, useState } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../../../context/themeContext';
import { Button, Icon, LoadingScreen, Text } from '../../../components';
import { icons } from '../../../assets/icons';
import fonts from '../../../theme/fonts';
import { deleteNote, editNote } from '../../../api/notesApis';
import { useDispatch } from 'react-redux';
import { showLoader } from '../../../redux/features/loaderSlice';
import { showToast } from '../../../redux/features/toastSlice';
import { moderateScale } from '../../../utils/scaling';
import { useKeyboard } from '../../../hooks/useKeyboard';
import { ViewNotesProps } from './types';


const ViewNotes: React.FC<ViewNotesProps> = ({ navigation, route }) => {
  const { item } = route.params;
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const isKeyboardVisible = useKeyboard();
  const [edit, setEdit] = useState<boolean>(false);
  const [focus, setFocus] = useState<boolean>(false);
  const [notesError, setNotesError] = useState<string>('');
  const [note, setNote] = useState<string>(item.content);
  const scrollViewRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);

  const handleBack = () => navigation.goBack();

  const handleEdit = async () => {
    if (note) {
      setNotesError('');
      dispatch(showLoader(true));
      try {
        const response = await editNote(item._id, { content: note });
        setEdit(false);
        dispatch(showToast({ message: response?.message, type: 'success' }));
      } catch (error) {
        console.error('Error editing note:', error);
        dispatch(showToast({ message: 'Failed to edit note', type: 'error' }));
      } finally {
        dispatch(showLoader(false));
      }
    } else {
      setNotesError('This field is required ');
    }
  };

  const handleDelete = async () => {
    dispatch(showLoader(true));
    try {
      const response = await deleteNote({ noteIds: [item._id] });
      dispatch(showToast({ message: response?.message, type: 'error' }));
    } catch (error) {
      console.error('Error deleting note:', error);
      dispatch(showToast({ message: 'Failed to delete note', type: 'error' }));
    } finally {
      dispatch(showLoader(false));
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View
            style={[
              styles.container,
              {
                backgroundColor: colors.white,
                flexShrink: 1,
                marginTop: 50,
              },
              Platform.select({
                ios: {
                  marginBottom: isKeyboardVisible ? -50 : 0,
                },
              }),
            ]}>
            <View style={styles.header}>
              <Text textStyle="semibold20">Add Note</Text>
              <Icon
                onPress={handleBack}
                source={icons.closed}
                size={moderateScale(20)}
              />
            </View>
            <ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              style={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
              scrollEnabled={true}
              contentContainerStyle={styles.scrollContent}>
              {edit ? (
                <TextInput
                  ref={textInputRef}
                  style={[
                    styles.input,
                    {
                      borderColor: focus
                        ? colors.primary
                        : notesError
                          ? colors.error
                          : colors.grey,
                      color: colors.black,
                      textAlignVertical: 'top',
                    },
                  ]}
                  value={note}
                  onChangeText={setNote}
                  multiline
                  placeholder="Write Note Here...."
                  autoFocus={true}
                  onFocus={() => {
                    setFocus(true);
                    setTimeout(() => {
                      textInputRef.current?.measureInWindow(
                        (x, y, width, height) => {
                          scrollViewRef.current?.scrollTo({
                            y: y - 100,
                            animated: true,
                          });
                        },
                      );
                    }, 100);
                  }}
                  onBlur={() => setFocus(false)}
                  scrollEnabled={false}
                  blurOnSubmit={false}
                />
              ) : (
                <Text textStyle="regular16" color={colors.textPrimary}>
                  {note}
                </Text>
              )}
            </ScrollView>
            {edit ? (
              <Button
                height={35}
                width={100}
                backgroundColor={colors.primary}
                title="Save"
                textColor={colors.white}
                textStyle="semibold12"
                style={[
                  styles.alignEnd,
                  Platform.OS === 'android' && { marginBottom: 14 },
                ]}
                onPress={handleEdit}
              />
            ) : (
              <View style={styles.buttonRow}>
                <Button
                  height={35}
                  width={'48%'}
                  title="Edit"
                  textStyle="semibold12"
                  onPress={() => setEdit(true)}
                />
                <Button
                  height={35}
                  width={'48%'}
                  title="Delete"
                  backgroundColor={colors.error}
                  textColor={colors.white}
                  textStyle="semibold12"
                  onPress={handleDelete}
                />
              </View>
            )}
          </View>
          {Platform.OS === 'android' && (
            <View
              style={{
                height: moderateScale(15),
                backgroundColor: 'white',
              }}
            />
          )}

          <LoadingScreen />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    backgroundColor: 'red',
    gap: 22,
    flex: 0.8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  input: {
    fontFamily: fonts.family.regular,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    flex: 1,
    borderBottomWidth: 1.5,
  },
  alignEnd: {
    alignSelf: 'flex-end',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default ViewNotes;
