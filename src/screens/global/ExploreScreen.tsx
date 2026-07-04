import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
} from "react-native";

type Room = {
  id: string;
  name: string;
  description?: string;
  membersCount?: number;
  avatarUrl?: string;
};

export const ExploreScreen = ({ navigation }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true);

        // mock data (nanti bisa diganti API Matrix / backend)
        const data: Room[] = [
          {
            id: "1",
            name: "Tech Community",
            description: "Discuss software engineering & system design",
            membersCount: 1200,
            avatarUrl: "https://i.pravatar.cc/150?img=10",
          },
          {
            id: "2",
            name: "AI Research",
            description: "Machine learning and AI discussions",
            membersCount: 540,
            avatarUrl: "https://i.pravatar.cc/150?img=12",
          },
          {
            id: "3",
            name: "Startup Space",
            description: "Build and scale products",
            membersCount: 890,
            avatarUrl: "https://i.pravatar.cc/150?img=15",
          },
        ];

        setRooms(data);
      } catch (err) {
        console.log("Explore load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: Room }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation?.navigate("RoomDetail", { roomId: item.id })
        }
      >
        <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />

        <View style={styles.content}>
          <Text style={styles.title}>{item.name}</Text>

          <Text style={styles.desc} numberOfLines={2}>
            {item.description}
          </Text>

          <Text style={styles.meta}>
            {item.membersCount ?? 0} members
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Explore Spaces</Text>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search rooms..."
        placeholderTextColor="#888"
        style={styles.search}
      />

      <FlatList
        data={filteredRooms}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
    padding: 16,
  },

  header: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111",
    marginBottom: 12,
  },

  search: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(10, 10, 10, 0.08)"
  },

  list: {
    paddingBottom: 20,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",

    borderWidth: 1,
    borderColor: "rgba(10, 10, 10, 0.08)"
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },

  content: {
    flex: 1,
  },

  title: {
    color: "#111",
    fontSize: 16,
    fontWeight: "600",
  },

  desc: {
    color: "#555",
    fontSize: 13,
    marginTop: 2,
  },

  meta: {
    color: "#777",
    fontSize: 12,
    marginTop: 4,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
