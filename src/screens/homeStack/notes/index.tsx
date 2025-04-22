import React, { useCallback, useState, } from 'react';
import { styles } from './styles';
import { icons } from '../../../assets/icons';
import { routes } from '../../../navigation/Routes';
import { useTheme } from '../../../context/themeContext';
import { Button, Header, Icon, Spinner, Text } from '../../../components';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  View,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { getAllNotes } from '../../../api/notesApis';
import { useFocusEffect } from '@react-navigation/native';
import { MyNotesProps, Note } from './types';



const { height } = Dimensions.get('window');

const MyNotes: React.FC<MyNotesProps> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [checkedNoteIds, setCheckedNoteIds] = useState(new Set<number>());

  const isAnyChecked: boolean = checkedNoteIds.size > 0;

  useFocusEffect(
    useCallback(() => {
      setCheckedNoteIds(new Set());
      setSelectAll(false);
      setPage(1);
      refreshNotes();
      return () => { };
    }, []),
  );

  const refreshNotes = async () => {
    setIsLoading(true);
    try {
      const response = await getAllNotes(1);

      if (response?.success) {
        setNotes(response.data || []);
        setPage(2);
        setTotalPages(response.totalPages || 1);
      }
    } catch (error) {
      console.error('Error refreshing notes:', error);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  };

  const fetchNotes = async (pageToFetch = page) => {
    if (isLoading || pageToFetch > totalPages) return;

    setIsLoading(true);
    try {
      const response = await getAllNotes(pageToFetch);

      if (response?.success) {
        if (response.data && response.data.length > 0) {
          setNotes(prevNotes =>
            pageToFetch === 1
              ? response.data
              : [...prevNotes, ...response.data],
          );
          setPage(pageToFetch + 1);
          setTotalPages(response.totalPages || 1);
        }
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleCheck = useCallback((id: number) => {
    setCheckedNoteIds(prevIds => {
      const newChecked = new Set(prevIds);
      newChecked.has(id) ? newChecked.delete(id) : newChecked.add(id);
      return newChecked;
    });
    setSelectAll(false);
  }, []);

  const handleSelectAll = useCallback(() => {
    if (!selectAll) {
      const allNoteIds = new Set(notes.map(note => note._id));
      setCheckedNoteIds(allNoteIds);
    } else {
      setCheckedNoteIds(new Set());
    }
    setSelectAll(!selectAll);
  }, [selectAll, notes]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && page <= totalPages) {
      fetchNotes();
    }
  }, [page, totalPages, isLoading]);

  const handleDelete = () => {
    navigation.navigate(routes.deleteNotes, {
      checkedNoteIds: Array.from(checkedNoteIds),
    });
  };

  const handleOnRefresh = () => {
    refreshNotes();
  };

  const renderNoteItem = useCallback(
    ({ item }: { item: Note }) => (
      <Pressable
        onPress={() => navigation.navigate(routes.viewNotes, { item })}
        style={[styles.notes, { backgroundColor: colors.primaryLight }]}>
        <Icon
          source={
            checkedNoteIds.has(item._id) ? icons.approved : icons.unchecked
          }
          size={28}
          color={checkedNoteIds.has(item._id) ? colors.primary : '#BCB3E2'}
          onPress={() => handleToggleCheck(item._id)}
          style={{ marginTop: 2 }}
        />
        <View style={{ flex: 1 }}>
          <Text
            textStyle="regular16"
            numberOfLines={2}
            color={colors.textPrimary}>
            {item.content.length > 50
              ? item.content.slice(0, 50) + '...'
              : item.content}
          </Text>
        </View>
      </Pressable>
    ),
    [checkedNoteIds, colors, handleToggleCheck, navigation],
  );

  const listEmptyComponent = () => {
    if (!isLoading) {
      return (
        <View
          style={{
            height: height - 200,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
          }}>
          <Icon source={icons.notes} size={50} />
          <Text textStyle="medium16" color={colors.black}>
            No Notes Yet
          </Text>
          <Text textStyle="regular14" color={colors.textBody}>
            Start capturing your thoughts now
          </Text>
          <Button
            height={36}
            width={220}
            backgroundColor={colors.primary}
            title="Add Note"
            textStyle="semibold12"
            onPress={() => navigation.navigate(routes.addNotes)}
          />
        </View>
      );
    }
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: height - 200,
        }}>
        <Spinner size={60} color={colors.primary} />
      </View>
    );
  };

  const renderFooter = () => {
    if (isLoading && !refreshing && notes.length > 0) {
      return (
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            height: 60,
            justifyContent: 'center',
          }}>
          <Spinner size={20} strokeWidth={4} />
        </View>
      );
    }
    return null;
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="My Notes"
        leftIcon={isAnyChecked ? icons.del : undefined}
        onPressLeft={() => handleDelete()}
      />
      {isAnyChecked && (
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 24,
            marginTop: 10,
            alignItems: 'center',
          }}>
          <Icon
            source={selectAll ? icons.approved : icons.unchecked}
            size={28}
            color={selectAll ? colors.primary : '#BCB3E2'}
            onPress={() => handleSelectAll()}
          />
          <Text textStyle="regular16" color={colors.textPrimary}>
            {' '}
            Select all
          </Text>
        </View>
      )}
      <FlatList
        style={{ paddingHorizontal: 22 }}
        data={notes}
        renderItem={renderNoteItem}
        keyExtractor={item => item._id.toString()}
        showsVerticalScrollIndicator={false}
        onEndReached={() => handleLoadMore()}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={listEmptyComponent}
        removeClippedSubviews={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleOnRefresh}
            colors={[colors.primary]}
          />
        }
      />

      {notes.length > 0 && (
        <Pressable
          style={[styles.floatingButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate(routes.addNotes)}>
          <Icon source={icons.plus} disabled />
        </Pressable>
      )}
    </SafeAreaView>
  );
};

export default MyNotes;
