import React, { useState, useCallback, } from 'react';
import { View, StyleSheet, Pressable, FlatList, Modal, ListRenderItem } from 'react-native';
import { Icon, Text } from '.';
import { icons } from '../assets/icons';
import { useTheme } from '../context/themeContext';
import type { DefaultDropdownItem, DropdownHeaderProps, DropdownItem, DropdownItemProps, DropdownProps, SimpleDropdownItem } from './types';


const isDefaultItem = (item: DropdownItem): item is DefaultDropdownItem =>
  item && typeof item === 'object' && '_id' in item;

const isSimpleItem = (item: DropdownItem): item is SimpleDropdownItem =>
  item && typeof item === 'object' && 'id' in item && 'value' in item && 'label' in item;

const getItemId = (item: DropdownItem): string => {
  if (!item) return '';
  if (isDefaultItem(item)) return item._id;
  if (isSimpleItem(item)) return item.id;
  if ('id' in item) return item.id as string;
  if ('_id' in item) return item._id as string;
  if ('value' in item) return item.value as string;
  return '';
};

const getItemDisplayText = (item: DropdownItem): string => {
  if (!item) return '';
  if (isDefaultItem(item) && item.name) return item.name;
  if ('label' in item) return item.label as string;
  if ('name' in item) return item.name as string;
  if ('value' in item) return item.value as string;
  return '';
};


const DropdownHeader: React.FC<DropdownHeaderProps> = ({
  variant,
  item,
  isOpen,
  colors,
  placeholder,
  style,
  disabled,
}) => {
  const displayText = item ? getItemDisplayText(item) : placeholder;

  if (variant === 'filter') {
    return (
      <View
        style={[
          styles.filterHeader,
          style,
          {
            borderColor: isOpen ? colors.primary : colors.grey,
            borderWidth: 0.5,
            width: 150,
            borderRadius: 100,
            borderBottomLeftRadius: isOpen ? 0 : 100,
            borderTopLeftRadius: isOpen ? 30 : 100,
            borderBottomRightRadius: isOpen ? 0 : 100,
            borderTopRightRadius: isOpen ? 30 : 100,
          },
        ]}>
        <Text textStyle="semibold12" color={colors.textSecondary}>
          Filter:
        </Text>
        <Text
          textStyle="semibold12"
          color={displayText ? colors.textPrimary : colors.textSecondary}
          style={{ flex: 1, marginLeft: 4 }}>
          {displayText}
        </Text>
        <Icon
          source={isOpen ? icons.up : icons.downn}
          size={12}
          disabled
          color={colors.textPrimary}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.header,
        style,
        { borderBottomColor: isOpen ? colors.primary : colors.grey },
      ]}>
      <View style={styles.headerContent}>
        <View style={styles.selectedItem}>
          {variant === 'default' ? (
            <View style={[{ width: '100%', flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'space-between' }]}>
              <View style={[{ gap: 10, alignItems: 'center', flexDirection: 'row', }]}>
                <View
                  style={{
                    backgroundColor: '#F0FDF5',
                    padding: 10,
                    borderRadius: 100,
                  }}>
                  <Icon source={icons.briefcase} size={25} disabled />
                </View>
                <Text textStyle="regular16">{displayText || placeholder}</Text></View>
              {item && isDefaultItem(item) && item.color && (
                <View
                  style={{
                    height: 25,
                    width: 25,
                    backgroundColor: item.color,
                    borderRadius: 100,
                  }}
                />
              )}
            </View>) : (<Text
              textStyle="medium16"
              color={displayText ? colors.textPrimary : colors.textSecondary}>
              {displayText || placeholder}
            </Text>)
          }
        </View>
      </View>
      {!disabled && (
        <Icon
          source={isOpen ? icons.up : icons.downn}
          size={14}
          disabled
          color={colors.textSecondary}
        />
      )}
    </View>
  );
};

const DropdownItem: React.FC<DropdownItemProps> = ({
  item,
  isSelected,
  onSelect,
  variant,
  colors,
  showIcons,
  iconSize,
  itemStyle,
}) => {
  const displayText = getItemDisplayText(item);

  if (variant === 'filter') {
    return (
      <Pressable
        onPress={() => onSelect(item)}
        style={[
          styles.filterItem,
          itemStyle,
          isSelected && { backgroundColor: colors.primaryLight },
        ]}>
        <Text
          textStyle="regular14"
          color={isSelected ? colors.primary : colors.textPrimary}>
          {displayText}
        </Text>
      </Pressable>
    );
  }

  if (variant === 'simple') {
    return (
      <Pressable
        onPress={() => onSelect(item)}
        style={[
          styles.simpleItem,
          itemStyle,
          isSelected && { backgroundColor: colors.primaryLight, zIndex: 100 },
        ]}>
        <Text color={colors.textPrimary} textStyle="regular16">
          {displayText}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => onSelect(item)}
      style={[
        styles.item,
        itemStyle,
        isSelected && { backgroundColor: colors.primaryLight, zIndex: 100 },
      ]}>
      <View style={[{ flexDirection: 'row', gap: 10, alignItems: 'center' }]}>
        <View
          style={{
            backgroundColor: '#F0FDF5',
            padding: 10,
            borderRadius: 100,
          }}>
          <Icon source={icons.briefcase} size={25} disabled />
        </View>
        <Text textStyle="regular16">{displayText}</Text>
      </View>
      {isDefaultItem(item) && item.color && (
        <View
          style={{
            height: 25,
            width: 25,
            backgroundColor: item.color,
            borderRadius: 100,
          }}
        />
      )}
    </Pressable>
  );
};

const Dropdown: React.FC<DropdownProps> = ({
  data,
  selectedItem,
  onSelect,
  label,
  placeholder = 'Select an option',
  variant = 'default',
  containerStyle,
  headerStyle,
  dropdownStyle,
  itemStyle,
  showIcons = true,
  iconSize = 20,
  renderHeader,
  renderItem,
  labelColor,
  labelStyle = 'semibold16',
  disabled = false,
  onOpenStateChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [headerLayout, setHeaderLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const { colors } = useTheme();
  const headerRef = React.useRef<View | null>(null);

  const toggleDropdown = useCallback(() => {
    if (!disabled) {
      const newState = !isOpen;

      if (newState && headerRef.current) {
        headerRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
          setHeaderLayout({ x, y, width, height });
        });
      }

      setIsOpen(newState);
      if (onOpenStateChange) {
        onOpenStateChange(newState);
      }
    }
  }, [disabled, isOpen, onOpenStateChange]);

  const handleSelect = useCallback(
    (item: DropdownItem) => {
      onSelect(item);
      setIsOpen(false);
      if (onOpenStateChange) {
        onOpenStateChange(false);
      }
    },
    [onSelect, onOpenStateChange],
  );

  const isItemSelected = useCallback(
    (item: DropdownItem) => {
      if (!selectedItem) return false;

      const itemId = getItemId(item);
      const selectedId = getItemId(selectedItem);

      return itemId === selectedId;
    },
    [selectedItem],
  );

  const renderDropdownContent = () => {
    const dropdownStyles = [
      styles.dropdownModal,
      variant === 'simple' && styles.simpleDropdown,
      variant === 'default' && styles.defaultDropdown,
      variant === 'filter' && styles.filterDropdown,
      dropdownStyle,
    ];

    const renderListItem: ListRenderItem<DropdownItem> = ({ item }) => {
      if (renderItem) {
        return renderItem(item, isItemSelected(item), handleSelect);
      }
      return (
        <DropdownItem
          item={item}
          isSelected={isItemSelected(item)}
          onSelect={handleSelect}
          variant={variant}
          colors={colors}
          showIcons={showIcons}
          iconSize={iconSize}
          itemStyle={itemStyle}
        />
      );
    };

    return (
      <View style={dropdownStyles}>
        {data.length === 0 ? (
          <Text
            textStyle="bold12"
            style={{ alignSelf: 'center', marginVertical: 20 }}>
            No data available
          </Text>
        ) : (
          <FlatList
            data={data}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ marginHorizontal: 5 }}
            renderItem={renderListItem}
            keyExtractor={item => getItemId(item)}
            bounces={false}
            nestedScrollEnabled={true}
          />
        )}
      </View>
    );
  };

  const modalContentStyle = {
    position: 'absolute',
    top: headerLayout.y + headerLayout.height,
    left: headerLayout.x,
    width: headerLayout.width,
    maxHeight: 300,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && variant !== 'filter' && (
        <Text textStyle={labelStyle} color={labelColor}>
          {label}
        </Text>
      )}
      <View ref={headerRef}>
        <Pressable
          disabled={disabled}
          onPress={toggleDropdown}
          accessibilityRole="button">
          {renderHeader ? (
            renderHeader(selectedItem, isOpen)
          ) : (
            <DropdownHeader
              variant={variant}
              item={selectedItem}
              isOpen={isOpen}
              colors={colors}
              placeholder={placeholder}
              showIcons={showIcons}
              iconSize={iconSize}
              style={headerStyle}
              disabled={disabled}
            />
          )}
        </Pressable>
      </View>

      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={() => {
          setIsOpen(false);
          if (onOpenStateChange) {
            onOpenStateChange(false);
          }
        }}>
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => {
            setIsOpen(false);
            if (onOpenStateChange) {
              onOpenStateChange(false);
            }
          }}>
          <Pressable
            style={[
              modalContentStyle,
              variant === 'filter' && styles.filterModalContent
            ]}
            onPress={e => e.stopPropagation()}>
            {renderDropdownContent()}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'white',
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    marginRight: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    paddingRight: 15,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  },
  filterModalContent: {
    width: 150,
  },
  dropdownModal: {
    width: '100%',
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10
  },
  defaultDropdown: {
    borderWidth: 0,
    paddingHorizontal: 4,
    shadowRadius: 4,
    elevation: 5,
    padding: 4,
  },
  simpleDropdown: {
    shadowOpacity: 0.08,
    elevation: 5,
    borderColor: 'white',
    padding: 4,
  },
  filterDropdown: {
    shadowOpacity: 0.05,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    borderRadius: 8,
  },
  simpleItem: {
    paddingHorizontal: 16,
    paddingVertical: 2,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 100,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterItem: {
    paddingHorizontal: 16,
    paddingVertical: 2,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 100,
  },
});

export default React.memo(Dropdown);