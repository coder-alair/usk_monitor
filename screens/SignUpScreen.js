import React, { useState } from "react";
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
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import { HttpClient } from "../server/http";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, APP_ENV } from '@env';


export default function SignUpScreen({ navigation }) {
  const [firstName, setFirstName] = useState(""); // State for First Name
  const [lastName, setLastName] = useState(""); // State for Last Name
  const [mobileOrEmail, setMobileOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [role, setRole] = useState("CMA");
  const [isLoading, setIsLoading] = useState(false);

  const signUp = async () => {
    setIsLoading(true);
    try {
      if (!firstName || !lastName || !mobileOrEmail || !password) {
        setIsLoading(false);
        return Toast.show({
          type: "error",
          text1: "Error!",
          text2: "Please fill all the required fields.",
        });
      }

      if (!/^\d{10}$/.test(mobileOrEmail)) {
        setIsLoading(false);
        return Toast.show({
          type: "error",
          text1: "Error!",
          text2: "Mobile Number must be 10 digits or enter a valid email.",
        });
      }

      const { message, user } = await HttpClient.post(`${API_URL}/api/auth/admin-signup`, {
        firstName, // Include first name
        lastName, // Include last name
        email: mobileOrEmail,
        password,
        referralCode,
        role,
      });

      Toast.show({
        type: "success",
        text1: message,
        text2: "You have signed up successfully.",
      });

      // Clear input fields after successful signup
      setFirstName("");
      setLastName("");
      setMobileOrEmail("");
      setPassword("");
      setReferralCode("");
      await AsyncStorage.setItem("user", JSON.stringify(user));

      navigation.navigate("Register");
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error!",
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
          <Text style={styles.title}>Sign Up</Text>
          <View style={styles.rolePickerContainer}>
            <Text style={styles.rolePickerLabel}>as</Text>
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

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your first name"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your last name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone number or Email address</Text>
          <TextInput
            style={styles.input}
            maxLength={10}
            placeholder="Type here"
            value={mobileOrEmail}
            onChangeText={setMobileOrEmail}
            keyboardType="default"
          />
        </View>

        <View>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View>
          <Text style={styles.inputLabel}>Referral Code (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Referral code (if any)"
            value={referralCode}
            onChangeText={setReferralCode}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={signUp}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.linkText}>
          Already have an account?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("Login")}
          >
            Login
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
  inputContainer: {
    marginBottom: 10,
    flex: 1,
  },
  inputWrapper: {
    position: "relative",
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
  inputLabel: {
    fontWeight: "500",
    color: "#000000",
    fontSize: 15,
  },
  dropdown: {
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
    width: 150,
    marginLeft: 5,
    textAlign: "center",
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
  rolePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rolePickerLabel: {
    fontWeight: "400",
    fontSize: 24,
    textAlign: "center",
    marginLeft: 10,
  },
});
