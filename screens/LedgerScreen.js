import React, {
  useState,
  useEffect,
  useContext,
} from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemeContext } from "../context/ThemeContext";

export default function LedgerScreen() {
  const { theme } = useContext(ThemeContext);

  // FORM
  const [vendorName, setVendorName] = useState("");
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");

  const [type, setType] = useState("Income");
  const [itemType, setItemType] = useState("Vegetables");
  const [customerType, setCustomerType] = useState("Retail");

  const [ledgerData, setLedgerData] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("All");

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem("ledgerData");
      if (data) setLedgerData(JSON.parse(data));
    } catch (e) {
      console.log(e);
    }
  };

  const saveData = async (data) => {
    await AsyncStorage.setItem("ledgerData", JSON.stringify(data));
  };

  // ADD / UPDATE
  const addOrUpdateEntry = async () => {
    if (!vendorName || !amount) return;

    if (editId) {
      const updated = ledgerData.map((i) =>
        i.id === editId
          ? {
              ...i,
              vendorName,
              amount,
              phone,
              type,
              itemType,
              customerType,
            }
          : i
      );

      setLedgerData(updated);
      await saveData(updated);
      setEditId(null);
    } else {
      const newEntry = {
        id: Date.now().toString(),
        vendorName,
        amount,
        phone,
        type,
        itemType,
        customerType,
      };

      const updated = [newEntry, ...ledgerData];
      setLedgerData(updated);
      await saveData(updated);
    }

    setVendorName("");
    setAmount("");
    setPhone("");
    setType("Income");
    setItemType("Vegetables");
    setCustomerType("Retail");
  };

  // DELETE
  const deleteEntry = (id) => {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const filtered = ledgerData.filter((i) => i.id !== id);
          setLedgerData(filtered);
          await saveData(filtered);
        },
      },
    ]);
  };

  // EDIT
  const startEdit = (item) => {
    setVendorName(item.vendorName);
    setAmount(item.amount);
    setPhone(item.phone || "");
    setType(item.type);
    setItemType(item.itemType);
    setCustomerType(item.customerType);
    setEditId(item.id);
  };

  // WHATSAPP
  const sendWhatsApp = (phone, name, amount) => {
    if (!phone) return alert("Phone missing");

    const msg = `Hello ${name}, your pending amount is ₹${amount}`;

    const url = `whatsapp://send?phone=91${phone}&text=${encodeURIComponent(msg)}`;

    Linking.openURL(url).catch(() => {
      alert("WhatsApp not installed");
    });
  };

  const filteredData = ledgerData.filter((i) => {
    const matchSearch = i.vendorName
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchType =
      filterType === "All" ? true : i.type === filterType;

    return matchSearch && matchType;
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* TITLE */}
      <Text style={[styles.title, { color: theme.colors.primary }]}>
        Ledger Management
      </Text>

      {/* INPUTS */}
      <TextInput
        placeholder="Vendor Name"
        value={vendorName}
        onChangeText={setVendorName}
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
      />

      <TextInput
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
      />

      <TextInput
        placeholder="Phone Number"
        keyboardType="numeric"
        value={phone}
        onChangeText={setPhone}
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
      />

      {/* TYPE */}
      <View style={styles.row}>
        {["Income", "Expense"].map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setType(t)}
            style={[styles.typeBtn, { backgroundColor: type === t ? "#4CAF50" : "#777" }]}
          >
            <Text style={styles.txt}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ITEM TYPE (SCROLL FIXED) */}
      <Text style={{ color: theme.colors.text, marginTop: 10 }}>Item Type</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {["Vegetables", "Fruits", "Mixed"].map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setItemType(t)}
            style={[styles.scrollBtn, { backgroundColor: itemType === t ? "#4CAF50" : "#777" }]}
          >
            <Text style={styles.txt}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* CUSTOMER TYPE (SCROLL FIXED) */}
      <Text style={{ color: theme.colors.text, marginTop: 10 }}>Customer Type</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {["Retail", "Wholesale", "Hotel"].map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setCustomerType(t)}
            style={[styles.scrollBtn, { backgroundColor: customerType === t ? "#1565C0" : "#777" }]}
          >
            <Text style={styles.txt}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ADD BUTTON */}
      <TouchableOpacity style={styles.addBtn} onPress={addOrUpdateEntry}>
        <Text style={styles.txt}>{editId ? "Update" : "Add Entry"}</Text>
      </TouchableOpacity>

      {/* LIST */}
      <FlatList
        data={filteredData}
        scrollEnabled={false}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>

            <Text style={{ color: theme.colors.text, fontSize: 18 }}>
              {item.vendorName}
            </Text>

            <Text style={{ color: theme.colors.text }}>
              ₹{item.amount} | {item.type}
            </Text>

            <Text style={{ color: theme.colors.text }}>
              📱 {item.phone}
            </Text>

            {/* ACTION BUTTONS RESTORED */}
            <View style={styles.actionRow}>

              <TouchableOpacity onPress={() => startEdit(item)} style={[styles.actionBtn, { backgroundColor: "#1565C0" }]}>
                <Text style={styles.txt}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteEntry(item.id)} style={[styles.actionBtn, { backgroundColor: "#F44336" }]}>
                <Text style={styles.txt}>Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => sendWhatsApp(item.phone, item.vendorName, item.amount)} style={[styles.actionBtn, { backgroundColor: "#25D366" }]}>
                <Text style={styles.txt}>WhatsApp</Text>
              </TouchableOpacity>

            </View>

          </View>
        )}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  title: { fontSize: 30, fontWeight: "bold", marginBottom: 20 },

  input: { padding: 15, borderRadius: 15, marginBottom: 10 },

  row: { flexDirection: "row", justifyContent: "space-between" },

  typeBtn: { width: "48%", padding: 12, borderRadius: 12, alignItems: "center" },

  scrollBtn: { padding: 12, borderRadius: 20, marginRight: 10, marginTop: 10 },

  addBtn: { backgroundColor: "#1565C0", padding: 18, borderRadius: 15, marginTop: 15, alignItems: "center" },

  txt: { color: "#fff", fontWeight: "bold" },

  card: { padding: 15, borderRadius: 15, marginTop: 15 },

  actionRow: { flexDirection: "row", marginTop: 10 },

  actionBtn: { flex: 1, marginHorizontal: 3, padding: 10, borderRadius: 10, alignItems: "center" },
});