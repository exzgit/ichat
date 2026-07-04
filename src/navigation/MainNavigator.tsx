import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { View, StyleSheet } from "react-native";

import { InboxListScreen } from "../screens/inbox/InboxScreen";
import { UserProfileScreen } from "../screens/profile/UserProfileScreen";
import { ExploreScreen } from "../screens/global/ExploreScreen";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

const Stack = createNativeStackNavigator();

import { useNavigation } from "@react-navigation/native";

export default function MainNavigator({ onLogout }) {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: "#EEE" }}>
      <Header
        title="IChat"
      />

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "none",
          animationDuration: 50,
        }}
      >
        <Stack.Screen name="Chat" component={InboxListScreen} />
        <Stack.Screen name="Explore" component={ExploreScreen} />
        <Stack.Screen name="Profile">
          {(props) => <UserProfileScreen {...props} onLogout={onLogout} />}
        </Stack.Screen>
      </Stack.Navigator>

      <Footer onChange={(tab) => navigation.navigate(tab)} />
    </View>
  );
}
