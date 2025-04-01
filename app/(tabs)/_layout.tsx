import {StyleSheet} from 'react-native';
import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Index from '@/app/(tabs)';
import Profile from '@/app/(tabs)/profile';
import Explore from '@/app/(tabs)/explore';
import Saved from '@/app/(tabs)/saved';
import TabBarBottom from '@/components/Tabs/TabBarBottom';

const Tab = createBottomTabNavigator();

const _Layout = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => {
        return <TabBarBottom {...props} />;
      }}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={Index} />
      <Tab.Screen name="Explore" component={Explore} />
      <Tab.Screen name="Saved" component={Saved} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default _Layout;

const styles = StyleSheet.create({});
