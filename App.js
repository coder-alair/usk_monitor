// App.js
import React from "react";
import AppNavigator from "./navigation/AppNavigator";
import { UserProvider } from "./contexts/AuthContext";
import { BACKEND_API_URL } from "./helper/constant";

export default function App() {
  console.log({BACKEND_API_URL});
  return <UserProvider>
    <AppNavigator />
  </UserProvider>;
}
