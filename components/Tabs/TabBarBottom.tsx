import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useLinkBuilder} from '@react-navigation/native';
import {Colors} from '@/libs/constants/colors';
import {PlatformPressable} from '@react-navigation/elements';
import Icon from '@expo/vector-icons/Ionicons';

const TabBarBottom = ({state, descriptors, navigation}: BottomTabBarProps) => {
  const {buildHref} = useLinkBuilder();
  return (
    <View className="flex flex-row justify-center items-center  w-full bg-black h-[90px]">
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label = (
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name
        ) as string;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const iconMap: Record<string, string> = {
          Home: isFocused ? 'home' : 'home-outline',
          Explore: isFocused ? 'tv' : 'tv-outline',
          Saved: isFocused ? 'bookmark' : 'bookmark-outline',
          Profile: isFocused ? 'person' : 'person-outline',
        };

        const nameIcon: any = iconMap[label] || '';

        return (
          <PlatformPressable
            className="flex justify-center items-center pb-6 pl-4 pr-4"
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{flex: 1}}
            key={index}
          >
            <Icon
              className="pb-[6px]"
              name={nameIcon}
              size={24}
              color={isFocused ? Colors.white : Colors.secondary}
            />
            <Text
              className={`${isFocused ? 'font-bold' : 'font-semibold'}`}
              style={{color: isFocused ? Colors.white : Colors.secondary}}
            >
              {label}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
};

export default TabBarBottom;

const styles = StyleSheet.create({});
