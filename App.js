import React from "react";

import {
  NavigationContainer,
} from "@react-navigation/native";

import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import HomeScreen from "./screens/HomeScreen";

import LedgerScreen from "./screens/LedgerScreen";

import AnalyticsScreen from "./screens/AnalyticsScreen";

import ReportScreen from "./screens/ReportScreen";

import SettingsScreen from "./screens/SettingsScreen";

import {
  ThemeProvider,
} from "./context/ThemeContext";

const Tab =
  createBottomTabNavigator();

export default function App() {

  return (

    <ThemeProvider>

      <NavigationContainer>

        <Tab.Navigator
          screenOptions={{
            headerShown: false,
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
            name="Reports"
            component={ReportScreen}
          />

          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
          />

        </Tab.Navigator>

      </NavigationContainer>

    </ThemeProvider>
  );
}