// contexts/UserContext.js

import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const retrieveUserData = async () => {
    try {
      const savedUserDataString = await AsyncStorage.getItem("user");
      if (savedUserDataString) {
        const savedUserData = JSON.parse(savedUserDataString);
        setCurrentUser({ ...savedUserData, id: savedUserData?._id });
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    retrieveUserData();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
