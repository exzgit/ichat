import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LoadingScreen } from "../LoadingScreen";
import { mxcUrlToImageV1 } from "../../services/media";

import { Client } from "../../services/api";

const client = Client();

export const InboxListScreen = () => {
  const [isLoading, setLoading] = useState(true);
  const [joinedRooms, setJoinedRooms] = useState([]);

  useEffect(() => {
    const getRooms = async () => {
      try {
        const directRoomsContent = await client.getAccountData("m.direct")?.getContent() || {};
        const directRooms = Object.entries(directRoomsContent).flatMap(
          ([userId, roomIds]) => {
            return roomIds.map(async (roomId) => {
              const room = await client.getRoom(roomId);

              const user_profile = await client.getProfileInfo(userId);
              const avatar = await mxcUrlToImageV1(user_profile?.avatar_url, 64, 64, "scale");
              const displayname = user_profile?.displayname;
              return {
                roomId,
                room,
                userId,
                avatar,
                displayname
              };
            });
          }
        );

        const resolveJoinedRooms = await Promise.all(directRooms);
        setJoinedRooms(resolveJoinedRooms);
      } catch (err) {
        Alert.alert("Network Error", err?.errmsg || "Check your connection.");
      } finally {
        setLoading(false);
      }
    };

    getRooms();
  }, []);

  console.log(joinedRooms);

  if (isLoading) {
    return (<LoadingScreen/>);
  }

  const renderItem = ({ item, index }) => (
    <View style={styles.chatItem}>
      <Image
        source={{
          uri:
            item.avatar ||
            `https://i.pravatar.cc/150?img=${index}`,
        }}
        style={styles.avatar}
      />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.name}>
            {item.displayname}
          </Text>
          <Text style={styles.time}>
            {formatTime(item.timestamp)}
          </Text>
        </View>

        <Text
          style={styles.message}
          numberOfLines={1}
        >
        </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={joinedRooms}
      keyExtractor={(item) => item.room ? item.room.roomId : null}
      renderItem={renderItem}
    />
  );
};

// format timestamp → jam
const formatTime = (ts) => {
  if (!ts) return "";

  const date = new Date(ts);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: "row",
    padding: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(10, 10, 10, 0.08)",
  },
  content: {
    flex: 1,
    marginLeft: 12,
    borderBottomWidth: 0.2,
    borderColor: "#e2e2e2"
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontWeight: "600",
    fontSize: 16,
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
  message: {
    marginTop: 4,
    color: "#666",
  },
});
