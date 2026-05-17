import React, { useContext } from "react";

import { NavigationContainer } from "@react-navigation/native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import AnalyticsScreen from "../screens/AnalyticsScreen";
import SettingsScreen from "../screens/SettingsScreen";

import { ThemeContext } from "../context/ThemeContext";
import LedgerScreen from "../screens/LedgerScreen";

const Tab = createBottomTabNavigator();

export default function Navigation() {

  const { theme } = useContext(ThemeContext);

  return (
    <NavigationContainer>

      <Tab.Navigator
        screenOptions={{
          headerShown: false,

          tabBarStyle: {
            backgroundColor: theme.colors.card,
          },

          tabBarActiveTintColor:
            theme.colors.primary,
        }}
      >

        <Tab.Screen
          name="Home"
          component={HomeScreen}
        />

        <Tab.Screen
          name="Ledger"
          component={LedgerScreen}
        />

        <Tab.Screen
          name="Analytics"
          component={AnalyticsScreen}
        />

        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
        />

      </Tab.Navigator>

    </NavigationContainer>
  );
}