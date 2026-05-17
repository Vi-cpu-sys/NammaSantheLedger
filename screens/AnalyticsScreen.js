import React, { useEffect, useState, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PieChart } from "react-native-chart-kit";
import { ThemeContext } from "../context/ThemeContext";

const screenWidth = Dimensions.get("window").width;

export default function AnalyticsScreen() {
  const context = useContext(ThemeContext);

  const theme = context?.theme ?? {
    colors: {
      background: "#fff",
      text: "#000",
      primary: "#2E7D32",
      card: "#f5f5f5",
    },
  };

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem("ledgerData");
      if (data) calculate(JSON.parse(data));
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ CLEAN CALCULATION (NO CATEGORY)
  const calculate = (data) => {
    let totalIncome = 0;
    let totalExpense = 0;

    data.forEach((item) => {
      const amount = Number(item.amount);

      if (item.type === "Income") {
        totalIncome += amount;
      } else {
        totalExpense += amount;
      }
    });

    setIncome(totalIncome);
    setExpense(totalExpense);
  };

  // PIE DATA (ONLY INCOME / EXPENSE)
  const pieData = [
    {
      name: "Income",
      amount: income,
      color: "#4CAF50",
      legendFontColor: theme.colors.text,
      legendFontSize: 15,
    },
    {
      name: "Expense",
      amount: expense,
      color: "#F44336",
      legendFontColor: theme.colors.text,
      legendFontSize: 15,
    },
  ];

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      {/* TITLE */}
      <Text style={[styles.title, { color: theme.colors.primary }]}>
        Analytics Dashboard
      </Text>

      {/* SUMMARY CARDS */}
      <View style={styles.row}>
        <View style={[styles.card, { backgroundColor: "#4CAF50" }]}>
          <Text style={styles.cardTitle}>Income</Text>
          <Text style={styles.cardValue}>₹ {income}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#F44336" }]}>
          <Text style={styles.cardTitle}>Expense</Text>
          <Text style={styles.cardValue}>₹ {expense}</Text>
        </View>
      </View>

      {/* PIE CHART */}
      <View
        style={[
          styles.chartCard,
          { backgroundColor: theme.colors.card },
        ]}
      >
        <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
          Income vs Expense
        </Text>

        <PieChart
          data={pieData}
          width={screenWidth - 40}
          height={220}
          accessor={"amount"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
          chartConfig={{
            color: () => "#000",
          }}
        />
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

  cardTitle: {
    color: "#fff",
    fontSize: 18,
  },

  cardValue: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },

  chartCard: {
    marginTop: 25,
    padding: 20,
    borderRadius: 25,
    alignItems: "center",
  },

  chartTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
});