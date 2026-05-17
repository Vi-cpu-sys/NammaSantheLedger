import React, {
  useState,
  useCallback,
  useContext,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  useFocusEffect,
} from "@react-navigation/native";

import {
  ThemeContext,
} from "../context/ThemeContext";

export default function ReportScreen() {

  const { theme } =
    useContext(ThemeContext);

  const [income,
    setIncome] =
    useState(0);

  const [expense,
    setExpense] =
    useState(0);

  const [balance,
    setBalance] =
    useState(0);

  const [transactions,
    setTransactions] =
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

        calculateTotals(parsed);
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

      setTransactions(data.length);
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

      {/* TITLE */}

      <Text
        style={[
          styles.title,
          {
            color:
              theme.colors.primary,
          },
        ]}
      >
        Monthly Report
      </Text>

      {/* INCOME */}

      <View
        style={[
          styles.card,
          {
            backgroundColor:
              "#4CAF50",
          },
        ]}
      >

        <Text style={styles.cardTitle}>
          Total Income
        </Text>

        <Text style={styles.cardValue}>
          ₹ {income}
        </Text>

      </View>

      {/* EXPENSE */}

      <View
        style={[
          styles.card,
          {
            backgroundColor:
              "#F44336",
          },
        ]}
      >

        <Text style={styles.cardTitle}>
          Total Expense
        </Text>

        <Text style={styles.cardValue}>
          ₹ {expense}
        </Text>

      </View>

      {/* BALANCE */}

      <View
        style={[
          styles.card,
          {
            backgroundColor:
              "#1565C0",
          },
        ]}
      >

        <Text style={styles.cardTitle}>
          Net Savings
        </Text>

        <Text style={styles.cardValue}>
          ₹ {balance}
        </Text>

      </View>

      {/* TRANSACTIONS */}

      <View
        style={[
          styles.card,
          {
            backgroundColor:
              "#9C27B0",
          },
        ]}
      >

        <Text style={styles.cardTitle}>
          Total Transactions
        </Text>

        <Text style={styles.cardValue}>
          {transactions}
        </Text>

      </View>

      {/* INSIGHTS */}

      <View
        style={[
          styles.insightCard,
          {
            backgroundColor:
              theme.colors.card,
          },
        ]}
      >

        <Text
          style={[
            styles.insightTitle,
            {
              color:
                theme.colors.text,
            },
          ]}
        >
          Financial Insights
        </Text>

        <Text
          style={[
            styles.insightText,
            {
              color:
                theme.colors.text,
            },
          ]}
        >
          • Monitor business growth
        </Text>

        <Text
          style={[
            styles.insightText,
            {
              color:
                theme.colors.text,
            },
          ]}
        >
          • Analyze monthly expenses
        </Text>

        <Text
          style={[
            styles.insightText,
            {
              color:
                theme.colors.text,
            },
          ]}
        >
          • Improve savings strategy
        </Text>

        <Text
          style={[
            styles.insightText,
            {
              color:
                theme.colors.text,
            },
          ]}
        >
          • Maintain financial stability
        </Text>

      </View>

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
    textAlign: "center",
    marginTop: 20,
    marginBottom: 25,
  },

  card: {
    padding: 25,
    borderRadius: 20,
    marginBottom: 20,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 20,
  },

  cardValue: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 10,
  },

  insightCard: {
    padding: 25,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 30,
  },

  insightTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  insightText: {
    fontSize: 17,
    marginBottom: 12,
  },

});