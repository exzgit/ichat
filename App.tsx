import 'react-native-get-random-values';
import { StatusBar } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AuthNavigator from "./src/navigation/AuthNavigator";
import MainNavigator from "./src/navigation/MainNavigator";
import { LoadingScreen } from "./src/screens/LoadingScreen";

import { Client } from "./src/services/api";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const autoLogin = async () => {
      try {
        const client = Client();
        const res = await client.whoami();
        setIsLoggedIn(res.ok);
      } catch (err) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    autoLogin();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#FFF"
        />

        {isLoading ? (
          <LoadingScreen/>
        ) : isLoggedIn ? (
          <MainNavigator onLogout={() => setIsLoggedIn(false)}/>
        ) : (
          <AuthNavigator onLogin={() => setIsLoggedIn(true)}/>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
