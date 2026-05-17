import React, {
  createContext,
  useState,
} from "react";

export const ThemeContext =
  createContext();

const lightTheme = {

  colors: {

    background: "#F5F5F5",

    card: "#FFFFFF",

    text: "#000000",

    primary: "#2E7D32",
  },
};

const darkTheme = {

  colors: {

    background: "#121212",

    card: "#1E1E1E",

    text: "#FFFFFF",

    primary: "#4CAF50",
  },
};

export const ThemeProvider =
  ({ children }) => {

    const [darkMode,
      setDarkMode] =
      useState(false);

    const toggleTheme = () => {
      setDarkMode(!darkMode);
    };

    const theme =
      darkMode
        ? darkTheme
        : lightTheme;

    return (

      <ThemeContext.Provider
        value={{
          darkMode,
          toggleTheme,
          theme,
        }}
      >

        {children}

      </ThemeContext.Provider>
    );
};