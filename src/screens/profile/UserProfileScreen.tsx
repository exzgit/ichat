import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LoadingScreen } from "../LoadingScreen";

import { mxcUrlToImageV1 } from "../../services/media";

import { Client } from "../../services/api";

const client = Client();

export const UserProfileScreen = ({ onLogout }) => {
  const [userProfileInfo, setUserProfileInfo ] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);

        const id = await client.getUserId();

        if (id) {
          const profile = await client.getProfileInfo(id);
          const avatar = await mxcUrlToImageV1(profile.avatar_url);
          setUserProfileInfo({
            user_id: id,
            avatar_url: avatar,
            display_name: profile.displayname
          });
        }
      } catch (err) {
        console.log(err);
        Alert.alert("Network Error", err?.errmsg || "Check your connection.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await client.logout(true);
      client.stopClient();

      await AsyncStorage.removeMany([
        "access_token",
        "device_id",
        "user_id",
      ]);

      onLogout();
    } catch (err) {
      const errorMessage = err?.message;
      Alert.alert("Logout Failed", errorMessage);
    }
  };

  if (isLoading) {
    return (<LoadingScreen />);
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `${userProfileInfo?.avatar_url}` }}
        style={styles.avatar}
      />

      <Text style={styles.name}>
        {userProfileInfo?.display_name ?? "No Name"}
      </Text>

      <Text style={styles.username}>
        {userProfileInfo?.user_id ?? "Unknown User"}
      </Text>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: "#FFF",
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 16,
    borderWidth: 0.5,
    backgroundColor: "#111",
    borderColor: "rgba(10, 10, 10, 0.05)",
  },

  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111",
  },

  username: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
  },

  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 24,
  },

  infoBox: {
    width: "100%",
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    color: "#8E8E93",
  },

  value: {
    fontSize: 15,
    color: "#111",
    marginTop: 2,
  },

  button: {
    marginTop: 30,
    width: "100%",
    backgroundColor: "#008DF1",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
