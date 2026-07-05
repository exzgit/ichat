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

import { Client, initClient } from "./src/services/api";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const autoLogin = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("access_token");
        const refreshToken = await AsyncStorage.getItem("refresh_token");
        const deviceId = await AsyncStorage.getItem("device_id");
        const userId = await AsyncStorage.getItem("user_id");

        const client = initClient(accessToken, deviceId, userId);

        try {
          await client.whoami();
          setIsLoggedIn(true);
          client.startClient();
        } catch (err) {
          if (refreshToken) {
            const res = await client.refreshToken(refreshToken);

            await AsyncStorage.setItem("access_token", res.access_token);
            await AsyncStorage.setItem("refresh_token", res.refresh_token);

            client.setAccessToken(res.access_token);

            setIsLoggedIn(true);
            client.startClient();
          } else {
            throw err;
          }
        }
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
