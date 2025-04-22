import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../../context/themeContext';
import {
  Header,
  InputField,
  Button,
  Text,
  Switch,
  ProfileAvatar,
} from '../../../components';
import { icons } from '../../../assets/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  inviteAll,
  invitePerson,
  removeInvitedUser,
} from '../../../redux/features/eventSlice';
import { RootState } from '../../../redux/store';
import { tabs } from '../../../constants/data';
import { getUserNetwork, searchNetwork } from '../../../api/calendar';
import { userRoles } from '../../../utils/enums';
import { InviteProps, User } from './types';


const Invite: React.FC<InviteProps> = ({ }) => {
  const { colors } = useTheme();
  const [selectedTab, setSelectedTab] = useState('All');
  const [users, setUsers] = useState<User[]>([]);
  const { invited, invitedAll } = useSelector((state: RootState) => state.event);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const dispatch = useDispatch();

  const fetchUsersList = useCallback(
    async (pageNum: number) => {
      if (!hasMore && pageNum > 1) return;
      setLoading(true);
      try {
        const response = await getUserNetwork(pageNum, limit);
        setUsers(prevUsers =>
          pageNum === 1 ? response.users : [...prevUsers, ...response.users],
        );

        setHasMore(response.users.length >= limit);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    },
    [limit, hasMore],
  );

  useEffect(() => {
    fetchUsersList(1);
  }, [fetchUsersList]);

  const loadMoreUsers = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUsersList(nextPage);
    }
  };

  const filteredUsers = users?.filter(
    user =>
      (selectedTab === 'All' || user.category === selectedTab) &&
      (user?.firstName + ' ' + user?.lastName)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  const isUserInvited = useCallback(
    (userId: string) => {
      return (
        invited.some((inv,) => {
          return inv._id === userId;
        }) || invitedAll
      );
    },
    [invited, invitedAll],
  );

  const handleInvite = useCallback(
    (item: User) => {
      if (!isUserInvited(item._id)) {
        dispatch(invitePerson([...invited, { ...item, id: item._id }]));
      } else {
        dispatch(removeInvitedUser(item._id));
      }
    },
    [dispatch, invited, isUserInvited],
  );

  const handleSearch = async (text: string) => {
    try {
      setSearchQuery(text);
      const response = await searchNetwork(text);
      console.log(response);
    } catch (error) { }
  };

  const handleAllInvited = (val: string | boolean) => {
    const boolVal = typeof val === 'string' ? val === 'true' : val;
    if (boolVal) {
      const usersToInvite = filteredUsers.map(user => ({
        ...user,
        id: user._id,
      }));

      const alreadyInvitedOutsideFilter = invited.filter(
        inv => !filteredUsers.some(user => user._id === inv.id),
      );

      const allInvitedUsers = [
        ...alreadyInvitedOutsideFilter,
        ...usersToInvite,
      ];

      dispatch(
        inviteAll({
          invited: allInvitedUsers,
          length: allInvitedUsers.length,
          isAll: true,
        }),
      );
    } else {
      const usersToKeep = invited.filter(
        inv => !filteredUsers.some(user => user._id === inv.id),
      );

      dispatch(
        inviteAll({
          invited: usersToKeep,
          length: usersToKeep.length,
          isAll: false,
        }),
      );
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Schedule Event" />
      <View style={styles.searchContainer}>
        <InputField
          label=""
          placeholder="Search person"
          icon={icons.search}
          variant="search"
          containerStyle={{
            marginTop: 12,
            marginVertical: 10,
          }}
          onChangeText={handleSearch}
        />
      </View>

      <View>
        <FlatList
          data={tabs}
          removeClippedSubviews={false}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabContainer}
          getItemLayout={(data, index) => ({
            length: 70,
            offset: 70 * index,
            index,
          })}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.tab,
                {
                  backgroundColor:
                    selectedTab === item ? colors.primary : 'transparent',
                  borderColor:
                    selectedTab === item ? colors.primary : colors.grey,
                },
              ]}
              onPress={() => setSelectedTab(item)}>
              <Text
                textStyle="semibold12"
                color={selectedTab === item ? colors.white : colors.primary}>
                {item}
              </Text>
            </Pressable>
          )}
        />
      </View>

      <FlatList
        data={filteredUsers}
        contentContainerStyle={styles.userListContainer}
        keyExtractor={item => item._id}
        initialNumToRender={10}
        onEndReached={loadMoreUsers}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        removeClippedSubviews={false}
        ListHeaderComponent={
          selectedTab === 'All' ? (
            <View style={styles.switchContainer}>
              <Text color={colors.black} textStyle="semibold16">
                Invite all
              </Text>
              <Switch value={invitedAll} onValueChange={handleAllInvited} />
            </View>
          ) : null
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text textStyle="medium14">No user found</Text>
          </View>
        )}
        renderItem={({ item }) => {
          const isInvited = isUserInvited(item._id);

          return (
            <View key={item._id} style={styles.userItem}>
              <View style={styles.userInfo}>
                <ProfileAvatar
                  uri={item?.imageUrl}
                  firstName={item?.firstName}
                  lastName={item?.lastName}
                  size={45}
                  textStyle="medium16"
                />

                <View style={styles.userDetails}>
                  <Text textStyle="medium12" color={colors.textPrimary}>
                    {item?.firstName + ' ' + item?.lastName}
                  </Text>
                  <Text textStyle="regular10" style={{ color: colors.textBody }}>
                    {userRoles[item?.role as keyof typeof userRoles] || 'Unknown Role'}
                  </Text>
                </View>
              </View>
              <Button
                title={isInvited ? 'Invited' : 'Invite'}
                onPress={() => handleInvite(item)}
                height={24}
                width={137}
                backgroundColor={isInvited ? colors.grey : colors.primary}
                textColor={isInvited ? colors.primary : colors.white}
                textStyle="semibold12"
                disabled={invitedAll}
              />
            </View>
          )
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: { paddingHorizontal: 24, marginBottom: 16 },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    height: 35,
  },
  tab: {
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
  userListContainer: {
    paddingHorizontal: 24,
    flexGrow: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomColor: '#F0F0F0',
  },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  userDetails: { marginLeft: 12 },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Invite;
