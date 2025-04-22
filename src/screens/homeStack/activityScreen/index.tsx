import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Pressable,
} from 'react-native';
import { Header, Icon, Text } from '../../../components';
import { icons } from '../../../assets/icons';
import { useTheme } from '../../../context/themeContext';
import { routes } from '../../../navigation/Routes';
import { projects } from '../../../constants/data';
import { moderateScale } from '../../../utils/scaling';
import styles from './styles';
import { ActivityScreenProps, ProjectItem, TabType } from './types';


const ActivityScreen: React.FC<ActivityScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const { colors } = useTheme();

  const onPressActivity = useCallback(() => {
    navigation.navigate(routes.activityDetail);
  }, [navigation]);

  const handleTabPress = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  const renderProjectItem = useCallback(({ item }: { item: ProjectItem }) => (
    <Pressable
      key={item.id}
      style={[
        styles.projectItem,
        {
          borderColor: colors.primary,
          backgroundColor: item.unread
            ? colors.primaryLight
            : colors.backgroundSecondary,
        },
      ]}
      onPress={onPressActivity}>
      <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
        <Icon source={icons.menu} size={moderateScale(18)} />
      </View>
      <View style={styles.projectContent}>
        <View style={styles.projectDetails}>
          <Text textStyle="regular14" color={colors.textPrimary}>
            {item.title}
          </Text>
          <Text textStyle="regular12">
            {item.description} · {item.location}
          </Text>
          <Text textStyle="regular12" color={colors.textBody}>
            {item.timeframe}
          </Text>
        </View>
      </View>
      <Icon
        source={icons.right}
        size={moderateScale(12)}
        color={colors.primary}
      />
    </Pressable>
  ), [colors, onPressActivity]);

  const listProps = useMemo(() => ({
    keyExtractor: (item: ProjectItem) => item.id,
    removeClippedSubviews: true,
    initialNumToRender: 10,
    maxToRenderPerBatch: 10,
    windowSize: 10
  }), []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Activity" />
      <View style={styles.tabsContainer}>
        {(['All', 'Active', 'Visited'] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => handleTabPress(tab)}>
            <Text
              textStyle="regular12"
              color={activeTab === tab ? colors.primary : colors.textPrimary}>
              {tab}
            </Text>
            {activeTab === tab && <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />}
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        style={styles.projectsContainer}
        data={projects}
        renderItem={renderProjectItem}
        {...listProps}
      />
    </SafeAreaView>
  );
};



export default React.memo(ActivityScreen);