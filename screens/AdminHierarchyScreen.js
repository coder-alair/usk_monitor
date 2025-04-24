import React, { useState, useEffect, useContext } from "react";
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
import { Avatar } from "react-native-elements";
import { Picker } from '@react-native-picker/picker';
import { UserContext } from "../contexts/AuthContext";
import { BACKEND_API_URL } from "../helper/constant";
import ShowComponent from "../helper/ShowComponent";
import { HttpClient } from "../server/http";

export default function AdminHierarchyScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [adminRoles, setAdminRoles] = useState([]);
  const [role, setRole] = useState("CMA");
  const [categoryValue, setCategoryValue] = useState("driver");
  const [stateValue, setStateValue] = useState("rajasthan");
  const [districtValue, setDistrictValue] = useState("jaipur");
  const [countryValue, setCountryValue] = useState("india");
  const [blockValue, setBlockValue] = useState("ambar");
  const [gpnValue, setGpnValue] = useState("achrol");
  const [villageName, setVillageName] = useState("achrol");
  const { currentUser } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");

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

  const generateReferralCode = () => {
    return Math.floor(10000000 + Math.random() * 900000).toString();
  };

  const [referralCode, setReferralCode] = useState(generateReferralCode());

  const category = [
    { label: "Driver", value: "driver" },
    { label: "Electrician", value: "electrician" },
  ];

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
  ];

  const villageData = [
    { label: "Achrol", value: "achrol" },
    { label: "Anoppura", value: "anoppura" },
  ];

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
      const userRole = currentUser?.role;
      const allowedRoles = roleHierarchy[userRole] || [];
      const filteredRoles = roles.filter((r) => allowedRoles.includes(r.value));
      setAdminRoles(filteredRoles);
      if (filteredRoles.length > 0) {
        setRole(filteredRoles[0].value);
      }
    }
  }, [currentUser?.role]);

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
      await HttpClient.post(`${BACKEND_API_URL}/api/auth/add-user`, {
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
      Toast.show({
        type: "error",
        text1: "Failed to add user. Please try again.",
      });
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
    <View style={styles.container}>
      {/* Header with Logo */}
      <View style={styles.headerContainer}>
        <Image
          source={require("../assets/usk-img.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Administrative Hierarchy</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Add User Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>Add User</Text>
        </TouchableOpacity>

        {/* Admin Info Card */}
        <View style={styles.adminCard}>
          <Avatar
            rounded
            size="medium"
            source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
            containerStyle={styles.avatar}
          />
          <View style={styles.adminInfo}>
            <Text style={styles.adminName}>
              {currentUser?.firstName || "Test"} {currentUser?.lastName || "User"}
            </Text>
            <Text style={styles.adminRole}>
              {currentUser?.role?.split('_').join(' ') || "Country Admin"}
            </Text>
            <Text style={styles.userCount}>Total Users: {users?.length || 0}</Text>
          </View>
        </View>

        {/* User Cards */}
        <ShowComponent condition={currentUser?.role !== "GPN_admin"}>
          {users?.length > 0 ? (
            users?.map((user, index) => (
              <View key={index} style={styles.userCard}>
                <View style={styles.userCardHeader}>
                  <Avatar
                    rounded
                    size="small"
                    source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
                  />
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>
                      {user?.firstName} {user?.lastName}
                    </Text>
                    <Text style={styles.userRole}>
                      {user?.role?.split('_').join(' ')}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.districtButton}
                  onPress={() => navigation.navigate("Details", { userId: user._id })}
                >
                  <Text style={styles.districtButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noUsersText}>No users available</Text>
          )}
        </ShowComponent>

        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => navigation.navigate("Details")}
        >
          <Text style={styles.detailsButtonText}>Check All User Details</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add User Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New User</Text>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.input}
                value={newUserEmail}
                onChangeText={setNewUserEmail}
                placeholder="Enter email"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Phone:</Text>
              <TextInput
                style={styles.input}
                value={newUserPhone}
                onChangeText={setNewUserPhone}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                maxLength={10}
              />

              <ShowComponent condition={currentUser?.role !== "GPN_admin"}>
                <Text style={styles.label}>Role:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={role}
                    onValueChange={setRole}
                    style={styles.picker}
                  >
                    {adminRoles.map((item, index) => (
                      <Picker.Item key={index} label={item.label} value={item.value} />
                    ))}
                  </Picker>
                </View>
              </ShowComponent>

              <ShowComponent condition={currentUser?.role === "CMA"}>
                <Text style={styles.label}>Country:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={countryValue}
                    onValueChange={setCountryValue}
                    style={styles.picker}
                  >
                    {countryData.map((item, index) => (
                      <Picker.Item key={index} label={item.label} value={item.value} />
                    ))}
                  </Picker>
                </View>
              </ShowComponent>

              <ShowComponent condition={currentUser?.role === "CMA"}>
                <Text style={styles.label}>Category:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={categoryValue}
                    onValueChange={setCategoryValue}
                    style={styles.picker}
                  >
                    {category.map((item, index) => (
                      <Picker.Item key={index} label={item.label} value={item.value} />
                    ))}
                  </Picker>
                </View>
              </ShowComponent>

              <ShowComponent condition={currentUser?.role === "country_admin"}>
                <Text style={styles.label}>State:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={stateValue}
                    onValueChange={setStateValue}
                    style={styles.picker}
                  >
                    {statesData.map((item, index) => (
                      <Picker.Item key={index} label={item.label} value={item.value} />
                    ))}
                  </Picker>
                </View>
              </ShowComponent>

              <ShowComponent condition={currentUser?.role === "state_admin"}>
                <Text style={styles.label}>District:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={districtValue}
                    onValueChange={setDistrictValue}
                    style={styles.picker}
                  >
                    {districtsData.map((item, index) => (
                      <Picker.Item key={index} label={item.label} value={item.value} />
                    ))}
                  </Picker>
                </View>
              </ShowComponent>

              <ShowComponent condition={currentUser?.role === "district_admin"}>
                <Text style={styles.label}>Block:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={blockValue}
                    onValueChange={setBlockValue}
                    style={styles.picker}
                  >
                    {blocksData.map((item, index) => (
                      <Picker.Item key={index} label={item.label} value={item.value} />
                    ))}
                  </Picker>
                </View>
              </ShowComponent>

              <ShowComponent condition={currentUser?.role === "block_admin"}>
                <Text style={styles.label}>Gram Panchayat:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={gpnValue}
                    onValueChange={setGpnValue}
                    style={styles.picker}
                  >
                    {GPNData.map((item, index) => (
                      <Picker.Item key={index} label={item.label} value={item.value} />
                    ))}
                  </Picker>
                </View>
              </ShowComponent>

              <ShowComponent condition={currentUser?.role === "gpn_admin"}>
                <Text style={styles.label}>Village Name:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={villageName}
                    onValueChange={setVillageName}
                    style={styles.picker}
                  >
                    {villageData.map((item, index) => (
                      <Picker.Item key={index} label={item.label} value={item.value} />
                    ))}
                  </Picker>
                </View>
              </ShowComponent>

              <Text style={styles.label}>Referral Code:</Text>
              <Text style={styles.referralCode}>{referralCode}</Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={handleAddTask}
                >
                  <Text style={styles.buttonText}>Add User</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logoImage: {
    width: 150,
    height: 80,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  adminCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  avatar: {
    marginRight: 16,
  },
  adminInfo: {
    flex: 1,
  },
  adminName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  adminRole: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  userCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  userCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  userRole: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  districtButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  districtButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noUsersText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  },
  detailsButton: {
    backgroundColor: '#607D8B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  detailsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 10,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalContent: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    backgroundColor: '#f9f9f9',
    paddingTop:8,
    paddingBottom:8,
  },
  referralCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginVertical: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});