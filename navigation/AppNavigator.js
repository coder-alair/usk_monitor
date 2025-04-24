import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "../screens/LoginScreen";
import RegistrationScreen from "../screens/RegistrationScreen";
import KYCVerificationScreen from "../screens/KYCVerificationScreen";
import AdminHierarchyScreen from "../screens/AdminHierarchyScreen";
import SignUpScreen from "../screens/SignUpScreen";
import DetailsScreen from "../screens/Details";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const handleLogout = async (navigation) => {
    try {
      await AsyncStorage.removeItem("user"); // Remove user data from AsyncStorage
      navigation.navigate("Login"); // Navigate back to the Login screen
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegistrationScreen} />
        <Stack.Screen
          name="KYC Verification"
          component={KYCVerificationScreen}
        />
        <Stack.Screen
          name="Admin Hierarchy"
          component={AdminHierarchyScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity
                onPress={() => handleLogout(navigation)}
                style={{ marginRight: 10 }}
              >
                <Text style={{ color: "red", fontWeight: "bold" }}>Logout</Text>
              </TouchableOpacity>
            ),
          })}
        />
         <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity
                onPress={() => handleLogout(navigation)}
                style={{ marginRight: 10 }}
              >
                <Text style={{ color: "red", fontWeight: "bold" }}>Logout</Text>
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
