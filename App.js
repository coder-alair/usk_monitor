// App.js
import React from "react";
import AppNavigator from "./navigation/AppNavigator";
import { UserProvider } from "./contexts/AuthContext";

export default function App() {
  return <UserProvider>
    <AppNavigator />
  </UserProvider>;
}
