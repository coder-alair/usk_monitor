import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { launchImageLibrary } from "react-native-image-picker"; // Import image picker
import { BACKEND_API_URL } from "../helper/constant";

export default function KYCVerificationScreen({ navigation }) {
  const [aadharNumber, setAadharNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [frontAadhar, setFrontAadhar] = useState(null); // State for front Aadhar image
  const [backAadhar, setBackAadhar] = useState(null); // State for back Aadhar image
  const [frontPan, setFrontPan] = useState(null); // State for front PAN image

  // Function to display Toast message
  const showToast = (type, text1, text2) => {
    Toast.show({
      type,
      text1,
      text2,
    });
  };

  // Function to select an image
  const selectImage = (setImageState) => {
    launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: true,
        maxWidth: 300,
        maxHeight: 300,
      },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorCode) {
          console.log("ImagePicker Error: ", response.errorCode);
        } else if (response.assets && response.assets.length > 0) {
          const image = response.assets[0];
          setImageState(image);
        }
      }
    );
  };

  // Function to handle KYC submission
  const handleSubmitKYC = async () => {
    navigation.navigate("Admin Hierarchy");
    if (
      !aadharNumber ||
      !panNumber ||
      !otp ||
      !frontAadhar ||
      !backAadhar ||
      !frontPan
    ) {
      return showToast(
        "error",
        "Error!",
        "Please fill all the required fields and upload images."
      );
    }

    setIsLoading(true);
    setTimeout(async () => {
      try {
        const response = await axios.post(
          `${BACKEND_API_URL}/api/auth/kyc`,
          {
            aadhar_card_number: aadharNumber,
            Pan_number: panNumber,
            Enter_OTP: otp,
            Front_side_of_adhaar: frontAadhar.uri, // Upload front Aadhar image
            Back_side_of_adhaar: backAadhar.uri, // Upload back Aadhar image
            Front_side_of_Pan: frontPan.uri, // Upload front PAN image
          }
        );

        if (response.status === 201) {
          showToast(
            "success",
            "KYC Verification Successful",
            "Your KYC has been stored."
          );
          // navigation.navigate("Admin Hierarchy");
        } else {
          showToast(
            "error",
            "Error!",
            "KYC submission failed. Please try again."
          );
        }
      } catch (error) {
        showToast("error", "Error!", error.message || "Something went wrong!");
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

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
        <Image source={require("../assets/kyc.png")} style={styles.kycLogo} />
      </View>

      <Text style={styles.title}>KYC Verification</Text>
      <Text style={styles.subtitle}>
        Please complete the KYC verification by providing your Aadhar and PAN
        numbers to ensure your identity is securely verified.
      </Text>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Aadhar card number</Text>
          <TextInput
            style={styles.input}
            placeholder="XXXX XXXX XXXX"
            keyboardType="numeric"
            value={aadharNumber}
            onChangeText={setAadharNumber}
          />
        </View>

        <View style={styles.uploadRow}>
          <View style={styles.uploadContainer}>
            {frontAadhar ? (
              <Image
                source={{ uri: frontAadhar.uri }}
                style={styles.uploadedImage}
              />
            ) : (
              <Image source={require("../assets/uploadBtn.png")} />
            )}
            <Text style={styles.uploadTitle}>Front side of your Aadhar</Text>
            <TouchableOpacity
              style={styles.chooseFileButton}
              onPress={() => selectImage(setFrontAadhar)}
            >
              <Text style={styles.chooseFileButtonText}>Choose a File</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.uploadContainer}>
            {backAadhar ? (
              <Image
                source={{ uri: backAadhar.uri }}
                style={styles.uploadedImage}
              />
            ) : (
              <Image source={require("../assets/uploadBtn.png")} />
            )}
            <Text style={styles.uploadTitle}>Back side of your Aadhar</Text>
            <TouchableOpacity
              style={styles.chooseFileButton}
              onPress={() => selectImage(setBackAadhar)}
            >
              <Text style={styles.chooseFileButtonText}>Choose a File</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>PAN number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your PAN number"
            value={panNumber}
            onChangeText={setPanNumber}
          />
        </View>

        <View style={styles.uploadContainer}>
          {frontPan ? (
            <Image
              source={{ uri: frontPan.uri }}
              style={styles.uploadedImage}
            />
          ) : (
            <Image source={require("../assets/uploadBtn.png")} />
          )}
          <Text style={styles.uploadTitle}>Front side of your PAN</Text>
          <TouchableOpacity
            style={styles.chooseFileButton}
            onPress={() => selectImage(setFrontPan)}
          >
            <Text style={styles.chooseFileButtonText}>Choose a File</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Enter OTP (sent to your registered Aadhar email and phone number)
          </Text>
          <View style={styles.otpRow}>
            <TextInput
              style={styles.otpInput}
              placeholder="Enter OTP here"
              keyboardType="numeric"
              value={otp}
              onChangeText={setOtp}
            />
            <TouchableOpacity style={styles.vrfyButton} onPress={() => {}}>
              <Text style={styles.vrfyButtonText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.resendText}>Resend</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmitKYC}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>
        <Toast />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: "#1C9D5B",
    padding: 16,
    borderRadius: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginLeft: 20,
    marginTop: 20,
    resizeMode: "contain",
  },
  logoContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  kycLogo: {
    alignSelf: "center",
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "400",
    textAlign: "center",
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "#6C6C6C",
  },
  uploadContainer: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: "400",
    marginBottom: 5,
  },
  chooseFileButton: {
    backgroundColor: "#00562A",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  chooseFileButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    borderColor: "#cccccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#F7F7F7",
    color: "#6B6B6B",
  },
  otpRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  otpInput: {
    borderColor: "#cccccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    flex: 1,
    backgroundColor: "#F7F7F7",
    color: "#6B6B6B",
  },
  vrfyButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#00562A",
    borderRadius: 5,
  },
  vrfyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resendText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    color: "#00562A",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#00562A",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
