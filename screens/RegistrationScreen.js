import React from "react";
import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import Toast from "react-native-toast-message";
import axios from "axios";

export default function RegistrationScreen({ navigation }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    permanentAddress: "",

    companyName: "",
    companyAddress: "",
    website: "",
    currentSalary: "",
    targetSalary: "",
  });
  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "Registration Successful",
      text2: "Welcome",
    });
  };
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      style={{ height: 500 }}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/usk-img.png")}
          style={styles.logoImage}
        />
      </View>

      <Text style={styles.title}>Registration</Text>

      <View style={styles.form}>
        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First name</Text>
            <TextInput style={styles.input} placeholder="" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last name</Text>
            <TextInput style={styles.input} placeholder="" />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Your email"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth</Text>
          <TextInput style={styles.input} placeholder="(DD/MM/YYYY)" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Permanent address</Text>
          <TextInput style={styles.input} placeholder="Type here" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            {/* <CheckBox
        value={toggleCheckBox}
        onValueChange={(newValue) => setToggleCheckBox(newValue)}
      /> */}
            Permanent address is same as present address
          </Text>

          <TextInput style={styles.input} placeholder="Permanet address" />
        </View>

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Work experience (in years)</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Education</Text>
            <TextInput style={styles.input} placeholder="" />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Educational certificate</Text>
          <TextInput
            style={styles.input}
            placeholder="Upload your educational certificate here"
          />
        </View>

        <Text style={styles.subTitle}>
          <Image source={require("../assets/Line.png")} style={styles.line} />{" "}
          Company details{" "}
          <Image source={require("../assets/Line.png")} style={styles.line} />
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Company name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your company name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Company address</Text>
          <TextInput style={styles.input} placeholder="Type here" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Website</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your company website"
          />
        </View>

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current salary</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Target salary</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              keyboardType="numeric"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            showToast();
            setTimeout(async () => {
              navigation.navigate("KYC Verification");
            }, 1000);
          }}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        {/* <Button
          title="Continue"
          onPress={() => navigation.navigate("KYC Verification")}
        /> */}
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
  logoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    marginBottom: 20,
  },
  form: {
    flex: 1,
    backgroundColor: "#1C9D5B",
    borderRadius: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    // paddingLeft: 10,
    // paddingRight: 10,
    paddingTop: 15,
  },
  line: {
    width: 60,
    marginBottom: 4,
    height: 2,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 15,

    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#FFFFFF",
  },
  input: {
    height: 50,
    borderColor: "#cccccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
    color: "#6B6B6B",
  },

  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    color: "#FFFFFF",
    marginTop: 30,
  },
  button: {
    height: 50,
    borderColor: "#cccccc",
    borderWidth: 1,
    borderRadius: 5,
    // paddingHorizontal: 10,
    backgroundColor: "#003E1E",
    color: "#6B6B6B",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 30,
    marginTop: 30,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
