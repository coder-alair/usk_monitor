import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker"; // Import Picker
import { HttpClient } from "../server/http";

export default function LoginScreen({ navigation }) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CMA"); // State for the dropdown
  const [isLoading, setIsLoading] = useState(false);

  const storeUserData = async (userData) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Error storing user data:", error);
    }
  };
  const retrieveUserData = async () => {
    try {
      const saveduserDataString = await AsyncStorage.getItem("user");
      if (saveduserDataString) {
        const saveduserData = JSON.parse(saveduserDataString);
        console.log("Retrieved user data:", saveduserData);
        navigation.navigate("Admin Hierarchy");
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  };
  useEffect(() => {
    retrieveUserData();
  }, []);

  const login = async () => {
    setIsLoading(true);
    console.log(mobileNumber, password);

    try {
      if (!mobileNumber || !password) {
        setIsLoading(false);
        return Toast.show({
          type: "error",
          text1: "Error Message!",
          text2: "Please enter both mobile number and password.",
        });
      }

      if (mobileNumber.length !== 10) {
        setIsLoading(false);
        return Toast.show({
          type: "error",
          text1: "Error Message!",
          text2: "Mobile Number must be 10 digits.",
        });
      }

      const { user, message } = await HttpClient.post("/auth/login", {
        email: mobileNumber,
        password,
        role,
      });

      await storeUserData(user);
      // if (role !== returnedRole) {
      //   setIsLoading(false);
      //   return Toast.show({
      //     type: "error",
      //     text1: "Error Message!",
      //     text2: "Please enter correct role.",
      //   });
      // }

      Toast.show({
        type: "success",
        text1: message,
      });

      navigation.navigate("Admin Hierarchy");
      setMobileNumber("");
      setPassword("");
    } catch (error) {
      setIsLoading(false);
      console.error(error); // Log the error for debugging
      Toast.show({
        type: "error",
        text1: "Error Message!",
        text2: error?.response?.data?.message || "Something went wrong!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      style={{ height: 500 }}
    >
      <View style={styles.container}>
        <Image source={require("../assets/usk-img.png")} style={styles.logo} />
        <View style={styles.header}>
          <Text style={styles.title}>Login</Text>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontWeight: "400",
                fontSize: 24,
                textAlign: "center",
                marginLeft: 40,
              }}
            >
              as
            </Text>
            <Picker
              selectedValue={role}
              onValueChange={(itemValue) => setRole(itemValue)}
              style={styles.dropdown}
            >
              <Picker.Item label="CMA" value="CMA" />
              <Picker.Item label="Country admin" value="country_admin" />
              <Picker.Item label="State admin" value="state_admin" />
              <Picker.Item label="District admin" value="district_admin" />
              <Picker.Item
                label="District super admin"
                value="district_super_admin"
              />
              <Picker.Item
                label="Distributor admin"
                value="distributor_admin"
              />
              <Picker.Item label="Block admin" value="block_admin" />
              <Picker.Item label="GPN admin" value="GPN_admin" />
            </Picker>
          </View>
        </View>

        <View>
          <Text style={styles.input_1}>Phone number or Email address</Text>
          <TextInput
            style={styles.input}
            value={mobileNumber}
            maxLength={10}
            onChangeText={(e) => setMobileNumber(e)}
            placeholder="Type here"
            keyboardType="numeric"
          />
        </View>

        <View>
          <Text style={styles.input_1}>
            Password
            <Text style={styles.link_pass}> Forgot Password?</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={password}
            maxLength={10}
            onChangeText={(e) => setPassword(e)}
            placeholder="Enter your password"
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={login}
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.linkText}>
          Don't have an account?
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("SignUp")}
          >
            Sign Up
          </Text>
        </Text>
        <Toast />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    color: "#000000",
    fontWeight: "600",
    marginRight: 55,
  },
  input: {
    marginTop: 5,
    padding: 10,
    marginBottom: 10,
    width: 300,
    backgroundColor: "#F3F3F3",
    borderRadius: 5,
  },
  linkText: {
    color: "#000000",
    marginTop: 20,
  },
  link: {
    color: "#047857",
    textDecorationLine: "underline",
    marginLeft: 5,
  },
  logo: {
    height: 250,
    width: 350,
    marginBottom: 40,
    resizeMode: "contain",
  },
  link_pass: {
    color: "#047857",
    paddingLeft: 10,
  },
  input_1: {
    fontWeight: "500",
    color: "#000000",
    fontSize: 15,
  },
  dropdown: {
    width: 150,
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#00562A",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
    width: 300,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
