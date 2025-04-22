import React, { useState, useEffect, useContext, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import Toast from "react-native-toast-message";
import { HttpClient } from "../server/http";
import { Avatar } from "react-native-elements";

import { Picker } from "react-native-web";
import { UserContext } from "../contexts/AuthContext";
import { BACKEND_API_URL } from "../helper/constant";
import ShowComponent from "../helper/ShowComponent";



export default function AdminHierarchyScreen() {
  const [users, setUsers] = useState([]);
  const [adminRoles, setAdminRoles] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [role, setRole] = useState("CMA"); // State for the dropdown
  const [categoryValue, setCategoryValue] = useState("driver"); // State for the dropdown
  const [stateValue, setStateValue] = useState("rajasthan"); // State for the dropdown
  const [districtValue, setDistrictValue] = useState("jaipur"); // State for the dropdown
  const [countryValue, setCountryValue] = useState("india"); // State for the dropdown
  const [blockValue, setBlockValue] = useState("ambar"); // State for the dropdown
  const [gpnValue, setGpnValue] = useState("achrol"); // State for the dropdown
  const [villageName, setVillageName] = useState("achrol"); // State for the dropdown
  const { currentUser, loading } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState(""); // New user email
  const [newUserPhone, setNewUserPhone] = useState(""); // New user phone

  const roleHierarchy = {
    CMA: ["country_admin"],
    country_admin: ["state_admin"],
    state_admin: ["district_admin"],
    district_admin: ["district_shop_admin", "distributor_admin"],
    district_shop_admin: ['block_admin'],
    distributor_admin: ['block_admin'],
    block_admin: ['gpn_admin'],
    gpn_admin: ['vendor'],
    vendor: [],
  };

  // Generate a random 6-digit referral code
  const generateReferralCode = () => {
    return Math.floor(10000000 + Math.random() * 900000).toString();
  };

  const category = [
    {
      label: "Driver", value: "driver"
    },
    {
      label: "Electrician", value: "electrician"
    },
  ]

  const countryData = [
    { label: "India", value: "india" },
  ];

  const statesData = [
    { label: "Rajasthan", value: "rajasthan" },
    { label: "Maharashtra", value: "maharashtra" },
    { label: "Uttar Pradesh", value: "uttar_pradesh" },
    { label: "Karnataka", value: "karnataka" },
  ];

  const districtsData = [
    { label: "Jaipur", value: "jaipur" },
    { label: "Jodhpur", value: "jodhpur" },
    { label: "Udaipur", value: "udaipur" },
    { label: "Kota", value: "kota" },
  ];

  const blocksData = [
    { label: "Ambar", value: "amber" },
    { label: "Andhi", value: "andhi" },
    { label: "Bassi", value: "bassi" },
    { label: "Chaksu", value: "chaksu" },
  ];

  const GPNData = [
    { label: "Achrol", value: "achrol_764576" },
    { label: "Akhepura", value: "akhepura" },
    { label: "Akedadoongar", value: "akedadoongar" },
    { label: "Bagwada", value: "bagwada" },
  ]

  const villageData = [
    { label: "Achrol", value: "achrol" },
    { label: "Anoppura", value: "anoppura" },
  ]

  const [referralCode, setReferralCode] = useState(generateReferralCode());

  const roles = [
    { label: "Country admin", value: "country_admin" },
    { label: "State admin", value: "state_admin" },
    { label: "District admin", value: "district_admin" },
    { label: "District shop admin", value: "district_shop_admin" },
    { label: "Distributor admin", value: "distributor_admin" },
    { label: "Block admin", value: "block_admin" },
    { label: "GPN admin", value: "gpn_admin" },
    { label: "Vendor", value: "vendor" },
  ];


  useEffect(() => {
    if (currentUser?.role) {
      console.log({ currentUser })
      const userRole = currentUser?.role;

      const allowedRoles = roleHierarchy[userRole] || [];

      const filteredRoles = roles.filter((r) => allowedRoles.includes(r.value));

      setAdminRoles(filteredRoles);
      setStates(statesData);
      setDistricts(districtsData);
      if (filteredRoles.length > 0) {
        setRole(filteredRoles[0].value);
      }
    }
  }, [currentUser?.role]);

  console.log({ role })

  const handleAddTask = async () => {
    if (!newUserEmail || !newUserPhone) {
      alert("Please enter both email and phone number.");
      return;
    }

    const allowedRoles = roleHierarchy[currentUser?.role] || [];
    if (!allowedRoles.includes(role)) {
      alert("You are not authorized to create a user with this role.");
      return;
    }

    try {
      const response = await HttpClient.post(`${BACKEND_API_URL}/api/auth/add-user`, {
        email: newUserEmail,
        phone: newUserPhone,
        referralCode,
        currentUserId: currentUser?._id,
        userType: role,
        category: categoryValue
      });
      Toast.show({
        type: "info",
        text1: "User added successfully",
      });
      setModalVisible(false);
      setNewUserEmail("");
      setNewUserPhone("");
      setReferralCode(generateReferralCode());
      getUsers();
    } catch (error) {
      console.log(error);
      alert("Failed to add user. Please try again.");
    }
  };

  const getUsers = async () => {
    try {
      const response = await HttpClient.get(
        `${BACKEND_API_URL}/api/auth/get-users/${currentUser._id}`
      );
      setUsers(response.users);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch users. Please try again.");
    }
  };

  useEffect(() => {
    if (currentUser && currentUser?._id) {
      getUsers();
    }
  }, [currentUser?._id]);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      style={{ height: 500, padding: 20 }}
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/usk-img.png")}
          style={styles.logoImage}
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Administrative Hierarchy</Text>
      </View>

      {/* Add Task Button */}
      <TouchableOpacity
        style={styles.smallAddTaskButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addTaskText}>Add User</Text>
      </TouchableOpacity>

      {/* Admin Info */}
      <View style={styles.adminInfo}>
        <Avatar
          rounded
          source={{
            uri: "https://randomuser.me/api/portraits/men/1.jpg",
          }}
        />
        <View style={styles.adminDetails}>
          <View style={styles.adminLeft}>
            <Text style={styles.adminName}>
              {currentUser?.firstName || "Test"}{" "}
              {currentUser?.lastName || "User"}
            </Text>
            <Text style={styles.adminRole}>
              {currentUser?.role || "Country Admin"}
            </Text>
          </View>
          <View style={styles.adminStates}>
            <Text>Total Users: {users?.length || 0}</Text>
            <Image source={require("../assets/dropdown.png")} />
          </View>
        </View>
      </View>

      {/* View All Button */}
      {/* <TouchableOpacity style={styles.viewAllButton}>
        <View style={styles.viewAllText}>
          <Text>View all state admins</Text>
        </View>
      </TouchableOpacity> */}

      {/* State Information */}
      <Text style={styles.stateText}>
        Your state: <Text style={{ fontWeight: "bold" }}>Rajasthan</Text>
      </Text>

      {/* Admin Cards */}
      {users?.length > 0 ? (
        users?.map((user, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <Image source={require("../assets/menu.png")} />
              <Image
                source={require("../assets/person2.png")}
                style={styles.adminCardImage}
              />
              <View style={styles.cardInfo}>
                <View style={styles.cardInfoLeft}>
                  <Text style={styles.cardName}>
                    {user?.firstName} {user?.lastName}
                  </Text>
                  <Text style={styles.cardRole}>{user?.role}</Text>
                </View>
                <View style={styles.cardDistricts}>
                  <Text>Total Districts: {user?.totalDistricts || 0}</Text>
                  <Image source={require("../assets/dropdown.png")} />
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.viewAllButton}>
              <View>
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  District admins
                </Text>
              </View>
            </TouchableOpacity>

            {/* GPN List */}
            <View style={styles.gpnList}>
              {user.gpnList?.map((gpn, index) => (
                <Text key={index} style={styles.gpnText}>
                  {gpn}
                </Text>
              ))}
            </View>
          </View>
        ))
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No users available.
        </Text>
      )}

      {/* Modal for Add Task */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add User Details</Text>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              {/* User Details Form */}
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.input}
                value={newUserEmail}
                onChangeText={(text) => setNewUserEmail(text)}
              />

              <Text style={styles.label}>Phone:</Text>
              <TextInput
                style={styles.input}
                value={newUserPhone}
                maxLength={10}
                onChangeText={(text) => setNewUserPhone(text)}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Role:</Text>
              <View style={{ flexDirection: "row" }}>
                <Picker
                  selectedValue={role}
                  onValueChange={(itemValue) => setRole(itemValue)}
                  style={styles.dropdown}
                >
                  {adminRoles.map((item, index) => (
                    <Picker.Item key={index} label={item.label} value={item.value} />
                  ))}
                </Picker>
              </View>

              <ShowComponent condition={currentUser?.role == "CMA"}>
                <Text style={styles.label}>Country:</Text>
                <View style={{ flexDirection: "row" }}>
                  <Picker
                    selectedValue={countryValue}
                    onValueChange={(itemValue) => setCountryValue(itemValue)}
                    style={styles.dropdown}
                  >
                    {countryData.map((item, index) => (
                      <Picker.Item key={index} label={item.label} value={item.value} />
                    ))}
                  </Picker>
                </View>
              </ShowComponent>

              <ShowComponent condition={currentUser?.role == "CMA"}>
                <Text style={styles.label}>Category:</Text>
                <View style={{ flexDirection: "row" }}>
                  <Picker
                    selectedValue={categoryValue}
                    onValueChange={(itemValue) => setCategoryValue(itemValue)}
                    style={styles.dropdown}
                  >
                    {category.map((item, index) => (
                      <Picker.Item key={index} label={item.label} value={item.value} />
                    ))}
                  </Picker>
                </View>
              </ShowComponent>

              <ShowComponent condition={currentUser?.role == "country_admin"}>
                <Text style={styles.label}>State:</Text>
                <View style={{ flexDirection: "row" }}>
                  <Picker
                    selectedValue={stateValue}
                    onValueChange={(itemValue) => setStateValue(itemValue)}
                    style={styles.dropdown}
                  >
                    {statesData.map((item, index) => (
                      <Picker.Item key={index} label={item.label} value={item.value} />
                    ))}
                  </Picker>
                </View>
              </ShowComponent>

              <ShowComponent condition={currentUser?.role == "state_admin"}>
                <Text style={styles.label}>District:</Text>
                <View style={{ flexDirection: "row" }}>
                  <Picker
                    selectedValue={districtValue}
                    onValueChange={(itemValue) => setDistrictValue(itemValue)}
                    style={styles.dropdown}
                  >
                    {districtsData.map((item, index) => (
                      <Picker.Item key={index} label={item.label} value={item.value} />
                    ))}
                  </Picker>
                </View>
              </ShowComponent>

              <ShowComponent condition={currentUser?.role == "district_admin"}>
                <Text style={styles.label}>Block:</Text>
                <View style={{ flexDirection: "row" }}>
                  <Picker
                    selectedValue={blockValue}
                    onValueChange={(itemValue) => setBlockValue(itemValue)}
                    style={styles.dropdown}
                  >
                    {blocksData.map((item, index) => (
                      <Picker.Item key={index} label={item.label} value={item.value} />
                    ))}
                  </Picker>
                </View>
              </ShowComponent>

              <ShowComponent condition={currentUser?.role == "block_admin"}>
                <Text style={styles.label}>Gram Panchayat:</Text>
                <View style={{ flexDirection: "row" }}>
                  <Picker
                    selectedValue={gpnValue}
                    onValueChange={(itemValue) => setGpnValue(itemValue)}
                    style={styles.dropdown}
                  >
                    {GPNData.map((item, index) => (
                      <Picker.Item key={index} label={item.label} value={item.value} />
                    ))}
                  </Picker>
                </View>
              </ShowComponent>

              <ShowComponent condition={currentUser?.role == "gpn_admin"}>
                <Text style={styles.label}>Village Name:</Text>
                <View style={{ flexDirection: "row" }}>
                  <Picker
                    selectedValue={villageName}
                    onValueChange={(itemValue) => setVillageName(itemValue)}
                    style={styles.dropdown}
                  >
                    {villageData.map((item, index) => (
                      <Picker.Item key={index} label={item.label} value={item.value} />
                    ))}
                  </Picker>
                </View>
              </ShowComponent>

              <Text style={styles.refer}>Referral Code:</Text>
              <Text style={styles.referralCode}>{referralCode}</Text>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddTask}
              >
                <Text style={styles.submitText}>Add User</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 50,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoImage: {
    width: 200,
    height: 150,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  smallAddTaskButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  addTaskText: {
    color: "white",
    fontSize: 16,
  },
  adminInfo: {
    flexDirection: "row",
    marginVertical: 20,
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
  },
  adminImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  adminDetails: {
    flex: 1,
    marginLeft: 10,
  },
  adminLeft: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  adminName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  adminRole: {
    color: "gray",
  },
  adminStates: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  viewAllText: {
    flexDirection: "row",
    alignItems: "center",
  },
  stateText: {
    marginVertical: 20,
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  adminCardImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  cardInfo: {
    flex: 1,
  },
  cardInfoLeft: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardName: {
    fontWeight: "bold",
  },
  cardRole: {
    color: "gray",
  },
  cardDistricts: {
    flexDirection: "row",
    alignItems: "center",
  },
  gpnList: {
    marginTop: 10,
  },
  gpnText: {
    color: "black",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    marginBottom: 10,
    fontWeight: "bold",
  },
  referralCode: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    color: "green",
    textAlign: "center",
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  dropdown: {
    width: "100%",
    marginBottom: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  submitText: {
    color: "white",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  closeText: {
    color: "white",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#FF5722",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    marginVertical: 10,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
  },
});
