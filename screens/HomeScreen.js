import React, {
  useState,
  useContext,
  useCallback,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  useFocusEffect,
} from "@react-navigation/native";

import {
  ThemeContext,
} from "../context/ThemeContext";

export default function HomeScreen() {

  const { theme } =
    useContext(ThemeContext);

  const [ledgerData,
    setLedgerData] =
    useState([]);

  const [income,
    setIncome] =
    useState(0);

  const [expense,
    setExpense] =
    useState(0);

  const [balance,
    setBalance] =
    useState(0);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {

    try {

      const data =
        await AsyncStorage.getItem(
          "ledgerData"
        );

      if (data) {

        const parsed =
          JSON.parse(data);

        setLedgerData(parsed);

        calculateTotals(parsed);

      } else {

        setLedgerData([]);
      }

    } catch (error) {

      console.log(error);
    }
  };

  const calculateTotals =
    (data) => {

      let totalIncome = 0;

      let totalExpense = 0;

      data.forEach((item) => {

        const amount =
          Number(item.amount);

        if (
          item.type === "Income"
        ) {

          totalIncome += amount;

        } else {

          totalExpense += amount;
        }
      });

      setIncome(totalIncome);

      setExpense(totalExpense);

      setBalance(
        totalIncome - totalExpense
      );
    };

  return (

    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor:
            theme.colors.background,
        },
      ]}
    >

      <Text
        style={[
          styles.title,
          {
            color:
              theme.colors.primary,
          },
        ]}
      >
        Namma Santhe Ledger
      </Text>

      {/* TOTALS */}

      <View style={styles.row}>

        <View
          style={[
            styles.card,
            {
              backgroundColor:
                "#4CAF50",
            },
          ]}
        >

          <Text style={styles.cardText}>
            Income
          </Text>

          <Text style={styles.cardValue}>
            ₹ {income}
          </Text>

        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor:
                "#F44336",
            },
          ]}
        >

          <Text style={styles.cardText}>
            Expense
          </Text>

          <Text style={styles.cardValue}>
            ₹ {expense}
          </Text>

        </View>

      </View>

      {/* BALANCE */}

      <View style={styles.balanceCard}>

        <Text style={styles.balanceTitle}>
          Current Balance
        </Text>

        <Text style={styles.balanceValue}>
          ₹ {balance}
        </Text>

      </View>

      {/* RECENT */}

      <Text
        style={[
          styles.sectionTitle,
          {
            color:
              theme.colors.text,
          },
        ]}
      >
        Recent Transactions
      </Text>

      <FlatList
        data={ledgerData}

        keyExtractor={(item) =>
          item.id
        }

        scrollEnabled={false}

        ListEmptyComponent={() => (

          <Text
            style={{
              color:
                theme.colors.text,

              textAlign: "center",

              marginTop: 20,
            }}
          >
            No Transactions Found
          </Text>
        )}

        renderItem={({ item }) => (

          <View
            style={[
              styles.itemCard,
              {
                backgroundColor:
                  theme.colors.card,
              },
            ]}
          >

            <View style={styles.itemRow}>

              <View>

                <Text
                  style={[
                    styles.vendor,
                    {
                      color:
                        theme.colors.text,
                    },
                  ]}
                >
                  {item.vendorName}
                </Text>

                <Text
                  style={{
                    color:
                      theme.colors.text,
                  }}
                >
                  {item.category}
                </Text>

              </View>

              <Text
                style={[
                  styles.amount,
                  {
                    color:
                      item.type ===
                      "Income"
                        ? "#4CAF50"
                        : "#F44336",
                  },
                ]}
              >
                ₹ {item.amount}
              </Text>

            </View>

          </View>
        )}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 25,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    padding: 20,
    borderRadius: 20,
  },

  cardText: {
    color: "#fff",
    fontSize: 18,
  },

  cardValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
  },

  balanceCard: {
    backgroundColor: "#1565C0",
    marginTop: 20,
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
  },

  balanceTitle: {
    color: "#fff",
    fontSize: 20,
  },

  balanceValue: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "bold",
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 15,
  },

  itemCard: {
    padding: 18,
    borderRadius: 18,
    marginBottom: 15,
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  vendor: {
    fontSize: 18,
    fontWeight: "bold",
  },

  amount: {
    fontSize: 20,
    fontWeight: "bold",
  },

});