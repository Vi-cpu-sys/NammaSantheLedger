import React, {
  useContext,
} from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Print from "expo-print";

import * as Sharing from "expo-sharing";

import {
  ThemeContext,
} from "../context/ThemeContext";

export default function SettingsScreen() {

  const {
    darkMode,
    toggleTheme,
    theme,
  } = useContext(ThemeContext);

  // EXPORT PDF

  const exportPDF = async () => {

    try {

      const data =
        await AsyncStorage.getItem(
          "ledgerData"
        );

      const parsedData =
        data
          ? JSON.parse(data)
          : [];

      let htmlContent = `

        <html>

        <body style="font-family: Arial; padding: 20px;">

        <h1>Namma Santhe Ledger Report</h1>

        <hr/>

      `;

      parsedData.forEach((item) => {

        htmlContent += `

          <div style="
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 10px;
          ">

            <h3>${item.vendorName}</h3>

            <p>Amount: ₹ ${item.amount}</p>

            <p>Type: ${item.type}</p>

            <p>Category: ${item.category}</p>

          </div>
        `;
      });

      htmlContent += `
        </body>
        </html>
      `;

      const { uri } =
        await Print.printToFileAsync({

          html: htmlContent,
        });

      await Sharing.shareAsync(uri);

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Error",
        "Failed to export PDF"
      );
    }
  };

  // CLEAR DATA

  const clearData = async () => {

    try {

      await AsyncStorage.removeItem(
        "ledgerData"
      );

      Alert.alert(
        "Success",
        "All ledger data cleared"
      );

    } catch (error) {

      console.log(error);
    }
  };

  return (

    <View
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
        Settings
      </Text>

      {/* DARK MODE */}

      <TouchableOpacity
        style={styles.button}
        onPress={toggleTheme}
      >

        <Text style={styles.buttonText}>

          {darkMode
            ? "☀️ Light Mode"
            : "🌙 Dark Mode"}

        </Text>

      </TouchableOpacity>

      {/* EXPORT PDF */}

      <TouchableOpacity
        style={styles.button}
        onPress={exportPDF}
      >

        <Text style={styles.buttonText}>
          📄 Export PDF
        </Text>

      </TouchableOpacity>

      {/* CLEAR DATA */}

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor:
              "#F44336",
          },
        ]}
        onPress={clearData}
      >

        <Text style={styles.buttonText}>
          🗑️ Clear Data
        </Text>

      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },

  button: {
    backgroundColor: "#2E7D32",
    padding: 18,
    borderRadius: 18,
    marginBottom: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

});