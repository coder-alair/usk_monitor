import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";
import Toast from "react-native-toast-message";
import { HttpClient } from "../server/http";
import { BACKEND_API_URL } from "../helper/constant";
import RegisterValidations from "../helper/validations/registerValidations";

export default function RegistrationScreen({navigation}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    education: "",
    certificates: "",
    experience: "",
    permanentAddress: "",
    companyName: "",
    companyAddress: "",
    website: "",
    currentSalary: "",
    targetSalary: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const register = async () => {
    const { errors, isValid } = RegisterValidations(formData);
    setErrors(errors);

    if (!isValid) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: Object.values(errors)[0], // Show the first error
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await HttpClient.post(
        `${BACKEND_API_URL}/api/auth/register`,
        formData
      );

      console.log("here",response)
      if (response?.message?.includes("successfully")) {
        Toast.show({
          type: "success",
          text1: "Registration Successful",
        });
        console.log({navigation})
        navigation.navigate("Admin Hierarchy");
        return;
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Server Error",
        text2: error?.data?.message || "Something went wrong!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
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
              <TextInput
                style={styles.input}
                placeholder=""
                value={formData.firstName}
                onChangeText={(text) => handleInputChange("firstName", text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last name</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                value={formData.lastName}
                onChangeText={(text) => handleInputChange("lastName", text)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              placeholder="(DD/MM/YYYY)"
              value={formData.dob}
              onChangeText={(text) => handleInputChange("dob", text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Permanent address</Text>
            <TextInput
              style={styles.input}
              value={formData.permanentAddress}
              onChangeText={(text) => handleInputChange("permanentAddress", text)}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Work experience (in years)</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                value={formData.experience}
                onChangeText={(text) => handleInputChange("experience", text)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Education</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                value={formData.education}
                onChangeText={(text) => handleInputChange("education", text)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Educational certificate</Text>
            <TextInput
              style={styles.input}
              value={formData.certificates}
              onChangeText={(text) => handleInputChange("certificates", text)}
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
              value={formData.companyName}
              onChangeText={(text) => handleInputChange("companyName", text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company address</Text>
            <TextInput
              style={styles.input}
              value={formData.companyAddress}
              onChangeText={(text) => handleInputChange("companyAddress", text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Website</Text>
            <TextInput
              style={styles.input}
              value={formData.website}
              onChangeText={(text) => handleInputChange("website", text)}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current salary</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={formData.currentSalary}
                onChangeText={(text) => handleInputChange("currentSalary", text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Target salary</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={formData.targetSalary}
                onChangeText={(text) => handleInputChange("targetSalary", text)}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={register}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
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
    backgroundColor: "#1C9D5B",
    borderRadius: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    backgroundColor: "#003E1E",
    color: "#6B6B6B",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 30,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});