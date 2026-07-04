import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MessageCircle, Users, User, Search, Bell } from "lucide-react-native";

export const Footer = ({ onChange }) => {
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState("Chat");

  const handlePress = (key) => {
    setActive(key);
    onChange && onChange(key);
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => handlePress("Chat")} style={styles.item}>
          <MessageCircle size={22} color={active === "Chat" ? "#008DF1" : "#888"} />
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={() => handlePress("Room")} style={styles.item}>
          <Users size={22} color={active === "Room" ? "#008DF1" : "#888"} />
        </TouchableOpacity> */}

        <TouchableOpacity onPress={() => handlePress("Explore")} style={styles.item}>
          <Search size={22} color={active === "Explore" ? "#008DF1" : "#888"} />
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={() => handlePress("Notification")} style={styles.item}>
          <Bell size={22} color={active === "Notification" ? "#008DF1" : "#888"} />
        </TouchableOpacity> */}

        <TouchableOpacity onPress={() => handlePress("Profile")} style={styles.item}>
          <User size={22} color={active === "Profile" ? "#008DF1" : "#888"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  container: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  item: {
    padding: 4,
    alignItems: "center",
  },
  label: {
    fontSize: 11,
    color: "#888",
    marginTop: 4,
  },
  active: {
    color: "#008DF1",
  },
});
