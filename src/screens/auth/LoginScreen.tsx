import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Eye, EyeClosed } from "lucide-react-native";

import { Client, initClient } from "../../services/api";

export default function LoginScreen({ navigation, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    initClient();

    if (!username || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      const formattedUser = username.startsWith("@")
        ? username
        : `@${username}`;
      const finalFormattedUser = formattedUser.endsWith(":matrix.org")
        ? formattedUser
        : `${formattedUser}:matrix.org`;

      const client = Client();
      const res = await client.login("m.login.password", {
        user: finalFormattedUser, 
        password: password 
      });

      client.startClient();

      if (res.access_token) {
        await AsyncStorage.setItem("access_token", res.access_token);
        await AsyncStorage.setItem("user_id", res.user_id);
        await AsyncStorage.setItem("device_id", res.device_id);

        onLogin();
      }
    } catch (err) {
      const errorMessage = err?.message;
      Alert.alert("Login Failed", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("../../assets/IChat.png")} style={styles.icon} />
        <Text style={styles.title}>I-Chat</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Username"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eye}
        >
          {showPassword ? (
            <Eye size={18} color="#666" />
          ) : (
            <EyeClosed size={18} color="#666" />
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("ForgotPassword")}
      >
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Create account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    justifyContent: "center",
    padding: 24,
  },

  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#008DF1",
  },

  icon: {
    width: 36,
    height: 36,
    marginRight: 10,
    resizeMode: "contain",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    color: "#111",
  },

  eye: {
    paddingLeft: 8,
  },

  forgot: {
    textAlign: "right",
    color: "#008DF1",
    fontSize: 13,
    marginBottom: 16,
  },

  button: {
    backgroundColor: "#008DF1",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 15,
  },

  link: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
});
