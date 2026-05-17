import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TransactionScreen() {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await AsyncStorage.getItem("ledgerData");
    setData(res ? JSON.parse(res) : []);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.vendorName}</Text>
            <Text>{item.type}</Text>
            <Text>₹ {item.amount}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
  name: { fontWeight: "bold", fontSize: 18 }
});