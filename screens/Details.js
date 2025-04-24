import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Modal,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { HttpClient } from "../server/http";
import { Avatar } from "react-native-elements";
import { UserContext } from "../contexts/AuthContext";
import { BACKEND_API_URL } from "../helper/constant";
import ShowComponent from "../helper/ShowComponent";
import { Linking } from "react-native";


export default function DetailsScreen({ navigation }) {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const { currentUser } = useContext(UserContext);

    const getDrivers = async () => {
        setLoading(true);
        try {
            const response = await HttpClient.get(
                `${BACKEND_API_URL}/api/auth/get-drivers`
            );
            setDrivers(response?.data);
        } catch (error) {
            console.log(error);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to fetch drivers. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            getDrivers();
        }
    }, [currentUser]);

    const handleDriverSelect = (driver) => {
        setSelectedDriver(driver);
        setModalVisible(true);
    };

    // Function to render the availability status chip
    const renderAvailabilityChip = (isAvailable) => {
        return (
            <View
                style={[
                    styles.statusChip,
                    {
                        backgroundColor: isAvailable ? "#E0F7E6" : "#FFE0E0",
                    },
                ]}
            >
                <View
                    style={[
                        styles.statusDot,
                        { backgroundColor: isAvailable ? "#4CAF50" : "#F44336" },
                    ]}
                />
                <Text
                    style={[
                        styles.statusText,
                        { color: isAvailable ? "#1E8E3E" : "#D32F2F" },
                    ]}
                >
                    {isAvailable ? "Online" : "Offline"}
                </Text>
            </View>
        );
    };

    // Function to render star rating
    const renderRating = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FontAwesome key={i} name="star" size={16} color="#FFC107" />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<FontAwesome key={i} name="star-half-o" size={16} color="#FFC107" />);
            } else {
                stars.push(<FontAwesome key={i} name="star-o" size={16} color="#FFC107" />);
            }
        }

        return (
            <View style={styles.ratingContainer}>
                {stars}
                <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            </View>
        );
    };

    const handleCallDriver = (phoneNumber) => {
        const phoneUrl = `tel:${phoneNumber}`;
        Linking.canOpenURL(phoneUrl)
            .then(supported => {
                if (supported) {
                    return Linking.openURL(phoneUrl);
                } else {
                    Toast.show({
                        type: "error",
                        text1: "Error",
                        text2: "Phone calls are not supported on this device",
                    });
                }
            })
            .catch(error => {
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "Could not open phone app",
                });
                console.log(error);
            });
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Driver Details</Text>
                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={getDrivers}
                >
                    <MaterialIcons name="refresh" size={24} color="#007BFF" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <Text>Loading drivers...</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {drivers?.length > 0 ? (
                        drivers.map((driver) => (
                            <TouchableOpacity
                                key={driver._id}
                                style={styles.card}
                                onPress={() => handleDriverSelect(driver)}
                            >
                                <View style={styles.cardHeader}>
                                    <Avatar
                                        rounded
                                        size="medium"
                                        title={driver.fullName.charAt(0)}
                                        containerStyle={styles.avatar}
                                        source={driver.profilePhoto ? { uri: driver.profilePhoto } : null}
                                    />
                                    <View style={styles.driverInfo}>
                                        <Text style={styles.driverName}>{driver.fullName}</Text>
                                        <Text style={styles.driverEmail}>{driver.email}</Text>
                                    </View>
                                    {renderAvailabilityChip(driver.isAvailable)}
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.cardBody}>
                                    <View style={styles.infoRow}>
                                        <View style={styles.infoItem}>
                                            <MaterialIcons name="phone" size={18} color="#666" />
                                            <Text style={styles.infoText}>{driver.contactNumber}</Text>
                                        </View>
                                        <View style={styles.infoItem}>
                                            <MaterialIcons name="work" size={18} color="#666" />
                                            <Text style={styles.infoText}>
                                                Status: <Text style={styles.statusValue}>{driver.status}</Text>
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.infoRow}>
                                        <View style={styles.infoItem}>
                                            <MaterialIcons name="location-on" size={18} color="#666" />
                                            <Text style={styles.infoText} numberOfLines={1}>{driver.address}</Text>
                                        </View>
                                        <View style={styles.infoItem}>
                                            {renderRating(driver.rating)}
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <MaterialIcons name="directions-car" size={64} color="#ccc" />
                            <Text style={styles.emptyText}>No drivers available</Text>
                        </View>
                    )}
                </ScrollView>
            )}

            {/* Driver Detail Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        {selectedDriver && (
                            <>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Driver Details</Text>
                                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                                        <MaterialIcons name="close" size={24} color="#333" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.driverProfileHeader}>
                                    <Avatar
                                        rounded
                                        size="large"
                                        title={selectedDriver.fullName.charAt(0)}
                                        containerStyle={styles.modalAvatar}
                                        source={selectedDriver.profilePhoto ? { uri: selectedDriver.profilePhoto } : null}
                                    />
                                    <Text style={styles.modalDriverName}>{selectedDriver.fullName}</Text>
                                    {renderAvailabilityChip(selectedDriver.isAvailable)}
                                    {renderRating(selectedDriver.rating)}
                                </View>

                                <View style={styles.modalDivider} />

                                <ScrollView style={styles.modalDetailScroll}>
                                    <View style={styles.detailItem}>
                                        <MaterialIcons name="email" size={20} color="#007BFF" />
                                        <View style={styles.detailContent}>
                                            <Text style={styles.detailLabel}>Email</Text>
                                            <Text style={styles.detailValue}>{selectedDriver.email}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.detailItem}>
                                        <MaterialIcons name="phone" size={20} color="#007BFF" />
                                        <View style={styles.detailContent}>
                                            <Text style={styles.detailLabel}>Phone</Text>
                                            <Text style={styles.detailValue}>{selectedDriver.contactNumber}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.detailItem}>
                                        <MaterialIcons name="location-on" size={20} color="#007BFF" />
                                        <View style={styles.detailContent}>
                                            <Text style={styles.detailLabel}>Address</Text>
                                            <Text style={styles.detailValue}>{selectedDriver.address}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.detailItem}>
                                        <MaterialIcons name="directions-car" size={20} color="#007BFF" />
                                        <View style={styles.detailContent}>
                                            <Text style={styles.detailLabel}>Status</Text>
                                            <Text style={styles.detailValue}>{selectedDriver.status}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.detailItem}>
                                        <MaterialIcons name="location-searching" size={20} color="#007BFF" />
                                        <View style={styles.detailContent}>
                                            <Text style={styles.detailLabel}>GPS Coordinates</Text>
                                            <Text style={styles.detailValue}>
                                                {selectedDriver.location?.coordinates[1].toFixed(6)}, {selectedDriver.location?.coordinates[0].toFixed(6)}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.detailItem}>
                                        <MaterialIcons name="access-time" size={20} color="#007BFF" />
                                        <View style={styles.detailContent}>
                                            <Text style={styles.detailLabel}>Member Since</Text>
                                            <Text style={styles.detailValue}>
                                                {new Date(selectedDriver.createdAt).toLocaleDateString()}
                                            </Text>
                                        </View>
                                    </View>
                                </ScrollView>

                                <View style={styles.modalActions}>
                                    <TouchableOpacity
                                        style={styles.contactButton}
                                        onPress={() => handleCallDriver(selectedDriver.contactNumber)}
                                    >
                                        <MaterialIcons name="phone" size={18} color="#fff" />
                                        <Text style={styles.buttonText}>Call Driver</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
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
        backgroundColor: "#f5f5f5",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#fff",
        elevation: 2,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    refreshButton: {
        padding: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    scrollContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    avatar: {
        backgroundColor: "#007BFF",
    },
    driverInfo: {
        flex: 1,
        marginLeft: 12,
    },
    driverName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    driverEmail: {
        fontSize: 12,
        color: "#666",
        marginTop: 2,
    },
    statusChip: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "500",
    },
    divider: {
        height: 1,
        backgroundColor: "#e0e0e0",
        marginVertical: 12,
    },
    cardBody: {
        gap: 12,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    infoText: {
        marginLeft: 8,
        color: "#555",
        fontSize: 14,
    },
    statusValue: {
        textTransform: "capitalize",
        fontWeight: "500",
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    ratingText: {
        marginLeft: 4,
        color: "#666",
        fontSize: 14,
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: "#888",
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 16,
        width: "90%",
        maxHeight: "80%",
        elevation: 5,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    driverProfileHeader: {
        alignItems: "center",
        padding: 16,
    },
    modalAvatar: {
        backgroundColor: "#007BFF",
        marginBottom: 12,
    },
    modalDriverName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    modalDivider: {
        height: 1,
        backgroundColor: "#e0e0e0",
    },
    modalDetailScroll: {
        maxHeight: 300,
        padding: 16,
    },
    detailItem: {
        flexDirection: "row",
        marginBottom: 16,
    },
    detailContent: {
        marginLeft: 12,
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: "#666",
    },
    detailValue: {
        fontSize: 16,
        color: "#333",
    },
    modalActions: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
        alignItems: "center",
    },
    contactButton: {
        backgroundColor: "#007BFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        width: "100%",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        marginLeft: 8,
    }
});